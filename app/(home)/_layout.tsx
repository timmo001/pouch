import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Link, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SignOutButton } from "~/components/SignOutButton";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function AuthenticatedLayout() {
  return (
    <>
      <Unauthenticated>
        <View className="items-center justify-center flex-1 gap-4">
          <Text className="text-2xl font-bold text-center">
            Sign in to continue
          </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Button size="lg">
              <Text>Sign in</Text>
            </Button>
          </Link>
        </View>
      </Unauthenticated>
      <Authenticated>
        <SignOutButton />
        <Text className="text-2xl font-bold text-center">Authenticated</Text>
        <Stack screenOptions={{ headerRight: () => <ThemeToggle /> }}>
          <Stack.Screen name="index" options={{ title: "Pouch" }} />
        </Stack>
      </Authenticated>
      <AuthLoading>
        <Text className="text-2xl font-bold text-center">Loading...</Text>
      </AuthLoading>
    </>
  );
}
