import { useQuery } from "convex/react";
import { View } from "react-native";
import { GroupCard } from "~/components/GroupCard";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function Index() {
  const groups = useQuery(api.groups.get);

  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-2xl font-bold">Hello</Text>
      <View className="flex-row flex-wrap gap-4">
        {groups?.map((group) => <GroupCard key={group._id} {...group} />)}
      </View>
    </View>
  );
}
