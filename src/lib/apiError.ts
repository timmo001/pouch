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
function getStatusCode(error: unknown): number {
  if (isObjectWithStatus(error)) {
    return error.status;
  }
  if (isObjectWithStatusCode(error)) {
    return error.statusCode;
  }
  if (isObjectWithCode(error)) {
    const code = error.code;
    if (typeof code === "number") return code;
    if (typeof code === "string") {
      // Map some common string codes
      switch (code) {
        case "UNAUTHORIZED":
          return 401;
        case "FORBIDDEN":
          return 403;
        case "NOT_FOUND":
          return 404;
        case "BAD_REQUEST":
          return 400;
        default:
          return 400;
      }
    }
  }
  if (error instanceof Error && error.message.includes("not authenticated"))
    return 401;
  return 500;
}

/**
 * Formats an error into the standard API error response structure.
 */
export function handleApiError(error: unknown) {
  const status = getStatusCode(error);
  const message = error instanceof Error ? error.message : String(error);
  const code = isObjectWithCode(error) ? error.code : undefined;
  return {
    status,
    body: {
      data: null,
      error: { message, code },
    },
  };
}
