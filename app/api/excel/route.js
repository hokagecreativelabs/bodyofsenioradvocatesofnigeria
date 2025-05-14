import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();
    
    // Get query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const name = url.searchParams.get("name");
    const year = url.searchParams.get("year");
    
    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    // Build match condition
    const matchCondition = { userId: new mongoose.Types.ObjectId(userId) };
    
    // If name is provided, add it to the match condition
    if (name) {
      matchCondition.Name = name;
    }
    
    // If year is provided, add it to the match condition
    if (year) {
      matchCondition.year = parseInt(year);
    }
    
    // Find latest year in the database for this userId
    const latestYearRecord = await Transaction.findOne({ userId: userId })
      .sort({ year: -1 })
      .limit(1);
      
    const latestYear = latestYearRecord ? latestYearRecord.year : new Date().getFullYear();

    // Use MongoDB aggregation to group the data by Name
    const groupedData = await Transaction.aggregate([
      // Match only the transactions for this userId (and name/year if provided)
      { $match: matchCondition },
      
      // Sort by year 
      { $sort: { year: 1 } },
      
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
      
      // Reshape the output
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
    
    return NextResponse.json({
      groupedData: formattedGroupedData,
      latestYear: latestYear,
      count: Object.keys(formattedGroupedData).length
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}