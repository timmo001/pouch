import { type NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  getConvexClient,
  handleError,
} from "~/lib/api-auth";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

export async function POST(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const body = (await request.json()) as {
      group?: string;
      orderedIds?: string[];
    };
    const { group, orderedIds } = body;

    if (!group || !orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "Group and orderedIds array are required" },
        { status: 400 },
      );
    }

    const convex = getConvexClient();
    const result = await convex.mutation(api.listItems.reorder, {
      group: group as Id<"groups">,
      orderedIds: orderedIds as Id<"listItems">[],
    });

    return NextResponse.json({ data: { reorderedIds: result } });
  } catch (error) {
    return handleError(error);
  }
}
