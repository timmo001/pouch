import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getApiToken } from "~/lib/api/auth";
import { handleApiError } from "~/lib/api/error";
import { UpdateNotepadRequestSchema } from "~/lib/api/schemas";
import type { Id } from "~/convex/_generated/dataModel";
import type z from "zod";

/**
 * @openapi
 * /api/groups/{id}/notepad:
 *   get:
 *     description: Get notepad for group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The notepad object.
 */
// GET /api/groups/[id]/notepad - get notepad for group
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const apiAccessToken = getApiToken(req);
    const notepad = await fetchQuery(api.notepads.getFromGroup, {
      group: id,
      apiAccessToken,
    });
    return NextResponse.json({ data: notepad, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * @openapi
 * /api/groups/{id}/notepad:
 *   post:
 *     description: Create notepad for group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: The created notepad object.
 */
// POST /api/groups/[id]/notepad - create notepad for group
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const apiAccessToken = getApiToken(req);
    const notepad = await fetchMutation(api.notepads.create, {
      group: id,
      apiAccessToken,
    });
    return NextResponse.json({ data: notepad, error: null }, { status: 201 });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * @openapi
 * /api/groups/{id}/notepad:
 *   put:
 *     description: Update notepad content
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The updated notepad object.
 */
// PUT /api/groups/[id]/notepad - update notepad content
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const apiAccessToken = getApiToken(req);
    const body = (await req.json()) as z.infer<
      typeof UpdateNotepadRequestSchema
    >;
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

    const currentNotepad = await fetchQuery(api.notepads.getFromGroup, {
      group: id,
      apiAccessToken,
    });
    if (!currentNotepad) {
      return NextResponse.json(
        {
          data: null,
          error: { message: "Notepad not found", code: "NOT_FOUND" },
        },
        { status: 404 },
      );
    }

    const notepad = await fetchMutation(api.notepads.update, {
      ...parsed.data,
      id: currentNotepad._id,
      group: currentNotepad.group,
      apiAccessToken,
    });
    return NextResponse.json({ data: notepad, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * @openapi
 * /api/groups/{id}/notepad:
 *   delete:
 *     description: Delete notepad for group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success.
 */
// DELETE /api/groups/[id]/notepad - delete notepad for group
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const apiAccessToken = getApiToken(req);
    // Fetch the notepad for the group
    const notepad = await fetchQuery(api.notepads.getFromGroup, {
      group: id,
      apiAccessToken,
    });
    if (!notepad) {
      return NextResponse.json(
        {
          data: null,
          error: { message: "Notepad not found", code: "NOT_FOUND" },
        },
        { status: 404 },
      );
    }

    await fetchMutation(api.notepads.deleteNotepad, {
      id: notepad._id,
      group: id,
      apiAccessToken,
    });
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
