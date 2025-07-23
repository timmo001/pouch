"use client";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <div className="flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Not Found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Go Back
        </Button>
      </div>
    </>
  );
}
