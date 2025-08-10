"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Text, Float } from "@react-three/drei";
import { Suspense, useRef, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

export interface CoinRef {
  flip: (outcome: "HEADS" | "TAILS") => Promise<void>;
}

function RealisticCoin() {
  const coinRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (coinRef.current) {
      coinRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      coinRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={coinRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      {/* Main coin body - enhanced with better materials */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.15, 64]} />
        <meshStandardMaterial 
          color="#DAA520"
          metalness={0.95}
          roughness={0.08}
          emissive="#FFD700"
          emissiveIntensity={0.02}
          envMapIntensity={1.2}
        />
      </mesh>
      
      {/* Enhanced beveled edge with gradient */}
      <mesh castShadow>
        <cylinderGeometry args={[1.02, 0.98, 0.15, 64]} />
        <meshStandardMaterial 
          color="#B8860B"
          metalness={0.98}
          roughness={0.03}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* HEADS SIDE - Enhanced SOL Logo */}
      <group position={[0, 0.076, 0]}>
        {/* Outer rim with enhanced material */}
        <mesh>
          <cylinderGeometry args={[0.85, 0.85, 0.01, 32]} />
          <meshStandardMaterial 
            color="#654321"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1.0}
          />
        </mesh>
        
        {/* Inner background with gradient effect */}
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.01, 32]} />
          <meshStandardMaterial 
            color="#FFD700"
            metalness={0.9}
            roughness={0.15}
            emissive="#FFA500"
            emissiveIntensity={0.1}
            envMapIntensity={1.3}
          />
        </mesh>
        
        {/* Enhanced SOL text with better depth */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.025, 16]} />
          <meshStandardMaterial 
            color="#4B0082"
            metalness={0.7}
            roughness={0.3}
            envMapIntensity={1.1}
          />
        </mesh>
        
        {/* Enhanced Solana gradient bars with better positioning */}
        <mesh position={[-0.15, 0.012, 0.2]}>
          <boxGeometry args={[0.3, 0.035, 0.025]} />
          <meshStandardMaterial 
            color="#00D4FF" 
            metalness={0.9}
            roughness={0.1}
            emissive="#00D4FF"
            emissiveIntensity={0.15}
          />
        </mesh>
        
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.25, 0.035, 0.025]} />
          <meshStandardMaterial 
            color="#9945FF" 
            metalness={0.9}
            roughness={0.1}
            emissive="#9945FF"
            emissiveIntensity={0.15}
          />
        </mesh>
        
        <mesh position={[0.15, 0.012, -0.2]}>
          <boxGeometry args={[0.3, 0.035, 0.025]} />
          <meshStandardMaterial 
            color="#14F195" 
            metalness={0.9}
            roughness={0.1}
            emissive="#14F195"
            emissiveIntensity={0.15}
          />
        </mesh>
        
        {/* Added subtle inner ring for depth */}
        <mesh position={[0, 0.008, 0]}>
          <ringGeometry args={[0.4, 0.35, 32]} />
          <meshStandardMaterial 
            color="#B8860B"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
      
      {/* TAILS SIDE - Enhanced Solana Network Symbol */}
      <group position={[0, -0.076, 0]} rotation={[Math.PI, 0, 0]}>
        {/* Enhanced outer rim */}
        <mesh>
          <cylinderGeometry args={[0.85, 0.85, 0.01, 32]} />
          <meshStandardMaterial 
            color="#654321"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1.0}
          />
        </mesh>
        
        {/* Enhanced inner background */}
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.01, 32]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            metalness={0.95}
            roughness={0.08}
            envMapIntensity={1.2}
          />
        </mesh>
        
        {/* Enhanced central hexagon */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.025, 6]} />
          <meshStandardMaterial 
            color="#9945FF"
            metalness={0.8}
            roughness={0.15}
            emissive="#9945FF"
            emissiveIntensity={0.25}
            envMapIntensity={1.3}
          />
        </mesh>
        
        {/* Enhanced network nodes with better glow */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 0.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <mesh key={i} position={[x, 0.012, z]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial 
                color="#00D4FF" 
                metalness={0.9}
                roughness={0.1}
                emissive="#00D4FF"
                emissiveIntensity={0.4}
                envMapIntensity={1.2}
              />
            </mesh>
          );
        })}
        
        {/* Enhanced connection lines */}
        {[...Array(4)].map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          const x = Math.cos(angle) * 0.35;
          const z = Math.sin(angle) * 0.35;
          return (
            <mesh key={i} position={[x, 0.008, z]} rotation={[0, angle, 0]}>
              <boxGeometry args={[0.15, 0.008, 0.015]} />
              <meshStandardMaterial 
                color="#14F195" 
                metalness={0.95}
                roughness={0.05}
                emissive="#14F195"
                emissiveIntensity={0.2}
              />
            </mesh>
          );
        })}
        
        {/* Added inner network pattern */}
        <mesh position={[0, 0.008, 0]}>
          <ringGeometry args={[0.3, 0.25, 32]} />
          <meshStandardMaterial 
            color="#00D4FF"
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
      
      {/* Enhanced edge serrations with better detail */}
      {[...Array(48)].map((_, i) => {
        const angle = (i / 48) * Math.PI * 2;
        const x = Math.cos(angle) * 1.01;
        const z = Math.sin(angle) * 1.01;
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.015, 0.15, 0.015]} />
            <meshStandardMaterial 
              color="#CD853F"
              metalness={0.9}
              roughness={0.15}
              envMapIntensity={1.1}
            />
          </mesh>
        );
      })}
      
      {/* Added subtle rim highlight */}
      <mesh position={[0, 0.075, 0]}>
        <ringGeometry args={[0.99, 0.98, 64]} />
        <meshStandardMaterial 
          color="#FFD700"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      <mesh position={[0, -0.075, 0]}>
        <ringGeometry args={[0.99, 0.98, 64]} />
        <meshStandardMaterial 
          color="#FFD700"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

const Coin = forwardRef<CoinRef>((props, ref) => {
  const coinRef = useRef<THREE.Group>(null);
  const isFlipping = useRef(false);

  useImperativeHandle(ref, () => ({
    flip: async (outcome: "HEADS" | "TAILS") => {
      if (!coinRef.current || isFlipping.current) return;
      
      isFlipping.current = true;
      const coin = coinRef.current;
      
      // Determine final rotation based on outcome
      const finalRotationX = outcome === "HEADS" ? 0 : Math.PI;
      const spins = 3 + Math.random() * 2; // 3-5 spins
      const totalRotationX = spins * Math.PI * 2 + finalRotationX;
      
      // Create flip timeline
      const tl = gsap.timeline();
      
      // Launch upward with spin
      tl.to(coin.position, {
        y: 3,
        duration: 0.8,
        ease: "power2.out"
      })
      .to(coin.rotation, {
        x: totalRotationX,
        y: coin.rotation.y + Math.PI * 2 * 2,
        duration: 1.6,
        ease: "power2.inOut"
      }, 0)
      // Fall down
      .to(coin.position, {
        y: 0,
        duration: 0.8,
        ease: "power2.in",
        delay: 0.8
      })
      // Bounce
      .to(coin.position, {
        y: 0.3,
        duration: 0.2,
        ease: "power2.out"
      })
      .to(coin.position, {
        y: 0,
        duration: 0.3,
        ease: "bounce.out"
      });

      await tl.then(() => {
        isFlipping.current = false;
      });
    }
  }));

  // Enhanced idle animation
  useFrame((state) => {
    if (coinRef.current && !isFlipping.current) {
      // Smooth rotation
      coinRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      
      // Gentle floating motion
      coinRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      
      // Subtle breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      coinRef.current.scale.setScalar(scale);
      
      // Gentle swaying
      coinRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      
      // Subtle position drift
      coinRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
      coinRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <group ref={coinRef} position={[0, 0, 0]}>
      <RealisticCoin />
    </group>
  );
});

Coin.displayName = "Coin";

export interface ThreeSceneRef {
  flipCoin: (outcome: "HEADS" | "TAILS") => Promise<void>;
}

const SimpleThreeScene = forwardRef<ThreeSceneRef>((props, ref) => {
  const coinRef = useRef<CoinRef>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useImperativeHandle(ref, () => ({
    flipCoin: async (outcome: "HEADS" | "TAILS") => {
      if (coinRef.current) {
        await coinRef.current.flip(outcome);
      }
    }
  }));

  if (!mounted) {
    return (
      <div className="h-[70vh] w-full rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading 3D Scene...</div>
      </div>
    );
  }

  return (
    <div className="h-[70vh] w-full rounded-xl overflow-hidden border border-white/10 bg-black">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <Suspense fallback={null}>
          {/* Enhanced lighting for realistic coin */}
          <ambientLight intensity={0.2} />
          
          {/* Main directional light with shadows */}
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={20}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />
          
          {/* Key light from top with golden hue */}
          <pointLight 
            position={[0, 8, 0]} 
            intensity={1.2} 
            color="#FFD700"
            distance={15}
            decay={2}
          />
          
          {/* Fill lights for details */}
          <pointLight 
            position={[-3, 3, 3]} 
            intensity={0.8} 
            color="#FFA500"
            distance={12}
            decay={2}
          />
          <pointLight 
            position={[3, 3, 3]} 
            intensity={0.8} 
            color="#FF8C00"
            distance={12}
            decay={2}
          />
          
          {/* Rim light for edge definition */}
          <pointLight 
            position={[0, 0, -5]} 
            intensity={0.6} 
            color="#FFFFFF"
            distance={10}
            decay={2}
          />
          
          {/* Accent lights for Solana colors */}
          <pointLight 
            position={[2, 1, 2]} 
            intensity={0.4} 
            color="#9945FF"
            distance={8}
            decay={2}
          />
          <pointLight 
            position={[-2, 1, 2]} 
            intensity={0.4} 
            color="#00D4FF"
            distance={8}
            decay={2}
          />
          
          {/* Additional accent lights for depth */}
          <pointLight 
            position={[0, -2, 3]} 
            intensity={0.3} 
            color="#14F195"
            distance={6}
            decay={2}
          />
          
          {/* The enhanced realistic coin */}
          <Coin ref={coinRef} />
          
          {/* Floating particles around the coin for magical effect */}
          {[...Array(12)].map((_, i) => (
            <Float
              key={i}
              speed={1.5}
              rotationIntensity={0.5}
              floatIntensity={0.5}
              position={[
                Math.sin(i * Math.PI * 2 / 12) * 3,
                Math.cos(i * Math.PI * 2 / 12) * 0.5 + 1,
                Math.cos(i * Math.PI * 2 / 12) * 3
              ]}
            >
              <mesh>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial 
                  color={["#FFD700", "#9945FF", "#00D4FF", "#14F195"][i % 4]}
                  emissive={["#FFD700", "#9945FF", "#00D4FF", "#14F195"][i % 4]}
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            </Float>
          ))}
          
          {/* Premium environment with better reflections */}
          <Environment preset="studio" background={false} />
          
          {/* Enhanced controls */}
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            autoRotate={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI * 2 / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

SimpleThreeScene.displayName = "SimpleThreeScene";

export default SimpleThreeScene;
