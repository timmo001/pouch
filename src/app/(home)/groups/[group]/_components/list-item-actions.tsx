"use client";
import { PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { type Doc } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { ListItemArchive } from "~/app/(home)/groups/[group]/_components/list-item-archive";
import { ListItemDelete } from "~/app/(home)/groups/[group]/_components/list-item-delete";

export function ListItemActions({ listItem }: { listItem: Doc<"listItems"> }) {
  return (
    <div className="flex flex-shrink-0 flex-row gap-2">
      <Link
        href={`/groups/${listItem.group}/list-items/${listItem._id}`}
        passHref
      >
        <Button type="button" size="icon" variant="ghost">
          <PencilLineIcon />
        </Button>
      </Link>
      <ListItemArchive listItem={listItem} variant="icon" />
      <ListItemDelete listItem={listItem} variant="icon" />
    </div>
  );
}
