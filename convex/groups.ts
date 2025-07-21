import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("groups")
      .filter((q) =>
        q.and(
          q.eq(q.field("user"), identity.tokenIdentifier),
          q.eq(q.field("archived"), false),
        ),
      )
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.id);
    if (group === null) {
      throw new Error("Group not found");
    }

    if (group.user !== identity.tokenIdentifier) {
      throw new Error("You are not the owner of this group");
    }

    return group;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      user: identity.tokenIdentifier,
      archived: false,
    });
  },
});

export const updateName = mutation({
  args: {
    id: v.id("groups"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.id);
    if (group === null) {
      throw new Error("Group not found");
    }

    if (group.user !== identity.tokenIdentifier) {
      throw new Error("You are not the owner of this group");
    }

    return await ctx.db.patch(args.id, {
      name: args.name,
    });
  },
});

export const updateDescription = mutation({
  args: {
    id: v.id("groups"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.id);
    if (group === null) {
      throw new Error("Group not found");
    }

    if (group.user !== identity.tokenIdentifier) {
      throw new Error("You are not the owner of this group");
    }

    return await ctx.db.patch(args.id, {
      description: args.description,
    });
  },
});

export const deleteGroup = mutation({
  args: {
    id: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.id);
    if (group === null) {
      throw new Error("Group not found");
    }

    if (group.user !== identity.tokenIdentifier) {
      throw new Error("You are not the owner of this group");
    }

    // First delete all listItems in the group
    const listItems = await ctx.db
      .query("listItems")
      .filter((q) => q.eq(q.field("group"), args.id))
      .collect();

    for (const listItem of listItems) {
      if (listItem.user !== identity.tokenIdentifier) {
        throw new Error("You are not the owner of this listItem");
      }

      await ctx.db.delete(listItem._id);
    }

    // Then delete the group
    return await ctx.db.delete(args.id);
  },
});
