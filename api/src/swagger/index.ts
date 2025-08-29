import type { Express } from "express";

export async function mountSwagger(app: Express) {
  const enable =
    process.env.ENABLE_DOCS === "true" || process.env.NODE_ENV !== "production";
  if (!enable) return;

  try {
    const swaggerUi = (await import("swagger-ui-express")).default;
    const { generateOpenAPIDocument } = await import("./registry.js");

    const spec = generateOpenAPIDocument();
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
    app.get("/openapi.json", (_req, res) => res.json(spec));
    console.log("📘 Swagger UI at /docs");
  } catch (err) {
    console.warn("Docs disabled (missing deps?):", (err as Error).message);
  }
}
