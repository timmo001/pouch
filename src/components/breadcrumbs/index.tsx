"use client";
import React from "react";
import Link from "next/link";
import { Authenticated } from "convex/react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { useBreadcrumbsStore } from "~/components/providers/breadcrumbs-store-provider";
import Logo from "~/components/assets/logo";

export function Breadcrumbs() {
  const items = useBreadcrumbsStore((state) => state.items);

  const homeLink = (
    <BreadcrumbItem>
      <BreadcrumbLink className="flex items-center gap-2" asChild>
        <Link href="/">
          <Logo />
          Pouch
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );

  if (items === null) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {homeLink}
          <Authenticated>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </Authenticated>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {homeLink}
        {items.map((item, index) => (
          <React.Fragment key={item.key}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.title}</Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground">{item.title}</span>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
