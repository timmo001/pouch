import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    user: v.string(),
    archived: v.boolean(),
  }),

  links: defineTable({
    url: v.string(),
    description: v.optional(v.string()),
    group: v.id("groups"),
    user: v.string(),
    archived: v.boolean(),
  }),
});
