import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sol Flip Wars - Provably Fair 3D Coin Flipping",
  description: "Immersive 3D coin flipping game on Solana. Every flip is provably fair and verifiable on-chain. Experience the future of blockchain gaming.",
  keywords: "Solana, blockchain gaming, provably fair, 3D gaming, cryptocurrency, coin flip, Web3",
  openGraph: {
    title: "Sol Flip Wars",
    description: "Immersive 3D. Provably fair. Built on Solana.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
