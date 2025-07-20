"use client";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Confirmation } from "~/components/ui/confirmation";
import { Dots } from "~/components/ui/dots";
import { cn } from "~/lib/utils";
import { type Doc } from "~/convex/_generated/dataModel";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "~/convex/_generated/api";
import { getLinkTitle } from "~/lib/link";

export function LinkDelete({
  link,
  variant,
}: {
  link: Doc<"links">;
  variant: "icon" | "text";
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.links.deleteLink),
    onSuccess: () => {
      toast.success(`${title} deleted`);
      if (pathname.includes(link._id)) {
        router.replace(`/groups/${link.group}`);
      } else {
        router.refresh();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete link");
    },
  });

  const title = useMemo(
    () =>
      getLinkTitle({
        description: link.description,
        url: link.url,
      }),
    [link.description, link.url],
  );

  return (
    <Confirmation
      title={`Delete ${title}`}
      description="Are you sure you want to delete this link?"
      confirm={{
        text: "Delete",
        variant: "destructive",
        pendingText: (
          <span>
            Deleting
            <Dots count={3} />
          </span>
        ),
        isPending,
        onConfirm: () => {
          mutate({ group: link.group, id: link._id });
        },
      }}
      trigger={
        <Button
          className={cn(
            variant === "icon" &&
              "hover:bg-destructive/10 hover:text-destructive",
          )}
          type="button"
          size={variant === "icon" ? "icon" : "default"}
          variant={variant === "icon" ? "ghost" : "destructive"}
        >
          <Trash2Icon />
          <span className={cn(variant === "icon" && "sr-only")}>
            {isPending ? (
              <>
                Deleting
                <Dots count={3} />
              </>
            ) : (
              "Delete"
            )}
          </span>
        </Button>
      }
    />
  );
}
