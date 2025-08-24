import { MongoClient } from "mongodb";

let client: MongoClient;
export async function getDb() {
  try {
    if (!client) {
      const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
      client = new MongoClient(uri);
      await client.connect();
      console.log("Connected to MongoDB");
    }
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
  }
  return client.db(process.env.MONGODB_DB);
}
