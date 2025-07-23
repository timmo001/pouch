"use client";
import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ThemePicker } from "~/components/ui/theme-picker";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { BreadcrumbsStoreProvider } from "~/components/providers/breadcrumbs-store-provider";

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
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const hasPromptedRef = useRef<boolean>(false);
  const dismissedRef = useRef<boolean>(false);

  const isHomeOrWelcomePage = useMemo(
    () => pathname === "/" || pathname === "/welcome",
    [pathname],
  );

  useEffect(() => {
    if (!isSignedIn) {
      localStorage.setItem("pwaPromptDismissed", "false");
      dismissedRef.current = false;

      // If not signed in and not on the welcome page, redirect to welcome page
      if (pathname === "/") {
        console.log("Redirecting to welcome page");
        router.replace("/welcome");
      }
    }
  }, [isSignedIn, pathname, router]);

  useEffect(() => {
    // Check if the user is logged in and has already dismissed the prompt in localStorage
    if (
      isSignedIn &&
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
      <div className="relative flex h-screen w-screen max-w-screen flex-col">
        <header className="bg-background/50 fixed top-0 right-0 left-0 z-50 w-screen border-b backdrop-blur-sm">
          <div className="container mx-auto flex h-14 flex-shrink-0 items-center px-4">
            <div className="mr-auto text-lg font-semibold">
              <Breadcrumbs />
            </div>
            <div className="flex items-center gap-2">
              {isHomeOrWelcomePage ? (
                <Link href="https://github.com/timmo001/pouch" target="_blank">
                  <Button
                    className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                    aria-label="Github"
                  >
                    <svg
                      className="h-5 w-5 fill-current"
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>GitHub</title>
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </Button>
                </Link>
              ) : null}
              <ThemePicker />
              <Authenticated>
                <UserButton />
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
        <main className="container mx-auto flex flex-1 flex-col p-4">
          <Authenticated>{children}</Authenticated>
          <Unauthenticated>
            <div className="flex h-full w-full flex-row items-center justify-center gap-4">
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <p className="text-center text-2xl font-bold lg:text-4xl">
                  Sign in to continue
                </p>
                <Button size="lg" variant="default" asChild>
                  <SignInButton mode="modal" />
                </Button>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <p className="text-center text-2xl font-bold lg:text-4xl">
                  New here?
                </p>
                <Button size="lg" variant="default" asChild>
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
