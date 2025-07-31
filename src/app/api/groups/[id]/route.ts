import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getApiToken } from "~/lib/api/auth";
import { handleApiError } from "~/lib/api/error";
import type { Id } from "~/convex/_generated/dataModel";

/**
 * @openapi
 * /api/groups/{id}:
 *   get:
 *     description: Get group by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The group object.
 */
// GET /api/groups/[id] - get group by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const apiAccessToken = getApiToken(req);
    const group = await fetchQuery(api.groups.getById, {
      id,
      apiAccessToken,
    });
    return NextResponse.json({ data: group, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * @openapi
 * /api/groups/{id}:
 *   delete:
 *     description: Delete group by ID
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
// DELETE /api/groups/[id] - delete group
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const apiAccessToken = getApiToken(req);
    await fetchMutation(api.groups.deleteGroup, { id, apiAccessToken });
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
