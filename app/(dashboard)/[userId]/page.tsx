"use client"
import { generateKeyPair } from "@/actions/wallet-keys";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Home() {
  return (
    <div>
      <Button onClick={() => {
        toast.success("Hello how are you");
        generateKeyPair();
      }}>Hello</Button>

    </div>
  );
}
