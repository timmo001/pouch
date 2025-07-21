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
import { getListItemTitle } from "~/lib/list-item";

export function ListItemDelete({
  listItem,
  variant,
}: {
  listItem: Doc<"listItems">;
  variant: "icon" | "text";
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.listItems.deletelistItem),
    onSuccess: () => {
      toast.success(`${title} deleted`);
      if (pathname.includes(listItem._id)) {
        router.replace(`/groups/${listItem.group}`);
      } else {
        router.refresh();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete item");
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
    <Confirmation
      title={`Delete ${title}`}
      description="Are you sure you want to delete this item?"
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
          mutate({ group: listItem.group, id: listItem._id });
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
