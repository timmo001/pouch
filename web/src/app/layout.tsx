import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { ThemeToggle } from "~/components/ui/theme-toggle";

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
          <div className="fixed z-50 top-4 right-4">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
