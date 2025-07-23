import { type Metadata } from "next";
import { Dots } from "~/components/ui/dots";
import { BreadcrumbsSetter } from "~/components/breadcrumbs/setter";

export const metadata: Metadata = {
  title: "Loading",
  description: "This may take a few seconds.",
};

export default function Loading() {
  return (
    <>
      <BreadcrumbsSetter items={null} />
      <div className="flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">
          Loading
          <Dots count={3} />
        </h1>
        <p className="text-muted-foreground">This may take a few seconds.</p>
      </div>
    </>
  );
}
