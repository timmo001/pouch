"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { BreadcrumbsStoreProvider } from "~/components/providers/breadcrumbs-store-provider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <BreadcrumbsStoreProvider>
      <div className="flex h-screen w-screen flex-col">
        <header className="border-b">
          <div className="container mx-auto flex h-14 flex-shrink-0 items-center px-4">
            <div className="mr-auto text-lg font-semibold">
              <Breadcrumbs />
            </div>
            <div className="flex items-center gap-2">
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
        <main className="container mx-auto flex flex-1 flex-col p-4">
          <Authenticated>{children}</Authenticated>
          <Unauthenticated>
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <p className="text-center text-2xl font-bold lg:text-4xl">
                  Sign in to continue
                </p>
                <Button size="default" variant="default" asChild>
                  <SignInButton mode="modal" />
                </Button>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <p className="text-center text-2xl font-bold lg:text-4xl">
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
    </BreadcrumbsStoreProvider>
  );
}
