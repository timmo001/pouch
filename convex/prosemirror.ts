import { ProsemirrorSync } from "@convex-dev/prosemirror-sync";
import { components } from "./_generated/api";
// Do not use `import { type Id }..`, it will cause a codegen error
import type { Id } from "./_generated/dataModel";
import type { QueryCtx, MutationCtx } from "./_generated/server";

const prosemirrorSync = new ProsemirrorSync<Id<"notepads">>(
  components.prosemirrorSync,
);

const { getSnapshot, submitSnapshot, latestVersion, getSteps, submitSteps } =
  prosemirrorSync.syncApi({
    async checkRead(ctx: QueryCtx, id: Id<"notepads">) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }

      const notepad = await ctx.db.get(id);
      if (!notepad) {
        throw new Error("Notepad not found");
      }

      if (notepad.user !== identity.tokenIdentifier) {
        throw new Error("Not authorized to read this notepad");
      }
    },

    async checkWrite(ctx: MutationCtx, id: Id<"notepads">) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }

      const notepad = await ctx.db.get(id);
      if (!notepad) {
        throw new Error("Notepad not found");
      }

      if (notepad.user !== identity.tokenIdentifier) {
        throw new Error("Not authorized to write to this notepad");
      }
    },
  });

// Exports need to be done here for some reason, not at the definition
// Something something top level exports, something something codegen?
export {
  prosemirrorSync,
  getSnapshot,
  submitSnapshot,
  latestVersion,
  getSteps,
  submitSteps,
};
