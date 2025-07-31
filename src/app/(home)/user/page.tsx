import { type Metadata } from "next";
import { UserSettings } from "~/components/user-settings";

export const metadata: Metadata = {
  title: "User",
  description: "User page",
};

export default async function UserPage() {
  return <UserSettings />;
}
