"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { ThreeSceneRef } from "./SimpleThreeScene";
import { 
  getTreasuryStats, 
  processEntry, 
  ENTRY_FEE_SOL,
  WINNER_PERCENTAGE,
  HOUSE_FEE_PERCENTAGE,
  TreasuryStats
} from "@/lib/solanaTransactions";
import { 
  initAudio, 
  playCoinFlip, 
  playWinSound, 
  playLoseSound, 
  playClickSound, 
  playErrorSound 
} from "@/lib/sounds";

type StartRoundResponse = { roundId: string; serverHash: string };
type OutcomeResponse = { roundId: string; hashHex: string; outcome: "HEADS" | "TAILS" };
type RevealResponse = { roundId: string; serverSeed: string };

interface HUDProps {
  sceneRef?: React.RefObject<ThreeSceneRef | null>;
}

export default function HUD({ sceneRef }: HUDProps) {
  const { connected, publicKey, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [clientSeed, setClientSeed] = useState<string>("");
  const [roundId, setRoundId] = useState<string | null>(null);
  const [serverHash, setServerHash] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);
  const [outcome, setOutcome] = useState<string | null>(null);
  const [lastHash, setLastHash] = useState<string | null>(null);
  const [revealedSeed, setRevealedSeed] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [hasPaidEntry] = useState<boolean>(false); // Keep for legacy flip function
  const [isProcessingGame, setIsProcessingGame] = useState<boolean>(false);
  const [treasuryStats, setTreasuryStats] = useState<TreasuryStats>(getTreasuryStats());

  useEffect(() => {
    // Autogenerate a strong cryptographic client seed if not provided
    if (!clientSeed) {
      const random = globalThis.crypto?.getRandomValues?.(new Uint32Array(8)); // More entropy
      const seed = random
        ? Array.from(random)
            .map((n) => n.toString(16).padStart(8, "0"))
            .join("")
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
      setClientSeed(seed);
    }
  }, [clientSeed]);

  // Update treasury stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTreasuryStats(getTreasuryStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);



  async function startRound() {
    try {
      playClickSound(); // Button click sound
      
      const res = await fetch("/api/provably-fair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as StartRoundResponse;
      setRoundId(data.roundId);
      setServerHash(data.serverHash);
      setOutcome(null);
      setLastHash(null);
      setRevealedSeed(null);
      setNonce(0);

      // Trigger excitement animation when round starts
      if (sceneRef?.current) {
        playCoinFlip(); // Coin flip sound
        // Quick teaser flip to show the coin is ready
        await sceneRef.current.flipCoin("HEADS");
      }
    } catch (error) {
      console.error("Failed to start round:", error);
      playErrorSound();
      alert("Failed to start round. Please try again.");
    }
  }

  async function playCompleteGame() {
    if (!roundId || !connected || !publicKey || !signTransaction || !sendTransaction || isProcessingGame) return;
    
    // Initialize audio on user interaction
    initAudio();
    playClickSound(); // Button click sound
    
    setIsProcessingGame(true);
    setIsFlipping(true);
    
    try {
      // Check balance before attempting transaction
      const balance = await connection.getBalance(publicKey);
      const requiredLamports = ENTRY_FEE_SOL * 1_000_000_000; // Convert SOL to lamports
      const estimatedFee = 5000; // Estimate 0.000005 SOL for transaction fee
      
      if (balance < requiredLamports + estimatedFee) {
        throw new Error(`insufficient funds: need ${ENTRY_FEE_SOL} SOL + transaction fees, have ${(balance / 1_000_000_000).toFixed(4)} SOL`);
      }
      // First, get the flip outcome
      const res = await fetch("/api/provably-fair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId, clientSeed, nonce }),
      });
      const data = (await res.json()) as OutcomeResponse;
      
      const isWinner = data.outcome === "HEADS";
      
      // Create single transaction with entry fee + potential payout
      const { createGameTransaction } = await import("@/lib/solanaTransactions");
      const transaction = createGameTransaction(publicKey, isWinner);
      
      // Set up transaction
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send single transaction
      const signedTransaction = await signTransaction(transaction);
      const signature = await sendTransaction(signedTransaction, connection);
      
      // Confirm transaction
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      // Play coin flip sound and trigger animation
      playCoinFlip();
      if (sceneRef?.current) {
        await sceneRef.current.flipCoin(data.outcome);
      }
      
      // Update state
      setOutcome(data.outcome);
      setLastHash(data.hashHex);
      setNonce((n) => n + 1);
      
      // Process entry payment
      processEntry(signature);
      setTreasuryStats(getTreasuryStats());
      
      // Show result with appropriate sound
      if (isWinner) {
        playWinSound();
        console.log(`🎉 WINNER! Transaction: ${signature}`);
        alert(`🎉 YOU WON! Check your wallet for winnings!`);
      } else {
        playLoseSound();
        console.log(`💥 Better luck next time! Transaction: ${signature}`);
      }
      
    } catch (error: unknown) {
      console.error("Game transaction failed:", error);
      
      // Better error messages based on common issues
      let errorMessage = "Game transaction failed. Please try again.";
      
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes("insufficient")) {
        errorMessage = `❌ Insufficient Balance!\n\nYou need at least ${ENTRY_FEE_SOL} SOL to play.\nPlease add more SOL to your wallet.`;
      } else if (errorMsg.includes("rejected") || errorMsg.includes("cancelled")) {
        errorMessage = "❌ Transaction cancelled by user.";
      } else if (errorMsg.includes("blockhash")) {
        errorMessage = "❌ Transaction expired. Please try again.";
      } else if (errorMsg.includes("network")) {
        errorMessage = "❌ Network error. Check your connection and try again.";
      }
      
      playErrorSound();
      alert(errorMessage);
    } finally {
      setIsProcessingGame(false);
      setIsFlipping(false);
    }
  }

  // Legacy function for manual entry payment
  async function flipOnce() {
    if (!roundId || !connected || isFlipping || !hasPaidEntry) return;
    
    setIsFlipping(true);
    try {
      const res = await fetch("/api/provably-fair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId, clientSeed, nonce }),
      });
      const data = (await res.json()) as OutcomeResponse;
      
      // Trigger coin flip animation
      if (sceneRef?.current) {
        await sceneRef.current.flipCoin(data.outcome);
      }
      
      setOutcome(data.outcome);
      setLastHash(data.hashHex);
      setNonce((n) => n + 1);
      
      // Show win celebration
      if (data.outcome === "HEADS") {
        console.log(`🎉 WINNER! You could win ${treasuryStats.availableWinnings.toFixed(3)} SOL!`);
      }
    } finally {
      setIsFlipping(false);
    }
  }

  async function reveal() {
    if (!roundId) return;
    const res = await fetch("/api/provably-fair/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roundId }),
    });
    const data = (await res.json()) as RevealResponse;
    setRevealedSeed(data.serverSeed);
  }

  if (!connected) {
    return (
      <div className="w-full mt-6">
        <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 backdrop-blur p-6 text-center">
          <div className="text-lg font-medium text-yellow-300 mb-2">
            🔐 Connect Wallet to Play
          </div>
          <p className="text-sm opacity-70">
            Connect any Solana wallet to start flipping coins with provably fair randomness.
          </p>
        </div>
      </div>
    );
  }

  // Show treasury stats at top
  const treasuryStatsSection = (
    <div className="w-full mt-6 mb-4">
      <div className="rounded-xl border border-purple-400/30 bg-purple-500/10 backdrop-blur p-4">
        <h3 className="text-lg font-medium text-purple-300 mb-3">💰 Treasury Pool</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{treasuryStats.totalPool.toFixed(2)}</div>
            <div className="text-xs opacity-70">Total Pool (SOL)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-300">{treasuryStats.availableWinnings.toFixed(2)}</div>
            <div className="text-xs opacity-70">Winnings ({(WINNER_PERCENTAGE * 100).toFixed(0)}%)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-300">{(treasuryStats.totalPool * HOUSE_FEE_PERCENTAGE).toFixed(2)}</div>
            <div className="text-xs opacity-70">House Fee ({(HOUSE_FEE_PERCENTAGE * 100).toFixed(0)}%)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">{treasuryStats.entryCount}</div>
            <div className="text-xs opacity-70">Players</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {treasuryStatsSection}
      
      <div className="w-full grid gap-3 sm:gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs opacity-70">Live round commit (SHA-256)</div>
              <div className="font-mono break-all text-emerald-300">
                {serverHash ?? "—"}
              </div>
            </div>
            <button
              onClick={startRound}
              className="px-4 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-400 text-black font-medium"
            >
              Start round
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 text-sm">
          <div className="grid gap-3">
            <label className="grid gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-70">Client seed (for provably fair verification)</span>
                <span className="text-xs text-cyan-300">✓ Safe to share</span>
              </div>
              <input
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
                className="bg-black/30 border border-white/10 rounded-md px-3 py-2 font-mono text-sm"
                placeholder="your-random-seed"
              />
              <div className="text-xs opacity-50 text-emerald-300">
                💡 This seed is combined with server seed to ensure fair randomness. Change it anytime for extra security.
              </div>
            </label>

            {/* Single Transaction Game Button */}
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-4 text-center">
                <div className="text-lg font-bold text-cyan-300 mb-2">
                  🎲 Play & Pay in One Transaction
                </div>
                <p className="text-xs opacity-80 mb-3">
                  Pay <span className="font-bold text-cyan-300">{ENTRY_FEE_SOL} SOL</span> and play instantly.
                  <br />
                  If you win, winnings are paid back in the same transaction!
                </p>
                <button
                  onClick={playCompleteGame}
                  disabled={!roundId || isProcessingGame}
                  className="px-6 py-3 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold flex items-center gap-2 mx-auto"
                >
                  {isProcessingGame ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Processing Game...
                    </>
                  ) : (
                    `Play & Pay ${ENTRY_FEE_SOL} SOL (nonce ${nonce})`
                  )}
                </button>
              </div>
              
              {/* Legacy flip button for manual mode */}
              <div className="flex items-center gap-3">
                <button
                  onClick={flipOnce}
                  disabled={!roundId || isFlipping || !hasPaidEntry}
                  className="px-4 py-2 rounded-lg bg-gray-500/90 hover:bg-gray-400 disabled:opacity-40 text-black font-medium flex items-center gap-2"
                >
                  {isFlipping ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Flipping...
                    </>
                  ) : (
                    `Manual Flip (legacy)`
                  )}
                </button>
                <button
                  onClick={reveal}
                  disabled={!roundId}
                  className="px-4 py-2 rounded-lg bg-white/80 hover:bg-white text-black disabled:opacity-40 font-medium"
                >
                  Reveal server seed
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className={`rounded-lg border p-3 ${
                outcome === "HEADS" 
                  ? "bg-emerald-500/20 border-emerald-400/50" 
                  : outcome === "TAILS" 
                  ? "bg-red-500/20 border-red-400/50"
                  : "bg-black/30 border-white/10"
              }`}>
                <div className="opacity-70">Outcome</div>
                <div className="mt-1 text-lg font-semibold flex items-center gap-2">
                  {outcome === "HEADS" && "🎉 HEADS (WIN!)"}
                  {outcome === "TAILS" && "💥 TAILS (LOSS)"}
                  {!outcome && "—"}
                </div>
                {outcome === "HEADS" && (
                  <div className="text-xs text-emerald-300 mt-1">
                    Winnings: {treasuryStats.availableWinnings.toFixed(3)} SOL
                  </div>
                )}
              </div>
              <div className="rounded-lg bg-black/30 border border-white/10 p-3 sm:col-span-2">
                <div className="opacity-70">Last preimage hash</div>
                <div className="mt-1 font-mono break-all">{lastHash ?? "—"}</div>
              </div>
            </div>

            {revealedSeed && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-400/30 p-3">
                <div className="text-xs opacity-70">Server seed (verify by SHA-256)</div>
                <div className="font-mono break-all">{revealedSeed}</div>
                <div className="mt-2 pt-2 border-t border-emerald-400/20">
                  <a
                    href="/verify"
                    className="text-xs text-emerald-300 hover:text-emerald-200 underline"
                  >
                    → Verify this result independently
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


