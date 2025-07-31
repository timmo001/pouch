"use client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/convex/_generated/api";
import { Button } from "./ui/button";
import { Input } from "~/components/ui/input";
import { useQuery } from "convex/react";
import { Dots } from "~/components/ui/dots";
import { useEffect } from "react";
import { CopyIcon, KeyIcon } from "lucide-react";
import { FormControl, FormField, FormLabel } from "~/components/ui/form";
import { Label } from "~/components/ui/label";

export function UserSettings() {
  const { user: authUser } = useUser();

  const user = useQuery(api.users.getCurrentUser);

  const {
    mutate: generateApiAccessToken,
    isPending: isGeneratingApiAccessToken,
  } = useMutation({
    mutationFn: useConvexMutation(api.users.generateApiAccessToken),
    onSuccess: () => {
      toast.success("User settings updated");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update user settings");
    },
  });

  const {
    mutate: createFromCurrentUser,
    isPending: isCreatingFromCurrentUser,
  } = useMutation({
    mutationFn: useConvexMutation(api.users.createFromCurrentUser),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create user");
    },
  });

  useEffect(() => {
    if (authUser && !user && !isCreatingFromCurrentUser) {
      createFromCurrentUser({});
    }
  }, [authUser, createFromCurrentUser, isCreatingFromCurrentUser, user]);

  function handleCopyApiAccessToken() {
    if (user?.apiAccessToken) {
      void navigator?.clipboard?.writeText(user.apiAccessToken);
      toast.success("API Access Token copied!");
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold">User Settings</h1>
      <p className="text-muted-foreground mb-12 text-sm">
        {authUser?.emailAddresses[0]?.emailAddress}
      </p>
      <section className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-2xl flex-col gap-4">
          {user && !isCreatingFromCurrentUser ? (
            <>
              <Label htmlFor="apiAccessToken">API Access Token</Label>
              <div className="flex flex-row gap-2">
                <div
                  className="selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 relative flex h-9 w-full min-w-0 flex-grow cursor-pointer flex-row items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
                  onClick={handleCopyApiAccessToken}
                >
                  {user?.apiAccessToken ?? "Not set"}
                  <CopyIcon className="size-4" />
                </div>
                <Button
                  disabled={isGeneratingApiAccessToken}
                  onClick={() => generateApiAccessToken({})}
                >
                  <KeyIcon className="size-4" />
                  {isGeneratingApiAccessToken
                    ? "Generating..."
                    : `${user?.apiAccessToken ? "Regenerate" : "Generate"} Token`}
                </Button>
              </div>
            </>
          ) : (
            <h2 className="text-2xl font-bold">
              Loading
              <Dots count={3} />
            </h2>
          )}
        </div>
      </section>
    </>
  );
}
