import { NextResponse } from "next/server";
import * as xlsx from "xlsx";
import Transaction from "@/models/Transaction";
import User from "@/models/user.model"
import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";

// For debugging purposes - log request details
function logRequestDetails(req) {
  console.log("Request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers));
}

export async function POST(req) {
  try {
    // Log request details for debugging
    logRequestDetails(req);
    
    // Ensure the database is connected
    await dbConnect();

    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    console.log("File received:", file.name, "Size:", file.size);

    // Convert the file to an array buffer
    const buffer = await file.arrayBuffer();
    
    // Parse the Excel file from the buffer
    const workbook = xlsx.read(new Uint8Array(buffer), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log("Parsed Excel data, row count:", data.length);
    
    if (data.length === 0) {
      return NextResponse.json({ message: "Excel file is empty." }, { status: 400 });
    }

    // Log first row to help debug field mapping issues
    console.log("First row sample:", JSON.stringify(data[0]));

    // Get all unique user IDs from the Excel data
    const excelUserIds = [...new Set(data.map(row => row["UserId"] || row["User ID"] || row["userId"]))];
    console.log("Unique Excel User IDs found:", excelUserIds);

    // Fetch all users from database to create mapping
    const users = await User.find({}).select('_id id').lean();
    console.log("Users found in database:", users.length);

    // Create mapping from Excel user ID to MongoDB ObjectId
    const userIdMapping = {};
    
    // Method 1: If you have a id field in your User model
    users.forEach(user => {
      if (user.id && excelUserIds.includes(user.id)) {
        userIdMapping[user.id] = user._id;
      }
    });

    // Method 2: If Excel user IDs correspond to user order in database (1st user = ID 1, etc.)
    // excelUserIds.forEach(excelId => {
    //   const numericId = parseInt(excelId);
    //   if (!isNaN(numericId) && numericId > 0 && numericId <= users.length) {
    //     userIdMapping[excelId] = users[numericId - 1]._id; // Array is 0-indexed
    //   }
    // });

    console.log("User ID mapping created:", userIdMapping);

    // Check if all Excel user IDs have corresponding database users
    const unmappedUserIds = excelUserIds.filter(id => !userIdMapping[id]);
    if (unmappedUserIds.length > 0) {
      return NextResponse.json({ 
        message: "Some user IDs from Excel don't have corresponding users in database",
        unmappedUserIds: unmappedUserIds,
        availableUsers: users.length
      }, { status: 400 });
    }

    // Process Excel data into transactions
    const transactions = [];
    const skippedRows = [];

    data.forEach((row, index) => {
      const excelUserId = row["UserId"] || row["User ID"] || row["userId"];
      const mongoUserId = userIdMapping[excelUserId];

      if (!mongoUserId) {
        skippedRows.push({
          rowIndex: index + 1,
          reason: `No matching user found for Excel User ID: ${excelUserId}`,
          rowData: row
        });
        return;
      }

      transactions.push({
        userId: mongoUserId,
        reference: `EXCEL-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6)}`,
        Name: row["Name"] || "Unknown",
        amount: parseFloat(row["Amount Due (N)"] || 0),
        year: parseInt(row["Year"] || new Date().getFullYear()),
        status: "success",
        source: "excel",
        amountDue: parseFloat(row["Amount Due (N)"] || 0),
        amountPaid: parseFloat(row["Amount Paid (N)"] || 0),
        amountOutstanding: parseFloat(row["Amount Outstanding (N)"] || 0),
        amountPaidInAdvance: parseFloat(row["Amount Paid in Advance (N)"] || 0),
      });
    });

    console.log(`Processed ${transactions.length} transactions, skipped ${skippedRows.length} rows`);

    if (transactions.length === 0) {
      return NextResponse.json({ 
        message: "No valid transactions to import",
        skippedRows: skippedRows
      }, { status: 400 });
    }

    // Save transactions to database
    const result = await Transaction.insertMany(transactions);
    console.log("Inserted transactions:", result.length);

    // Find the latest year in the dataset
    const maxYear = Math.max(...transactions.map(t => t.year));

    // Get all user IDs that were processed
    const processedUserIds = [...new Set(transactions.map(t => t.userId))];

    // Use MongoDB aggregation pipeline to group the data by Name and include user info
    const groupedData = await Transaction.aggregate([
      // Match only the transactions we just inserted
      { $match: { userId: { $in: processedUserIds } } },
      
      // Lookup user information
      {
        $lookup: {
          from: "users", // Make sure this matches your User collection name
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      
      // Unwind user array (since it's a 1-to-1 relationship)
      { $unwind: "$user" },
      
      // Group by Name and include user info
      { 
        $group: {
          _id: {
            name: "$Name",
            userId: "$userId"
          },
          userName: { $first: "$user.name" }, // Adjust field name as per your User model
          userEmail: { $first: "$user.email" }, // Adjust field name as per your User model
          transactions: { 
            $push: {
              amount: "$amount",
              amountDue: "$amountDue",
              amountPaid: "$amountPaid",
              amountOutstanding: "$amountOutstanding",
              amountPaidInAdvance: "$amountPaidInAdvance",
              year: "$year",
              status: "$status",
              reference: "$reference"
            }
          }
        }
      },
      
      // Reshape to match the desired output format
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          userId: "$_id.userId",
          userName: 1,
          userEmail: 1,
          transactions: 1
        }
      }
    ]);

    // Convert the array of grouped data to the desired object format
    const formattedGroupedData = {};
    groupedData.forEach(group => {
      const key = `${group.name}_${group.userId}`;
      formattedGroupedData[key] = {
        name: group.name,
        userId: group.userId,
        userName: group.userName,
        userEmail: group.userEmail,
        transactions: group.transactions
      };
    });
    
    // Return the data in the desired format
    return NextResponse.json({
      message: "Data imported successfully",
      count: result.length,
      skippedRows: skippedRows.length,
      skippedDetails: skippedRows,
      userIdMapping: userIdMapping,
      groupedData: formattedGroupedData,
      latestYear: maxYear
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { 
        message: "An error occurred during import", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}