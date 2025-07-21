"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "~/convex/_generated/api";
import { type Doc } from "~/convex/_generated/dataModel";
import { ListItemForm } from "~/components/forms/list-item";
import type { ListItemFormType } from "~/components/forms/list-item";

export function UpdateListItemForm({
  listItem: listItemIn,
}: {
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
      loading={isPending}
      onSubmit={handleSubmit}
      initialValues={{
        type: listItemIn.type,
        value: listItemIn.value,
        description: listItemIn.description,
      }}
      groupName={listItemIn.group.name}
    />
  );
}
