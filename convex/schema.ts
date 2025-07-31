import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    apiAccessToken: v.optional(v.string()),
  })
    .index("by_token_identifier", ["tokenIdentifier"])
    .index("by_api_access_token", ["apiAccessToken"]),

  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    user: v.string(),
    archived: v.boolean(),
  })
    .index("by_user_archived", ["user", "archived"])
    .index("by_user_archived_name", ["user", "archived", "name"]),

  listItems: defineTable({
    type: v.union(v.literal("text"), v.literal("url")),
    value: v.string(),
    description: v.optional(v.string()),
    group: v.id("groups"),
    user: v.string(),
    archived: v.boolean(),
    position: v.optional(v.number()),
  }).index("by_group_user_archived_position", [
    "group",
    "user",
    "archived",
    "position",
  ]),

  notepads: defineTable({
    content: v.optional(v.string()), // Prosemirror will cover this in its own tables. Leaving for prosperity.
    group: v.id("groups"),
    user: v.string(),
    updatedAt: v.number(),
  }).index("by_group_user", ["group", "user"]),
});
