import SHA256 from "crypto-js/sha256";
import { v4 as uuidv4 } from "uuid";

export type FlipOutcome = "HEADS" | "TAILS";

export function generateServerSeed(): string {
  const randomBytes = globalThis.crypto?.getRandomValues?.(new Uint32Array(8));
  if (randomBytes) {
    return Array.from(randomBytes)
      .map((n) => n.toString(16).padStart(8, "0"))
      .join("");
  }
  return uuidv4().replace(/-/g, "") + uuidv4().replace(/-/g, "");
}

export function createRoundId(): string {
  return uuidv4();
}

export function sha256Hex(input: string): string {
  return SHA256(input).toString();
}

export function computeOutcomeFromHash(hashHex: string): FlipOutcome {
  const firstHexDigit = hashHex[0];
  const value = parseInt(firstHexDigit, 16);
  return value % 2 === 0 ? "HEADS" : "TAILS";
}

export function computeOutcome(
  serverSeed: string,
  clientSeed: string,
  nonce: number
): { hashHex: string; outcome: FlipOutcome } {
  const preimage = `${serverSeed}${clientSeed}${nonce}`;
  const hashHex = sha256Hex(preimage);
  return { hashHex, outcome: computeOutcomeFromHash(hashHex) };
}

// Simple in-memory store for demo purposes. Replace with Redis/DB in production.
type RoundRecord = { serverSeed: string; createdAt: number };
const roundIdToRecord: Map<string, RoundRecord> = new Map();

export function storeRound(roundId: string, serverSeed: string): void {
  roundIdToRecord.set(roundId, { serverSeed, createdAt: Date.now() });
}

export function getRound(roundId: string): RoundRecord | undefined {
  return roundIdToRecord.get(roundId);
}

export function deleteRound(roundId: string): void {
  roundIdToRecord.delete(roundId);
}


