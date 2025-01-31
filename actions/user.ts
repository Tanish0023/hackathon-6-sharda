"use server"

import { db } from "@/lib/db"

export const userExist = async (
  mobileNo: string,
  meterId: string
) => {
  const userData = await db.user.findFirst({
    where: {
      mobileNo: mobileNo,
      meterId: meterId,
    },
  });

  return userData;
};


export const changeIsSelling = async (
    userId: string,
    meterId: string,
    isSelling: boolean
  ) => {
    try {
      const user = await db.user.update({
        where: {
            id: userId,
            meterId: meterId,
        },
        data: {
          isSelling: isSelling!,
        },
      });
      return user;
    } catch (error) {
      console.error("Error updating surplus energy:", error);
      throw new Error("Failed to update surplus energy");
    }
  };
  


  export const getIsSelling = async (
    userId: string,
    meterId: string,
  ) => {
    try {
      const user = await db.user.findUnique({
        where: {
            id: userId,
            meterId: meterId,
        }
      });
      return user;
    } catch (error) {
      console.error("Error updating surplus energy:", error);
      throw new Error("Failed to update surplus energy");
    }
  };
  