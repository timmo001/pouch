import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? "light" : "dark";
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  return (
    <DropdownMenuItem onPress={toggleColorScheme}>
      {isDarkColorScheme ? (
        <MoonStar className="text-foreground" size={14} />
      ) : (
        <Sun className="text-foreground" size={14} />
      )}
      <Text className="text-foreground">
        {isDarkColorScheme ? "Dark" : "Light"} mode
      </Text>
    </DropdownMenuItem>
  );
}
