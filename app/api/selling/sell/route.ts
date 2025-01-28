import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { updateUnits } from "@/actions/unit";
import axios from "axios";
import { error as consoleError } from "console"; // Renamed to avoid conflict

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON request body
    const { sellCredit } = await req.json();
    console.log("Credits to sell:", sellCredit);

    if (!sellCredit || sellCredit <= 0) {
      return NextResponse.json(
        { message: "Invalid sellCredit value" },
        { status: 400 }
      );
    }

    const cookies = req.cookies;
    const authCookie = cookies.get("Auth")?.value;

    // Check if authCookie is available
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
    if (!user || user.SellerCredit! < sellCredit) {
      return NextResponse.json(
        { message: "Insufficient credits to sell" },
        { status: 400 }
      );
    }

    // Create a new energy listing
    const energyListing = await db.energyListing.create({
      data: {
        userId,
        meterId,
        credits: sellCredit,
        price: 80, // Fixed price, can be dynamic
        pricePerCredit: 4.5 // Fixed price per credit
      }
    });

    try {
      const d = new Date();
      console.log(`Random time: ${Math.random() * 100}`);
      
      const price = await axios.post("http://172.32.16.159:8000/predict/");

      console.log(`PRICE ${price}`);
      
      // await db.user.update({
      //   where: { id: userId },
      //   data: {
      //     SellerCredit: {
      //       decrement: sellCredit
      //     }
      //   }
      // });
    } catch (err) { // Renamed the error variable to avoid conflict
      consoleError("[AI MODAL]: ", err); // Using the renamed consoleError function
      throw new Error("internal server error");
    }

    // Decrement the user's SellerCredit

    // Update units (assuming this is relevant to your business logic)
    await updateUnits(userId, sellCredit);

    // Return success response
    return NextResponse.json(energyListing, { status: 200 });
  } catch (err) { // Renamed the error variable to avoid conflict
    consoleError("Error:", err); // Using the renamed consoleError function
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
