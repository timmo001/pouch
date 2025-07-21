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
    group: string;
    notepad: string;
  };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { group, notepad } = context.params;
    const body = (await request.json()) as {
      content?: string;
    };
    const { content } = body;

    if (content === undefined) {
      return NextResponse.json(
        { error: "Content is required" },
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
      id: notepad as Id<"notepads">,
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
    const { group, notepad } = context.params;

    const convex = getConvexClient();
    await convex.mutation(api.notepads.deleteNotepad, {
      id: notepad as Id<"notepads">,
      group: group as Id<"groups">,
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleError(error);
  }
}
