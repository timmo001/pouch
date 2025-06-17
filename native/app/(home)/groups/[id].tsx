import { useQuery } from "convex/react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

export default function GroupScreen({
  params,
}: {
  params: { id: Id<"groups"> };
}) {
  const group = useQuery(api.groups.getById, {
    id: params.id,
  });
  const links = useQuery(api.links.getFromGroup, {
    group: params.id,
  });

  return (
    <View>
      <Text>{group?.name}</Text>
      <Text>{links?.length}</Text>
    </View>
  );
}
