// src/app/api/auth/check-auth/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
