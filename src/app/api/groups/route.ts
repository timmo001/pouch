import { type NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  getConvexClient,
  handleError,
} from "~/lib/api-auth";
import { api } from "~/convex/_generated/api";

export async function GET(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const convex = getConvexClient();
    const groups = await convex.query(api.groups.getAll);
    return NextResponse.json({ data: groups });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const body = (await request.json()) as {
      name?: string;
      description?: string;
    };
    const { name, description } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 },
      );
    }

    const convex = getConvexClient();
    const groupId = await convex.mutation(api.groups.create, {
      name,
      description: typeof description === "string" ? description : undefined,
    });

    return NextResponse.json({ data: { id: groupId } }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
