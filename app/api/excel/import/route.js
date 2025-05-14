import { NextResponse } from "next/server";
import * as xlsx from "xlsx";
import Transaction from "@/models/Transaction";
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

    // Get a dynamic userId (could be from session, token, or passed in form data)
    const userId = formData.get("userId") || new mongoose.Types.ObjectId(); // Generate new ID if none provided

    // Process Excel data into transactions
    const transactions = data.map((row) => {
      return {
        userId: userId,
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
      };
    });

    // Save transactions to database
    const result = await Transaction.insertMany(transactions);
    console.log("Inserted transactions:", result.length);

    // Find the latest year in the dataset
    const maxYear = Math.max(...transactions.map(t => t.year));

    // Use MongoDB aggregation pipeline to group the data by Name
    const groupedData = await Transaction.aggregate([
      // Match only the transactions we just inserted (by userId)
      { $match: { userId: userId } },
      
      // Group by Name
      { 
        $group: {
          _id: "$Name",
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
          name: "$_id",
          transactions: 1
        }
      }
    ]);

    // Convert the array of grouped data to the desired object format
    const formattedGroupedData = {};
    groupedData.forEach(group => {
      formattedGroupedData[group.name] = group.transactions;
    });
    
    // Return the data in the desired format
    return NextResponse.json({
      message: "Data imported successfully",
      count: result.length,
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