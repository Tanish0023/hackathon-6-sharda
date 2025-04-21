import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { updateUnits } from "@/actions/unit";

interface DecodedToken {
  userId: string;
  meterId: string;
  name: string;
  mobileNo: string;
}

export async function GET(req: NextRequest) {
  const cookies = req.cookies;
  const authCookie = cookies.get("Auth")?.value;

  if (!authCookie) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const secret = process.env.JWT_SECRET || "My-secret";

  try {
    const decoded = verify(authCookie, secret) as DecodedToken;
    const { userId, meterId } = decoded;

    const credits = parseFloat((Math.random() * 0.1).toFixed(2)); // small unit of energy credit

    const sellingEnergy = await db.seller.create({
      data: {
        userId,
        meterId,
        credits,
      },
    });

    // Update user's totalUnits and credit
    await updateUnits(userId, credits);

    return NextResponse.json(sellingEnergy, { status: 200 });
  } catch (error) {
    console.error("Error verifying token or creating seller entry:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 401 }
    );
  }
}
