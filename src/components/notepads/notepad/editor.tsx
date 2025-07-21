"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { toast } from "sonner";
import { api } from "~/convex/_generated/api";
import { type Doc } from "~/convex/_generated/dataModel";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { Dot } from "lucide-react";

export function NotepadEditor({
  group,
  preloadedNotepad,
}: {
  group: Doc<"groups">;
  preloadedNotepad: Preloaded<typeof api.notepads.getFromGroup>;
}) {
  const notepad = usePreloadedQuery(preloadedNotepad);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateNotepad = useMutation({
    mutationFn: useConvexMutation(api.notepads.update),
    onSuccess: () => {
      console.log("Successfully updated notepad");
    },
    onError: (error) => {
      console.error("Failed to update notepad", error);
      toast.error("Failed to update notepad");
    },
  });

  const onUpdate = useCallback(
    (content: string) => {
      if (!notepad?._id) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounced update to prevent too many updates
      timeoutRef.current = setTimeout(() => {
        updateNotepad.mutate({
          id: notepad._id,
          group: group._id,
          content,
        });
      }, 500);
    },
    [timeoutRef, updateNotepad, notepad, group._id],
  );

  const updatedAt = useMemo(() => {
    return new Date(notepad?.updatedAt ?? 0);
  }, [notepad?.updatedAt]);

  if (!notepad) {
    return null;
  }

  return (
    <NotepadContent
      notepad={notepad.content}
      updatedAt={updatedAt}
      onUpdate={onUpdate}
    />
  );
}

function NotepadContent({
  notepad,
  updatedAt,
  onUpdate,
}: {
  notepad: string;
  updatedAt: Date;
  onUpdate: (content: string) => void;
}) {
  const [content, setContent] = useState(notepad);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateContentIfInactive = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (content === notepad) {
        return;
      }

      if (
        textareaRef.current &&
        document.activeElement === textareaRef.current
      ) {
        return;
      }

      setContent(notepad);
    }, 1000);
  }, [content, notepad]);

  useEffect(() => {
    if (content === notepad) {
      return;
    }

    updateContentIfInactive();
  }, [content, notepad, updateContentIfInactive]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    onUpdate(e.target.value);
  }

  const contentMatchesServer = useMemo(() => {
    return content === notepad;
  }, [content, notepad]);

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <Textarea
        ref={textareaRef}
        className="min-h-full w-full"
        value={content}
        onChange={handleChange}
      />
      <div className="flex flex-row gap-2 px-1">
        <p
          className={cn(
            "text-muted-foreground text-sm",
            contentMatchesServer ? "text-teal-600" : "text-amber-600",
          )}
        >
          {contentMatchesServer ? "Synced" : "Unsynced"}
        </p>
        <Dot className="text-muted-foreground size-5" />
        <p className="text-muted-foreground text-sm">
          Last updated: {updatedAt.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
