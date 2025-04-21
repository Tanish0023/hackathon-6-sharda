"use client";

import CheckoutPage from "./checkOutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { JSX } from "react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export const Home = ({ amount }: { amount: number }): JSX.Element => {


  return (
    <main className="max-w-6xl border-white mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-[#111828]-100 to-[#111828]-800">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Please Pay</h1>
        <h2 className="text-2xl">
          has requested
          <span className="font-bold"> ₹{amount}</span>
        </h2>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "inr",
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </main>
  );
}