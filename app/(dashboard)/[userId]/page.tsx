"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getTotalEnergyUnit = async () => {
  try {
    const response = await axios.post("/api/user");

    return response.data.totalUnits || 0;
  } catch (error) {
    console.error("Error fetching total energy units:", error);
    return 0; 
  }
};

const getTotalCredit = async () => {
  try {
    const response = await axios.post("/api/user"); 
    
    return response.data.SellerCredit || 0; 
  } catch (error) {
    console.error("Error fetching total credits:", error);
    return 0;
  }
};

export default function Home() {
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [credits, setCredits] = useState(0);

  const updateEnergyData = async () => {
    const totalUnits = await getTotalEnergyUnit();
    setTotalEnergy(totalUnits);
    toast.success("Energy data updated!");
  };

  const updateCreditData = async () => {
    const totalCredits = await getTotalCredit();
    setCredits(totalCredits);
    toast.success("Credits updated!");
  };

  useEffect(() => {
    const useEffectUpdateEnergy = async () => {
      const totalUnits = await getTotalEnergyUnit();
      setTotalEnergy(totalUnits);
      const totalCredits = await getTotalCredit();
      setCredits(totalCredits);
      };

    useEffectUpdateEnergy();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-10 px-6">
      {/* Energy Dashboard */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
          Energy Dashboard
        </h1>
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
            <strong>Total Energy supplied to the grid:</strong>
          </p>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {totalEnergy.toFixed(2)} kWh
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            This is the total energy you've supplied to the grid so far. Your energy contribution is helping power the community!
          </p>
        </div>
        <div className="mt-6 text-center">
          <Button onClick={updateEnergyData} className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg shadow-md transition duration-300">
            Update Energy
          </Button>
        </div>
      </div>

      {/* Credit Dashboard */}
      <div className="max-w-4xl my-2 mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
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
            These are the credits you've earned for contributing energy to the grid. Keep up the great work!
          </p>
        </div>
        <div className="mt-6 text-center">
          <Button onClick={updateCreditData} className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg shadow-md transition duration-300">
            Update Credits
          </Button>
        </div>
      </div>
    </div>
  );
}
