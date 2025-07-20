"use client";
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
import { Trash2Icon } from "lucide-react";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { useMemo } from "react";

const UpdateLinkFormSchema = z.object({
  url: z.string().min(1),
  description: z.string().optional(),
});

type UpdateLinkForm = z.infer<typeof UpdateLinkFormSchema>;

export function UpdateLinkForm({
  link: linkIn,
}: {
  link: Omit<Doc<"links">, "group"> & { group: Doc<"groups"> };
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.links.update),
    onSuccess: () => {
      router.replace(`/groups/${linkIn.group._id}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update link");
    },
  });
  const router = useRouter();

  const form = useForm<UpdateLinkForm>({
    resolver: zodResolver(UpdateLinkFormSchema),
    defaultValues: {
      url: linkIn.url,
      description: linkIn.description,
    },
  });

  const description = useWatch({
    control: form.control,
    name: "description",
  });

  const url = useWatch({
    control: form.control,
    name: "url",
  });

  function onSubmit(values: UpdateLinkForm) {
    mutate({ group: linkIn.group._id, id: linkIn._id, ...values });
  }

  const title = useMemo(() => {
    if (description?.length) {
      return description;
    }

    if (url.length) {
      return url;
    }

    return linkIn.url;
  }, [description, url, linkIn.url]);

  return (
    <>
      <BreadcrumbsSetter
        items={[
          { key: "home", title: "Pouch", href: "/" },
          {
            key: `groups/${linkIn.group._id}`,
            title: linkIn.group.name,
            href: `/groups/${linkIn.group._id}`,
          },
          {
            key: `links/${linkIn._id}`,
            title,
          },
        ]}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <h1 className="flex-grow text-3xl font-bold">{title}</h1>
          <Button className="hover:bg-destructive/10 hover:text-destructive">
            <Trash2Icon />
            Delete
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Update Link</h1>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
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
      </div>
    </>
  );
}
