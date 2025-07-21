import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { type Id } from "~/convex/_generated/dataModel";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { UpdateListItemForm } from "~/app/(home)/groups/[group]/list-items/[item]/_components/form";
import { getListItemTitle } from "~/lib/list-item";
import { ListItemDelete } from "~/app/(home)/groups/[group]/_components/list-item-delete";

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
    listItem.group.name,
  ];
  return {
    title: titles.join(" | "),
    description: titles.join(" - "),
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
    description: listItem.description,
    value: listItem.value,
  });

  return (
    <>
      <BreadcrumbsSetter
        items={[
          { key: "home", title: "Pouch", href: "/" },
          {
            key: `groups/${groupId}`,
            title: listItem.group.name,
            href: `/groups/${groupId}`,
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
            Update ListItem: {title}
          </h1>
          <ListItemDelete
            listItem={{
              ...listItem,
              group: listItem.group._id,
            }}
            variant="text"
          />
        </div>
        <UpdateListItemForm listItem={listItem} />
      </div>
    </>
  );
}
