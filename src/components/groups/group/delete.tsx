"use client";
import { useRouter } from "next/navigation";
import { Confirmation } from "~/components/ui/confirmation";
import { Dots } from "~/components/ui/dots";
import { type Doc } from "~/convex/_generated/dataModel";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "~/convex/_generated/api";

export function GroupDelete({
  group,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: {
  group: Doc<"groups">;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.groups.deleteGroup),
    onSuccess: () => {
      toast.success(`${group.name} deleted`);
      router.replace("/");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete group");
    },
  });

  return (
    <Confirmation
      title={`Delete ${group.name}`}
      description="Are you sure you want to delete this group?"
      confirm={{
        text: "Delete",
        variant: "destructive",
        pendingText: (
          <span>
            Deleting
            <Dots count={3} />
          </span>
        ),
        isPending,
        onConfirm: () => {
          mutate({ id: group._id });
        },
      }}
      open={controlledOpen}
      onOpenChange={controlledOnOpenChange}
      trigger={trigger}
    />
  );
}
