"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeToggle({ varient = "default" }: { varient?: "default" | "icon" }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before showing theme text
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Button variant="outline" size={varient} onClick={toggleTheme} className="">
            <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
            <Moon className="hidden h-[1.2rem] w-[1.2rem] transition-all dark:block" />
            {varient == "default" && mounted && <span className="capitalize">{theme}</span>}
        </Button>
    );
}
