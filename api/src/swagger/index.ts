import type { Express } from "express";
import { generateOpenAPIDocument } from "./registry.js";

export async function mountSwagger(app: Express) {
  const enable =
    process.env.ENABLE_DOCS === "true" || process.env.NODE_ENV !== "production";
  if (!enable) return;

  const swaggerUi = (await import("swagger-ui-express")).default;
  const spec = generateOpenAPIDocument();

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
  app.get("/openapi.json", (_req, res) => res.json(spec));
}
