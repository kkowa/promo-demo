import { Router } from "express";
import { z } from "zod";
import { getDb } from "../db.js";
import type { Application } from "../types.js";
import { ObjectId } from "mongodb";

const router = Router();

const CreateSchema = z.object({
  employeeId: z.string(),
  managerId: z.string(),
  fields: z.object({
    currentLevel: z.string(),
    targetLevel: z.string(),
    justification: z.string().min(10),
    attachments: z.array(z.string()).optional(),
  }),
});

router.post("/", async (req, res) => {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const db = await getDb();
  const doc: Application = {
    ...parsed.data,
    fields: {
      ...parsed.data.fields,
      attachments: parsed.data.fields.attachments ?? [],
    },
    status: "SUBMITTED",
    submittedAt: new Date().toISOString(),
    comments: [],
  };
  const result = await db.collection("applications").insertOne(doc as any);
  res.status(201).json({ id: result.insertedId.toString(), ...doc });
});

router.get("/:id", async (req, res) => {
  const db = await getDb();
  const found = await db
    .collection("applications")
    .findOne({ _id: new ObjectId(req.params.id) });
  if (!found) return res.status(404).json({ message: "Not found" });
  res.json({ id: found._id.toString(), ...found, _id: undefined });
});

export default router;
