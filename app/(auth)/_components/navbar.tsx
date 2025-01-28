"use client";

import ThemeButton from "@/components/theme-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const path = usePathname();
  console.log(path);
  

  return (
    <div className="sticky top-0 w-full flex items-center justify-between bg-blue-200 dark:bg-slate-700 p-4 shadow-md">
      <div>
        <Link 
          href={"/"}
          className="text-xl"
        >
          Home
        </Link>
      </div>
      <div className="flex items-center justify-center gap-5">
        <Link
          href={"/sign-in"}
          className={cn(
            path === "/sign-in" && "border-b-2 border-white",
            "text-xl"
          )}
          
        >
          Login
        </Link>
        <Link
          href={"/sign-up"}
          className={cn(
            path === "/sign-up" && "border-b-2 border-white",
            "text-xl"
          )}
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
