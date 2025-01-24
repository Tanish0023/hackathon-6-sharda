import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Allow unprotected routes (e.g., sign-in and sign-up)
//   const unprotectedRoutes = ["/sign-in", "/sign-up"];
//   if (unprotectedRoutes.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // Retrieve the token from cookies
//   const token = request.cookies.get("session")?.value;

//   if (!token) {
//     // Redirect to sign-in if the token is missing
//     const signInUrl = new URL("/sign-in", request.url);
//     signInUrl.searchParams.set("callbackUrl", request.url); // Redirect back after login
//     return NextResponse.redirect(signInUrl);
//   }

//   try {
//     // Verify the token using your secret key
//     jwt.verify(token, process.env.JWT_SECRET!);
//     return NextResponse.next(); // Token is valid, allow access
//   } catch (err) {
//     // Redirect to sign-in if the token is invalid or expired
//     const signInUrl = new URL("/sign-in", request.url);
//     signInUrl.searchParams.set("callbackUrl", request.url); // Redirect back after login
//     return NextResponse.redirect(signInUrl);
//   }
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all paths except API routes, static files, and unprotected routes
//      */
//     "/((?!api|_next|static|favicon.ico|sign-in|sign-up).*)",
//   ],
};
