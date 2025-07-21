import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/apiAuth";
import { handleApiError } from "~/lib/apiError";
import { UpdateListItemRequestSchema } from "~/lib/apiSchemas";
import type { Id } from "~/convex/_generated/dataModel";

// GET /api/groups/[id]/list-items/[itemId] - get list item by id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } },
) {
  try {
    const token = getAuthToken(req);
    const item = await fetchQuery(
      api.listItems.getById,
      {
        id: params.itemId as Id<"listItems">,
        group: params.id as Id<"groups">,
      },
      { token },
    );
    return NextResponse.json({ data: item, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

// PUT /api/groups/[id]/list-items/[itemId] - update list item
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } },
) {
  try {
    const token = getAuthToken(req);
    const body = await req.json();
    const parsed = UpdateListItemRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: { message: "Invalid request body", code: "BAD_REQUEST" },
        },
        { status: 400 },
      );
    }
    await fetchMutation(
      api.listItems.update,
      {
        group: params.id as Id<"groups">,
        id: params.itemId as Id<"listItems">,
        ...parsed.data,
      },
      { token },
    );
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

// DELETE /api/groups/[id]/list-items/[itemId] - delete list item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } },
) {
  try {
    const token = getAuthToken(req);
    await fetchMutation(
      api.listItems.deletelistItem,
      {
        group: params.id as Id<"groups">,
        id: params.itemId as Id<"listItems">,
      },
      { token },
    );
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
