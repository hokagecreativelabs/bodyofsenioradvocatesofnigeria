// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  response.cookies.set({
    name: 'token',
    value: '',
    maxAge: 0,
    httpOnly: true,
    path: '/',
  });

  return response;
}
