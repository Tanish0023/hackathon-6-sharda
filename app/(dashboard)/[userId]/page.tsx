"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getTotalEnergyUnit = async () => {
  try {
    const response = await axios.post("/api/user"); // Adjust API endpoint if necessary
    return response.data.totalUnits || 0; // Safely return the totalUnits
  } catch (error) {
    console.error("Error fetching total energy units:", error);
    return 0; // Fallback value in case of error
  }
};

export default function Home() {
  const [totalEnergy, setTotalEnergy] = useState(0);

  useEffect(() => {
    const updateEnergyData = async () => {
      const totalUnits = await getTotalEnergyUnit();
      setTotalEnergy(totalUnits);
    };

    // Call the function initially
    updateEnergyData();

    // Set up an interval to update data every 3 seconds
    const interval = setInterval(() => {
      updateEnergyData();
    }, 3000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          toast.success("Hello, how are you?");
        }}
      >
        Hello
      </Button>

      <div>
        <strong>Total Energy supplied to the grid:</strong> {totalEnergy.toFixed(2)} kWh
      </div>
    </div>
  );
}
