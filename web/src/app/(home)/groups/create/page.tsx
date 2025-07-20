"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { z } from "zod";
import { api } from "~/convex/_generated/api";
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

const CreateGroupFormSchema = z.object({
  name: z.string().min(1),
});

type CreateGroupForm = z.infer<typeof CreateGroupFormSchema>;

export default function CreateGroupPage() {
  const createGroup = useMutation(api.groups.create);
  const router = useRouter();

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(CreateGroupFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: CreateGroupForm) {
    const newId = await createGroup(values);
    router.replace(`/groups/${newId}`);
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
          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  );
}
