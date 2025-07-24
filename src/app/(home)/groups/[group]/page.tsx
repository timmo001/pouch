import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { type Id } from "~/convex/_generated/dataModel";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { DraggableListItems } from "~/components/list-items/draggable-list";
import { NotepadEditor } from "~/components/notepads/notepad/editor";
import { GroupActions } from "~/components/groups/group/actions";

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
        items={[{ key: `groups/${group._id}`, title: group.name }]}
      />
      <div className="container mx-auto max-w-screen-lg">
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-row items-center justify-between gap-2 px-2">
            <h1 className="text-3xl font-bold text-wrap">{group.name}</h1>
            <GroupActions group={group} />
          </div>
          {preloadedListItems && (
            <DraggableListItems
              group={group}
              preloadedListItems={preloadedListItems}
            />
          )}
          <NotepadEditor group={group} />
        </div>
      </div>
    </>
  );
}
