import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { type Id } from "~/convex/_generated/dataModel";
import { getAuthToken } from "~/server/auth";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { CreateListItemForm } from "~/app/(home)/groups/[group]/list-items/create/_components/form";

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

  return (
    <>
      <BreadcrumbsSetter
        items={[
          { key: "home", title: "Pouch", href: "/" },
          {
            key: `groups/${group._id}`,
            title: group.name,
            href: `/groups/${group._id}`,
          },
          { key: "list-items/create", title: "Create List Item" },
        ]}
      />
      <CreateListItemForm group={group} />
    </>
  );
}
