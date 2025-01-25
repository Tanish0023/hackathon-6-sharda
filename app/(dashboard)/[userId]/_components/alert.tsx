"use client";

import { changeIsSelling } from "@/actions/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

const toggleIsSelling = async (isSelling: boolean) => {
  try {
    const response = await axios.post("/api/user");
    const { userId, meterid } = response.data;

    const updatedStatus = await changeIsSelling(userId, meterid, !isSelling);
    return updatedStatus.isSelling;
  } catch (error) {
    console.error("Error toggling isSelling status:", error);
    return isSelling; 
  }
};

const getSellingStatus = async () => {
  try {
    const response = await axios.post("/api/user");
    const { isSelling } = response.data || false;
    return isSelling;
  } catch (error) {
    console.error("Error fetching selling status:", error);
    return false; 
  }
};

export default function AlertDialogComp() {
  const [isSelling, setIsSelling] = useState<boolean | null>(null); // Initial state is null while loading status
  const [isOpen, setIsOpen] = useState(false); // State to control dialog visibility
  const [actionType, setActionType] = useState<boolean | null>(null); // Track whether it's selling or stopping

  useEffect(() => {
    const fetchSellingStatus = async () => {
      const status = await getSellingStatus();
      setIsSelling(status);
    };
    fetchSellingStatus();
  }, []);

  useEffect(() => {
    if (isSelling) {
      const interval = setInterval(async () => {
        try {
          await axios.get("/api/selling");
        } catch (error) {
          console.error("Error fetching seller data:", error);
        }
      }, 5000); 

      return () => clearInterval(interval); 
    }
  }, [isSelling]);

  const handleAction = async () => {
    if (isSelling === null) return; 

    const updatedStatus = await toggleIsSelling(isSelling);
    setIsSelling(updatedStatus);

    setIsOpen(false);
  };

  const openDialog = (action: true | false) => {
    setActionType(action); 
    setIsOpen(true);
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === true
                ? "Are you sure you want to sell your surplus energy?"
                : "Are you sure you want to stop selling?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === true
                ? "This action will allow you to sell your surplus energy."
                : "This action will stop selling and remove your surplus energy from the market."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pop-up trigger for selling */}
      {!isSelling ? (
        <Button onClick={() => openDialog(true)}>Sell surplus energy</Button>
      ) : (
        <Button onClick={() => openDialog(false)}>Stop Selling</Button>
      )}
    </>
  );
}
