import { type Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { DateLocale } from "~/components/ui/date-locale";
import type { Group, Id } from "~/convex/_generated/dataModel";
import { notFound } from "next/navigation";
import type { FunctionReturnType } from "convex/server";

export async function generateMetadata({
  params,
}: {
  params: { id: Id<"groups"> };
}): Promise<Metadata> {
  const token = await getAuthToken();

  const group = await fetchQuery(
    api.groups.getById,
    { id: params.id },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[id]/generateMetadata] Error fetching group from api.groups.getById",
      error,
    );
    notFound();
  });

  if (!group) {
    console.warn(
      "[groups/[id]/generateMetadata] Group not found from fetchQuery",
    );
    notFound();
  }

  return {
    title: group.name,
    description: group.name,
  };
}

export default async function GroupPage({
  params,
}: {
  params: { id: Id<"groups"> };
}) {
  const token = await getAuthToken();
  const group = await fetchQuery(
    api.groups.getById,
    { id: params.id },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[id]/page] Error fetching group from api.groups.getById",
      error,
    );
    notFound();
  });

  if (!group) {
    console.warn("[groups/[id]/page] Group not found from fetchQuery");
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{group.name}</h1>
    </div>
  );
}
