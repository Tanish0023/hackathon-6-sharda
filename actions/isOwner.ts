"use server"

import axios from "axios"

export async function isOwner(
    userId: string
){
    const isUser = await axios.post("/api/user");

    if(isUser.data.id == userId){
        return true;
    }else{
        return false;
    }
}