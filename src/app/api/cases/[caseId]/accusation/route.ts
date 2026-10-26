import { NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoClient } from 'mongodb';

const bodySchema = z.object({ suspect: z.string().min(1).max(80), motive: z.string().min(1).max(500), evidenceIds: z.array(z.string().max(60)).length(3) });
const solution = { suspect: 'Mara Voss', motive: 'Mara feared that Elias would expose her substitution of the original Asterion Astrolabe with a replica and the falsified restoration records.', evidence: new Set(['appointment','report','computer','camera','access','witness','duty','mount','weapon','note']) };
const validEvidence = new Set(['asterion','mount','catalogue','note','appointment','report','computer','camera','maintenance','access','notebook','duty','kettle','witness','weapon']);
let client: MongoClient | null = null;

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await context.params;
  if (caseId !== 'case-001') return NextResponse.json({ error: 'Case not found.' }, { status: 404 });
  let parsed;
  try { parsed = bodySchema.safeParse(await request.json()); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!parsed.success || new Set(parsed.data.evidenceIds).size !== 3 || parsed.data.evidenceIds.some(id => !validEvidence.has(id))) return NextResponse.json({ error: 'Choose three valid evidence items.' }, { status: 400 });
  const { suspect, motive, evidenceIds } = parsed.data;
  const correctIdentity = suspect === solution.suspect && motive === solution.motive;
  const strongTheory = correctIdentity && evidenceIds.filter(id => solution.evidence.has(id)).length >= 2;
  const correct = correctIdentity && strongTheory;
  if (process.env.MONGODB_URI) {
    try {
      client ??= new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      await client.db(process.env.MONGODB_DB ?? 'paradox').collection('investigationEvents').insertOne({ caseId, eventType: 'accusation', eventData: { suspect, motive, evidenceIds, correct, strongTheory }, createdAt: new Date() });
    } catch { /* Local play continues when Atlas is unavailable; progress remains in browser storage. */ }
  }
  return NextResponse.json({ correct, identityCorrect: correctIdentity, strongTheory, message: correct ? 'The evidence holds.' : correctIdentity ? 'Your theory is right. Strengthen the evidence.' : 'Contradictions remain unresolved.' });
}
