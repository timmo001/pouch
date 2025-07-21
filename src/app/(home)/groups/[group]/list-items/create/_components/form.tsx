"use client";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { z } from "zod";
import { api } from "~/convex/_generated/api";
import { type Doc, type Id } from "~/convex/_generated/dataModel";
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
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

const CreateListItemFormSchema = z.object({
  type: z.union([z.literal("text"), z.literal("url")]),
  value: z.string().min(1),
  description: z.string().optional(),
});

type CreateListItemForm = z.infer<typeof CreateListItemFormSchema>;

export function CreateListItemForm({ group }: { group: Doc<"groups"> }) {
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
  const router = useRouter();

  const form = useForm<CreateListItemForm>({
    resolver: zodResolver(CreateListItemFormSchema),
    defaultValues: {
      type: "text",
      value: "",
      description: "",
    },
  });

  const currentType = useWatch({
    control: form.control,
    name: "type",
  });

  function onSubmit(values: CreateListItemForm) {
    mutate({ group: group._id, ...values });
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Create List Item in {group.name}</h1>
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
                    size="lg"
                    variant="outline"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <ToggleGroupItem
                      className="px-14"
                      aria-label="Text"
                      value="text"
                    >
                      Text
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="px-14"
                      aria-label="URL"
                      value="url"
                    >
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
                <FormLabel>{currentType === "url" ? "URL" : "Title"}</FormLabel>
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
                Creating
                <Dots count={3} />
              </span>
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
