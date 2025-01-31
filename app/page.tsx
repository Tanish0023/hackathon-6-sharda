"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // ✅ Read authentication status from headers
    fetch("/")
      .then((res) => res.headers)
      .then((headers) => {
        const authStatus = headers.get("X-User-Authenticated") === "true";
        const id = headers.get("X-User-ID") || "";

        setIsAuthenticated(authStatus);
        setUserId(id);
      });
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">

      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-50 flex justify-between items-center">
        <div className="text-2xl font-bold">MyPlatform</div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <Link href={`/${userId}`}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors">
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to MyPlatform</h1>
        <p className="text-lg">A one-stop solution for all your energy needs and efficient trading.</p>
      </header>

      {/* Information Section */}
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-white">About Us</h2>
        <p className="mb-6 text-gray-400">
          MyPlatform offers innovative solutions for dynamic energy pricing and trading. We aim to provide a seamless
          experience for users, ensuring transparency, efficiency, and sustainability in energy transactions.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold mb-2 text-white">Dynamic Pricing</h3>
            <p className="text-gray-400">Real-time pricing based on energy supply and demand.</p>
          </div>
          <div className="bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold mb-2 text-white">Secure Transactions</h3>
            <p className="text-gray-400">Blockchain-backed platform for secure and transparent transactions.</p>
          </div>
          <div className="bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold mb-2 text-white">User-Friendly Interface</h3>
            <p className="text-gray-400">Simplified and intuitive interface for a seamless experience.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-white">FAQs</h2>
          <div className="space-y-4">
            <details className="bg-gray-700 shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
              <summary className="cursor-pointer text-lg font-bold text-white">What is MyPlatform?</summary>
              <p className="text-gray-300 mt-2">
                MyPlatform is an innovative platform for trading energy efficiently with real-time pricing.
              </p>
            </details>
            <details className="bg-gray-700 shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
              <summary className="cursor-pointer text-lg font-bold text-white">How does dynamic pricing work?</summary>
              <p className="text-gray-300 mt-2">
                Dynamic pricing adjusts based on the current supply and demand for energy.
              </p>
            </details>
            <details className="bg-gray-700 shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
              <summary className="cursor-pointer text-lg font-bold text-white">Is the platform secure?</summary>
              <p className="text-gray-300 mt-2">
                Yes, we use blockchain technology to ensure secure and transparent transactions.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} MyPlatform. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default HomePage;
