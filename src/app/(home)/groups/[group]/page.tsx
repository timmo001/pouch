import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { type Id } from "~/convex/_generated/dataModel";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { GroupEditName } from "~/components/groups/group/edit-name";
import { GroupEditDescription } from "~/components/groups/group/edit-description";
import { GroupDelete } from "~/components/groups/group/delete";
import { DraggableListItems } from "~/components/list-items/draggable-list";

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

export const dynamic = "force-dynamic";

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
          { key: "home", title: "Pouch", href: "/" },
          { key: `groups/${group._id}`, title: group.name },
        ]}
      />
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-row items-center justify-between gap-2 px-2">
          <h1 className="text-3xl font-bold text-wrap">{group.name}</h1>
          <div className="flex flex-grow flex-row flex-wrap justify-end gap-2">
            <GroupEditName group={group} />
            <GroupEditDescription group={group} />
            <GroupDelete group={group} />
          </div>
        </div>
        {preloadedListItems && (
          <DraggableListItems
            group={group}
            preloadedListItems={preloadedListItems}
          />
        )}
      </div>
    </>
  );
}
