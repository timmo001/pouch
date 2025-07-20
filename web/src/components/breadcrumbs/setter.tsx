"use client";
import { useEffect } from "react";
import { useBreadcrumbsStore } from "~/components/providers/breadcrumbs-store-provider";
import { type BreadcrumbItem } from "~/components/hooks/store/breadcrumbs";

interface BreadcrumbsSetterProps {
  items: BreadcrumbItem[] | null;
}

export function BreadcrumbsSetter({ items }: BreadcrumbsSetterProps) {
  const setBreadcrumbs = useBreadcrumbsStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    setBreadcrumbs(items);
  }, [items, setBreadcrumbs]);

  return null;
}
