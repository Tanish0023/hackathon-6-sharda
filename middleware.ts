import { NextResponse } from "next/server";
import { parse } from "cookie";
import { jwtVerify } from 'jose';

export async function middleware(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.Auth; 

  const publicAssets = [
    "/favicon.ico",
    "/_next/static/",
    '/sign-in', '/sign-up','/_next', '/favicon.ico', '/api'
  ];
  
  if (publicAssets.some((path) => req.url.includes(path))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-up", req.url)); // Redirect to login
  }  
  try {
    const decoded = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || "My-secret"));
    console.log(decoded.payload.userId);
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/sign-up", req.url)); // Redirect to login or unauthorized page
  }
}

export const config = {
  matcher: "/:userId", // Apply the middleware to your protected routes
};
