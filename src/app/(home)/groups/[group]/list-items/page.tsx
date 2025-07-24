import { type Metadata } from "next";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { api } from "~/convex/_generated/api";
import { type Id } from "~/convex/_generated/dataModel";
import { getAuthToken } from "~/server/auth";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { DraggableListItems } from "~/components/list-items/draggable-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: Id<"groups"> }>;
}): Promise<Metadata> {
  const { group: groupId } = await params;

  const token = await getAuthToken();

  const group = await fetchQuery(
    api.groups.getById,
    { id: groupId },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/list-items/generateMetadata] Error fetching group from api.groups.getById",
      error,
    );
    notFound();
  });

  if (!group) {
    console.warn(
      "[groups/[group]/list-items/generateMetadata] Group not found from fetchQuery",
    );
    notFound();
  }

  const titles = ["List Items", group.name];
  return {
    title: titles.join(" | "),
    description: titles.join(" - "),
  };
}

export const dynamic = "force-dynamic";

export default async function ListItemsPage({
  params,
}: {
  params: Promise<{ group: Id<"groups"> }>;
}) {
  const { group: groupId } = await params;

  const token = await getAuthToken();
  const group = await fetchQuery(
    api.groups.getById,
    { id: groupId },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/list-items/page] Error fetching group from api.groups.getById",
      error,
    );
    notFound();
  });

  if (!group) {
    console.warn(
      "[groups/[group]/list-items/page] Group not found from fetchQuery",
    );
    notFound();
  }

  const preloadedListItems = await preloadQuery(
    api.listItems.getFromGroup,
    { group: group._id },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/page] Error fetching listItems from api.listItems.getFromGroup",
      error,
    );
    return null;
  });

  return (
    <>
      <BreadcrumbsSetter
        items={[
          {
            key: `groups/${group._id}`,
            title: group.name,
            href: `/groups/${groupId}`,
          },
          {
            key: `list-items`,
            title: "List Items",
          },
        ]}
      />
      <div className="container mx-auto max-w-screen-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <h1 className="flex-grow text-3xl font-bold">
              List Items for {group.name}
            </h1>
          </div>

          {preloadedListItems && (
            <DraggableListItems
              group={group}
              preloadedListItems={preloadedListItems}
            />
          )}
        </div>
      </div>
    </>
  );
}
