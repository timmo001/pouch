"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { BreadcrumbsStoreProvider } from "~/components/providers/breadcrumbs-store-provider";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

// Add BeforeInstallPromptEvent type if not available
// See: https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const hasPromptedRef = useRef(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    // Check if the user has already dismissed the prompt in localStorage
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("pwaPromptDismissed") === "true"
    ) {
      dismissedRef.current = true;
      return;
    }

    function handler(e: Event) {
      // Only handle if it's a BeforeInstallPromptEvent
      if (typeof (e as BeforeInstallPromptEvent).prompt !== "function") return;
      e.preventDefault();
      if (hasPromptedRef.current || dismissedRef.current) return;
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      hasPromptedRef.current = true;
      toast("Install Pouch to get a better experience!", {
        description: "Share URLs/text to Pouch, shortcuts and more",
        dismissible: true,
        closeButton: true,
        duration: 120000, // 2 minutes
        position: "bottom-center",
        action: {
          label: "Install",
          onClick: () => {
            const promptEvent = deferredPromptRef.current;
            if (promptEvent) {
              void promptEvent.prompt();
              deferredPromptRef.current = null;
            }
          },
        },
        // onAutoClose: () => {
        //   localStorage.setItem("pwaPromptDismissed", "false");
        //   dismissedRef.current = false;
        // },
        onDismiss: () => {
          localStorage.setItem("pwaPromptDismissed", "true");
          dismissedRef.current = true;
        },
      });
    }
    window.addEventListener("beforeinstallprompt", handler as EventListener, {
      once: true,
    });
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener,
      );
    };
  }, []);

  return (
    <BreadcrumbsStoreProvider>
      <div className="flex relative flex-col w-screen h-screen max-w-screen">
        <header className="fixed top-0 right-0 left-0 z-50 w-screen border-b backdrop-blur-sm bg-background/50">
          <div className="container flex flex-shrink-0 items-center px-4 mx-auto h-14">
            <div className="mr-auto text-lg font-semibold">
              <Breadcrumbs />
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
        <div className="min-h-14" />
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
    </BreadcrumbsStoreProvider>
  );
}
