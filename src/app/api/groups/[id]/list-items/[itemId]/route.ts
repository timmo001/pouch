import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/api/auth";
import { handleApiError } from "~/lib/api/error";
import { UpdateListItemRequestSchema } from "~/lib/api/schemas";
import type { Id } from "~/convex/_generated/dataModel";
import type z from "zod";

/**
 * @openapi
 * /api/groups/{id}/list-items/{itemId}:
 *   get:
 *     description: Get list item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The list item object.
 */
// GET /api/groups/[id]/list-items/[itemId] - get list item by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups">; itemId: Id<"listItems"> }> },
) {
  const { id, itemId } = await params;
  try {
    const token = getAuthToken(req);
    const item = await fetchQuery(
      api.listItems.getById,
      { id: itemId, group: id },
      { token },
    );
    return NextResponse.json({ data: item, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * @openapi
 * /api/groups/{id}/list-items/{itemId}:
 *   put:
 *     description: Update list item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success.
 */
// PUT /api/groups/[id]/list-items/[itemId] - update list item
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups">; itemId: Id<"listItems"> }> },
) {
  const { id, itemId } = await params;
  try {
    const token = getAuthToken(req);
    const body = (await req.json()) as z.infer<
      typeof UpdateListItemRequestSchema
    >;
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
        group: id,
        id: itemId,
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

/**
 * @openapi
 * /api/groups/{id}/list-items/{itemId}:
 *   delete:
 *     description: Delete list item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success.
 */
// DELETE /api/groups/[id]/list-items/[itemId] - delete list item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups">; itemId: Id<"listItems"> }> },
) {
  const { id, itemId } = await params;
  try {
    const token = getAuthToken(req);
    await fetchMutation(
      api.listItems.deletelistItem,
      { group: id, id: itemId },
      { token },
    );
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
