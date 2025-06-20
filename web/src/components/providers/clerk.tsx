"use client";
import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ClerkProviderBase
      appearance={{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        baseTheme: theme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProviderBase>
  );
}
