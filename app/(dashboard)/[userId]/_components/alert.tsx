"use client"

import { changeIsSelling, getIsSelling } from "@/actions/user"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"

const toggleIsSelling = async (isSelling: boolean) => {
  // Toggling the isSelling status based on the current status
  const response = await axios.post("/api/user");
  const { userId, meterid } = response.data;

  const updatedStatus = await changeIsSelling(userId, meterid, !isSelling);
  return updatedStatus.isSelling;
}

const getSellingStatus = async () => {
  const response = await axios.post("/api/user");
  const { isSelling } = response.data || false;
  return isSelling;
}

export default function AlertDialogComp() {
  const [isSelling, setIsSelling] = useState<boolean | null>(null);  // Initial state is null while loading status
  const [isOpen, setIsOpen] = useState(false); // State to control dialog visibility
  const [actionType, setActionType] = useState<boolean | null>(null); // Track whether it's selling or stopping

  useEffect(() => {
    const fetchSellingStatus = async () => {
      const status = await getSellingStatus();
      setIsSelling(status);
    };
    fetchSellingStatus();
  }, []);

  const handleAction = async () => {
    if (isSelling === null) return;  // Wait for the status to be loaded

    const updatedStatus = await toggleIsSelling(isSelling);
    setIsSelling(updatedStatus);

    setIsOpen(false);  // Close the dialog after action
  };

  const openDialog = (action: true | false) => {    
    setActionType(action);  // Set action type when button is clicked
    setIsOpen(true);  // Open dialog
  }

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
              {actionType === false
                ? "This action will allow you to sell your surplus energy."
                : "This action will stop selling and remove your surplus energy from the market."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pop-up trigger for selling */}
      {!isSelling ? (
        <Button
          onClick={() => openDialog(true)}
        >
          Sell surplus energy
        </Button>
      ) : (
        <Button
          onClick={() => openDialog(false)}
        >
          Stop Selling
        </Button>
      )}
    </>
  );
}
