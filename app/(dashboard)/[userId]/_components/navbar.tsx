import ThemeButton from "@/components/theme-button";
import AlertDialogComp from "./alert";
import BuyButton from "./buyButton";

const Navbar = () => {
    return ( 
        <div
            className="sticky w-full flex items-center justify-center h-[80px] bg-slate-500"
        >
            Navbar
            <AlertDialogComp />
            <BuyButton />
            <ThemeButton />
        </div>
     );
}
 
export default Navbar;