import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";

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
    const decoded = verify(authCookie, secret) as { userId: string; meterId: string; name: string; mobileNo: string};

    const { userId, meterId, name, mobileNo  } = decoded;

    const user = await db.user.findUnique({
      where:{
        id: userId
      }
    })
        
    const isSelling = user?.isSelling;
    const totalUnits = user?.totalUnits;
    const SellerCredit = user?.SellerCredit;
    
    return NextResponse.json({userId, meterId, name, mobileNo, isSelling, totalUnits, SellerCredit },{status: 200});
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}