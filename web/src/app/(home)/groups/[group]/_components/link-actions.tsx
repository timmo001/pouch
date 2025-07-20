"use client";
import { PencilLineIcon, Trash2Icon } from "lucide-react";
import { type Doc } from "~/convex/_generated/dataModel";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Confirmation } from "~/components/ui/confirmation";
import Link from "next/link";
import { Dots } from "~/components/ui/dots";
import { toast } from "sonner";

export function LinkActions({ link }: { link: Doc<"links"> }) {
  const { mutate: deleteMutate, isPending: deletionIsPending } = useMutation({
    mutationFn: useConvexMutation(api.links.deleteLink),
    onSuccess: () => {
      toast.success("Link deleted");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete link");
    },
  });

  return (
    <div className="flex flex-row gap-2">
      <Link href={`/groups/${link.group}/links/${link._id}`} passHref>
        <Button size="icon" variant="ghost">
          <PencilLineIcon />
        </Button>
      </Link>
      <Confirmation
        title="Delete link"
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
          isPending: deletionIsPending,
          onConfirm: () => {
            deleteMutate({ group: link.group, id: link._id });
          },
        }}
        trigger={
          <Button
            className="hover:bg-destructive/10 hover:text-destructive"
            size="icon"
            variant="ghost"
          >
            <Trash2Icon />
          </Button>
        }
      />
    </div>
  );
}
