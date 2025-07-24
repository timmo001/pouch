import { type Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { api } from "~/convex/_generated/api";
import { type Id } from "~/convex/_generated/dataModel";
import { getAuthToken } from "~/server/auth";
import { NotepadEditor } from "~/components/notepads/notepad/editor";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: Id<"groups">; notepad: Id<"notepads"> }>;
}): Promise<Metadata> {
  const { group: groupId } = await params;

  const token = await getAuthToken();

  const group = await fetchQuery(
    api.groups.getById,
    { id: groupId },
    { token },
  ).catch((error) => {
    console.warn(
      "[groups/[group]/notepads/[notepad]/generateMetadata] Error fetching group from api.groups.getById",
      error,
    );
    notFound();
  });

  if (!group) {
    console.warn(
      "[groups/[group]/notepads/[notepad]/generateMetadata] Group not found from fetchQuery",
    );
    notFound();
  }

  const titles = ["Notepad", group.name];
  return {
    title: titles.join(" | "),
    description: titles.join(" - "),
  };
}

export const dynamic = "force-dynamic";

export default async function NotepadPage({
  params,
}: {
  params: Promise<{ group: Id<"groups">; notepad: Id<"notepads"> }>;
}) {
  const { group: groupId } = await params;

  const token = await getAuthToken();
  const group = await fetchQuery(
    api.groups.getById,
    { id: groupId },
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
            key: `notepads/ID`,
            title: "Notepad",
          },
        ]}
      />
      <div className="container mx-auto max-w-screen-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <h1 className="flex-grow text-3xl font-bold">
              Update Notepad for {group.name}
            </h1>
          </div>

          <NotepadEditor group={group} />
        </div>
      </div>
    </>
  );
}
