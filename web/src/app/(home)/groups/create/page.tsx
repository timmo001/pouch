import { type Metadata } from "next";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";
import { CreateGroupForm } from "./_components/form";

export const metadata: Metadata = {
  title: "Create Group",
  description: "Create a new group",
};

export default async function CreateGroupPage() {
  return (
    <>
      <BreadcrumbsSetter
        items={[
          { key: "home", title: "Pouch", href: "/" },
          { key: "groups/create", title: "Create Group" },
        ]}
      />

      <CreateGroupForm />
    </>
  );
}
