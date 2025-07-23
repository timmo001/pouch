import { createLoader, parseAsString, type SearchParams } from "nuqs/server";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { preloadQuery } from "convex/nextjs";
import { CreateListItemForm } from "~/app/(home)/groups/[group]/list-items/create/_components/form";

export const loadSearchParams = createLoader({
  title: parseAsString,
  text: parseAsString,
  url: parseAsString,
});

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const token = await getAuthToken();

  const { title, text, url } = await loadSearchParams(searchParams);

  const hasValidQuery =
    title?.length || text?.length || url?.length ? true : false;

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

      {hasValidQuery ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <h1 className="flex-grow text-3xl font-bold">
              Create new List Item from {title}
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
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Invalid query</h1>
          <p className="text-sm text-muted-foreground">
            Please provide a valid query.
          </p>
          <pre>{JSON.stringify({ title, text, url }, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
