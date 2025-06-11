import { useQuery } from "convex/react";
import { View } from "react-native";
import { GroupCard } from "~/components/GroupCard";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function HomeScreen() {
  const groups = useQuery(api.groups.getAll);

  return (
    <View className="items-center justify-start flex-1 p-4">
      <Text className="text-4xl font-bold">Groups</Text>
      <View className="flex-row flex-wrap w-full gap-4 mt-4">
        {groups?.map((group) => <GroupCard key={group._id} {...group} />)}
      </View>
    </View>
  );
}
