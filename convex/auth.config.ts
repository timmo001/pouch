import { env } from "~/env";

const authConfig = {
  providers: [
    {
      domain: env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
