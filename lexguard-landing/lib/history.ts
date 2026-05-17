import { db } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import type { FinalClause } from "@/lib/types";

export interface AnalysisRecord {
  id?: string;
  userId: string;
  userName: string;
  userRole: string;
  fileName: string;
  riskScore: number;
  counts: { high: number; medium: number; low: number };
  clauses: FinalClause[];
  analyzedAt: number; // epoch ms
}

export async function saveAnalysis(record: Omit<AnalysisRecord, "id">): Promise<string> {
  try {
    const ref = await db.collection("analyses").add({
      ...record,
      _ts: FieldValue.serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    // Non-fatal — don't break the analysis if history save fails
    console.warn("[history] save failed:", err);
    return "";
  }
}

export async function getUserHistory(userId: string, limit = 10): Promise<AnalysisRecord[]> {
  try {
    const snap = await db
      .collection("analyses")
      .where("userId", "==", userId)
      .orderBy("analyzedAt", "desc")
      .limit(limit)
      .get();

    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AnalysisRecord));
  } catch (err) {
    console.warn("[history] read failed:", err);
    return [];
  }
}
