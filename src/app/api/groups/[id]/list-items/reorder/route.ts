import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/apiAuth";
import { handleApiError } from "~/lib/apiError";
import { ReorderListItemsRequestSchema } from "~/lib/apiSchemas";
import type { Id } from "~/convex/_generated/dataModel";

// POST /api/groups/[id]/list-items/reorder - reorder list items
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = getAuthToken(req);
    const body = await req.json();
    const parsed = ReorderListItemsRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: { message: "Invalid request body", code: "BAD_REQUEST" },
        },
        { status: 400 },
      );
    }
    const result = await fetchMutation(
      api.listItems.reorder,
      {
        group: params.id as Id<"groups">,
        orderedIds: parsed.data.orderedIds as Id<"listItems">[],
      },
      { token },
    );
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
