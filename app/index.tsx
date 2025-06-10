import { useQuery } from "convex/react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function Index() {
  const groups = useQuery(api.groups.get);

  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-2xl font-bold text-white">Hello</Text>
      {groups?.map(({ _id, name }) => (
        <Text key={_id} className="text-2xl font-bold text-white">
          {name}
        </Text>
      ))}
    </View>
  );
}
