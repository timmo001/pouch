import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

function sortByPosition(a: Doc<"links">, b: Doc<"links">) {
  return (a.position ?? 0) - (b.position ?? 0);
}

export const getFromGroup = query({
  args: {
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_group_user_archived_position", (q) =>
        q.eq("group", args.group).eq("user", identity.tokenIdentifier)
      )
      .collect();

    return {
      active: links.filter((link) => !link.archived).sort(sortByPosition),
      archived: links.filter((link) => link.archived).sort(sortByPosition),
    };
  },
});

export const getById = query({
  args: {
    id: v.id("links"),
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const link = await ctx.db.get(args.id);
    if (!link) return null;

    const group = await ctx.db.get(args.group);
    if (!group) return null;

    if (group.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to access this group");
    }

    if (link.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to access this link");
    }

    return {
      ...link,
      group: group,
    };
  },
});

export const create = mutation({
  args: {
    group: v.id("groups"),
    url: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    // Get the highest position in the group
    const existingLinks = await ctx.db
      .query("links")
      .withIndex("by_group_user_archived_position", (q) =>
        q
          .eq("group", args.group)
          .eq("user", identity.tokenIdentifier)
          .eq("archived", false)
      )
      .collect();

    const maxPosition = existingLinks.reduce(
      (max, link) => Math.max(max, link.position ?? 0),
      0
    );

    return await ctx.db.insert("links", {
      url: args.url,
      description: args.description,
      group: args.group,
      user: identity.tokenIdentifier,
      archived: false,
      position: maxPosition + 1,
    });
  },
});

export const update = mutation({
  args: {
    group: v.id("groups"),
    id: v.id("links"),
    url: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const link = await ctx.db.get(args.id);
    if (!link) return null;

    if (link.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to update this link");
    }

    return await ctx.db.patch(args.id, {
      url: args.url,
      description: args.description,
    });
  },
});

export const toggleArchive = mutation({
  args: {
    group: v.id("groups"),
    id: v.id("links"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const link = await ctx.db.get(args.id);
    if (!link) return null;

    if (link.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to archive this link");
    }

    if (link.group !== args.group) {
      throw new Error("Not authorized to archive this link");
    }

    return await ctx.db.patch(args.id, {
      archived: !link.archived,
    });
  },
});

export const reorder = mutation({
  args: {
    group: v.id("groups"),
    orderedIds: v.array(v.id("links")),
  },
  returns: v.array(v.id("links")),
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

    console.log("Ordered IDs:", args.orderedIds);

    const results = await Promise.all(
      args.orderedIds.map(async (linkId, index) => {
        const existingLink = await ctx.db.get(linkId);

        if (!existingLink) {
          console.warn("Link not found:", linkId);
          return null;
        }

        if (existingLink.user !== identity.tokenIdentifier) {
          console.warn("Not authorized to update this link:", existingLink._id);
          return null;
        }

        if (existingLink.group !== args.group) {
          console.warn("Link is not in the correct group:", existingLink._id);
          return null;
        }

        await ctx.db.patch(linkId, {
          position: (index + 1) * 100,
        });

        // Return the link ID to indicate success
        return linkId;
      })
    );

    // Filter out null results and return only successful updates
    return results.filter((result) => result !== null);
  },
});

export const deleteLink = mutation({
  args: {
    group: v.id("groups"),
    id: v.id("links"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const link = await ctx.db.get(args.id);
    if (!link) return null;

    if (link.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to delete this link");
    }

    if (link.group !== args.group) {
      throw new Error("Not authorized to delete this link");
    }

    return await ctx.db.delete(args.id);
  },
});
