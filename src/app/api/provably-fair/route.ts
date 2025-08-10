import { NextRequest, NextResponse } from "next/server";
import {
  computeOutcome,
  createRoundId,
  generateServerSeed,
  getRound,
  sha256Hex,
  storeRound,
} from "@/lib/provablyFair";

// POST /api/provably-fair
// Body: { clientSeed?: string, nonce?: number, roundId?: string }
// If roundId missing, create one and return serverHash (commit). If present, compute outcome.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const clientSeed: string = String(body.clientSeed ?? "");
    const nonce: number = Number.isFinite(body.nonce) ? Number(body.nonce) : 0;
    const roundId: string | undefined = body.roundId;

    if (!roundId) {
      const newRoundId = createRoundId();
      const serverSeed = generateServerSeed();
      storeRound(newRoundId, serverSeed);
      const serverHash = sha256Hex(serverSeed);
      return NextResponse.json({ roundId: newRoundId, serverHash });
    }

    const record = getRound(roundId);
    if (!record) {
      return NextResponse.json(
        { error: "Unknown roundId. Start a new round." },
        { status: 400 }
      );
    }

    const { hashHex, outcome } = computeOutcome(
      record.serverSeed,
      clientSeed,
      nonce
    );
    return NextResponse.json({
      roundId,
      hashHex,
      outcome,
      // Do not reveal serverSeed here; provide a separate reveal endpoint.
    });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}


