"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type BreadcrumbsStore,
  createBreadcrumbsStore,
} from "~/components/hooks/store/breadcrumbs";

export type BreadcrumbsStoreApi = ReturnType<typeof createBreadcrumbsStore>;

export const BreadcrumbsStoreContext = createContext<
  BreadcrumbsStoreApi | undefined
>(undefined);

export interface BreadcrumbsStoreProviderProps {
  children: ReactNode;
}

export const BreadcrumbsStoreProvider = ({
  children,
}: BreadcrumbsStoreProviderProps) => {
  const storeRef = useRef<BreadcrumbsStoreApi | null>(null);
  storeRef.current ??= createBreadcrumbsStore();

  return (
    <BreadcrumbsStoreContext.Provider value={storeRef.current}>
      {children}
    </BreadcrumbsStoreContext.Provider>
  );
};

export const useBreadcrumbsStore = <T,>(
  selector: (store: BreadcrumbsStore) => T,
): T => {
  const breadcrumbsStoreContext = useContext(BreadcrumbsStoreContext);

  if (!breadcrumbsStoreContext) {
    throw new Error(
      `useBreadcrumbsStore must be used within BreadcrumbsStoreProvider`,
    );
  }

  return useStore(breadcrumbsStoreContext, selector);
};
