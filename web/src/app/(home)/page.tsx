import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { DateLocale } from "~/components/ui/date-locale";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const token = await getAuthToken();

  const groups = await fetchQuery(api.groups.getAll, {}, { token }).catch(
    (error) => {
      console.warn(
        "[home/page] Error fetching groups from api.groups.getAll",
        error,
      );
      return [];
    },
  );

  return (
    <>
      <BreadcrumbsSetter items={[{ key: "home", title: "Pouch" }]} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-baseline justify-between gap-2 px-2">
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground text-center text-sm">
            Total: {groups?.length}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {groups?.map((group) => (
            <Link key={group._id} href={`/groups/${group._id}`} passHref>
              <Button
                className="flex h-32 w-full flex-col items-start gap-2 p-6 text-4xl"
                size="lg"
                variant="secondary"
              >
                <div>{group.name}</div>
                <div className="text-muted-foreground flex flex-grow items-center gap-2 text-sm">
                  Created:{" "}
                  <DateLocale
                    date={new Date(group._creationTime)}
                    showDate
                    showTime
                  />
                </div>
              </Button>
            </Link>
          ))}
          <Link href="/groups/create" passHref>
            <Button
              className="flex h-32 w-full flex-row items-center gap-2 p-6 text-4xl"
              size="lg"
              variant="outline"
            >
              <PlusIcon className="size-10" />
              Create new
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
