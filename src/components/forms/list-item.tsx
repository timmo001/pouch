"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dots } from "~/components/ui/dots";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export const ListItemFormSchema = z
  .object({
    type: z.union([z.literal("text"), z.literal("url")]),
    value: z.string().min(1),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "url") {
        return z.url().safeParse(data.value).success;
      }
      return true;
    },
    {
      message: "Please enter a valid URL.",
      path: ["value"],
    },
  );

export type ListItemFormType = z.infer<typeof ListItemFormSchema>;

export function ListItemForm({
  type,
  initialValues,
  loading = false,
  onSubmit,
}: {
  type: "create" | "update";
  initialValues?: Partial<ListItemFormType>;
  loading?: boolean;
  onSubmit: (values: ListItemFormType) => void;
}) {
  const form = useForm<ListItemFormType>({
    resolver: zodResolver(ListItemFormSchema),
    defaultValues: {
      type: initialValues?.type ?? "url",
      value: initialValues?.value ?? "",
      description: initialValues?.description ?? "",
    },
  });

  const currentType = useWatch({
    control: form.control,
    name: "type",
  });

  return (
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
              <FormDescription />
              <FormMessage />
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
                <Input
                  {...field}
                  placeholder={
                    currentType === "url" ? "https://example.com" : "Do things"
                  }
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
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
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span>
              {type === "create" ? "Creating" : "Updating"}
              <Dots count={3} />
            </span>
          ) : type === "create" ? (
            "Create"
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
}
