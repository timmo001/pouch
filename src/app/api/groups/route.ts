import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { getAuthToken } from "~/lib/apiAuth";
import { handleApiError } from "~/lib/apiError";
import { CreateGroupRequestSchema } from "~/lib/apiSchemas";

// GET /api/groups - list all groups
export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const groups = await fetchQuery(api.groups.getAll, {}, { token });
    return NextResponse.json({ data: groups, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

// POST /api/groups - create a new group
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const body = await req.json();
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
    const newId = (await fetchMutation(api.groups.create, parsed.data, {
      token,
    })) as string;
    return NextResponse.json({ data: newId, error: null }, { status: 201 });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
