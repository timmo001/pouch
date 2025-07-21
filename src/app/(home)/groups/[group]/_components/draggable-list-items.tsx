"use client";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { ExternalLinkIcon, GripVertical, PlusIcon } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { toast } from "sonner";
import Link from "next/link";
import { type Doc, type Id } from "~/convex/_generated/dataModel";
import { api } from "~/convex/_generated/api";
import { getListItemTitle } from "~/lib/list-item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ListItemActions } from "~/app/(home)/groups/[group]/_components/list-item-actions";
import { Button } from "~/components/ui/button";

export function DraggableListItems({
  group,
  preloadedListItems,
}: {
  group: Doc<"groups">;
  preloadedListItems: Preloaded<typeof api.listItems.getFromGroup>;
}) {
  const listItems = usePreloadedQuery(preloadedListItems);

  const updatePosition = useMutation({
    mutationFn: useConvexMutation(api.listItems.reorder),
    onSuccess: () => {
      console.log("Successfully reordered items");
    },
    onError: (error) => {
      toast.error("Failed to reorder items");
      console.error(error);
    },
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced reorder function
  const debouncedReorder = useCallback(
    (orderedIds: Id<"listItems">[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updatePosition.mutate({
          group: group._id,
          orderedIds,
        });
      }, 500);
    },
    [updatePosition, group._id],
  );

  /**
   * @param list Either the active or archived list. This is used to determine which list to update.
   * @param updatedList The list of listItems in the correct order.
   */
  function onSort(
    list: "active" | "archived",
    updatedList: Doc<"listItems">[],
  ) {
    const newActiveList = (
      list === "active" ? updatedList : listItems.active
    ).map((listItem) => listItem._id);
    const newArchivedList = (
      list === "archived" ? updatedList : listItems.archived
    ).map((listItem) => listItem._id);

    const orderedIds = [
      ...newActiveList,
      // The archived list will always be positioned after the active list
      ...newArchivedList,
    ];

    // Use the debounced function instead of calling updatePosition directly
    debouncedReorder(orderedIds);
  }

  return (
    <>
      {group.description && (
        <p className="text-muted-foreground text-sm">{group.description}</p>
      )}
      <div className="flex flex-row justify-between gap-2 px-3 pt-3 pb-2">
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <span className="text-muted-foreground text-sm">
            Total: {listItems?.active.length + listItems?.archived.length}
          </span>
          <span className="text-muted-foreground text-sm">
            {listItems?.active.length} active, {listItems?.archived.length}{" "}
            archived
          </span>
        </div>
      </div>
      <SortableListItems
        listItems={listItems.active}
        onSort={(l) => onSort("active", l)}
      />
      <div className="flex w-full flex-row items-center justify-between gap-2 px-2">
        <Link
          className="w-full"
          href={`/groups/${group._id}/list-items/create`}
          passHref
        >
          <Button className="w-full" size="lg" variant="secondary">
            <PlusIcon className="h-4 w-4" />
            Create new
          </Button>
        </Link>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="archived">
          <AccordionTrigger className="flex flex-row items-center gap-2 px-3 text-lg font-semibold">
            Archived
          </AccordionTrigger>
          <AccordionContent>
            <SortableListItems
              listItems={listItems.archived}
              onSort={(l) => onSort("archived", l)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function SortableListItems({
  listItems: listItemsIn,
  onSort,
}: {
  listItems: Doc<"listItems">[];
  onSort: (updatedList: Doc<"listItems">[]) => void;
}) {
  const listItemsFromProps = useMemo(
    () =>
      (listItemsIn ?? []).map((listItem) => ({
        ...listItem,
        id: listItem._id,
      })),
    [listItemsIn],
  );
  const [listItems, setListItems] = useState(listItemsFromProps);

  useEffect(() => {
    setListItems(listItemsFromProps);
  }, [listItemsFromProps]);

  return (
    <ReactSortable
      className="divide-border/60 flex flex-col divide-y"
      animation={150}
      handle=".drag-handle"
      list={listItems}
      setList={(sortedListItems) => {
        // Update the local state with the new order
        setListItems(sortedListItems);
        // Update the database with the new order
        onSort(sortedListItems);
      }}
    >
      {listItems.map((listItem) => (
        <div
          key={listItem._id}
          className="flex min-w-0 flex-row items-center justify-between gap-2 px-2 py-1.5"
        >
          <div className="flex min-w-0 flex-grow flex-row items-center gap-2">
            <div className="drag-handle flex-shrink-0 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4" />
            </div>
            <Link
              className="group flex min-w-0 flex-grow"
              href={listItem.value}
              target="_blank"
            >
              <div className="flex w-full min-w-0 flex-grow flex-row items-baseline justify-between gap-2">
                <span className="flex flex-shrink-0 flex-row items-baseline gap-2 text-nowrap">
                  {getListItemTitle({
                    type: listItem.type,
                    description: listItem.description,
                    value: listItem.value,
                  })}
                  <ExternalLinkIcon className="size-3.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="text-muted-foreground min-w-0 flex-shrink truncate text-sm opacity-0 transition-opacity group-hover:opacity-100">
                  {listItem.value}
                </span>
              </div>
            </Link>
          </div>
          <ListItemActions listItem={listItem} />
        </div>
      ))}
    </ReactSortable>
  );
}
