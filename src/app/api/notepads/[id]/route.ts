import { type NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  getConvexClient,
  handleError,
} from "~/lib/api-auth";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { id } = context.params;
    const body = (await request.json()) as {
      group?: string;
      content?: string;
    };
    const { group, content } = body;

    if (!group || content === undefined) {
      return NextResponse.json(
        { error: "Group ID and content are required" },
        { status: 400 },
      );
    }

    if (typeof content !== "string") {
      return NextResponse.json(
        { error: "Content must be a string" },
        { status: 400 },
      );
    }

    const convex = getConvexClient();
    await convex.mutation(api.notepads.update, {
      id: id as Id<"notepads">,
      group: group as Id<"groups">,
      content,
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { id } = context.params;
    const url = new URL(request.url);
    const groupId = url.searchParams.get("group");

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required as query parameter" },
        { status: 400 },
      );
    }

    const convex = getConvexClient();
    await convex.mutation(api.notepads.deleteNotepad, {
      id: id as Id<"notepads">,
      group: groupId as Id<"groups">,
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleError(error);
  }
}
