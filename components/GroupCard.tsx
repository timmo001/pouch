import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

export function GroupCard({ _id, name }: { _id: Id<"groups">; name: string }) {
  const links = useQuery(api.links.getFromGroup, {
    group: _id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>{links?.length}</Text>
      </CardContent>
    </Card>
  );
}
