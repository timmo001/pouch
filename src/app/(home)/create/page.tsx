import { type SearchParams } from "nuqs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { CreateListItemForm } from "~/app/(home)/groups/[group]/list-items/create/_components/form";
import { loadSearchParams } from "~/app/(home)/create/searchParams";

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const token = await getAuthToken();

  const { title, text, url } = await loadSearchParams(searchParams);

  const value = url?.length ? url : text;

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
      <BreadcrumbsSetter items={[{ key: "create", title: "Create new..." }]} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <h1 className="flex-grow text-3xl font-bold">
            Create new List Item{" "}
            {title || value ? ` from ${title ?? value}` : ""}
          </h1>
        </div>

        <CreateListItemForm
          preloadedGroups={preloadedGroups}
          initialValues={{
            type: value?.startsWith("http") ? "url" : "text",
            value: value ?? "",
            description: title ?? "",
          }}
        />
      </div>
    </>
  );
}
