import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/api/auth";
import { handleApiError } from "~/lib/api/error";
import { CreateListItemRequestSchema } from "~/lib/api/schemas";
import type { Id } from "~/convex/_generated/dataModel";
import type z from "zod";

/**
 * @openapi
 * /api/groups/{id}/list-items:
 *   get:
 *     description: List items in group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of items.
 */
// GET /api/groups/[id]/list-items - list items in group
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const token = getAuthToken(req);
    const items = await fetchQuery(
      api.listItems.getFromGroup,
      { group: id },
      { token },
    );
    return NextResponse.json({ data: items, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * @openapi
 * /api/groups/{id}/list-items:
 *   post:
 *     description: Create list item in group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: The created item ID.
 */
// POST /api/groups/[id]/list-items - create list item in group
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const token = getAuthToken(req);
    const body = (await req.json()) as z.infer<
      typeof CreateListItemRequestSchema
    >;
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
      { group: id, ...parsed.data },
      { token },
    )) as string;
    return NextResponse.json({ data: newId, error: null }, { status: 201 });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
