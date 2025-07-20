import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { PlusIcon, ExternalLinkIcon } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getLinkTitle } from "~/lib/link";
import { getAuthToken } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { type Id } from "~/convex/_generated/dataModel";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import Link from "next/link";
import { LinkActions } from "~/app/(home)/groups/[group]/_components/link-actions";
import { GroupEditName } from "~/app/(home)/groups/[group]/_components/group-edit-name";
import { GroupEditDescription } from "~/app/(home)/groups/[group]/_components/group-edit-description";
import { GroupDelete } from "~/app/(home)/groups/[group]/_components/group-delete";

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
        <div className="flex flex-row items-center justify-between gap-2 px-2">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <div className="flex flex-row gap-2">
            <GroupEditName group={group} />
            <GroupEditDescription group={group} />
            <GroupDelete group={group} />
          </div>
        </div>
        <div className="flex flex-row justify-between gap-2 px-3 pt-3 pb-2">
          {group.description && (
            <p className="text-muted-foreground text-sm">{group.description}</p>
          )}
          <p className="text-muted-foreground text-sm">
            Total: {links?.length}
          </p>
        </div>
        <div className="divide-border/60 flex flex-col divide-y">
          {links?.map((link) => (
            <div
              key={link._id}
              className="flex flex-row items-center justify-between gap-2 px-2 py-1.5"
            >
              <Link className="group flex-grow" href={link.url} target="_blank">
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-2">
                  <span className="flex flex-row items-center gap-2">
                    {getLinkTitle({
                      description: link.description,
                      url: link.url,
                    })}
                    <ExternalLinkIcon className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  {link.description?.length ? (
                    <span className="text-muted-foreground text-center text-sm opacity-0 transition-opacity group-hover:opacity-100">
                      {link.url}
                    </span>
                  ) : null}
                </div>
              </Link>
              <LinkActions link={link} />
            </div>
          ))}
        </div>
        <div className="flex w-full flex-row items-center justify-between gap-2 px-2">
          <Link
            className="w-full"
            href={`/groups/${group._id}/links/create`}
            passHref
          >
            <Button className="w-full" size="lg" variant="secondary">
              <PlusIcon className="h-4 w-4" />
              Create new
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
