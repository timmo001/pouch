import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { type Id } from "~/convex/_generated/dataModel";
import { getAuthToken } from "~/server/auth";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { CreateListItemForm } from "~/app/(home)/groups/[group]/list-items/create/_components/form";

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
      "[groups/[group]/list-items/create/generateMetadata] Error fetching group from api.groups.getById",
      error,
    );
    notFound();
  });

  if (!group) {
    console.warn(
      "[groups/[group]/list-items/create/generateMetadata] Group not found from fetchQuery",
    );
    notFound();
  }

  const titles = ["Create List Item", group.name];
  return {
    title: titles.join(" | "),
    description: titles.join(" for "),
  };
}

export const metadata: Metadata = {
  title: "Create List Item",
  description: "Create a new list item",
};

export const dynamic = "force-dynamic";

export default async function CreateListItemPage({
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
      "[groups/[group]/generateMetadata] Error fetching group from api.groups.getById",
      error,
    );
    notFound();
  });

  const preloadedGroups = await preloadQuery(
    api.groups.getAll,
    {},
    { token },
  ).catch((error) => {
    console.warn(
      "[create/page] Error fetching groups from api.groups.getAll",
      error,
    );
    return null;
  });

  if (!preloadedGroups) {
    return <div>Error fetching groups</div>;
  }

  return (
    <>
      <BreadcrumbsSetter
        items={[
          {
            key: `groups/${group._id}`,
            title: group.name,
            href: `/groups/${group._id}`,
          },
          {
            key: "list-items",
            title: "List Items",
            href: `/groups/${group._id}/list-items`,
          },
          { key: "create", title: "Create" },
        ]}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <h1 className="flex-grow text-3xl font-bold">
            Create new List Item in {group.name}
          </h1>
        </div>

        <CreateListItemForm preloadedGroups={preloadedGroups} group={group} />
      </div>
    </>
  );
}
