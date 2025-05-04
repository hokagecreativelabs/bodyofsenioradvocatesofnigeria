// app/api/auth/check-auth/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    await dbConnect();
    
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find the user
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Return user data
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    
    // Handle token validation errors
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}