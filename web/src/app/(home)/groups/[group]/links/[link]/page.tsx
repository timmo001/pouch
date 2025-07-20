import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { type Id } from "~/convex/_generated/dataModel";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { UpdateLinkForm } from "~/app/(home)/groups/[group]/links/[link]/_components/form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: Id<"groups">; link: Id<"links"> }>;
}): Promise<Metadata> {
  const { group: groupId, link: linkId } = await params;

  const token = await getAuthToken();

  const link = await fetchQuery(
    api.links.getById,
    { id: linkId, group: groupId },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/links/[link]/generateMetadata] Error fetching link from api.links.getById",
      error,
    );
    notFound();
  });

  if (!link) {
    console.warn(
      "[groups/[group]/links/[link]/generateMetadata] Link not found from fetchQuery",
    );
    notFound();
  }

  const titles = [
    link.description?.length ? link.description : link.url,
    link.group.name,
  ];
  return {
    title: titles.join(" | "),
    description: titles.join(" - "),
  };
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ group: Id<"groups">; link: Id<"links"> }>;
}) {
  const { group: groupId, link: linkId } = await params;

  const token = await getAuthToken();
  const link = await fetchQuery(
    api.links.getById,
    { id: linkId, group: groupId },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/links/[link]/page] Error fetching link from api.links.getById",
      error,
    );
    notFound();
  });

  if (!link) {
    console.warn(
      "[groups/[group]/links/[link]/page] Link not found from fetchQuery",
    );
    notFound();
  }

  return (
    <>
      <BreadcrumbsSetter
        items={[
          { key: "home", title: "Pouch", href: "/" },
          {
            key: `groups/${groupId}`,
            title: link.group.name,
            href: `/groups/${groupId}`,
          },
          { key: `links/${linkId}`, title: link.description ?? link.url },
        ]}
      />
      <UpdateLinkForm link={link} />
    </>
  );
}
