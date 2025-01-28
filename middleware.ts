import { NextRequest, NextResponse } from 'next/server';

const allowedPaths = ['/sign-in', '/sign-up','/' ,'/_next', '/favicon.ico', '/api']; // Public routes and assets

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // Current route path
  const authToken = request.cookies.get('Auth'); // Get auth token from cookies

  // Always allow public routes (sign-in, sign-up, static files, etc.)
  if (allowedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If user is authenticated, allow access to protected routes
  if (authToken) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected route, redirect to sign-in
  const signInUrl = new URL('/sign-in', request.url);
  return NextResponse.redirect(signInUrl);
}

// Apply middleware to all routes
export const config = {
  matcher: '/:path*', // Match all routes
};
