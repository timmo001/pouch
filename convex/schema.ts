import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    user: v.string(),
    archived: v.boolean(),
  }),

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
});
