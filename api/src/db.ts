import { MongoClient, Db } from "mongodb";
import type { Application } from "./types.js";

let client: MongoClient | undefined;

export async function getDb(): Promise<Db> {
  try {
    if (!client) {
      const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
      client = new MongoClient(uri);
      await client.connect();
      console.log("Connected to MongoDB");
    }
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
    throw e;
  }

  const dbName = process.env.MONGO_DB || "promo";
  return client.db(dbName);
}

async function seed() {
  const db = await getDb();

  // --- Users ---
  const users = db.collection("users");
  await users.updateOne(
    {
      $setOnInsert: {
        _id: "mgr_1",
        email: "manager@example.com",
        name: "Manager One",
        role: "manager",
        joinDate: new Date("2020-07-15T00:00:00.000Z"),
        certifications: [],
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  await users.updateOne(
    {
      $setOnInsert: {
        _id: "emp_1",
        email: "employee@example.com",
        name: "Employee One",
        role: "employee",
        joinDate: new Date("2018-06-15T00:00:00.000Z"),
        certifications: ["aws-cp", "scrum-mastery"],
        createdAt: new Date(),
        managerId: "mgr_1",
      },
    },
    { upsert: true }
  );

  // --- Applications ---
  const applications = db.collection<Application>("applications");

  // optional: ensure a helpful index
  await applications.createIndex({ employeeId: 1, submittedAt: -1 });

  const now = new Date();
  const appDocs: Application[] = [
    {
      // _id left to Mongo (ObjectId)
      employeeId: "emp_1",
      managerId: "mgr_1",
      status: "SUBMITTED",
      fields: {
        currentLevel: "L1",
        targetLevel: "L2",
        justification:
          "Consistent delivery, shipped X and Y features with measurable impact.",
        attachments: [],
      },
      eligibility: {
        tenureDays: 365 * 6,
        certCount: 2,
        meetsTenureRule: true,
        meetsCertRule: true,
      },
      comments: [
        {
          by: "emp_1",
          when: now.toISOString(),
          text: "Submitting for consideration.",
        },
      ],
      submittedAt: now.toISOString(),
    },
    {
      employeeId: "emp_1",
      managerId: "mgr_1",
      status: "MANAGER_REVIEW",
      fields: {
        currentLevel: "L2",
        targetLevel: "L3",
        justification: "Led migration to Node 22, reduced infra cost 15%.",
      },
      eligibility: {
        tenureDays: 365 * 7,
        certCount: 3,
        meetsTenureRule: true,
        meetsCertRule: true,
      },
      comments: [
        {
          by: "emp_1",
          when: now.toISOString(),
          text: "Following up with more evidence.",
        },
        { by: "mgr_1", when: now.toISOString(), text: "Review in progress." },
      ],
      submittedAt: new Date(
        now.getTime() - 1000 * 60 * 60 * 24 * 30
      ).toISOString(), // ~30 days ago
    },
  ];

  // idempotent-ish seeding: wipe demo docs for these users then insert
  await applications.deleteMany({ employeeId: "emp_1" });
  await applications.insertMany(appDocs as any);

  console.log(
    "✅ Seed complete: users (mgr_1, emp_1) and sample applications inserted"
  );
}

if (process.argv.includes("--seed")) {
  seed()
    .then(async () => {
      // close underlying client if you keep it global in getDb()
      const db = await getDb();
      await (db as any).client?.close?.();
    })
    .catch((err) => {
      console.error("Seed failed:", err);
      process.exit(1);
    });
}

export { seed };

export async function closeDb() {
  if (client) {
    await client.close();
    client = undefined;
  }
}
