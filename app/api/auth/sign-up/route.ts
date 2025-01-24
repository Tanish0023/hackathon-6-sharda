import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { db } from "@/lib/db";
import { userExist } from "@/actions/user";

export async function POST(req:Request){
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
        
        if(userExistCheck){
            return new NextResponse("Meter Already Exists",{status:404})
        }

        const userDetail = await db.user.create({
            data:{
                name,
                mobileNo,
                password: hashedPassword,
                meterId
            }
        })
        
        return NextResponse.json(userDetail);

    }
    catch(error){
        console.log("[SIGN-UP], ",error);
        return new NextResponse("Internal Error",{status:500})
    }
}