import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { PencilLineIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { type Id } from "~/convex/_generated/dataModel";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: Id<"groups"> }>;
}): Promise<Metadata> {
  const token = await getAuthToken();

  const group = await fetchQuery(
    api.groups.getById,
    { id: (await params).group },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/generateMetadata] Error fetching group from api.groups.getById",
      error,
    );
    notFound();
  });

  if (!group) {
    console.warn(
      "[groups/[group]/generateMetadata] Group not found from fetchQuery",
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
  params: Promise<{ group: Id<"groups"> }>;
}) {
  const token = await getAuthToken();
  const group = await fetchQuery(
    api.groups.getById,
    { id: (await params).group },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/page] Error fetching group from api.groups.getById",
      error,
    );
    notFound();
  });

  if (!group) {
    console.warn("[groups/[group]/page] Group not found from fetchQuery");
    notFound();
  }

  const links = await fetchQuery(
    api.links.getFromGroup,
    { group: group._id },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/page] Error fetching links from api.links.getFromGroup",
      error,
    );
    return [];
  });

  return (
    <>
      <BreadcrumbsSetter
        items={[
          { key: "home", title: "Pouch", href: "/" },
          { key: `groups/${group._id}`, title: group.name },
        ]}
      />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <div className="flex flex-row items-center justify-between gap-2 px-2">
          <p className="text-muted-foreground text-sm">
            Total: {links?.length}
          </p>
          <Link href={`/groups/${group._id}/links/create`} passHref>
            <Button size="lg" variant="secondary">
              <PlusIcon className="h-4 w-4" />
              Create new
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {links?.map((link) => (
            <div
              key={link._id}
              className="flex flex-row items-center justify-between gap-2 px-2"
            >
              <Link className="flex-grow" href={link.url} target="_blank">
                {link.url}
              </Link>
              <div className="flex flex-row gap-2">
                <Link href={`/groups/${group._id}/links/${link._id}`} passHref>
                  <Button size="icon" variant="ghost">
                    <PencilLineIcon />
                  </Button>
                </Link>
                <Button
                  className="hover:bg-destructive/10 hover:text-destructive"
                  size="icon"
                  variant="ghost"
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
