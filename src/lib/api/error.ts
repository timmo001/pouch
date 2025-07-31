import { NextResponse } from "next/server";

function isObjectWithStatus(obj: unknown): obj is { status: number } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "status" in obj &&
    typeof (obj as { status: unknown }).status === "number"
  );
}
function isObjectWithStatusCode(obj: unknown): obj is { statusCode: number } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "statusCode" in obj &&
    typeof (obj as { statusCode: unknown }).statusCode === "number"
  );
}
function isObjectWithCode(obj: unknown): obj is { code: string | number } {
  return typeof obj === "object" && obj !== null && "code" in obj;
}

/**
 * Maps common error types to HTTP status codes.
 */
function getStatusCode(error: unknown): {
  status: number;
  code?: string | number;
} {
  if (isObjectWithStatus(error)) {
    return { status: error.status };
  }
  if (isObjectWithStatusCode(error)) {
    return { status: error.statusCode };
  }
  if (isObjectWithCode(error)) {
    const code = error.code;
    if (typeof code === "number") return { status: code, code };
    if (typeof code === "string") {
      // Map some common string codes
      switch (code) {
        case "UNAUTHORIZED":
          return { status: 401, code };
        case "FORBIDDEN":
          return { status: 403, code };
        case "NOT_FOUND":
          return { status: 404, code };
        case "BAD_REQUEST":
          return { status: 400, code };
        default:
          return { status: 400, code };
      }
    }
  }
  if (error instanceof Error && error.message.includes("not authenticated"))
    return { status: 401 };
  return { status: 500 };
}

/**
 * Formats an error into the standard API error response structure.
 */
export function handleApiError(error: unknown) {
  if (error instanceof Error && error.message.includes("Invalid API token")) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid API token",
          code: "UNAUTHORIZED",
        },
      },
      { status: 401 },
    );
  }

  const { status, code } = getStatusCode(error);
  const message = error instanceof Error ? error.message : String(error);

  return NextResponse.json({
    status,
    body: {
      data: null,
      error: { message, code },
    },
  });
}
