import { MongoClient } from "mongodb";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Add MONGODB_URI to .env.local before running the seed command.");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB ?? "paradox");

    await db.collection("cases").updateOne(
      { caseId: "case-001" },
      {
        $set: {
          caseId: "case-001",
          number: "001",
          title: "The Last Light at Bellweather",
          status: "published",
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    await db.collection("playerProgress").createIndex(
      { playerKey: 1, caseId: 1 },
      { unique: true },
    );
    await db.collection("investigationEvents").createIndex({
      playerKey: 1,
      caseId: 1,
      createdAt: -1,
    });

    console.log("Seeded Case 001 metadata and player progress indexes.");
  } finally {
    await client.close();
  }
}

seed().catch((error: unknown) => {
  console.error("MongoDB seed failed:", error);
  process.exitCode = 1;
});
