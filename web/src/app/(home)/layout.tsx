"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import Link from "next/link";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="border-b">
        <div className="container flex flex-shrink-0 items-center px-4 mx-auto h-14">
          <div className="mr-auto text-lg font-semibold">
            <Link href="/">Pouch</Link>
          </div>
          <div className="flex gap-2 items-center">
            <ThemeToggle />
            <Authenticated>
              <UserButton
                customMenuItems={[
                  {
                    label: theme === "dark" ? "Light mode" : "Dark mode",
                    onClick: () =>
                      setTheme(theme === "dark" ? "light" : "dark"),
                  },
                ]}
              />
            </Authenticated>
            <Unauthenticated>
              <Button size="sm" variant="default" asChild>
                <SignInButton mode="modal" />
              </Button>
            </Unauthenticated>
          </div>
        </div>
      </header>
      <main className="container flex flex-col flex-1 p-4 mx-auto">
        <Authenticated>{children}</Authenticated>
        <Unauthenticated>
          <div className="flex flex-col gap-4 justify-center items-center w-full h-full">
            <div className="flex flex-col flex-1 gap-2 justify-center items-center">
              <p className="text-2xl font-bold text-center lg:text-4xl">
                Sign in to continue
              </p>
              <Button size="default" variant="default" asChild>
                <SignInButton mode="modal" />
              </Button>
            </div>
            <div className="flex flex-col flex-1 gap-2 justify-center items-center">
              <p className="text-2xl font-bold text-center lg:text-4xl">
                New here?
              </p>
              <Button size="default" variant="default" asChild>
                <SignUpButton mode="modal" />
              </Button>
            </div>
          </div>
        </Unauthenticated>
      </main>
    </div>
  );
}
