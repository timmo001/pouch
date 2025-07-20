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

    return await ctx.db
      .query("links")
      .filter((q) =>
        q.and(
          q.eq(q.field("user"), identity.tokenIdentifier),
          q.eq(q.field("archived"), false),
          q.eq(q.field("group"), args.group)
        )
      )
      .collect();
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

    return await ctx.db.insert("links", {
      url: args.url,
      description: args.description,
      group: args.group,
      user: identity.tokenIdentifier,
      archived: false,
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
