import type { UserIdentity } from "convex/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Gets user identity from API token.
 * This is for API clients using API tokens.
 */
export async function getUserIdentityFromApiToken(
  ctx: QueryCtx | MutationCtx,
  apiToken: string,
): Promise<UserIdentity> {
  const user = await ctx.db
    .query("users")
    .withIndex("by_api_access_token", (q) => q.eq("apiAccessToken", apiToken))
    .first();

  if (!user) {
    throw new Error("Invalid API token");
  }

  // Return a UserIdentity-compatible object for API token users
  return {
    tokenIdentifier: user.tokenIdentifier,
    subject: "N/A",
    issuer: "API Token",
  };
}
