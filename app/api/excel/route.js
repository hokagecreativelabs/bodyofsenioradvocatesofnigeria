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
    const getAllTransactions = url.searchParams.get("all"); // New parameter to get all transactions
    
    // Build match condition
    const matchCondition = {};
    
    // If userId is provided, filter by userId
    if (userId) {
      matchCondition.userId = new mongoose.Types.ObjectId(userId);
    }
    
    // If name is provided, add it to the match condition
    if (name) {
      matchCondition.Name = name;
    }
    
    // If year is provided, add it to the match condition
    if (year) {
      matchCondition.year = parseInt(year);
    }
    
    // Find latest year in the database (globally or for specific userId)
    const latestYearQuery = userId ? { userId: userId } : {};
    const latestYearRecord = await Transaction.findOne(latestYearQuery)
      .sort({ year: -1 })
      .limit(1);
    
    const latestYear = latestYearRecord ? latestYearRecord.year : new Date().getFullYear();
    
    // Use MongoDB aggregation to group the data
    const aggregationPipeline = [
      // Match transactions based on conditions (empty object matches all)
      { $match: matchCondition },
      
      // Sort by year
      { $sort: { year: 1 } },
      
      // Lookup user information to include user details
      {
        $lookup: {
          from: "users", // Make sure this matches your User collection name
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      
      // Unwind user array
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      
      // Group by Name and userId (to handle cases where multiple users have same name)
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
              reference: "$reference",
              createdAt: "$createdAt"
            }
          }
        }
      },
      
      // Reshape the output
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          userId: "$_id.userId",
          userName: 1,
          userEmail: 1,
          transactions: 1,
          totalTransactions: { $size: "$transactions" },
          totalAmountDue: { $sum: "$transactions.amountDue" },
          totalAmountPaid: { $sum: "$transactions.amountPaid" },
          totalAmountOutstanding: { $sum: "$transactions.amountOutstanding" }
        }
      },
      
      // Sort by user name for consistent ordering
      { $sort: { userName: 1, name: 1 } }
    ];
    
    const groupedData = await Transaction.aggregate(aggregationPipeline);
    
    // Convert the array of grouped data to the desired object format
    const formattedGroupedData = {};
    let totalTransactionCount = 0;
    let totalAmountDue = 0;
    let totalAmountPaid = 0;
    let totalAmountOutstanding = 0;
    
    groupedData.forEach(group => {
      // Create a unique key for each group
      const key = userId ? group.name : `${group.name}_${group.userId}`;
      
      formattedGroupedData[key] = {
        name: group.name,
        userId: group.userId,
        userName: group.userName || "Unknown User",
        userEmail: group.userEmail || "No Email",
        transactions: group.transactions,
        totalTransactions: group.totalTransactions,
        totalAmountDue: group.totalAmountDue,
        totalAmountPaid: group.totalAmountPaid,
        totalAmountOutstanding: group.totalAmountOutstanding
      };
      
      // Accumulate totals
      totalTransactionCount += group.totalTransactions;
      totalAmountDue += group.totalAmountDue;
      totalAmountPaid += group.totalAmountPaid;
      totalAmountOutstanding += group.totalAmountOutstanding;
    });
    
    // Get summary statistics
    const totalUsers = await Transaction.distinct("userId", matchCondition);
    const totalUniqueNames = await Transaction.distinct("Name", matchCondition);
    
    return NextResponse.json({
      groupedData: formattedGroupedData,
      summary: {
        latestYear: latestYear,
        totalGroups: Object.keys(formattedGroupedData).length,
        totalTransactions: totalTransactionCount,
        totalUsers: totalUsers.length,
        totalUniqueNames: totalUniqueNames.length,
        totalAmountDue: totalAmountDue,
        totalAmountPaid: totalAmountPaid,
        totalAmountOutstanding: totalAmountOutstanding
      },
      filters: {
        userId: userId || "all",
        name: name || "all",
        year: year || "all"
      }
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}