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
          q.eq(q.field("archived"), false)
        )
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
      throw new Error("Unauthorized");
    }

    return group;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("groups", {
      name: args.name,
      user: identity.tokenIdentifier,
      archived: false,
    });
  },
});
