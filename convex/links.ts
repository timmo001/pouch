import { v } from "convex/values";
import { query } from "./_generated/server";

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
