"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

const UpdateGroupNameSchema = z.object({
  name: z.string().min(1),
});
type UpdateGroupName = z.infer<typeof UpdateGroupNameSchema>;

export function GroupEditName({
  group: groupIn,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  group: Doc<"groups">;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();

  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = controlledOpen ?? localOpen;
  const setIsOpen = controlledOnOpenChange ?? setLocalOpen;

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.groups.updateName),
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update group name");
    },
  });

  const form = useForm<UpdateGroupName>({
    resolver: zodResolver(UpdateGroupNameSchema),
    defaultValues: {
      name: groupIn.name,
    },
  });

  function onSubmit(values: UpdateGroupName) {
    mutate({
      id: groupIn._id,
      name: values.name,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit group name</DialogTitle>
            </DialogHeader>
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
