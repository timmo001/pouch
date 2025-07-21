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
}: {
  title: string;
  description: string;
  trigger: React.ReactNode;
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
}) {
  const [open, setOpen] = useState(false);
  const [wasPending, setWasPending] = useState(false);

  useEffect(() => {
    if (confirm.isPending) {
      setOpen(true);
      setWasPending(true);
    } else if (wasPending) {
      setOpen(false);
      setWasPending(false);
    }
  }, [confirm.isPending, wasPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
