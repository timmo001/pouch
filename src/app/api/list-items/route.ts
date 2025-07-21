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
    const listItems = await convex.query(api.listItems.getFromGroup, {
      group: groupId as Id<"groups">,
    });

    return NextResponse.json({ data: listItems });
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
      type?: "text" | "url";
      value?: string;
      description?: string;
    };
    const { group, type, value, description } = body;

    if (!group || !type || !value) {
      return NextResponse.json(
        { error: "Group, type, and value are required" },
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
