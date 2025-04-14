import connectToDB from "../../../lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectToDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Missing credentials" }), { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
  }

  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return new Response(JSON.stringify({ token, fullName: user.fullName }), { status: 200 });
}
