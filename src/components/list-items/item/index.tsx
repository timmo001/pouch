"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ExternalLinkIcon, GripVertical } from "lucide-react";
import Link from "next/link";
import { type Doc } from "~/convex/_generated/dataModel";
import { getListItemTitle } from "~/lib/list-item";
import { motion, AnimatePresence } from "motion/react";
import { ListItemActions } from "~/components/list-items/item/actions";

export function ListItem({ listItem }: { listItem: Doc<"listItems"> }) {
  return (
    <div
      key={listItem._id}
      className="flex min-w-0 flex-row items-center justify-between gap-2 px-2 py-1.5"
    >
      <div className="flex min-w-0 flex-grow flex-row items-center gap-2">
        <div className="drag-handle flex-shrink-0 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </div>
        {listItem.type === "url" ? (
          <ListItemURL listItem={listItem} />
        ) : (
          <ListItemText listItem={listItem} />
        )}
      </div>
      <ListItemActions listItem={listItem} />
    </div>
  );
}

function ListItemURL({ listItem }: { listItem: Doc<"listItems"> }) {
  return (
    <Link
      className="group flex min-w-0 flex-grow"
      href={listItem.value}
      target="_blank"
    >
      <ListItemTextContainers
        content={{
          title: (
            <>
              {getListItemTitle({
                type: listItem.type,
                description: listItem.description,
                value: listItem.value,
              })}
              <ExternalLinkIcon className="size-3.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </>
          ),
          description: listItem.value,
        }}
      />
    </Link>
  );
}

function ListItemText({ listItem }: { listItem: Doc<"listItems"> }) {
  return (
    <ListItemTextContainers
      content={{
        title: listItem.value,
        description: listItem.description,
      }}
    />
  );
}

function ListItemTextContainers({
  content,
}: {
  content: {
    title: ReactNode | string;
    description: ReactNode | string;
  };
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number>(0);
  const titleHeightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleHeightRef.current) {
      setCollapsedHeight(titleHeightRef.current.offsetHeight);
    }
  }, [content.title]);

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        <motion.div
          key="desc-container"
          className="group flex w-full min-w-0 flex-row flex-wrap items-baseline justify-between gap-2 overflow-hidden"
          initial={{ height: collapsedHeight, opacity: 0 }}
          animate={{ height: isHovered ? "auto" : collapsedHeight, opacity: 1 }}
          exit={{ height: collapsedHeight, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div
            className="text-foreground flex min-w-0 flex-shrink flex-row items-center gap-2 text-wrap break-words transition-all"
            ref={titleHeightRef}
          >
            {content.title}
          </div>
          {content.description && isHovered && (
            <motion.span
              key={
                typeof content.description === "string"
                  ? content.description
                  : undefined
              }
              className="text-muted-foreground min-w-0 flex-shrink text-sm text-wrap break-words transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {content.description}
            </motion.span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
