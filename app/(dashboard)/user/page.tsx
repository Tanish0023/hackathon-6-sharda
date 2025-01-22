"use client"
import ThemeButton from "@/components/theme-button";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Home() {
  return (
    <div>
      <Button onClick={() => {
        toast.success("Hello how are you")
      }}>Hello</Button>

    </div>
  );
}
