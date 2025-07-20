"use client";
import { useMemo } from "react";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { ExternalLinkIcon, GripVertical } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { toast } from "sonner";
import Link from "next/link";
import { type Doc } from "~/convex/_generated/dataModel";
import { api } from "~/convex/_generated/api";
import { getLinkTitle } from "~/lib/link";
import { LinkActions } from "~/app/(home)/groups/[group]/_components/link-actions";

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
      toast.success("Successfully reordered links");
    },
    onError: (error) => {
      toast.error("Failed to reorder link");
      console.error(error);
    },
  });

  function onSort(sortedLinks: Doc<"links">[]) {
    updatePosition.mutate({
      group: group._id,
      orderedIds: sortedLinks.map((link) => link._id),
    });
  }

  return (
    <>
      <div className="flex flex-row justify-between gap-2 px-3 pt-3 pb-2">
        {group.description && (
          <p className="text-muted-foreground text-sm">{group.description}</p>
        )}
        <p className="text-muted-foreground text-sm">
          Total: {links?.active.length}
        </p>
      </div>
      <SortableLinks links={links.active} onSort={onSort} />
      <h2 className="px-2 text-lg font-semibold">Archived</h2>
      <SortableLinks links={links.archived} onSort={onSort} />
    </>
  );
}

function SortableLinks({
  links: linksIn,
  onSort,
}: {
  links: Doc<"links">[];
  onSort: (sortedLinks: Doc<"links">[]) => void;
}) {
  const links = useMemo(
    () =>
      (linksIn ?? []).map((link) => ({
        ...link,
        id: link._id,
      })),
    [linksIn],
  );

  return (
    <ReactSortable
      className="divide-border/60 flex flex-col divide-y"
      animation={150}
      handle=".drag-handle"
      list={links}
      setList={() => {
        /* This is handled by onEnd */
      }}
      onEnd={(evt) => {
      const { oldIndex, newIndex } = evt;
      if (oldIndex === undefined || newIndex === undefined) return;

      // Create a new sorted list based on the drag-and-drop event
      const newSortedLinks = [...links];
      const [movedLink] = newSortedLinks.splice(oldIndex, 1);
      if (!movedLink) return;
      newSortedLinks.splice(newIndex, 0, movedLink);

      onSort(newSortedLinks);
    }}
    >
      {links.map((link) => (
        <div
          key={link._id}
          className="flex flex-row items-center justify-between gap-2 px-2 py-1.5"
        >
          <div className="flex flex-grow flex-row items-center gap-2">
            <div className="drag-handle cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4" />
            </div>
            <Link className="group flex-grow" href={link.url} target="_blank">
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-2">
                <span className="flex flex-row items-center gap-2">
                  {getLinkTitle({
                    description: link.description,
                    url: link.url,
                  })}
                  <ExternalLinkIcon className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="text-muted-foreground text-center text-sm opacity-0 transition-opacity group-hover:opacity-100">
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
