import connectToDatabase from "@/lib/db"; 
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await connectToDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ message: "No token provided" }), { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
  }
}
