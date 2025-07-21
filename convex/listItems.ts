import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

function sortByPosition(a: Doc<"listItems">, b: Doc<"listItems">) {
  return (a.position ?? 0) - (b.position ?? 0);
}

export const create = mutation({
  args: {
    group: v.id("groups"),
    type: v.union(v.literal("text"), v.literal("url")),
    value: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    // Get the highest position in the group
    const existinglistItems = await ctx.db
      .query("listItems")
      .withIndex("by_group_user_archived_position", (q) =>
        q
          .eq("group", args.group)
          .eq("user", identity.tokenIdentifier)
          .eq("archived", false),
      )
      .collect();

    const maxPosition = existinglistItems.reduce(
      (max, listItem) => Math.max(max, listItem.position ?? 0),
      0,
    );

    return await ctx.db.insert("listItems", {
      type: args.type,
      value: args.value,
      description: args.description,
      group: args.group,
      user: identity.tokenIdentifier,
      archived: false,
      position: maxPosition + 1,
    });
  },
});

export const getFromGroup = query({
  args: {
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const listItems = await ctx.db
      .query("listItems")
      .withIndex("by_group_user_archived_position", (q) =>
        q.eq("group", args.group).eq("user", identity.tokenIdentifier),
      )
      .collect();

    return {
      active: listItems
        .filter((listItem) => !listItem.archived)
        .sort(sortByPosition),
      archived: listItems
        .filter((listItem) => listItem.archived)
        .sort(sortByPosition),
    };
  },
});

export const getById = query({
  args: {
    id: v.id("listItems"),
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const listItem = await ctx.db.get(args.id);
    if (!listItem) return null;

    const group = await ctx.db.get(args.group);
    if (!group) return null;

    if (group.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to access this group");
    }

    if (listItem.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to access this listItem");
    }

    return {
      ...listItem,
      group: group,
    };
  },
});

export const update = mutation({
  args: {
    group: v.id("groups"),
    id: v.id("listItems"),
    type: v.union(v.literal("text"), v.literal("url")),
    value: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const listItem = await ctx.db.get(args.id);
    if (!listItem) return null;

    if (listItem.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to update this listItem");
    }

    return await ctx.db.patch(args.id, {
      type: args.type,
      value: args.value,
      description: args.description,
    });
  },
});

export const toggleArchive = mutation({
  args: {
    group: v.id("groups"),
    id: v.id("listItems"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const listItem = await ctx.db.get(args.id);
    if (!listItem) return null;

    if (listItem.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to archive this listItem");
    }

    if (listItem.group !== args.group) {
      throw new Error("Not authorized to archive this listItem");
    }

    return await ctx.db.patch(args.id, {
      archived: !listItem.archived,
    });
  },
});

export const reorder = mutation({
  args: {
    group: v.id("groups"),
    orderedIds: v.array(v.id("listItems")),
  },
  returns: v.array(v.id("listItems")),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.group);
    if (!group) {
      throw new Error("Group not found");
    }

    if (group.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to access this group");
    }

    const results = await Promise.all(
      args.orderedIds.map(async (listItemId, index) => {
        const existinglistItem = await ctx.db.get(listItemId);

        if (!existinglistItem) {
          console.warn("listItem not found:", listItemId);
          return null;
        }

        if (existinglistItem.user !== identity.tokenIdentifier) {
          console.warn(
            "Not authorized to update this listItem:",
            existinglistItem._id,
          );
          return null;
        }

        if (existinglistItem.group !== args.group) {
          console.warn(
            "listItem is not in the correct group:",
            existinglistItem._id,
          );
          return null;
        }

        await ctx.db.patch(listItemId, {
          position: (index + 1) * 100,
        });

        // Return the listItem ID to indicate success
        return listItemId;
      }),
    );

    // Filter out null results and return only successful updates
    return results.filter((result) => result !== null);
  },
});

export const deleteListItem = mutation({
  args: {
    group: v.id("groups"),
    id: v.id("listItems"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const listItem = await ctx.db.get(args.id);
    if (!listItem) return null;

    if (listItem.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to delete this listItem");
    }

    if (listItem.group !== args.group) {
      throw new Error("Not authorized to delete this listItem");
    }

    return await ctx.db.delete(args.id);
  },
});
