"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type Preloaded } from "convex/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/convex/_generated/api";
import { type Doc, type Id } from "~/convex/_generated/dataModel";
import { ListItemForm } from "~/components/list-items/item/form";
import type { ListItemFormType } from "~/components/list-items/item/form";

export function CreateListItemForm({
  preloadedGroups,
  group,
  initialValues,
}: {
  preloadedGroups: Preloaded<typeof api.groups.getAll>;
  group?: Doc<"groups">;
  initialValues?: Partial<ListItemFormType>;
}) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.listItems.create),
    onSuccess: (
      newListItem: Omit<Doc<"listItems">, "_id" | "_creationTime">,
    ) => {
      router.replace(`/groups/${newListItem.group}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create list item");
    },
  });

  function handleSubmit(values: ListItemFormType) {
    if (!group && !(values.group as Id<"groups">)) {
      console.error("No group provided");
      toast.error("No group provided");
      return;
    }

    mutate({ ...values, group: group?._id ?? (values.group as Id<"groups">) });
  }

  return (
    <ListItemForm
      type="create"
      preloadedGroups={preloadedGroups}
      initialValues={{ ...initialValues, group: group?._id }}
      loading={isPending}
      onSubmit={handleSubmit}
    />
  );
}
