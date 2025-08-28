import { z } from "zod";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

import { registerCommon } from "./common.js";
import { registerApplications } from "./modules/applications.js";
import {
  ApplicationSchema,
  ApplicationListSchema,
  CreateApplicationInputSchema,
} from "../schemas/application.schema.js";

const registry = new OpenAPIRegistry();

const common = registerCommon(registry);
registerApplications(registry, common);

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV31([
    ...registry.definitions,
    ApplicationSchema,
    ApplicationListSchema,
    CreateApplicationInputSchema,
  ]);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: { title: "Promo API", version: "1.0.0" },
    servers: [{ url: `http://localhost:${process.env.PORT ?? 3000}` }],
  });
}
