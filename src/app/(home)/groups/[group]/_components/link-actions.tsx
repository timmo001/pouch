"use client";
import { PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { type Doc } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { LinkArchive } from "~/app/(home)/groups/[group]/_components/link-archive";
import { LinkDelete } from "~/app/(home)/groups/[group]/_components/link-delete";

export function LinkActions({ link }: { link: Doc<"links"> }) {
  return (
    <div className="flex flex-shrink-0 flex-row gap-2">
      <Link href={`/groups/${link.group}/links/${link._id}`} passHref>
        <Button type="button" size="icon" variant="ghost">
          <PencilLineIcon />
        </Button>
      </Link>
      <LinkArchive link={link} variant="icon" />
      <LinkDelete link={link} variant="icon" />
    </div>
  );
}
