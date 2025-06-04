import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import User from "@/models/user.model";
import mongoose from "mongoose";

export async function GET(request) {
    try {
      // Connect to database
      await dbConnect();
  
      // Extract search parameters
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page')) || 1;
      const limit = parseInt(searchParams.get('limit')) || 10;
      const status = searchParams.get('status');
      const source = searchParams.get('source');
      const year = searchParams.get('year');
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';
  
      // Build filter object
      const filter = {};
      if (status) filter.status = status;
      if (source) filter.source = source;
      if (year) filter.year = parseInt(year);
  
      // Calculate pagination
      const skip = (page - 1) * limit;
  
      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
      
      let transactionsQuery = Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
  
      // Only populate if User model is available
      if (User) {
        transactionsQuery = transactionsQuery.populate('userId', 'name email');
      }
  
      // Fetch transactions
      const transactions = await transactionsQuery;
  
      // Get total count
      const totalCount = await Transaction.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / limit);
  
      return NextResponse.json({
        success: true,
        data: transactions,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
  
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch transactions',
        error: error.message
      }, { status: 500 });
    }
  }