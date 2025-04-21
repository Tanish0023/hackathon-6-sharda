import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Extracting the credit value from the request body
    const { sellCredit } = await req.json();
    const creditAmount = Number(sellCredit);
    console.log(sellCredit);
    

    // Ensure the credit is a valid number and non-negative
    if (isNaN(creditAmount) || creditAmount < 0) {
      return NextResponse.json(
        { message: "Invalid credit value" },
        { status: 400 }
      );
    }

    // Retrieve authentication token from cookies
    const cookies = req.cookies;
    const authCookie = cookies.get("Auth")?.value;

    if (!authCookie) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET || "My-secret"; // Use a default secret for fallback

    // Decode the JWT token and extract user data
    const decoded = verify(authCookie, secret) as { userId: string; meterId: string; name: string; mobileNo: string };
    const { userId, meterId } = decoded;

    // Check user's total credits before proceeding
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || user.credit! < sellCredit) {
      return NextResponse.json(
        { message: "Insufficient credits to sell" },
        { status: 400 }
      );
    }

    // Update the user's credit in the database
    const updatedUser = await db.user.update({
      where: { id: decoded.userId },
      data: {
        credit: {
          decrement: creditAmount, // Incrementing the credit by the passed amount
        },
      },
    });

    

    const energyListing = await db.energyListing.create({
      data: {
        userId,
        meterId,
        credits: sellCredit,
        price: 80, // Fixed price, can be dynamic
        pricePerCredit: 4.5 // Fixed price per credit
      }
    });

    return NextResponse.json(
      { message: "Credit updated successfully", credit: updatedUser.credit },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error updating credit:", err);
    return NextResponse.json(
      { message: "Failed to update credit", error: err.message },
      { status: 500 }
    );
  }
}
