import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { getApiToken } from "~/lib/api/auth";
import { handleApiError } from "~/lib/api/error";
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
  {
    params,
  }: { params: Promise<{ id: Id<"groups">; itemId: Id<"listItems"> }> },
) {
  const { id, itemId } = await params;
  try {
    const apiAccessToken = getApiToken(req);
    await fetchMutation(api.listItems.toggleArchive, {
      group: id,
      id: itemId,
      apiAccessToken,
    });
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
