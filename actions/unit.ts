import { db } from "@/lib/db"; // Adjust the path to your Prisma client
import { triggerBlockchainTransaction } from "@/utils/blockchain";

export async function updateUnits(userId: string, credits: number) {
  try {
    // Increment `tempUnits` and `totalUnits`
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        tempUnits: {
          increment: credits,
        },
        totalUnits: {
          increment: credits,
        },
      },
    });

    const tempUnitsUserData = user.tempUnits || 0;
    console.log(`User's new tempUnits: ${user.tempUnits}`);

    // Check if `tempUnits` >= 1
    if (tempUnitsUserData >= 1) {
      console.log("Triggering blockchain transaction...");

      // Trigger blockchain transaction
      const blockchainResponse = await triggerBlockchainTransaction(
        user.publicKey!,
        user.privateKey!,
        Math.floor(tempUnitsUserData) // Send full units to the blockchain
      );

      if (blockchainResponse.success) {
        // Reset `tempUnits` after a successful blockchain transaction
        await db.user.update({
          where: { id: userId },
          data: {
            tempUnits: {
                decrement: 1
            },
            SellerCredit: {
              increment: 1 // Increment seller credits
            },
          },
        });

        console.log("Blockchain transaction successful and tempUnits reset.");
      } else {
        console.error("Blockchain transaction failed.");
      }
    }
  } catch (error) {
    console.error("Error updating units:", error);
  }
}
