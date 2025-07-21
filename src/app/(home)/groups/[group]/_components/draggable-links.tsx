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
import { getLinkTitle } from "~/lib/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { LinkActions } from "~/app/(home)/groups/[group]/_components/link-actions";
import { Button } from "~/components/ui/button";

export function DraggableLinks({
  group,
  preloadedLinks,
}: {
  group: Doc<"groups">;
  preloadedLinks: Preloaded<typeof api.links.getFromGroup>;
}) {
  const links = usePreloadedQuery(preloadedLinks);

  const updatePosition = useMutation({
    mutationFn: useConvexMutation(api.links.reorder),
    onSuccess: () => {
      console.log("Successfully reordered links");
    },
    onError: (error) => {
      toast.error("Failed to reorder link");
      console.error(error);
    },
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced reorder function
  const debouncedReorder = useCallback(
    (orderedIds: Id<"links">[]) => {
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
   * @param list The list of links that was sorted. This will be either the active or archived list.
   * @param updatedList The list of links in the correct order. This will be either the active or archived list.
   */
  function onSort(list: "active" | "archived", updatedList: Doc<"links">[]) {
    const newActiveList = (list === "active" ? updatedList : links.active).map(
      (link) => link._id,
    );
    const newArchivedList = (
      list === "archived" ? updatedList : links.archived
    ).map((link) => link._id);

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
        <p className="text-sm text-muted-foreground">{group.description}</p>
      )}
      <div className="flex flex-row gap-2 justify-between px-3 pt-3 pb-2">
        <div className="flex flex-row gap-2 justify-between items-center w-full">
          <span className="text-sm text-muted-foreground">
            Total: {links?.active.length + links?.archived.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {links?.active.length} active, {links?.archived.length} archived
          </span>
        </div>
      </div>
      <SortableLinks links={links.active} onSort={(l) => onSort("active", l)} />
      <div className="flex flex-row gap-2 justify-between items-center px-2 w-full">
        <Link
          className="w-full"
          href={`/groups/${group._id}/links/create`}
          passHref
        >
          <Button className="w-full" size="lg" variant="secondary">
            <PlusIcon className="w-4 h-4" />
            Create new
          </Button>
        </Link>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="archived">
          <AccordionTrigger className="flex flex-row gap-2 items-center px-3 text-lg font-semibold">
            Archived
          </AccordionTrigger>
          <AccordionContent>
            <SortableLinks
              links={links.archived}
              onSort={(l) => onSort("archived", l)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function SortableLinks({
  links: linksIn,
  onSort,
}: {
  links: Doc<"links">[];
  onSort: (updatedList: Doc<"links">[]) => void;
}) {
  const linksFromProps = useMemo(
    () =>
      (linksIn ?? []).map((link) => ({
        ...link,
        id: link._id,
      })),
    [linksIn],
  );
  const [links, setLinks] = useState(linksFromProps);

  useEffect(() => {
    setLinks(linksFromProps);
  }, [linksFromProps]);

  return (
    <ReactSortable
      className="flex flex-col divide-y divide-border/60"
      animation={150}
      handle=".drag-handle"
      list={links}
      setList={(sortedLinks) => {
        // Update the local state with the new order
        setLinks(sortedLinks);
        // Update the database with the new order
        onSort(sortedLinks);
      }}
    >
      {links.map((link) => (
        <div
          key={link._id}
          className="flex min-w-0 flex-row items-center justify-between gap-2 px-2 py-1.5"
        >
          <div className="flex flex-row flex-grow gap-2 items-center min-w-0">
            <div className="flex-shrink-0 drag-handle cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4" />
            </div>
            <Link
              className="flex flex-grow min-w-0 group"
              href={link.url}
              target="_blank"
            >
              <div className="flex flex-row flex-grow gap-2 justify-between items-baseline w-full min-w-0">
                <span className="flex flex-row flex-shrink-0 gap-2 items-baseline text-nowrap">
                  {getLinkTitle({
                    description: link.description,
                    url: link.url,
                  })}
                  <ExternalLinkIcon className="size-3.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="flex-shrink min-w-0 text-sm truncate opacity-0 transition-opacity text-muted-foreground group-hover:opacity-100">
                  {link.url}
                </span>
              </div>
            </Link>
          </div>
          <LinkActions link={link} />
        </div>
      ))}
    </ReactSortable>
  );
}
