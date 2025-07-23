"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type Preloaded } from "convex/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/convex/_generated/api";
import { type Doc } from "~/convex/_generated/dataModel";
import { ListItemForm } from "~/components/list-items/item/form";
import type { ListItemFormType } from "~/components/list-items/item/form";

export function UpdateListItemForm({
  preloadedGroups,
  listItem: listItemIn,
}: {
  preloadedGroups: Preloaded<typeof api.groups.getAll>;
  listItem: Omit<Doc<"listItems">, "group"> & { group: Doc<"groups"> };
}) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.listItems.update),
    onSuccess: () => {
      router.replace(`/groups/${listItemIn.group._id}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update listItem");
    },
  });

  function handleSubmit(values: ListItemFormType) {
    mutate({
      group: listItemIn.group._id,
      id: listItemIn._id,
      type: values.type,
      value: values.value,
      description: values.description,
    });
  }

  return (
    <ListItemForm
      type="update"
      preloadedGroups={preloadedGroups}
      loading={isPending}
      onSubmit={handleSubmit}
      initialValues={{
        group: listItemIn.group._id,
        type: listItemIn.type,
        value: listItemIn.value,
        description: listItemIn.description,
      }}
    />
  );
}
