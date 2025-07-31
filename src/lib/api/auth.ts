import { type NextRequest } from "next/server";

/**
 * Extracts the API token from the X-API-TOKEN header or ?apiToken= query param.
 * Throws an error if not found.
 */
export function getApiToken(req: NextRequest): string {
  // 1. Check X-API-TOKEN header
  const apiTokenHeader = req.headers?.get("x-api-token");
  if (apiTokenHeader) {
    return apiTokenHeader.trim();
  }
  // 2. Check ?apiToken= query param
  const { searchParams } = new URL(req.url);
  const apiToken = searchParams.get("apiToken");
  if (apiToken) {
    return apiToken;
  }
  throw new Error(
    "API token not found. Provide X-API-TOKEN header or ?apiToken= query param.",
  );
}
