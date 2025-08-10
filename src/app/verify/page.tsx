"use client";

import { useState } from "react";
import Link from "next/link";
import { sha256Hex, computeOutcomeFromHash } from "@/lib/provablyFair";

export default function VerifyPage() {
  const [serverSeed, setServerSeed] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState("");
  const [result, setResult] = useState<{
    hash: string;
    outcome: string;
    isValid: boolean;
  } | null>(null);

  function verify() {
    if (!serverSeed || !clientSeed || !nonce) return;
    
    const nonceNum = parseInt(nonce);
    if (isNaN(nonceNum)) return;

    const preimage = `${serverSeed}${clientSeed}${nonceNum}`;
    const hash = sha256Hex(preimage);
    const outcome = computeOutcomeFromHash(hash);

    setResult({
      hash,
      outcome,
      isValid: true,
    });
  }

  function clear() {
    setServerSeed("");
    setClientSeed("");
    setNonce("");
    setResult(null);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-[#030712] to-black text-white p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Verify Flip Result</h1>
          <p className="text-sm opacity-70">
            Independently verify any flip result using the server seed, client seed, and nonce.
          </p>
        </header>

        <div className="grid gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-lg font-medium mb-4">Input Parameters</h2>
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm opacity-70">Server Seed (revealed after flip)</span>
                <input
                  value={serverSeed}
                  onChange={(e) => setServerSeed(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-md px-3 py-2 font-mono text-sm"
                  placeholder="e.g., a1b2c3d4e5f6..."
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm opacity-70">Client Seed (your random input)</span>
                <input
                  value={clientSeed}
                  onChange={(e) => setClientSeed(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-md px-3 py-2 font-mono text-sm"
                  placeholder="e.g., your-random-seed"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm opacity-70">Nonce (flip number, starting from 0)</span>
                <input
                  value={nonce}
                  onChange={(e) => setNonce(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-md px-3 py-2 font-mono text-sm"
                  placeholder="e.g., 0"
                  type="number"
                  min="0"
                />
              </label>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={verify}
                  disabled={!serverSeed || !clientSeed || !nonce}
                  className="px-4 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-400 disabled:opacity-40 text-black font-medium"
                >
                  Verify Result
                </button>
                <button
                  onClick={clear}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {result && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 backdrop-blur p-6">
              <h2 className="text-lg font-medium mb-4 text-emerald-300">Verification Result</h2>
              <div className="grid gap-4 text-sm">
                <div>
                  <div className="opacity-70 mb-1">Preimage</div>
                  <div className="font-mono break-all bg-black/30 p-2 rounded border border-white/10">
                    {serverSeed}{clientSeed}{nonce}
                  </div>
                </div>

                <div>
                  <div className="opacity-70 mb-1">SHA-256 Hash</div>
                  <div className="font-mono break-all bg-black/30 p-2 rounded border border-white/10">
                    {result.hash}
                  </div>
                </div>

                <div>
                  <div className="opacity-70 mb-1">Outcome</div>
                  <div className="text-2xl font-semibold text-emerald-300">
                    {result.outcome}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    Calculated from first hex digit: {result.hash[0]} → {parseInt(result.hash[0], 16)} → {parseInt(result.hash[0], 16) % 2 === 0 ? "HEADS" : "TAILS"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 backdrop-blur p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-300">How Verification Works</h2>
            <div className="text-sm space-y-2 opacity-90">
              <p>1. <strong>Combine inputs:</strong> server_seed + client_seed + nonce</p>
              <p>2. <strong>Hash the combination:</strong> SHA-256(combined_string)</p>
              <p>3. <strong>Extract outcome:</strong> First hex digit % 2 == 0 ? HEADS : TAILS</p>
              <p className="text-xs opacity-70 mt-3">
                This algorithm ensures that outcomes are deterministic and verifiable, 
                but unpredictable until the server seed is revealed.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 font-medium transition-colors"
            >
              ← Back to Game
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
