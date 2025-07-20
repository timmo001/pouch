import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { ClerkProvider } from "~/components/providers/clerk";
import { ConvexClientProvider } from "~/components/providers/convex-with-clerk";
import { TanstackQueryProvider } from "~/components/providers/tanstack-query";

export const metadata: Metadata = {
  title: "Pouch",
  description: "Store your favorite things",
  icons: [{ rel: "icon", url: "/icon" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class">
          <ClerkProvider>
            <ConvexClientProvider>
              <TanstackQueryProvider>{children}</TanstackQueryProvider>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
