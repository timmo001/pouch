import { type Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { DateLocale } from "~/components/ui/date-locale";
import { type Id } from "~/convex/_generated/dataModel";
import { notFound } from "next/navigation";

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

  const links = await fetchQuery(
    api.links.getFromGroup,
    { group: group._id },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[id]/page] Error fetching links from api.links.getFromGroup",
      error,
    );
    return [];
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{group.name}</h1>
      <div className="flex flex-row items-center justify-between gap-2 px-2">
        <p className="text-muted-foreground text-sm">Total: {links?.length}</p>
        <Link href={`/groups/${group._id}/links/create`} passHref>
          <Button size="lg" variant="secondary">
            <PlusIcon className="h-4 w-4" />
            Create new
          </Button>
        </Link>
      </div>
    </div>
  );
}
