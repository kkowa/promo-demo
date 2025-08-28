// src/server.ts
import express from "express";
import cors from "cors";
import applications from "./routes/applications.js";
import { getDb } from "./db.js";
import { mountSwagger } from "./swagger/index.js";

(async () => {
  try {
    const app = express();
    const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

    app.use(cors());
    app.use(express.json());

    app.get("/api/promo", (_req, res) => {
      res.json({ message: "Welcome to the Promo API!" });
    });

    app.get("/health", async (_req, res) => {
      try {
        await (await getDb()).command({ ping: 1 });
        res.json({ ok: true });
      } catch (e) {
        res.status(500).json({ ok: false });
      }
    });

    app.use("/applications", applications);

    await mountSwagger(app);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("BOOTSTRAP FAILURE:", err);
    process.exit(1);
  }
})();
