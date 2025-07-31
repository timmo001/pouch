import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getApiToken } from "~/lib/api/auth";
import { handleApiError } from "~/lib/api/error";
import { CreateGroupRequestSchema } from "~/lib/api/schemas";
import type z from "zod";

/**
 * @openapi
 * /api/groups:
 *   get:
 *     description: List all groups
 *     responses:
 *       200:
 *         description: A list of groups.
 */
// GET /api/groups - list all groups
export async function GET(req: NextRequest) {
  try {
    const apiAccessToken = getApiToken(req);
    const groups = await fetchQuery(api.groups.getAll, {
      apiAccessToken,
    });
    return NextResponse.json({ data: groups, error: null });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * @openapi
 * /api/groups:
 *   post:
 *     description: Create a new group
 *     responses:
 *       201:
 *         description: The created group ID.
 */
// POST /api/groups - create a new group
export async function POST(req: NextRequest) {
  try {
    const apiAccessToken = getApiToken(req);
    const body = (await req.json()) as z.infer<typeof CreateGroupRequestSchema>;
    const parsed = CreateGroupRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: { message: "Invalid request body", code: "BAD_REQUEST" },
        },
        { status: 400 },
      );
    }
    const newId = (await fetchMutation(api.groups.create, {
      ...parsed.data,
      apiAccessToken,
    })) as string;
    return NextResponse.json({ data: newId, error: null }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
