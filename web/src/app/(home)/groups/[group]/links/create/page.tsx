import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { type Id } from "~/convex/_generated/dataModel";
import { getAuthToken } from "~/server/auth";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { CreateLinkForm } from "~/app/(home)/groups/[group]/links/create/_components/form";

export const metadata: Metadata = {
  title: "Create Link",
  description: "Create a new link",
};

export default async function CreateLinkPage({
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
          { key: "links/create", title: "Create Link" },
        ]}
      />
      <CreateLinkForm group={group} />
    </>
  );
}
