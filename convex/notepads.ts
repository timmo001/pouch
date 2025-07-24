import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { prosemirrorSync } from "./prosemirror";

export const create = mutation({
  args: {
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.group);
    if (!group) {
      throw new Error("Group not found");
    }

    if (group.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to create a notepad for this group");
    }

    const existingNotepad = await ctx.db
      .query("notepads")
      .withIndex("by_group_user", (q) =>
        q.eq("group", args.group).eq("user", identity.tokenIdentifier),
      )
      .first();

    if (existingNotepad) {
      return existingNotepad;
    }

    const notepadId = await ctx.db.insert("notepads", {
      content: "",
      group: args.group,
      user: identity.tokenIdentifier,
      updatedAt: Date.now(),
    });

    await prosemirrorSync.create(ctx, notepadId, { type: "doc", content: [] });

    return notepadId;
  },
});

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
      .query("notepads")
      .withIndex("by_group_user", (q) =>
        q.eq("group", args.group).eq("user", identity.tokenIdentifier),
      )
      .first();
  },
});

export const update = mutation({
  args: {
    id: v.id("notepads"),
    group: v.id("groups"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const notepad = await ctx.db.get(args.id);
    if (!notepad) return null;

    if (notepad.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to update this notepad");
    }

    if (notepad.group !== args.group) {
      throw new Error("This notepad does not belong to this group");
    }

    return await ctx.db.patch(notepad._id, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

export const deleteNotepad = mutation({
  args: {
    id: v.id("notepads"),
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const notepad = await ctx.db.get(args.id);
    if (!notepad) return null;

    if (notepad.user !== identity.tokenIdentifier) {
      throw new Error("Not authorized to delete this notepad");
    }

    if (notepad.group !== args.group) {
      throw new Error("This notepad does not belong to this group");
    }

    return await ctx.db.delete(notepad._id);
  },
});
