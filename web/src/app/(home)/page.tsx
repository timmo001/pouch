"use client";

import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";

export default function HomePage() {
  const groups = useQuery(api.groups.getAll);
  return <div>Authenticated content: {groups?.length}</div>;
}
