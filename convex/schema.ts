import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  groups: defineTable({
    archived: v.boolean(),
    name: v.string(),
    user: v.string(),
  }),

  links: defineTable({
    archived: v.boolean(),
    group: v.id("groups"),
    url: v.string(),
    user: v.string(),
  }),
});
