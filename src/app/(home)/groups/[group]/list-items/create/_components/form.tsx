"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "~/convex/_generated/api";
import { type Doc, type Id } from "~/convex/_generated/dataModel";
import { ListItemForm } from "~/components/forms/list-item";
import type { ListItemFormType } from "~/components/forms/list-item";

export function CreateListItemForm({ group }: { group: Doc<"groups"> }) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.listItems.create),
    onSuccess: (_newId: Id<"listItems">) => {
      router.replace(`/groups/${group._id}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create list item");
    },
  });

  function handleSubmit(values: ListItemFormType) {
    mutate({ group: group._id, ...values });
  }

  return (
    <ListItemForm type="create" loading={isPending} onSubmit={handleSubmit} />
  );
}
