import { type NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  getConvexClient,
  handleError,
} from "~/lib/api-auth";
import { api } from "~/convex/_generated/api";

export async function GET(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const convex = getConvexClient();
    const groups = await convex.query(api.groups.getAll);
    return NextResponse.json({ data: groups });
  } catch (error) {
    return handleError(error);
  }
}


