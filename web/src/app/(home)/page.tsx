"use client";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Button } from "~/components/ui/button";
import { api } from "~/convex/_generated/api";
import { PlusIcon } from "lucide-react";

export default function HomePage() {
  const groups = useQuery(api.groups.getAll);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Groups</h2>
      <div className="flex flex-row gap-2 justify-between items-center px-2">
        <p className="text-sm text-muted-foreground">Total: {groups?.length}</p>
        <Link href="/groups/create" passHref>
          <Button size="sm" variant="secondary">
            <PlusIcon className="w-4 h-4" />
            Create new
          </Button>
        </Link>
      </div>
    </div>
  );
}
