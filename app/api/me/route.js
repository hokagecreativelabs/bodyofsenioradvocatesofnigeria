// app/api/auth/me/route.js
import { connectToMongoDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Handle different JWT errors with appropriate responses
      if (error.name === "TokenExpiredError") {
        return NextResponse.json(
          { error: "Token expired" },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        );
      }
    }

    // Ensure userId exists in the token
    if (!decodedToken.userId) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectToMongoDB();

    // Get user from database (to get updated info)
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Convert Mongoose document to plain object and remove sensitive fields
    const userData = user.toObject ? user.toObject() : user;
    
    // Return user data
    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Authentication check failed", message: process.env.NODE_ENV === "development" ? error.message : undefined },
      { status: 500 }
    );
  }
}