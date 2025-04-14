import connectToDB from "../../../lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectToDB();

  const { email, fullName, password } = await req.json();

  if (!email || !password || !fullName) {
    return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "Email already registered" }), { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    email,
    fullName,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return new Response(
    JSON.stringify({ token, fullName: newUser.fullName }),
    { status: 201 }
  );
}
