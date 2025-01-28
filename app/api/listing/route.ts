// pages/api/energy-listing.js

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
      const listings = await db.energyListing.findMany();      
      return NextResponse.json(listings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
