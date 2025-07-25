"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ThemePicker } from "~/components/ui/theme-picker";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { BreadcrumbsStoreProvider } from "~/components/providers/breadcrumbs-store-provider";
import { Github } from "~/components/assets/github";
import { cn } from "~/lib/utils";
import { Welcome } from "~/components/welcome";

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
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const headerContainerRef = useRef<HTMLDivElement>(null);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const hasPromptedRef = useRef<boolean>(false);
  const dismissedRef = useRef<boolean>(false);

  const isHomePage = useMemo(() => pathname === "/", [pathname]);

  const [isAtTop, setIsAtTop] = useState(true);
  useEffect(() => {
    function handleScroll() {
      setIsAtTop(window.scrollY === 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Set initial state in case not at top on mount
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Check if the user is logged in and has already dismissed the prompt in localStorage
    if (
      (typeof window !== "undefined" &&
        window.location.hostname === "localhost") ||
      window.location.hostname === "127.0.0.1" ||
      (isSignedIn && localStorage.getItem("pwaPromptDismissed") === "true")
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
  }, [isSignedIn]);

  return (
    <BreadcrumbsStoreProvider>
      <div
        ref={headerContainerRef}
        className="relative flex min-h-screen flex-col"
      >
        <header
          className={cn(
            "bg-background/50 fixed top-0 right-0 left-0 z-50 w-screen backdrop-blur-sm",
            (!isAtTop || isSignedIn) && "border-b",
            !isSignedIn && "bg-transparent",
          )}
        >
          <div className="container mx-auto flex h-14 flex-shrink-0 items-center px-4">
            <div className="mr-auto text-lg font-semibold">
              <Authenticated>
                <Breadcrumbs />
              </Authenticated>
            </div>
            <div className="flex items-center gap-2">
              {isHomePage ? (
                <Link
                  href="https://github.com/timmo001/pouch"
                  target="_blank"
                  rel="noopener noreferrer"
                  passHref
                >
                  <Button
                    className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                    aria-label="Github"
                  >
                    <Github className="fill-current" />
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
        <Authenticated>
          <div className="min-h-14" />
          <main className="container mx-auto flex flex-1 flex-col gap-4 p-4">
            {children}
          </main>
        </Authenticated>
        <Unauthenticated>
          <Welcome />
        </Unauthenticated>
      </div>
    </BreadcrumbsStoreProvider>
  );
}
