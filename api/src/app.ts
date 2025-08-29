// src/app.ts
import express from "express";
import cors from "cors";
import applications from "./routes/applications.js";
import { getDb as realGetDb } from "./db.js";
import { mountSwagger as realMountSwagger } from "./swagger/index.js";

type Deps = {
  getDb?: typeof realGetDb;
  mountSwagger?: typeof realMountSwagger;
};

export default async function createApp({
  getDb = realGetDb,
  mountSwagger = realMountSwagger,
}: Deps = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/promo", (_req, res) =>
    res.json({ message: "Welcome to the Promo API!" })
  );

  app.get("/health", async (_req, res) => {
    try {
      await (await getDb()).command({ ping: 1 });
      res.json({ ok: true });
    } catch {
      res.status(500).json({ ok: false });
    }
  });

  app.use("/applications", applications);

  await mountSwagger(app).catch((e) => console.warn("Docs disabled:", e));
  return app;
}
