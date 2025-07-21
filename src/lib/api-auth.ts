import { type NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { env } from "~/env.js";

export function getConvexClient() {
  if (!env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  }
  return new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);
}

export function authenticateRequest(request: NextRequest) {
  const headerToken = request.headers.get("X-Access-Token");
  const url = new URL(request.url);
  const queryToken = url.searchParams.get("accessToken");
  
  const providedToken = headerToken ?? queryToken;
  
  if (!providedToken) {
    return NextResponse.json(
      { error: "Access token required. Provide via X-Access-Token header or accessToken query parameter." },
      { status: 401 }
    );
  }
  
  if (providedToken !== env.API_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Invalid access token" },
      { status: 403 }
    );
  }
  
  return null; // No error, authentication passed
}

export function handleError(error: unknown) {
  console.error("API Error:", error);
  
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
} 