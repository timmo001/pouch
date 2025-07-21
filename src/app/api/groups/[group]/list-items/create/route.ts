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
  };
}

export async function POST(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { group } = context.params;
    const body = (await request.json()) as {
      type?: "text" | "url";
      value?: string;
      description?: string;
    };
    const { type, value, description } = body;

    if (!type || !value) {
      return NextResponse.json(
        { error: "Type and value are required" },
        { status: 400 },
      );
    }

    if (type !== "text" && type !== "url") {
      return NextResponse.json(
        { error: "Type must be 'text' or 'url'" },
        { status: 400 },
      );
    }

    const convex = getConvexClient();
    const listItemId = await convex.mutation(api.listItems.create, {
      group: group as Id<"groups">,
      type,
      value,
      description: typeof description === "string" ? description : undefined,
    });

    return NextResponse.json({ data: { id: listItemId } }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
