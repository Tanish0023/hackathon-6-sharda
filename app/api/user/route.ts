import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const  cookies  = req.cookies;
  const authCookie = cookies.get("Auth")?.value;
    
  if (!authCookie) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const secret = process.env.JWT_SECRET || "My-secret";
  try {
    const decoded = verify(authCookie, secret) as { userId: string; meterId: string; name: string; mobileNo: string };

    const { userId, meterId, name, mobileNo  } = decoded;

    return NextResponse.json({userId, meterId, name, mobileNo},{status: 200});
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}