import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/apiAuth";
import { handleApiError } from "~/lib/apiError";
import { CreateListItemRequestSchema } from "~/lib/apiSchemas";
import type { Id } from "~/convex/_generated/dataModel";

// GET /api/groups/[id]/list-items - list items in group
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = getAuthToken(req);
    const items = await fetchQuery(
      api.listItems.getFromGroup,
      { group: params.id as Id<"groups"> },
      { token },
    );
    return NextResponse.json({ data: items, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

// POST /api/groups/[id]/list-items - create list item in group
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = getAuthToken(req);
    const body = await req.json();
    const parsed = CreateListItemRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: { message: "Invalid request body", code: "BAD_REQUEST" },
        },
        { status: 400 },
      );
    }
    const newId = (await fetchMutation(
      api.listItems.create,
      { group: params.id as Id<"groups">, ...parsed.data },
      { token },
    )) as string;
    return NextResponse.json({ data: newId, error: null }, { status: 201 });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
