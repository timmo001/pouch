import { type NextRequest, NextResponse } from "next/server";
import type z from "zod";
import { fetchMutation } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { getApiToken } from "~/lib/api/auth";
import { handleApiError } from "~/lib/api/error";
import { UpdateGroupNameRequestSchema } from "~/lib/api/schemas";

/**
 * @openapi
 * /api/groups/{id}/name:
 *   patch:
 *     description: Update group name
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
// PATCH /api/groups/[id]/name - update group name
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const apiAccessToken = getApiToken(req);
    const body = (await req.json()) as z.infer<
      typeof UpdateGroupNameRequestSchema
    >;
    const parsed = UpdateGroupNameRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: { message: "Invalid request body", code: "BAD_REQUEST" },
        },
        { status: 400 },
      );
    }
    await fetchMutation(api.groups.updateName, {
      id,
      name: parsed.data.name,
      apiAccessToken,
    });
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    return handleApiError(error);
  }
}
