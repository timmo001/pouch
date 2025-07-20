"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilRulerIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/convex/_generated/api";
import type { Doc } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Dots } from "~/components/ui/dots";

const UpdateGroupDescriptionSchema = z.object({
  description: z.string().min(1),
});
type UpdateGroupDescription = z.infer<typeof UpdateGroupDescriptionSchema>;

export function GroupEditDescription({
  group: groupIn,
}: {
  group: Doc<"groups">;
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.groups.updateDescription),
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update group description");
    },
  });

  const form = useForm<UpdateGroupDescription>({
    resolver: zodResolver(UpdateGroupDescriptionSchema),
    defaultValues: {
      description: groupIn.description,
    },
  });

  function onSubmit(values: UpdateGroupDescription) {
    mutate({
      id: groupIn._id,
      description: values.description,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary">
          <PencilRulerIcon />
          Edit description
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit group description</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    Saving
                    <Dots count={3} />
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
