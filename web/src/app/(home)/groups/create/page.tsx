"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { z } from "zod";
import { api } from "~/convex/_generated/api";
import { type Id } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Create Group</h1>
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
            {isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
