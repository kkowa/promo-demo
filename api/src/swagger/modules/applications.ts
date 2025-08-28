import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  ApplicationSchema,
  ApplicationListSchema,
  CreateApplicationInputSchema,
} from "../../schemas/application.schema.js";

export function registerApplications(
  registry: OpenAPIRegistry,
  common: { IdParam: any; ListQuery: any; ErrorSchema: any }
) {
  const { IdParam, ListQuery, ErrorSchema } = common;

  // POST /applications
  registry.registerPath({
    method: "post",
    path: "/applications",
    summary: "Create a promotion application",
    request: {
      body: {
        required: true,
        content: {
          "application/json": { schema: CreateApplicationInputSchema },
        },
      },
    },
    responses: {
      201: {
        description: "Created",
        content: { "application/json": { schema: ApplicationSchema } },
      },
      400: {
        description: "Validation error",
        content: { "application/json": { schema: ErrorSchema } },
      },
    },
  });

  // GET /applications/{id}
  registry.registerPath({
    method: "get",
    path: "/applications/{id}",
    summary: "Get an application by ID",
    parameters: [IdParam],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: ApplicationSchema } },
      },
      404: {
        description: "Not found",
        content: { "application/json": { schema: ErrorSchema } },
      },
    },
  });

  // GET /applications
  registry.registerPath({
    method: "get",
    path: "/applications",
    summary: "List applications",
    request: { query: ListQuery },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: ApplicationListSchema } },
      },
    },
  });
}
