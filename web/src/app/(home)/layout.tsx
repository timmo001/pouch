"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Authenticated>
        <UserButton />
        {children}
      </Authenticated>
      <Unauthenticated>
        <div className="items-center justify-center flex-1 gap-4">
          <p className="text-2xl font-bold text-center">Sign in to continue</p>
          <Button size="lg" variant="default" asChild>
            <SignInButton mode="modal" />
          </Button>
        </div>
      </Unauthenticated>
    </>
  );
}
