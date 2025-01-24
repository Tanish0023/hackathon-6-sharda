"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const BuyButton = () => {
    const router = useRouter();

    return ( 
        <div>
            <Button
                onClick={() => router.push("/energy-market")}
            >Buy Energy</Button>
        </div>
     );
}
 
export default BuyButton;