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
    item: string;
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { group, item } = context.params;

    const convex = getConvexClient();
    const listItem = await convex.query(api.listItems.getById, {
      id: item as Id<"listItems">,
      group: group as Id<"groups">,
    });

    return NextResponse.json({ data: listItem });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { group, item } = context.params;
    const body = (await request.json()) as {
      type?: "text" | "url";
      value?: string;
      description?: string;
      archived?: boolean;
    };
    const { type, value, description, archived } = body;

    const convex = getConvexClient();

    // Handle archive/unarchive
    if (archived !== undefined) {
      await convex.mutation(api.listItems.toggleArchive, {
        id: item as Id<"listItems">,
        group: group as Id<"groups">,
      });
    }

    // Handle other updates
    if (type || value || description !== undefined) {
      if (!type || !value) {
        return NextResponse.json(
          { error: "Type and value are required for updates" },
          { status: 400 },
        );
      }

      if (type !== "text" && type !== "url") {
        return NextResponse.json(
          { error: "Type must be 'text' or 'url'" },
          { status: 400 },
        );
      }

      await convex.mutation(api.listItems.update, {
        id: item as Id<"listItems">,
        group: group as Id<"groups">,
        type,
        value,
        description: typeof description === "string" ? description : undefined,
      });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { group, item } = context.params;

    const convex = getConvexClient();
    await convex.mutation(api.listItems.deletelistItem, {
      id: item as Id<"listItems">,
      group: group as Id<"groups">,
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleError(error);
  }
}
