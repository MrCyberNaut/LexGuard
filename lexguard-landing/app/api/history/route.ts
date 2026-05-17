import { NextRequest, NextResponse } from "next/server";
import { getUserHistory } from "@/lib/history";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  const analyses = await getUserHistory(userId, 10);
  return NextResponse.json({ analyses });
}
