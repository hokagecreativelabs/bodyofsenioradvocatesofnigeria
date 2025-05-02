import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import crypto from "crypto";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    const updatePromises = users.map(async (user) => {
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 days from now

      return User.findByIdAndUpdate(user._id, {
        callUpNumber: user.id,
        fullName: user.name,
        isActive: false,
        email: "",
        activationToken: token,
        activationTokenExpiresAt: expiry,
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, updated: users.length });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed users" }, { status: 500 });
  }
}
