"use server"

import { db } from "@/lib/db"

export const userExist = async (
    meterId: string
) => {
    const userData = await db.user.findUnique({
        where:{
            meterId
        }
    })
        
    return userData;
}