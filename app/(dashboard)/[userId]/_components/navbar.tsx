"use client";

import ThemeButton from "@/components/theme-button";
import AlertDialogComp from "./alert";
import BuyButton from "./buyButton";
import Sell from "./sell";
import axios from "axios";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [totalCredits, setTotalCredits] = useState<number | undefined>(undefined); // Initially undefined to check if it's loaded
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch credits from the backend
  const fetchCredits = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.post("/api/user"); // Make sure this endpoint returns totalCredits
      const userData = response.data; // Ensure your API sends credits in this format
      setTotalCredits(userData.credit);
    } catch (error) {
      console.error("Failed to fetch seller credits:", error);
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  // Fetch credits on initial render
  useEffect(() => {
    fetchCredits();
  }, []);

  // If loading, show a loading message
  if (loading) {
    return (
      <div className="text-center text-xl text-gray-700 dark:text-gray-300">
        Loading credits...
      </div>
    );
  }

  // If totalCredits is undefined, do not render the Sell component
  if (totalCredits === undefined) {
    return (
      <div className="text-center text-xl text-red-500 dark:text-red-400">
        Error fetching credits. Please try again.
      </div>
    );
  }

  return (
    <div className="sticky top-0 w-full flex items-center justify-between bg-blue-200 dark:bg-slate-700 p-4 shadow-md">
      <div className="flex items-center space-x-4">
        {/* Pass the totalCredits as a prop to the Sell component */}
        <Sell totalCredits={totalCredits} />
      </div>
      <div className="flex items-center space-x-5">
        <AlertDialogComp />
        <BuyButton />
        <ThemeButton />
      </div>
    </div>
  );
};

export default Navbar;
