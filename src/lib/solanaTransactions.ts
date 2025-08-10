import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Treasury configuration
export const TREASURY_WALLET = new PublicKey("2YH3P364XssVHVoPi8omTXdZbhVXVZvt6VSbzzkKHJNL");
export const ENTRY_FEE_SOL = 0.01; // $5 equivalent (adjust based on SOL price)
export const ENTRY_FEE_LAMPORTS = ENTRY_FEE_SOL * LAMPORTS_PER_SOL;
export const HOUSE_FEE_PERCENTAGE = 0.10; // 10%
export const WINNER_PERCENTAGE = 0.50; // 50%

export interface TreasuryStats {
  totalPool: number;
  availableWinnings: number;
  houseBalance: number;
  entryCount: number;
}

// Simple in-memory treasury (replace with database in production)
const treasuryState = {
  totalPool: 0,
  houseBalance: 0,
  entryCount: 0,
};

export function getTreasuryStats(): TreasuryStats {
  const availableWinnings = treasuryState.totalPool * WINNER_PERCENTAGE;
  return {
    totalPool: treasuryState.totalPool,
    availableWinnings,
    houseBalance: treasuryState.houseBalance,
    entryCount: treasuryState.entryCount,
  };
}

export function createSingleEntryTransaction(playerPubkey: PublicKey): Transaction {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: playerPubkey,
      toPubkey: TREASURY_WALLET,
      lamports: ENTRY_FEE_LAMPORTS,
    })
  );
  
  return transaction;
}

export function createGameTransaction(
  playerPubkey: PublicKey,
  isWinner: boolean = false
): Transaction {
  const transaction = new Transaction();
  
  // Add entry fee payment instruction
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: playerPubkey,
      toPubkey: TREASURY_WALLET,
      lamports: ENTRY_FEE_LAMPORTS,
    })
  );
  
  // If player wins, add payout instructions in the same transaction
  if (isWinner) {
    const stats = getTreasuryStats();
    const winnerAmount = Math.floor(stats.availableWinnings * LAMPORTS_PER_SOL);
    
    // Winner payout (from treasury back to player)
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: TREASURY_WALLET,
        toPubkey: playerPubkey,
        lamports: winnerAmount,
      })
    );
  }
  
  return transaction;
}

// Legacy function for backwards compatibility
export function createEntryTransaction(playerPubkey: PublicKey): Transaction {
  return createSingleEntryTransaction(playerPubkey);
}

export function processEntry(signature: string): void {
  treasuryState.totalPool += ENTRY_FEE_SOL;
  treasuryState.entryCount += 1;
  console.log(`Entry processed: ${signature}, New pool: ${treasuryState.totalPool} SOL`);
}

export function processWinnerPayout(signature: string, winnerAmount: number): void {
  const houseAmount = treasuryState.totalPool * HOUSE_FEE_PERCENTAGE;
  treasuryState.houseBalance += houseAmount;
  treasuryState.totalPool = treasuryState.totalPool - winnerAmount - houseAmount;
  console.log(`Winner payout processed: ${signature}, Remaining pool: ${treasuryState.totalPool} SOL`);
}

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}
