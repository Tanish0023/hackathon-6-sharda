import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { db } from "@/lib/db";
import { userExist } from "@/actions/user";
import { serialize } from 'cookie'
import { NextApiResponse } from "next";
import { sign } from "jsonwebtoken";

const MAX_AGE = 60 * 60 * 24 * 30;


export async function POST(req:Request, res: NextApiResponse){
    try{
        const {
            name,
            mobileNo,
            meterId,
            password,
        } = await req.json();

        const saltRound = parseInt(process.env.SALT_ROUND!);
        const hashedPassword = await bcrypt.hash(password, saltRound);     
        
        const userExistCheck = await userExist(meterId);
        console.log(userExistCheck);
        
        if(userExistCheck){
            return new NextResponse("Meter Already Exists",{status:404})
        }

        const userData = await db.user.create({
            data:{
                name,
                mobileNo,
                password: hashedPassword,
                meterId
            }
        })
        
        const secret = process.env.JWT_SECRET || "My-secret";
        
        const token = sign(
            {
                name,
                mobileNo,
                meterId
            },
            secret,{
                expiresIn: MAX_AGE
            }
        );

        const serialized = serialize("Auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: MAX_AGE,
            path: "/"
        })

        const response = {
            message: "Authenticated!",
            userData: userData
        }

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {"Set-Cookie": serialized}
        })

    }
    catch(error){
        console.log("[SIGN-UP], ",error);
        return new NextResponse("Internal Error",{status:500})
    }
}