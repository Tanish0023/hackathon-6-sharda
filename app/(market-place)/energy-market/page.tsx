"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Using Button component from UI library
import { Home } from "./_components/check-out";

const EnergyMarketPage = () => {
  const [listings, setListings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDemand, setUserDemand] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false); // State to control Checkout visibility

  // Fetch User ID
  const getUserId = async () => {
    try {
      const userData = await axios.post("/api/user");
      return userData.data.userId;  // Return the userId directly
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const userIdFromData = await getUserId(); // Wait for the promise to resolve
      setUserId(userIdFromData);  // Set the resolved userId
    };

    fetchUserId();  // Call the async function
  }, []);

  // Fetch Listings from API
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("/api/listing");
        setListings(response.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleCheckboxChange = (id: number, price: number, checked: boolean) => {
    if (checked) {
      setTotalPrice((prev) => prev + price);
      setSelectedListings((prev) => [...prev, id]);
    } else {
      setTotalPrice((prev) => prev - price);
      setSelectedListings((prev) =>
        prev.filter((listingId) => listingId !== id)
      );
    }
  };

  const handleDemandChange = (demand: string) => {
    setUserDemand(demand);
    let remainingDemand = parseFloat(demand);
    const newSelectedListings: number[] = [];
    let newTotalPrice = 0;

    listings.forEach((listing: any) => {
      if (remainingDemand > 0) {
        if (remainingDemand >= listing.unit) {
          newSelectedListings.push(listing.id);
          newTotalPrice += listing.price;
          remainingDemand -= listing.unit;
        }
      }
    });

    setSelectedListings(newSelectedListings);
    setTotalPrice(newTotalPrice);
  };

  useEffect(() => {
    listings.forEach((listing: any) => {
      const checkbox = document.getElementById(`checkbox-${listing.id}`) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = selectedListings.includes(listing.id);
      }
    });
  }, [selectedListings, listings]);

  const filteredListings = listings.filter((listing: any) =>
    listing.meterId.toString().includes(searchQuery)
  );

  const handleCheckoutClick = () => {
    setIsCheckoutVisible(true); // Show Checkout component when button is clicked
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-10 px-6">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-8">
        <Link href={`/${userId}`}>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg shadow-md">
            Dashboard
          </Button>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">
            Total Price: ₹<span className="font-bold">{totalPrice.toFixed(2)}</span>
          </span>
          <Button
            className={`${
              totalPrice > 0
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-4 py-2 rounded-lg shadow-md`}
            disabled={totalPrice === 0}
            onClick={handleCheckoutClick} // Trigger checkout visibility
          >
            Checkout
          </Button>
        </div>
        <input
          type="text"
          placeholder="Search by Meter ID..."
          className="p-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Checkout Component */}
      {isCheckoutVisible && <Home amount={totalPrice} />}
      
      {/* User Demand Input */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Enter your energy demand (kWh):</label>
        <input
          type="number"
          placeholder="Enter demand..."
          className="p-2 border rounded-lg shadow w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={userDemand}
          onChange={(e) => handleDemandChange(e.target.value)}
        />
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600 text-center">Loading listings...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing: any) => (
        
            <div key={listing.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{listing.meterId}</h3>
                <p className="text-gray-600">
                  Unit: {listing.credits} kWh | Price: ₹{listing.price.toFixed(2)} | Per unit Price: ₹{listing.pricePerCredit}
                </p>
              </div>
              <div>
                <input
                  id={`checkbox-${listing.id}`}
                  type="checkbox"
                  className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600"
                  onChange={(e) =>
                    handleCheckboxChange(
                      listing.id,
                      listing.price,
                      e.target.checked
                    )
                  }
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No listings match your search.</p>
        )}
      </div>

    
    </div>
  );
};

export default EnergyMarketPage;
