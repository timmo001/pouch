"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { z } from "zod";
import { api } from "~/convex/_generated/api";
import { type Id } from "~/convex/_generated/dataModel";
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

const CreateLinkFormSchema = z.object({
  url: z.string().min(1),
  description: z.string().optional(),
});

type CreateLinkForm = z.infer<typeof CreateLinkFormSchema>;

export function CreateLinkForm({ groupId }: { groupId: Id<"groups"> }) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.links.create),
    onSuccess: (newId: Id<"links">) => {
      router.replace(`/groups/${groupId}/links/${newId}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create link");
    },
  });
  const router = useRouter();

  const form = useForm<CreateLinkForm>({
    resolver: zodResolver(CreateLinkFormSchema),
    defaultValues: {
      url: "",
      description: "",
    },
  });

  function onSubmit(values: CreateLinkForm) {
    mutate({ group: groupId, ...values });
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Create Link</h1>
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
