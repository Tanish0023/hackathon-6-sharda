import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { userExist } from "@/actions/user";

export async function POST(req:Request, res: Response){
    console.log(req);
    
    try{
        const {
            mobileNo,
            password,
            meterId
        } = await req.json();   
        

        const userExistCheck = await userExist(meterId);
        if(!userExistCheck){
            return new NextResponse("User does not Exists",{status:404})
        }

        const {password: hashedPassword} =  userExistCheck;
        
        const passwordCheck = await bcrypt.compare(password, hashedPassword);  
        if(!passwordCheck){
            return new NextResponse("Password is not correct",{status:404})
        }
        
        const {name} = userExistCheck
        
        return NextResponse.json(userExistCheck);

    }
    catch(error){
        console.log("[SIGN-UP], ",error);
        return new NextResponse("Internal Error",{status:500})
    }
}