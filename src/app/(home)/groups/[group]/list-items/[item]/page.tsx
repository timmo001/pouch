import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { type Id } from "~/convex/_generated/dataModel";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { UpdateListItemForm } from "~/app/(home)/groups/[group]/list-items/[item]/_components/form";
import { getListItemTitle } from "~/lib/list-item";
import { ListItemDelete } from "~/components/list-items/item/delete";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: Id<"groups">; item: Id<"listItems"> }>;
}): Promise<Metadata> {
  const { group: groupId, item: itemId } = await params;

  const token = await getAuthToken();

  const listItem = await fetchQuery(
    api.listItems.getById,
    { id: itemId, group: groupId },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/list-items/[item]/generateMetadata] Error fetching listItem from api.listItems.getById",
      error,
    );
    notFound();
  });

  if (!listItem) {
    console.warn(
      "[groups/[group]/list-items/[item]/generateMetadata] ListItem not found from fetchQuery",
    );
    notFound();
  }

  const titles = [
    listItem.description?.length ? listItem.description : listItem.value,
    "List Items",
    listItem.group.name,
  ];
  return {
    title: titles.join(" | "),
    description: `${titles[0]} in ${titles[1]} for ${titles[2]}`,
  };
}

export const dynamic = "force-dynamic";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ group: Id<"groups">; item: Id<"listItems"> }>;
}) {
  const { group: groupId, item: itemId } = await params;

  const token = await getAuthToken();
  const listItem = await fetchQuery(
    api.listItems.getById,
    { id: itemId, group: groupId },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/list-items/[item]/page] Error fetching listItem from api.listItems.getById",
      error,
    );
    notFound();
  });

  if (!listItem) {
    console.warn(
      "[groups/[group]/list-items/[item]/page] ListItem not found from fetchQuery",
    );
    notFound();
  }

  const title = getListItemTitle({
    type: listItem.type,
    description: listItem.description,
    value: listItem.value,
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
            key: `groups/${groupId}`,
            title: listItem.group.name,
            href: `/groups/${groupId}`,
          },
          {
            key: `list-items`,
            title: "List Items",
            href: `/groups/${groupId}/list-items`,
          },
          {
            key: `list-items/${itemId}`,
            title,
          },
        ]}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <h1 className="flex-grow text-3xl font-bold">
            Update List Item: {title}
          </h1>
          <ListItemDelete
            listItem={{
              ...listItem,
              group: listItem.group._id,
            }}
            variant="text"
          />
        </div>

        <UpdateListItemForm
          preloadedGroups={preloadedGroups}
          listItem={listItem}
        />
      </div>
    </>
  );
}
