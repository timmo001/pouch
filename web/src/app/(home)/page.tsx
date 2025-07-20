import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getAuthToken } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { DateLocale } from "~/components/ui/date-locale";

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
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Groups</h2>
      <div className="flex flex-row items-center justify-between gap-2 px-2">
        <p className="text-muted-foreground text-sm">Total: {groups?.length}</p>
        <Link href="/groups/create" passHref>
          <Button size="sm" variant="secondary">
            <PlusIcon className="h-4 w-4" />
            Create new
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
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
      </div>
    </div>
  );
}
