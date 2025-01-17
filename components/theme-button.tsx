"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeButton = () => {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); 
    }, []);

    const changeTheme = () => {
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <Button onClick={changeTheme} variant="secondary" size="lg">
            {theme === "dark" ? <Moon /> : <Sun />}
        </Button>
    );
};

export default ThemeButton;
