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
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";

const CreateGroupFormSchema = z.object({
  name: z.string().min(1),
});

type CreateGroupForm = z.infer<typeof CreateGroupFormSchema>;

export default function CreateGroupPage() {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.groups.create),
    onSuccess: (newId: Id<"groups">) => {
      router.replace(`/groups/${newId}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create group");
    },
  });
  const router = useRouter();

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(CreateGroupFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: CreateGroupForm) {
    mutate(values);
  }

  return (
    <>
      <BreadcrumbsSetter
        items={[
          { key: "home", title: "Pouch", href: "/" },
          { key: "groups/create", title: "Create Group" },
        ]}
      />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Create Group</h1>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
    </>
  );
}
