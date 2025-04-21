"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  totalUnits?: number;
  credit?: number;
}

// Fetch user data
const getUserData = async (): Promise<UserData | null> => {
  try {
    const response = await axios.post<UserData>("/api/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    toast.error("Failed to fetch user data");
    return null;
  }
};

const addCredit = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const response = await axios.put("/api/user", {
      userId,
      amount,
    });
    return response.data.success || false;
  } catch (error) {
    console.error("Error adding credit:", error);
    toast.error("Failed to add credit");
    return false;
  }
};

export default function Home() {
  const [totalEnergy, setTotalEnergy] = useState<number>(0);
  const [credits, setCredits] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const user = await getUserData();
      if (user) {
        setUserId(user.id);
        setTotalEnergy(user.totalUnits || 0);
        setCredits(user.credit || 0);
        if (!user.credit || user.credit === 0) {
          toast("Welcome! Start contributing energy to earn credits!");
        }
      }
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const updateEnergyData = async () => {
    setIsLoading(true);
    try {
      const user = await getUserData();
      if (user) {
        setTotalEnergy(user.totalUnits || 0);
        toast.success("Energy data refreshed!");
      }
    } catch {
      toast.error("Failed to refresh energy data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCreditData = async () => {
    setIsLoading(true);
    try {
      const user = await getUserData();
      if (user) {
        setCredits(user.credit || 0);
        toast.success("Credits refreshed!");
      }
    } catch {
      toast.error("Failed to refresh credits");
    } finally {
      setIsLoading(false);
    }
  };

  const addEnergyCredit = async () => {
    if (!userId) {
      toast.error("User ID not available");
      return;
    }

    setIsLoading(true);
    try {
      const success = await addCredit(userId, 1);
      if (success) {
        toast.success("1 credit added for your energy contribution!");
        const user = await getUserData();
        if (user) {
          setCredits(user.credit || 0);
        }
      } else {
        toast.error("Failed to add credit");
      }
    } catch {
      toast.error("An error occurred while adding credit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-10 px-6">
      {/* Energy Section */}
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

      {/* Credit Section */}
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
            {credits === 0
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
