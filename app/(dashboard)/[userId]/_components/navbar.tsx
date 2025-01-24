import ThemeButton from "@/components/theme-button";
import AlertDialogComp from "./alert";
import BuyButton from "./buyButton";

const Navbar = () => {
    return ( 
        <div
            className="sticky w-full flex items-center justify-end h-[80px] bg-slate-500"
        >
            <div
                className="mr-5 flex items-center gap-x-5 "
            >
                <AlertDialogComp />
                <BuyButton />
                <ThemeButton />
            </div>
        </div>
     );
}
 
export default Navbar;