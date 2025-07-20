"use client";
import { PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { type Doc } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { LinkDelete } from "~/app/(home)/groups/[group]/_components/link-delete";

export function LinkActions({ link }: { link: Doc<"links"> }) {
  return (
    <div className="flex flex-row gap-2">
      <Link href={`/groups/${link.group}/links/${link._id}`} passHref>
        <Button type="button" size="icon" variant="ghost">
          <PencilLineIcon />
        </Button>
      </Link>
      <LinkDelete link={link} variant="icon" />
    </div>
  );
}
