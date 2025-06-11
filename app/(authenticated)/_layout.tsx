import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Slot } from "expo-router";
import React from "react";
import { Text } from "~/components/ui/text";

export default function AuthenticatedLayout() {
  return (
    <>
      <Unauthenticated>
        {/* <SignInButton /> */}
        <Text className="text-2xl font-bold text-center">Unauthenticated</Text>
      </Unauthenticated>
      <Authenticated>
        {/* <UserButton /> */}
        <Text className="text-2xl font-bold text-center">Authenticated</Text>
        <Slot />
      </Authenticated>
      <AuthLoading>
        <Text className="text-2xl font-bold text-center">Loading...</Text>
      </AuthLoading>
    </>
  );
}
