"use client";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import type { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/shadcn";
import { useBlockNoteSync } from "@convex-dev/prosemirror-sync/blocknote";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { type Doc, type Id } from "~/convex/_generated/dataModel";

export function NotepadEditor({ group }: { group: Doc<"groups"> }) {
  const createNotepad = useMutation(api.notepads.create);
  const notepad = useQuery(api.notepads.getFromGroup, { group: group._id });

  useEffect(() => {
    if (!notepad) {
      void createNotepad({ group: group._id });
    }
  }, [notepad, createNotepad, group._id]);

  if (!notepad) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return <Editor notepadId={notepad._id} />;
}

function Editor({ notepadId }: { notepadId: Id<"notepads"> }) {
  const { resolvedTheme } = useTheme();
  const sync = useBlockNoteSync<BlockNoteEditor>(api.prosemirror, notepadId);

  useEffect(() => {
    if (!sync.isLoading && sync.editor === null) {
      void sync.create({ type: "doc", content: [] });
    }
  }, [sync]);

  if (!sync.editor) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Setting up editor...
      </div>
    );
  }

  return (
    <BlockNoteView
      editor={sync.editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
