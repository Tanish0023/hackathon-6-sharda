import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { updateUnits } from "@/actions/unit";

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

    const data = {
        userId: userId,
        meterId: meterId,
        credits: parseFloat((Math.random()* 0.1).toFixed(2)),
    };
    const {credits} = data;
    
    const sellingEnergy = await db.seller.create({
      data:{
        userId,
        meterId,
        credits,
      }
    });

    await updateUnits(userId, credits);

    return NextResponse.json(sellingEnergy,{status: 200});
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 401 }
    );
  }
}