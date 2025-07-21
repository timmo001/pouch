import { type NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  getConvexClient,
  handleError,
} from "~/lib/api-auth";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

interface RouteContext {
  params: {
    group: string;
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { group } = context.params;

    const convex = getConvexClient();
    const notepad = await convex.query(api.notepads.getFromGroup, {
      group: group as Id<"groups">,
    });

    return NextResponse.json({ data: notepad });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { group } = context.params;

    const convex = getConvexClient();
    const notepad = await convex.mutation(api.notepads.create, {
      group: group as Id<"groups">,
    });

    return NextResponse.json({ data: notepad }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
