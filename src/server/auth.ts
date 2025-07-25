import "server-only";
import { auth } from "@clerk/nextjs/server";

export async function getAuthToken() {
  try {
    const authResult = await auth();
    if (!authResult.userId) {
      return undefined;
    }
    return (await authResult.getToken({ template: "convex" })) ?? undefined;
  } catch (error) {
    console.error("Clerk middleware error:", error);
    return undefined;
  }
}
