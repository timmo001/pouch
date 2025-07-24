"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type api } from "~/convex/_generated/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { usePreloadedQuery, type Preloaded } from "convex/react";

export const ListItemFormSchema = z
  .object({
    group: z.string().min(1, "Group is required"),
    type: z.union([z.literal("text"), z.literal("url")]),
    value: z.string().min(1, "Value is required"),
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
  preloadedGroups,
  loading = false,
  onSubmit,
}: {
  type: "create" | "update";
  initialValues?: Partial<ListItemFormType>;
  preloadedGroups: Preloaded<typeof api.groups.getAll>;
  loading?: boolean;
  onSubmit: (values: ListItemFormType) => void;
}) {
  const groups = usePreloadedQuery(preloadedGroups);

  const form = useForm<ListItemFormType>({
    resolver: zodResolver(ListItemFormSchema),
    defaultValues: {
      group: initialValues?.group,
      type: initialValues?.type ?? "url",
      value: initialValues?.value ?? "",
      description: initialValues?.description ?? "",
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

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        {type === "create" && !initialValues?.group && (
          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group._id} value={group._id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This is the group that the list item will be added to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
              <FormDescription>
                {currentType === "url"
                  ? "This can be opened when clicking on the URL list item"
                  : "This will be the title of the text list item"}
              </FormDescription>
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
                <div className="flex items-center gap-2">
                  <Input {...field} />
                  {currentType === "url" && (
                    <FetchTitleButton
                      disabled={loading}
                      url={currentValue}
                      setDescription={field.onChange}
                    />
                  )}
                </div>
              </FormControl>
              <FormDescription>
                {currentType === "url"
                  ? "This will be used as the title of the list item"
                  : "This will be shown when hovering over the list item"}
              </FormDescription>
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

// Helper component for fetching the page title
function FetchTitleButton({
  url,
  setDescription,
  disabled,
}: {
  url: string;
  setDescription: (desc: string) => void;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetch() {
    setLoading(true);
    setError(null);
    try {
      // Use a CORS proxy for fetch
      const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(url);
      const res = await fetch(proxyUrl);
      const html = await res.text();
      const titleRegex = /<title>(.*?)<\/title>/i;
      const match = titleRegex.exec(html);
      const title = match?.[1];
      if (title) {
        setDescription(title);
      } else {
        setError("No title found");
        toast.warning("No title found");
      }
    } catch (e) {
      console.error("Failed to fetch title:", e);
      toast.error("Failed to fetch title");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <Button
        className="w-full min-w-32"
        type="button"
        size="default"
        variant="secondary"
        onClick={handleFetch}
        disabled={loading || !url || disabled}
      >
        {loading ? "Fetching..." : "Use Page Title"}
      </Button>
      {error && (
        <span className="absolute right-0 -bottom-6 left-0 w-full text-center text-xs text-amber-500">
          {error}
        </span>
      )}
    </div>
  );
}
