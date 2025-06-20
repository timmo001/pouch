"use client";

import { useQuery } from "convex/react";
import { Button } from "~/components/ui/button";
import { api } from "~/convex/_generated/api";

export default function HomePage() {
  const groups = useQuery(api.groups.getAll);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Groups</h2>
      <p className="text-sm text-muted-foreground">Total: {groups?.length}</p>
      <Button>Create Group</Button>
    </div>
  );
}
