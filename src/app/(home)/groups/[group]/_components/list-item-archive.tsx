"use client";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArchiveIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dots } from "~/components/ui/dots";
import { cn } from "~/lib/utils";
import { type Doc } from "~/convex/_generated/dataModel";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "~/convex/_generated/api";
import { getListItemTitle } from "~/lib/list-item";

export function ListItemArchive({
  listItem,
  variant,
}: {
  listItem: Doc<"listItems">;
  variant: "icon" | "text";
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.listItems.toggleArchive),
    onSuccess: () => {
      toast.success(`${title} archived`);
      if (pathname.includes(listItem._id)) {
        router.replace(`/groups/${listItem.group}`);
      } else {
        router.refresh();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to archive item");
    },
  });

  const title = useMemo(
    () =>
      getListItemTitle({
        type: listItem.type,
        description: listItem.description,
        value: listItem.value,
      }),
    [listItem.type, listItem.description, listItem.value],
  );

  return (
    <Button
      type="button"
      size={variant === "icon" ? "icon" : "default"}
      variant={variant === "icon" ? "ghost" : "secondary"}
      onClick={() => {
        mutate({ group: listItem.group, id: listItem._id });
      }}
    >
      <ArchiveIcon />
      <span className={cn(variant === "icon" && "sr-only")}>
        {isPending ? (
          <>
            Deleting
            <Dots count={3} />
          </>
        ) : (
          "Archive"
        )}
      </span>
    </Button>
  );
}
