import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/apiAuth";
import { handleApiError } from "~/lib/apiError";
import type { Id } from "~/convex/_generated/dataModel";

/**
 * @openapi
 * /api/groups/{id}/list-items/{itemId}/archive:
 *   patch:
 *     description: Toggle archive status for list item
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
// PATCH /api/groups/[id]/list-items/[itemId]/archive - toggle archive status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } },
) {
  try {
    const token = getAuthToken(req);
    await fetchMutation(
      api.listItems.toggleArchive,
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
