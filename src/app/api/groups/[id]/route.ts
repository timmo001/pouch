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

export async function GET(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { id } = context.params;

    const convex = getConvexClient();
    const group = await convex.query(api.groups.getById, {
      id: id as Id<"groups">,
    });
    return NextResponse.json({ data: group });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { id } = context.params;
    const body = (await request.json()) as {
      name?: string;
      description?: string;
    };
    const { name, description } = body;

    const convex = getConvexClient();

    // Update name if provided
    if (name && typeof name === "string") {
      await convex.mutation(api.groups.updateName, {
        id: id as Id<"groups">,
        name,
      });
    }

    // Update description if provided
    if (description !== undefined) {
      await convex.mutation(api.groups.updateDescription, {
        id: id as Id<"groups">,
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
    const { id } = context.params;

    const convex = getConvexClient();
    await convex.mutation(api.groups.deleteGroup, { id: id as Id<"groups"> });
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleError(error);
  }
}
