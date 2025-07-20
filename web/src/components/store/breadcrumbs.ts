import { createStore } from "zustand/vanilla";

export type BreadcrumbItem = {
  key: string;
  title: string;
  href?: string;
};

export type BreadcrumbsState = {
  items: BreadcrumbItem[] | null;
};

export type BreadcrumbsActions = {
  setBreadcrumbs: (items: BreadcrumbItem[] | null) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  clearBreadcrumbs: () => void;
};

export type BreadcrumbsStore = BreadcrumbsState & BreadcrumbsActions;

export const defaultInitState: BreadcrumbsState = {
  items: null,
};

export const createBreadcrumbsStore = (
  initState: BreadcrumbsState = defaultInitState,
) => {
  return createStore<BreadcrumbsStore>()((set) => ({
    ...initState,
    setBreadcrumbs: (items) => set({ items }),
    addBreadcrumb: (item) =>
      set((state) => ({
        items: state.items ? [...state.items, item] : [item],
      })),
    clearBreadcrumbs: () => set({ items: null }),
  }));
};
