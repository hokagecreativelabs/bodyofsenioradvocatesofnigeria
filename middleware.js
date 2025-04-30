// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Get path from request
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Check if the path is for member dashboard
  const isMemberDashboard = pathname.startsWith('/member-dashboard');
  
  // Get authentication cookie
  const sessionCookie = request.cookies.get('session')?.value;
  
  // If it's a dashboard route but no session cookie, redirect to home
  if (isMemberDashboard && !sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    '/member-dashboard/:path*',
  ],
};