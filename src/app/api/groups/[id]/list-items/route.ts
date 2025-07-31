import { type NextRequest, NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import type z from "zod";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { getApiToken } from "~/lib/api/auth";
import { handleApiError } from "~/lib/api/error";
import { CreateListItemRequestSchema } from "~/lib/api/schemas";

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
    const apiAccessToken = getApiToken(req);
    const items = await fetchQuery(api.listItems.getFromGroup, {
      group: id,
      apiAccessToken,
    });
    return NextResponse.json({ data: items, error: null });
  } catch (error) {
    return handleApiError(error);
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
    const apiAccessToken = getApiToken(req);
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
    const newId = (await fetchMutation(api.listItems.create, {
      group: id,
      ...parsed.data,
      apiAccessToken,
    })) as unknown as string;
    return NextResponse.json({ data: newId, error: null }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
