import { NextRequest, NextResponse } from "next/server";
import { deleteRound, getRound } from "@/lib/provablyFair";

// POST /api/provably-fair/reveal
// Body: { roundId: string }
// Reveals the serverSeed for verification and deletes it from memory.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roundId: string | undefined = body.roundId;
    if (!roundId) {
      return NextResponse.json(
        { error: "roundId is required" },
        { status: 400 }
      );
    }
    const record = getRound(roundId);
    if (!record) {
      return NextResponse.json(
        { error: "Unknown roundId" },
        { status: 404 }
      );
    }
    deleteRound(roundId);
    return NextResponse.json({ roundId, serverSeed: record.serverSeed });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}


