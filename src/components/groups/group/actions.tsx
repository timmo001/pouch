"use client";
import {
  EllipsisVerticalIcon,
  PencilLineIcon,
  PencilRulerIcon,
  Trash2Icon,
} from "lucide-react";
import type { Doc } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { GroupEditName } from "~/components/groups/group/edit-name";
import { GroupEditDescription } from "~/components/groups/group/edit-description";
import { GroupDelete } from "~/components/groups/group/delete";
import { useState } from "react";

export function GroupActions({ group }: { group: Doc<"groups"> }) {
  // Controlled open state for each dialog
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editDescriptionOpen, setEditDescriptionOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-grow flex-row flex-wrap justify-end gap-2 md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom">
            <DropdownMenuItem
              variant="default"
              onClick={() => setTimeout(() => setEditNameOpen(true), 0)}
            >
              <PencilLineIcon />
              Edit name
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="default"
              onClick={() => setTimeout(() => setEditDescriptionOpen(true), 0)}
            >
              <PencilRulerIcon />
              Edit description
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setTimeout(() => setDeleteOpen(true), 0)}
            >
              <Trash2Icon />
              Delete group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop */}
      <div className="hidden flex-grow flex-row flex-wrap justify-end gap-2 md:flex">
        <Button
          size="lg"
          variant="secondary"
          onClick={() => setEditNameOpen(true)}
        >
          <PencilLineIcon />
          Edit name
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => setEditDescriptionOpen(true)}
        >
          <PencilRulerIcon />
          Edit description
        </Button>
        <Button
          size="lg"
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2Icon />
          Delete group
        </Button>
      </div>

      {/* Dialogs rendered outside the menu */}
      <GroupEditName
        group={group}
        open={editNameOpen}
        onOpenChange={setEditNameOpen}
      />
      <GroupEditDescription
        group={group}
        open={editDescriptionOpen}
        onOpenChange={setEditDescriptionOpen}
      />
      <GroupDelete
        group={group}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
