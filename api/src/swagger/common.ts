import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function registerCommon(registry: OpenAPIRegistry) {
  // Reusable "id" path param
  const IdParam = registry.registerParameter(
    "IdParam",
    z.string().openapi({
      param: { name: "id", in: "path" },
      example: "66c5f7e4d3e3a2b9f4a12345",
    })
  );

  // Optional list query
  const ListQuery = registry.register(
    "ListQuery",
    z.object({ limit: z.number().int().min(1).max(100).optional() })
  );

  // Simple error schema for 4xx/5xx
  const ErrorSchema = registry.register(
    "Error",
    z
      .object({ message: z.string(), code: z.string().optional() })
      .meta({ id: "Error" })
  );

  return { IdParam, ListQuery, ErrorSchema };
}
