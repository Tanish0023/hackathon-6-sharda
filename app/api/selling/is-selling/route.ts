import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
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

    const { userId, meterId } = decoded;

    const user = await db.user.findUnique({
        where:{
            id: userId
        }
    })
    
    return NextResponse.json(user?.isSelling,{status: 200});
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 401 }
    );
  }
}