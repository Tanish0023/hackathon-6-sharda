import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { userExist } from "@/actions/user";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req:NextRequest){
    try{
        const {
            mobileNo,
            password,
            meterId
        } = await req.json();   
        
        const userExistCheck = await userExist(meterId, mobileNo);
        if(!userExistCheck){
            return new NextResponse("User does not Exists",{status:404})
        }

        const {password: hashedPassword} =  userExistCheck;
        
        const passwordCheck = await bcrypt.compare(password, hashedPassword);  
        if(!passwordCheck){
            return new NextResponse("Password is not correct",{status:404})
        }
        
        const {id: userId, name} = userExistCheck;
        
        const secret = process.env.JWT_SECRET || "My-secret";

        const token = sign(
            {
                userId,
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

        const userData = {userId, name, meterId, mobileNo}
        const response = {
            message: "Authenticated!",
            userData
        }

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {"Set-Cookie": serialized}
        })

    }
    catch(error){
        console.error("[SIGN-UP], ",error);
        return new NextResponse("Internal Error",{status:500})
    }
}