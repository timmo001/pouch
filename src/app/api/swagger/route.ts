import { createSwaggerSpec } from "next-swagger-doc";

export async function GET() {
  return Response.json(
    createSwaggerSpec({
      apiFolder: "src/app/api",
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Pouch",
          version: "1.0.0",
        },
      },
    }),
  );
}
