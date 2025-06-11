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
    const users = await User.find({}).select('_id id name email').lean();
    console.log("Users found in database:", users.length);
    console.log("Sample user from database:", users[0]); // Debug: see what fields are available

    // Get all unique names from Excel data for name matching
    const excelNames = [...new Set(data.map(row => row["Name"]))];
    console.log("Unique Excel names found:", excelNames);

    // Create mapping from Excel user ID to MongoDB ObjectId
    const userIdMapping = {};
    const nameMatchingResults = {};
    
    // Helper function to normalize names for comparison
    const normalizeName = (name) => {
      return name ? name.toString().trim().toLowerCase().replace(/\s+/g, ' ') : '';
    };

    // Try multiple mapping strategies with name validation
    
    // Strategy 1: Direct ID field match (if your User model has an 'id' field)
    users.forEach(user => {
      if (user.id && excelUserIds.includes(user.id)) {
        userIdMapping[user.id] = {
          mongoId: user._id,
          dbName: user.name,
          strategy: 'direct_id'
        };
      }
    });

    // Strategy 2: Use array index + 1 (1st user = ID 1, 2nd user = ID 2, etc.)
    // This assumes your Excel user IDs correspond to user order in database
    if (Object.keys(userIdMapping).length === 0) {
      console.log("No direct ID matches found, trying index-based mapping...");
      excelUserIds.forEach(excelId => {
        const numericId = parseInt(excelId);
        if (!isNaN(numericId) && numericId > 0 && numericId <= users.length) {
          userIdMapping[excelId] = {
            mongoId: users[numericId - 1]._id,
            dbName: users[numericId - 1].name,
            strategy: 'index_based'
          };
        }
      });
    }

    // Strategy 3: Use MongoDB ObjectId as string (if Excel contains ObjectIds)
    if (Object.keys(userIdMapping).length === 0) {
      console.log("No index-based matches found, trying ObjectId mapping...");
      users.forEach(user => {
        const userIdStr = user._id.toString();
        if (excelUserIds.includes(userIdStr)) {
          userIdMapping[userIdStr] = {
            mongoId: user._id,
            dbName: user.name,
            strategy: 'objectid'
          };
        }
      });
    }

    // Strategy 4: Pure name matching (fallback)
    if (Object.keys(userIdMapping).length === 0) {
      console.log("No ID matches found, trying pure name matching...");
      data.forEach(row => {
        const excelUserId = row["UserId"] || row["User ID"] || row["userId"];
        const excelName = row["Name"];
        
        if (excelName && !userIdMapping[excelUserId]) {
          const normalizedExcelName = normalizeName(excelName);
          
          // Find user with matching name
          const matchingUser = users.find(user => 
            normalizeName(user.name) === normalizedExcelName
          );
          
          if (matchingUser) {
            userIdMapping[excelUserId] = {
              mongoId: matchingUser._id,
              dbName: matchingUser.name,
              strategy: 'name_only'
            };
          }
        }
      });
    }

    console.log("User ID mapping created:", userIdMapping);

    // Validate name matching for all mapped users
    const nameValidationWarnings = [];
    Object.entries(userIdMapping).forEach(([excelId, mapping]) => {
      // Find the Excel name for this user ID
      const excelRow = data.find(row => 
        (row["UserId"] || row["User ID"] || row["userId"]) == excelId
      );
      
      if (excelRow && excelRow["Name"]) {
        const excelName = normalizeName(excelRow["Name"]);
        const dbName = normalizeName(mapping.dbName);
        
        nameMatchingResults[excelId] = {
          excelName: excelRow["Name"],
          dbName: mapping.dbName,
          normalized: {
            excel: excelName,
            db: dbName
          },
          matches: excelName === dbName,
          strategy: mapping.strategy
        };
        
        if (excelName !== dbName) {
          nameValidationWarnings.push({
            excelId,
            excelName: excelRow["Name"],
            dbName: mapping.dbName,
            strategy: mapping.strategy
          });
        }
      }
    });

    console.log("Name matching results:", nameMatchingResults);
    if (nameValidationWarnings.length > 0) {
      console.log("Name validation warnings:", nameValidationWarnings);
    }

    // Process Excel data into transactions
    const transactions = [];
    const skippedRows = [];
    const unmappedUserIds = [];

    data.forEach((row, index) => {
      const excelUserId = row["UserId"] || row["User ID"] || row["userId"];
      const excelName = row["Name"];
      const userMapping = userIdMapping[excelUserId];

      if (!userMapping) {
        // Track unmapped user IDs but don't stop processing
        if (!unmappedUserIds.includes(excelUserId)) {
          unmappedUserIds.push(excelUserId);
        }
        
        skippedRows.push({
          rowIndex: index + 1,
          reason: `No matching user found for Excel User ID: ${excelUserId}`,
          excelName: excelName,
          rowData: row
        });
        return;
      }

      // Additional validation: check if names match (with warning, not blocking)
      const nameMatches = nameMatchingResults[excelUserId]?.matches;
      
      // Process valid rows (include even if names don't match perfectly)
      transactions.push({
        userId: userMapping.mongoId,
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
        // Add metadata for tracking
        mappingStrategy: userMapping.strategy,
        nameMatch: nameMatches,
        excelName: excelName,
        dbName: userMapping.dbName
      });
    });

    console.log(`Processed ${transactions.length} transactions, skipped ${skippedRows.length} rows`);

    // If no transactions were processed, return error
    if (transactions.length === 0) {
      return NextResponse.json({ 
        message: "No valid transactions to import. All user IDs from Excel are unmapped.",
        unmappedUserIds: unmappedUserIds,
        availableUsers: users.length,
        skippedRows: skippedRows,
        suggestions: [
          "Check if your User model has an 'id' field that matches Excel User IDs",
          "Verify that Excel User IDs correspond to user order in database (1 = first user, 2 = second user, etc.)",
          "Consider updating Excel with correct user identifiers"
        ]
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
    
    // Return success response with details about what was processed and what was skipped
    return NextResponse.json({
      message: transactions.length === data.length 
        ? "All data imported successfully" 
        : `Partial import completed: ${transactions.length} of ${data.length} rows imported`,
      count: result.length,
      totalRows: data.length,
      successfulRows: transactions.length,
      skippedRows: skippedRows.length,
      skippedDetails: skippedRows,
      unmappedUserIds: unmappedUserIds,
      userIdMapping: Object.fromEntries(
        Object.entries(userIdMapping).map(([key, value]) => [
          key, 
          {
            mongoId: value.mongoId.toString(),
            dbName: value.dbName,
            strategy: value.strategy
          }
        ])
      ),
      nameMatchingResults: nameMatchingResults,
      nameValidationWarnings: nameValidationWarnings,
      groupedData: formattedGroupedData,
      latestYear: maxYear,
      warnings: [
        ...(unmappedUserIds.length > 0 ? [`${unmappedUserIds.length} user IDs could not be mapped: ${unmappedUserIds.join(', ')}`] : []),
        ...(nameValidationWarnings.length > 0 ? [`${nameValidationWarnings.length} records have name mismatches - please verify data accuracy`] : [])
      ],
      summary: {
        totalProcessed: transactions.length,
        perfectMatches: Object.values(nameMatchingResults).filter(r => r.matches).length,
        nameWarnings: nameValidationWarnings.length,
        strategies: {
          direct_id: Object.values(userIdMapping).filter(u => u.strategy === 'direct_id').length,
          index_based: Object.values(userIdMapping).filter(u => u.strategy === 'index_based').length,
          objectid: Object.values(userIdMapping).filter(u => u.strategy === 'objectid').length,
          name_only: Object.values(userIdMapping).filter(u => u.strategy === 'name_only').length
        }
      }
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