"use client";
import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { darkTheme, lightTheme } from "~/lib/clerk-theme";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProviderBase
      appearance={resolvedTheme === "dark" ? darkTheme : lightTheme}
    >
      {children}
    </ClerkProviderBase>
  );
}
