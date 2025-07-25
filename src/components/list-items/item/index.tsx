"use client";
import { useState, type ReactNode } from "react";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { type Doc } from "~/convex/_generated/dataModel";
import { getListItemTitle } from "~/lib/list-item";
import { motion, AnimatePresence } from "motion/react";

export function ListItemURL({ listItem }: { listItem: Doc<"listItems"> }) {
  return (
    <Link
      className="group flex min-w-0 flex-grow"
      href={listItem.value}
      target="_blank"
    >
      <ListItemTextContainers
        content={{
          value: (
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

export function ListItemText({ listItem }: { listItem: Doc<"listItems"> }) {
  return (
    <ListItemTextContainers
      content={{
        value: listItem.value,
        description: listItem.description,
      }}
    />
  );
}

function ListItemTextContainers({
  content,
}: {
  content: {
    value: ReactNode | string;
    description: ReactNode | string;
  };
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const collapsedHeight = 24;

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        <motion.div
          key="desc-container"
          className="group flex w-full flex-row flex-wrap items-baseline justify-between gap-2 overflow-hidden"
          initial={{ height: collapsedHeight, opacity: 0 }}
          animate={{ height: isHovered ? "auto" : collapsedHeight, opacity: 1 }}
          exit={{ height: collapsedHeight, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <span className="flex flex-shrink-0 flex-row items-baseline gap-2 text-wrap">
            {content.value}
          </span>
          {content.description && isHovered && (
            <motion.span
              key={
                typeof content.description === "string"
                  ? content.description
                  : undefined
              }
              className="text-muted-foreground min-w-0 flex-shrink text-sm text-wrap transition-all"
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
