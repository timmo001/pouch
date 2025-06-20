"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const CreateGroupFormSchema = z.object({
  name: z.string().min(1),
});

type CreateGroupForm = z.infer<typeof CreateGroupFormSchema>;

export default function CreateGroupPage() {
  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(CreateGroupFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: CreateGroupForm) {
    console.log(values);
  }

  return (
    <div>
      <h1>Create Group</h1>
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
