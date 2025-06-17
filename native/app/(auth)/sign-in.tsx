import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="items-stretch justify-center flex-1 gap-4 p-12">
      <Input
        autoCapitalize="none"
        placeholder="Enter email"
        value={emailAddress}
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <Input
        placeholder="Enter password"
        secureTextEntry={true}
        value={password}
        onChangeText={(password) => setPassword(password)}
      />
      <Button onPress={onSignInPress} size="lg">
        <Text>Sign in</Text>
      </Button>
      <Link href="/sign-up" replace asChild>
        <Button size="lg" variant="link">
          <Text>Don&apos;t have an account? Sign up</Text>
        </Button>
      </Link>
    </View>
  );
}
