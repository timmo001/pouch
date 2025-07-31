import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();
  },
});

export const getUserByApiAccessToken = query({
  args: {
    apiAccessToken: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_api_access_token", (q) =>
        q.eq("apiAccessToken", args.apiAccessToken),
      )
      .first();
  },
});

export const createFromCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const generateApiAccessToken = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (user === null) {
      throw new Error("User not found");
    }

    const newApiAccessToken = crypto.randomUUID();

    await ctx.db.patch(user._id, {
      apiAccessToken: newApiAccessToken,
    });

    return { ...user, apiAccessToken: newApiAccessToken };
  },
});
