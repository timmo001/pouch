"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { z } from "zod";
import { api } from "~/convex/_generated/api";
import { type Doc } from "~/convex/_generated/dataModel";
import { Dots } from "~/components/ui/dots";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { ListItemDelete } from "~/app/(home)/groups/[group]/_components/list-item-delete";
import { getListItemTitle } from "~/lib/list-item";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

const UpdateListItemFormSchema = z.object({
  type: z.union([z.literal("text"), z.literal("url")]),
  value: z.string().min(1),
  description: z.string().optional(),
});

type UpdateListItemForm = z.infer<typeof UpdateListItemFormSchema>;

export function UpdateListItemForm({
  listItem: listItemIn,
}: {
  listItem: Omit<Doc<"listItems">, "group"> & { group: Doc<"groups"> };
}) {
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
  const router = useRouter();

  const form = useForm<UpdateListItemForm>({
    resolver: zodResolver(UpdateListItemFormSchema),
    defaultValues: {
      type: listItemIn.type,
      value: listItemIn.value,
      description: listItemIn.description,
    },
  });

  const currentType = useWatch({
    control: form.control,
    name: "type",
  });

  const currentValue = useWatch({
    control: form.control,
    name: "value",
  });

  const currentDescription = useWatch({
    control: form.control,
    name: "description",
  });

  function onSubmit(values: UpdateListItemForm) {
    mutate({
      group: listItemIn.group._id,
      id: listItemIn._id,
      type: values.type,
      value: values.value,
      description: values.description,
    });
  }

  const title = useMemo(
    () =>
      getListItemTitle({
        description: currentDescription,
        value: currentValue,
      }),
    [currentDescription, currentValue],
  );

  return (
    <>
      <BreadcrumbsSetter
        items={[
          { key: "home", title: "Pouch", href: "/" },
          {
            key: `groups/${listItemIn.group._id}`,
            title: listItemIn.group.name,
            href: `/groups/${listItemIn.group._id}`,
          },
          {
            key: `list-items/${listItemIn._id}`,
            title,
          },
        ]}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <h1 className="flex-grow text-3xl font-bold">
            Update ListItem: {title}
          </h1>
          <ListItemDelete
            listItem={{
              ...listItemIn,
              group: listItemIn.group._id,
            }}
            variant="text"
          />
        </div>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="gap-2"
                    >
                      <ToggleGroupItem value="text" aria-label="Text">
                        Text
                      </ToggleGroupItem>
                      <ToggleGroupItem value="url" aria-label="URL">
                        URL
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {currentType === "url" ? "URL" : "Title"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <span>
                  Updating
                  <Dots count={3} />
                </span>
              ) : (
                "Update"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
