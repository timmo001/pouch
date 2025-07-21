import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/apiAuth";
import { handleApiError } from "~/lib/apiError";
import { UpdateGroupNameRequestSchema } from "~/lib/apiSchemas";
import type { Id } from "~/convex/_generated/dataModel";
import type z from "zod";

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
  { params }: { params: { id: string } },
) {
  try {
    const token = getAuthToken(req);
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
    await fetchMutation(
      api.groups.updateName,
      { id: params.id as Id<"groups">, name: parsed.data.name },
      { token },
    );
    return NextResponse.json({ data: true, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
