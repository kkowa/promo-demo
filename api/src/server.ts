import express, { application } from "express";
import cors from "cors";
import applications from "./routes/applications.js";
import { getDb } from "./db.js";

// Basic Express server setup
const app = express();
// Use environment variable PORT or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get("/api/promo", (req, res) => {
  res.json({ message: "Welcome to the Promo API!" });
});

// Health check endpoint
app.get("/health", async (_req, res) => {
  try {
    // Simulate db connection
    await (await getDb()).command({ ping: 1 });
    // If successful, return ok: true
    res.json({ ok: true });
  } catch (error) {
    // If there's an error, return ok: false with status 500
    res.status(500).json({ ok: false });
  }
});

app.use("/applications", applications);
// Import and use the applications router
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
