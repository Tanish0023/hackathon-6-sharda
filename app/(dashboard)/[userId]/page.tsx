"use client";

import { addCredits, getBalance } from "@/actions/blockchain-interact";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserData {
  userId: string;
  totalUnits?: number;
}

// API calls with proper error handling
const getTotalEnergyUnit = async (): Promise<number> => {
  try {
    const response = await axios.post<UserData>("/api/user");
    return response.data.totalUnits || 0;
  } catch (error) {
    console.error("Error fetching total energy units:", error);
    toast.error("Failed to fetch energy data");
    return 0;
  }
};

const getTotalCredit = async (): Promise<string> => {
  try {
    const response = await axios.post<UserData>("/api/user");
    const userCredits = await getBalance(response.data.userId);
    if (userCredits === "0") {
      console.log("No credits yet for user:", response.data.userId);
    }
    return userCredits;
  } catch (error) {
    console.error("Error fetching total credits:", error);
    toast.error("Failed to fetch credits");
    return "0";
  }
};

export default function Home() {
  const [totalEnergy, setTotalEnergy] = useState<number>(0);
  const [credits, setCredits] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [energyUnits, creditAmount] = await Promise.all([
          getTotalEnergyUnit(),
          getTotalCredit(),
        ]);
        setTotalEnergy(energyUnits);
        setCredits(creditAmount);
        if (creditAmount === "0") {
          toast("Welcome! Start contributing energy to earn credits!");
        }
      } catch (error) {
        console.error("Error in initial data fetch:", error);
        toast.error("Failed to load initial data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Update handlers
  const updateEnergyData = async () => {
    setIsLoading(true);
    try {
      const totalUnits = await getTotalEnergyUnit();
      setTotalEnergy(totalUnits);
      toast.success("Energy data refreshed!");
    } catch (error) {
      toast.error("Failed to refresh energy data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCreditData = async () => {
    setIsLoading(true);
    try {
      const totalCredits = await getTotalCredit();
      setCredits(totalCredits);
      toast.success("Credits refreshed!");
    } catch (error) {
      toast.error("Failed to refresh credits");
    } finally {
      setIsLoading(false);
    }
  };

  const addEnergyCredit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<UserData>("/api/user");
      const result = await addCredits(response.data.userId, 1);
      
      if (result.success) {
        toast.success("1 credit added for your energy contribution!");
        const newCredits = await getTotalCredit();
        setCredits(newCredits);
      } else {
        toast.error(result.error || "Failed to add credit");
      }
    } catch (error) {
      console.error("Error adding credit:", error);
      toast.error("An error occurred while adding credit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-10 px-6">
      {/* Energy Dashboard */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
          Energy Dashboard
        </h1>
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
            <strong>Total Energy Supplied:</strong>
          </p>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {totalEnergy.toFixed(2)} kWh
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Your energy contribution is powering the community!
          </p>
        </div>
        <div className="mt-6 text-center">
          <Button
            onClick={updateEnergyData}
            disabled={isLoading}
            className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Refreshing..." : "Refresh Energy"}
          </Button>
        </div>
      </div>

      {/* Credit Dashboard */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
          Credit Dashboard
        </h1>
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
            <strong>Total Credits Earned:</strong>
          </p>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {credits} Credits
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            {credits === "0"
              ? "Start contributing energy to earn credits!"
              : "Credits earned for your energy contributions!"}
          </p>
        </div>
        <div className="mt-6 text-center space-x-4">
          <Button
            onClick={updateCreditData}
            disabled={isLoading}
            className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Refreshing..." : "Refresh Credits"}
          </Button>
          <Button
            onClick={addEnergyCredit}
            disabled={isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Add Energy Credit"}
          </Button>
        </div>
      </div>
    </div>
  );
}