import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
        q
          .eq("group", args.group)
          .eq("user", identity.tokenIdentifier)
          .eq("archived", false)
      )
      .collect();

    // Sort by position, with undefined positions treated as 0
    return links.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
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

export const archive = mutation({
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
      archived: true,
    });
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

export const updatePositions = mutation({
  args: {
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    // Get all links in the group that don't have a position
    const linksWithoutPosition = await ctx.db
      .query("links")
      .withIndex("by_group_user_archived_position", (q) =>
        q
          .eq("group", args.group)
          .eq("user", identity.tokenIdentifier)
          .eq("archived", false)
      )
      .filter((q) => q.eq(q.field("position"), undefined))
      .collect();

    // Update each link with a position
    for (let i = 0; i < linksWithoutPosition.length; i++) {
      const link = linksWithoutPosition[i];
      if (link) {
        await ctx.db.patch(link._id, {
          position: i + 1,
        });
      }
    }

    return linksWithoutPosition.length;
  },
});

export const updateLinkPosition = mutation({
  args: {
    group: v.id("groups"),
    id: v.id("links"),
    position: v.number(),
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

    if (link.group !== args.group) {
      throw new Error("Not authorized to update this link");
    }

    return await ctx.db.patch(args.id, {
      position: args.position,
    });
  },
});
