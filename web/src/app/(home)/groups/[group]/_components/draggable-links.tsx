"use client";
import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { ExternalLinkIcon, GripVertical } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { toast } from "sonner";
import Link from "next/link";
import { type Id, type Doc } from "~/convex/_generated/dataModel";
import { api } from "~/convex/_generated/api";
import { getLinkTitle } from "~/lib/link";
import { LinkActions } from "~/app/(home)/groups/[group]/_components/link-actions";

interface SortableItem {
  id: string;
}

export function DraggableLinks({
  links: linksIn,
  groupId,
}: {
  links: Doc<"links">[];
  groupId: Id<"groups">;
}) {
  const { data: links, refetch } = useQuery({
    ...convexQuery(api.links.getFromGroup, {
      group: groupId,
    }),
    initialData: linksIn,
  });

  const updatePosition = useMutation({
    mutationFn: useConvexMutation(api.links.updateLinkPosition),
    onSuccess: () => {
      void refetch();
    },
    onError: (error) => {
      toast.error("Failed to reorder link");
      console.error(error);
    },
  });

  function onSort(sortedLinks: (Doc<"links"> & SortableItem)[]) {
    // We only care about the final order, so we can ignore intermediate states
    // and just send the final positions to the server.
    sortedLinks.forEach((link, index) => {
      // Check if the position has changed
      if (link.position !== index + 1) {
        updatePosition.mutate({
          id: link._id,
          position: index + 1,
          group: groupId,
        });
      }
    });
  }

  const linksSortable = useMemo(
    () =>
      links.map((link) => ({
        ...link,
        id: link._id,
      })),
    [links],
  );

  if (!links) return <div>No links found</div>;

  return (
    <ReactSortable
      list={linksSortable}
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

        onSort(newSortedLinks as (Doc<"links"> & SortableItem)[]);
      }}
      handle=".drag-handle"
      animation={150}
      className="divide-border/60 flex flex-col divide-y"
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
