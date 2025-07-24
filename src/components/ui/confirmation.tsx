"use client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function Confirmation({
  title,
  description,
  trigger,
  cancel = { text: "Cancel", variant: "outline" },
  confirm = { text: "Confirm", variant: "default" },
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  title: string;
  description: string;
  trigger?: React.ReactNode;
  cancel?: {
    text: string;
    variant: "outline" | "secondary";
  };
  confirm?: {
    text: string;
    variant: "default" | "destructive";
    pendingText?: React.ReactNode;
    isPending?: boolean;
    onConfirm?: () => void;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [wasPending, setWasPending] = useState(false);

  // Use controlled open state if provided
  const isOpen = controlledOpen ?? open;
  const setIsOpen = controlledOnOpenChange ?? setOpen;

  useEffect(() => {
    if (confirm.isPending) {
      setIsOpen(true);
      setWasPending(true);
    } else if (wasPending) {
      setIsOpen(false);
      setWasPending(false);
    }
  }, [confirm.isPending, wasPending, setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Only render DialogTrigger if trigger is provided and not using controlled open */}
      {trigger && !controlledOpen && !controlledOnOpenChange && (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={cancel.variant}>{cancel.text}</Button>
          </DialogClose>
          <Button
            disabled={confirm.isPending}
            variant={confirm.variant}
            onClick={confirm.onConfirm}
          >
            {confirm.isPending ? confirm.pendingText : confirm.text}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
