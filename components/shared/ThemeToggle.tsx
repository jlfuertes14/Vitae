"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("vitae-theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || (!stored && systemDark) ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("vitae-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hover:text-foreground"
          onClick={toggle}
        >
          {theme === "light" ? (
            <Moon className="size-[18px]" />
          ) : (
            <Sun className="size-[18px]" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </TooltipContent>
    </Tooltip>
  );
}
