import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/apiAuth";
import { handleApiError } from "~/lib/apiError";
import { UpdateGroupDescriptionRequestSchema } from "~/lib/apiSchemas";
import type { Id } from "~/convex/_generated/dataModel";
import type z from "zod";

/**
 * @openapi
 * /api/groups/{id}/description:
 *   patch:
 *     description: Update group description
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
// PATCH /api/groups/[id]/description - update group description
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: Id<"groups"> }> },
) {
  const { id } = await params;
  try {
    const token = getAuthToken(req);
    const body = (await req.json()) as z.infer<
      typeof UpdateGroupDescriptionRequestSchema
    >;
    const parsed = UpdateGroupDescriptionRequestSchema.safeParse(body);
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
      api.groups.updateDescription,
      { id, description: parsed.data.description },
      { token },
    );
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
