import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { LogOut } from "~/lib/icons/LogOut";
import { User } from "~/lib/icons/User";

export function AccountMenu() {
  const { user, signOut, openUserProfile } = useClerk();

  async function handleSignOut() {
    try {
      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full me-3" size="icon" variant="ghost">
          <Avatar className="w-8 h-8" alt="Account menu">
            <AvatarImage source={{ uri: user?.imageUrl }} />
            <AvatarFallback>
              <Text>{user?.fullName?.charAt(0)}</Text>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ThemeToggle />
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={() => openUserProfile()}>
          <User className="text-foreground" size={14} />
          <Text className="text-foreground">Account</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={handleSignOut}>
          <LogOut className="text-foreground" size={14} />
          <Text className="text-foreground">Sign out</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
