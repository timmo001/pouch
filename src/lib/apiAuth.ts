import { type NextRequest } from "next/server";

/**
 * Extracts the Clerk token from the Authorization header (Bearer) or ?token= query param.
 * Throws an error if not found.
 */
export function getAuthToken(req: NextRequest): string {
  // 1. Check Authorization header
  const authHeader = req.headers?.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  // 2. Check ?token= query param
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? searchParams.get("accessToken");
  if (token) {
    return token;
  }
  throw new Error(
    "Authentication token not found. Provide Bearer token or ?token= query param.",
  );
}
