"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, MoonStar, Monitor } from "lucide-react";
import { Dots } from "~/components/ui/dots";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button disabled variant="ghost" size="icon" aria-label="Toggle theme">
        <Dots count={2} />
      </Button>
    );
  }

  const icon =
    theme === "light" ? (
      <Sun className="h-5 w-5" />
    ) : (
      <MoonStar className="h-5 w-5" />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-md p-0" align="end" side="bottom">
        <DropdownMenuItem
          className={cn(
            "group-focus:text-accent-foreground rounded-none rounded-t-md p-2",
            theme === "system" && "bg-accent text-accent-foreground",
          )}
          onSelect={() => setTheme("system")}
        >
          <Monitor
            className={cn(
              "group-focus:text-accent-foreground mr-2 h-4 w-4",
              theme === "system" && "text-accent-foreground",
            )}
          />{" "}
          System
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "group-focus:text-accent-foreground rounded-none p-2",
            theme === "light" && "bg-accent text-accent-foreground",
          )}
          onSelect={() => setTheme("light")}
        >
          <Sun
            className={cn(
              "group-focus:text-accent-foreground mr-2 h-4 w-4",
              theme === "light" && "text-accent-foreground",
            )}
          />{" "}
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "group-focus:text-accent-foreground rounded-none rounded-b-md p-2",
            theme === "dark" && "bg-accent text-accent-foreground",
          )}
          onSelect={() => setTheme("dark")}
        >
          <MoonStar
            className={cn(
              "group-focus:text-accent-foreground mr-2 h-4 w-4",
              theme === "dark" && "text-accent-foreground",
            )}
          />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
