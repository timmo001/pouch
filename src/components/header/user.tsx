"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function User() {
  return (
    <>
      <Authenticated>
        <Link href="/user" passHref>
          <Button size="icon" variant="ghost">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </Link>
        <UserButton />
      </Authenticated>
      <Unauthenticated>
        <Button size="sm" variant="default" asChild>
          <SignInButton mode="modal" />
        </Button>
      </Unauthenticated>
    </>
  );
}
