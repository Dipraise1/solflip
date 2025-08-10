"use client";

import { useRef } from "react";
import SimpleThreeScene, { ThreeSceneRef } from "@/components/SimpleThreeScene";
import HUD from "@/components/HUD";
import WalletConnection from "@/components/WalletConnection";

export default function Home() {
  const sceneRef = useRef<ThreeSceneRef>(null);
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-[#030712] to-black text-white p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Sol Flip Wars</h1>
            <p className="text-sm opacity-70">Immersive 3D. Provably fair.</p>
          </div>
          <WalletConnection />
        </header>
        <SimpleThreeScene ref={sceneRef} />
        <HUD sceneRef={sceneRef} />
      </div>
    </div>
  );
}
