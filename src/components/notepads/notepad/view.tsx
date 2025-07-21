"use client";
import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { toast } from "sonner";
import { api } from "~/convex/_generated/api";
import { type Id } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { PencilLineIcon } from "lucide-react";

export function NotepadView({
  groupId,
  preloadedNotepad,
}: {
  groupId: Id<"groups">;
  preloadedNotepad: Preloaded<typeof api.notepads.getFromGroup>;
}) {
  const notepad = usePreloadedQuery(preloadedNotepad);

  const createNotepad = useMutation({
    mutationFn: useConvexMutation(api.notepads.create),
    onSuccess: () => {
      console.log("Successfully created notepad");
    },
    onError: (error) => {
      console.error("Failed to create notepad", error);
      toast.error("Failed to create notepad");
    },
  });

  const onCreate = useCallback(() => {
    if (createNotepad.isPending) {
      return;
    }

    createNotepad.mutate({
      group: groupId,
    });
  }, [createNotepad, groupId]);

  useEffect(() => {
    if (!notepad) {
      onCreate();
    }
  }, [notepad, onCreate]);

  if (!notepad) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex flex-row justify-end gap-2">
        <Link
          href={`/groups/${notepad.group}/notepads/${notepad._id}`}
          passHref
        >
          <Button size="icon" variant="secondary">
            <PencilLineIcon />
            <span className="sr-only">Edit Notepad</span>
          </Button>
        </Link>
      </div>
      <NotepadContent notepad={notepad.content} />
    </div>
  );
}

function NotepadContent({ notepad }: { notepad: string }) {
  if (!notepad || notepad.length === 0) {
    return (
      <div className="text-muted-foreground text-center text-sm">
        Click the pencil icon to create a notepad
      </div>
    );
  }

  return (
    <pre className="text-sm break-words whitespace-pre-wrap">{notepad}</pre>
  );
}
