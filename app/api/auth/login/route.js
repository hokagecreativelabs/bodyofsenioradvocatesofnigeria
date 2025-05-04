import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import User from "../../../../models/user.model";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect(); // make sure MongoDB is connected

  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ message: "User has no password set" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // You can set a JWT token here or return success
    return NextResponse.json({ message: "Login successful", user: { email: user.email, name: user.fullName } });
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
