import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/apiAuth";
import { handleApiError } from "~/lib/apiError";
import { UpdateNotepadRequestSchema } from "~/lib/apiSchemas";
import type { Id } from "~/convex/_generated/dataModel";

// GET /api/groups/[id]/notepad - get notepad for group
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = getAuthToken(req);
    const notepad = await fetchQuery(
      api.notepads.getFromGroup,
      { group: params.id as Id<"groups"> },
      { token },
    );
    return NextResponse.json({ data: notepad, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

// POST /api/groups/[id]/notepad - create notepad for group
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = getAuthToken(req);
    const notepad = await fetchMutation(
      api.notepads.create,
      { group: params.id as Id<"groups"> },
      { token },
    );
    return NextResponse.json({ data: notepad, error: null }, { status: 201 });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

// PUT /api/groups/[id]/notepad - update notepad content
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = getAuthToken(req);
    const body = await req.json();
    const parsed = UpdateNotepadRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: { message: "Invalid request body", code: "BAD_REQUEST" },
        },
        { status: 400 },
      );
    }
    const notepad = await fetchMutation(
      api.notepads.update,
      { ...parsed.data, group: params.id as Id<"groups"> },
      { token },
    );
    return NextResponse.json({ data: notepad, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

// DELETE /api/groups/[id]/notepad - delete notepad
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; notepadId?: string } },
) {
  try {
    const token = getAuthToken(req);
    // notepadId is not in the route, so we need to fetch the notepad first
    const notepad = await fetchQuery(
      api.notepads.getFromGroup,
      { group: params.id as Id<"groups"> },
      { token },
    );
    if (!notepad) {
      return NextResponse.json(
        {
          data: null,
          error: { message: "Notepad not found", code: "NOT_FOUND" },
        },
        { status: 404 },
      );
    }
    await fetchMutation(
      api.notepads.deleteNotepad,
      { id: notepad._id as Id<"notepads">, group: params.id as Id<"groups"> },
      { token },
    );
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
