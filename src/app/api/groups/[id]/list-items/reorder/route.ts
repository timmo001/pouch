import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/api/auth";
import { handleApiError } from "~/lib/api/error";
import { ReorderListItemsRequestSchema } from "~/lib/api/schemas";
import type { Id } from "~/convex/_generated/dataModel";
import type z from "zod";

/**
 * @openapi
 * /api/groups/{id}/list-items/reorder:
 *   post:
 *     description: Reorder list items in group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The reordered items.
 */
// POST /api/groups/[id]/list-items/reorder - reorder list items
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const token = getAuthToken(req);
    const body = (await req.json()) as z.infer<
      typeof ReorderListItemsRequestSchema
    >;
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
        group: id,
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
