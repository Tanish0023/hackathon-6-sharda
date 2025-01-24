import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { userExist } from "@/actions/user";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

const MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req: Request) {
  try {
    const { name, mobileNo, meterId, password, longitude, latitude } = await req.json();

    // Validate inputs
    if (!name || !mobileNo || !meterId || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const saltRound = parseInt(process.env.SALT_ROUND || "10"); 
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const userExistCheck = await userExist(meterId);

    if (userExistCheck) {
      return new NextResponse("Meter already exists", { status: 400 });
    }

    const userData = await db.user.create({
      data: {
        name,
        mobileNo,
        password: hashedPassword,
        meterId,
        isSelling: false,
        longitude,
        latitude
      },
    });
    const { id: userId } = userData;

    const secret = process.env.JWT_SECRET || "My-secret";

    const tokenPayload = {
      userId,
      name,
      mobileNo,
      meterId,
    };

    const token = sign(tokenPayload, secret, {
      expiresIn: MAX_AGE,
    });

    const serialized = serialize("Auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: MAX_AGE,
      path: "/",
    });

    const userDataCookie = {
      userId,
      name,
      mobileNo,
      meterId,
    };
    
    const response = {
      message: "Authenticated!",
      userData: userDataCookie,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Set-Cookie": serialized, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[SIGN-UP]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
