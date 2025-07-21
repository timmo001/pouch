import { type NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  getConvexClient,
  handleError,
} from "~/lib/api-auth";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

export async function GET(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const url = new URL(request.url);
    const groupId = url.searchParams.get("group");

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required as query parameter" },
        { status: 400 },
      );
    }

    const convex = getConvexClient();
    const notepad = await convex.query(api.notepads.getFromGroup, {
      group: groupId as Id<"groups">,
    });

    return NextResponse.json({ data: notepad });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const body = (await request.json()) as {
      group?: string;
    };
    const { group } = body;

    if (!group) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 },
      );
    }

    const convex = getConvexClient();
    const notepad = await convex.mutation(api.notepads.create, {
      group: group as Id<"groups">,
    });

    return NextResponse.json({ data: notepad }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
