import type { UserIdentity } from "convex/server";
import { api } from "./_generated/api";
import type { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Gets user identity from Clerk authentication.
 * This is the standard way for web clients.
 */
export async function getUserIdentity(
  ctx: QueryCtx | MutationCtx,
): Promise<UserIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("Not authenticated");
  }
  return identity;
}

/**
 * Gets user identity from API token.
 * This is for API clients using API tokens.
 */
export async function getUserIdentityFromApiToken(
  ctx: QueryCtx | MutationCtx,
  apiToken: string,
): Promise<UserIdentity> {
  const user = await ctx.runQuery(api.users.getUserByApiAccessToken, {
    apiAccessToken: apiToken,
  });

  if (!user) {
    throw new Error("Invalid API token");
  }

  // Return a UserIdentity-compatible object for API token users
  return {
    tokenIdentifier: user.tokenIdentifier,
    subject: "",
    issuer: "",
    name: "",
    email: "",
    pictureUrl: "",
    emailVerified: false,
  };
}
