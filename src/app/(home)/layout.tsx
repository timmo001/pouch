"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import { BreadcrumbsStoreProvider } from "~/components/providers/breadcrumbs-store-provider";
import { Header } from "~/components/header";
import { Welcome } from "~/components/welcome";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <BreadcrumbsStoreProvider>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden overflow-y-auto">
        <Header />
        <Authenticated>
          <div className="min-h-14" />
          <main className="container mx-auto flex flex-1 flex-col gap-4 p-4">
            {children}
          </main>
        </Authenticated>
        <Unauthenticated>
          <Welcome />
        </Unauthenticated>
      </div>
    </BreadcrumbsStoreProvider>
  );
}
