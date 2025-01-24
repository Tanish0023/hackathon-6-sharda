"use server"

import { db } from "@/lib/db"

export const userExist = async (
    mobileNo: string,
) => {
    const userData = await db.user.findUnique({
        where:{
            mobileNo,
        }
    })

    return userData;
}