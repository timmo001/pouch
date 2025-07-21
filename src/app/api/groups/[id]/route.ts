import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/apiAuth";
import { handleApiError } from "~/lib/apiError";
import type { Id } from "~/convex/_generated/dataModel";

// GET /api/groups/[id] - get group by id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = getAuthToken(req);
    const group = await fetchQuery(
      api.groups.getById,
      { id: params.id as Id<"groups"> },
      { token },
    );
    return NextResponse.json({ data: group, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

// DELETE /api/groups/[id] - delete group
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = getAuthToken(req);
    await fetchMutation(
      api.groups.deleteGroup,
      { id: params.id as Id<"groups"> },
      { token },
    );
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
