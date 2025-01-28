"use client";

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";

interface SellProps {
  totalCredits: number;
}

const Sell = ({ totalCredits }: SellProps) => {
  const [sellCredit, setSellCredit] = useState<number | "">(0);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : parseFloat(e.target.value);

    if (value !== "" && (isNaN(value) || value < 0)) {
      setError("Enter a valid positive number.");
    } else if (value !== "" && value > totalCredits) {
      setError(`You cannot sell more than your total credits (${totalCredits}).`);
    } else {
      setError("");
    }

    setSellCredit(value);
  };

  const handleSell = () => {
    if (sellCredit && sellCredit > 0 && sellCredit <= totalCredits) {
      startTransition(async () => {
        try {
          await axios.post("/api/selling/sell", { sellCredit: sellCredit });
          toast.success("Energy listed successfully!!");
        } catch (error) {
          console.error("Error during API call:", error);
          toast.error("Problem occurred while listing energy.");
        }
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Sell</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sell Energy Credits</AlertDialogTitle>
          <AlertDialogDescription>
            <span>Enter the amount of energy credits you want to sell:</span>
            <Input type="number" value={sellCredit} onChange={handleInputChange} />
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSell}
            disabled={sellCredit === "" || sellCredit <= 0 || !!error || isPending}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Sell;
