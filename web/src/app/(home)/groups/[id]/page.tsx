import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return { title: `Group ${params.id}` };
}

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  return <div>Group: {params.id}</div>;
}
