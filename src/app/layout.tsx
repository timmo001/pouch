import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { ClerkProvider } from "~/components/providers/clerk";
import { ConvexClientProvider } from "~/components/providers/convex-with-clerk";
import { TanstackQueryProvider } from "~/components/providers/tanstack-query";

export const metadata: Metadata = {
  title: {
    template: "%s | Pouch",
    default: "Pouch",
  },
  description: "Store your favorite things",
  icons: [{ rel: "icon", url: "/icon" }],
  manifest: "/manifest.webmanifest",
  metadataBase: new URL("https://pouch.timmo.dev"),
  openGraph: {
    images: [
      {
        alt: "Pouch",
        url: "/api/og",
      },
    ],
    siteName: "Pouch",
    url: "https://pouch.timmo.dev",
  },
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
        <NuqsAdapter>
          <ThemeProvider attribute="class">
            <ClerkProvider>
              <ConvexClientProvider>
                <TanstackQueryProvider>
                  {children}
                  <Toaster />
                </TanstackQueryProvider>
              </ConvexClientProvider>
            </ClerkProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
