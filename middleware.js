import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req) {
  // Specify which paths require authentication
  const protectedPaths = ['/dashboard', '/profile'];  // Add any other protected paths here
  const { pathname } = req.nextUrl;

  // Only check authentication on protected routes
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Pass user info along via headers (or use cookies)
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.id);
      requestHeaders.set("x-user-email", decoded.email);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
  }

  // If it's not a protected path, just pass through
  return NextResponse.next();
}
