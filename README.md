# 🪙 Sol Flip Wars

**A Next-Generation 3D Web3 Coin Flip Game with Provably Fair Algorithms**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-blue)](https://threejs.org/)
[![Solana](https://img.shields.io/badge/Solana-Web3.js-orange)](https://solana.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🌟 **Overview**

Sol Flip Wars is an immersive 3D web experience that combines cutting-edge WebGL graphics with blockchain technology. Every interaction happens in a fully 3D environment - no flat UI, just pure immersive gaming with provably fair algorithms that ensure complete transparency and trust.

![Sol Flip Wars Demo](https://via.placeholder.com/800x400/1a1a1a/FFD700?text=Sol+Flip+Wars+3D+Experience)

## 🎮 **Key Features**

### **🎨 Full 3D Immersive Experience**
- **WebGL-powered 3D environment** using Three.js and React Three Fiber
- **No flat UI** - every menu, button, and interaction floats in 3D space
- **Dynamic lighting** with 7+ point lights and professional shadows
- **Floating particle effects** around the coin for magical atmosphere
- **Camera parallax** and smooth animations for premium feel

### **🪙 Premium 3D Coin**
- **Realistic metallic materials** with high metalness (0.95-0.98) and low roughness
- **Enhanced edge serrations** (48 detailed segments) for authentic coin feel
- **Dual-sided design**: HEADS (SOL logo) and TAILS (Solana network symbol)
- **Dynamic lighting reflections** with environment mapping
- **Smooth idle animations** including floating, breathing, and gentle swaying
- **Professional flip physics** with realistic spin and bounce effects

### **🔒 Provably Fair Algorithm**
- **Cryptographic transparency** using SHA-256 hashing
- **Server seed commitment** (hashed before round starts)
- **Client seed input** (player-provided for verification)
- **Nonce incrementation** to prevent repeat patterns
- **Post-game verification** with server seed reveal
- **Mathematical formula**: `outcome = (first_hex_digit_of_hash % 2) == 0 ? HEADS : TAILS`

### **💰 Solana Blockchain Integration**
- **Native SOL transactions** with bundled instruction support
- **Multiple wallet support**: Phantom, Solflare, Coinbase, Torus, Ledger, Math, Trust
- **Single transaction flow** for entry fee and potential payout
- **Real-time balance checking** and error handling
- **Treasury management** with house edge and winner calculations

### **🎵 Immersive Audio Experience**
- **Web Audio API integration** for cross-platform compatibility
- **Dynamic sound effects**: coin flip, win/loss, button clicks, errors
- **Audio initialization** on user interaction for browser compliance

## 🛠️ **Tech Stack**

### **Frontend & 3D**
- **Next.js 15.4.6** - React framework with App Router
- **TypeScript 5.0** - Type-safe development
- **Three.js** - 3D graphics and WebGL rendering
- **React Three Fiber** - React renderer for Three.js
- **GSAP** - Professional animations and timelines
- **Tailwind CSS** - Utility-first styling

### **Blockchain & Web3**
- **Solana Web3.js** - Solana blockchain interaction
- **Solana Wallet Adapter** - Multi-wallet support
- **SystemProgram.transfer** - Native SOL transactions
- **Transaction bundling** - Single signature for multiple operations

### **Backend & Security**
- **Next.js API Routes** - Server-side logic
- **crypto-js** - SHA-256 hashing implementation
- **Provably fair algorithms** - Cryptographic game fairness
- **In-memory state management** - Real-time game state

### **Development Tools**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Turbopack** - Fast development builds

## 🚀 **Installation & Setup**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Solana wallet (Phantom, Solflare, etc.)

### **Quick Start**
```bash
# Clone the repository
git clone https://github.com/Dipraise1/solflip.git
cd solflip

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### **Environment Setup**
```bash
# Optional: Set custom Solana RPC endpoint
# Create .env.local file
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## 🎯 **How to Play**

### **1. Connect Wallet**
- Click "Connect Wallet" button
- Choose your preferred Solana wallet
- Approve connection

### **2. Start a Round**
- Click "Start Round" to begin
- The system generates a server seed hash
- Your client seed is displayed for verification

### **3. Watch the Flip**
- The 3D coin performs realistic flip animation
- 3-5 spins with physics-based motion
- Bounce and settle effects

### **4. Verify Results**
- Outcome is displayed (HEADS/TAILS)
- Server seed is revealed for verification
- Use verification tools to confirm fairness

## 🔍 **Provably Fair Verification**

### **Verification Formula**
```javascript
// Combine all seeds and nonce
const combined = serverSeed + clientSeed + nonce;

// Generate SHA-256 hash
const hash = SHA256(combined);

// Determine outcome from first hex digit
const firstHex = hash.charAt(0);
const outcome = (parseInt(firstHex, 16) % 2) === 0 ? "HEADS" : "TAILS";
```

### **Verification Steps**
1. **Before flip**: Server seed hash is shown
2. **During game**: Client seed and nonce are visible
3. **After flip**: Original server seed is revealed
4. **Verify**: Recalculate hash locally to confirm result

## 🎨 **3D Coin Design Details**

### **HEADS Side (SOL Logo)**
- **Outer rim**: Dark brown metallic ring
- **Inner background**: Golden metallic surface
- **SOL text**: Raised indigo cylinder with depth
- **Gradient bars**: Solana brand colors (cyan, purple, green)
- **Inner ring**: Subtle depth enhancement

### **TAILS Side (Network Symbol)**
- **Outer rim**: Matching dark brown metallic
- **Inner background**: Deep black metallic surface
- **Central hexagon**: Purple emissive Solana symbol
- **Network nodes**: 8 cyan glowing spheres
- **Connection lines**: Green network pathways
- **Inner pattern**: Subtle network visualization

### **Edge Details**
- **48 serrations**: Realistic coin edge texture
- **Rim highlights**: Subtle golden edge lighting
- **Material properties**: High metalness, low roughness
- **Environment mapping**: Professional reflections

## 🔧 **Development Commands**

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Dependencies
npm install          # Install packages
npm update           # Update packages
```

## 📁 **Project Structure**

```
solflip/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── provably-fair/ # Game logic endpoints
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main game page
│   │   └── verify/            # Verification page
│   ├── components/             # React components
│   │   ├── SimpleThreeScene.tsx # 3D scene and coin
│   │   ├── HUD.tsx            # Game interface
│   │   ├── WalletConnection.tsx # Wallet integration
│   │   └── WalletProvider.tsx # Wallet context
│   └── lib/                   # Utility libraries
│       ├── provablyFair.ts    # Fairness algorithms
│       ├── solanaTransactions.ts # Blockchain logic
│       └── sounds.ts          # Audio utilities
├── public/                     # Static assets
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🌟 **Features in Detail**

### **Realistic Physics**
- **Coin flip animation**: 3-5 realistic spins
- **Gravity simulation**: Natural falling motion
- **Bounce physics**: Realistic settling behavior
- **Rotation dynamics**: Multiple axis rotation

### **Advanced Lighting**
- **7+ point lights**: Strategic positioning for depth
- **Directional shadows**: Professional shadow mapping
- **Color temperature**: Warm golden key lighting
- **Distance decay**: Realistic light falloff

### **Performance Optimizations**
- **Efficient geometries**: Optimized 3D models
- **Material pooling**: Shared material instances
- **Frame rate management**: Smooth 60fps animations
- **Memory management**: Proper cleanup and disposal

## 🔮 **Future Enhancements**

### **Planned Features**
- **VR support** for immersive headsets
- **Mobile optimization** for touch devices
- **Multiplayer mode** with real-time opponents
- **Tournament system** with leaderboards
- **NFT integration** for collectible coins
- **Advanced VRF** using Solana's built-in randomness

### **Technical Improvements**
- **WebGPU support** for next-gen graphics
- **Advanced shaders** for realistic materials
- **Audio spatialization** for 3D sound
- **Performance monitoring** and analytics

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Three.js community** for amazing 3D graphics library
- **Solana team** for fast and secure blockchain
- **Next.js team** for excellent React framework
- **Open source contributors** who made this possible

## 📞 **Support & Contact**

- **GitHub Issues**: [Report bugs or request features](https://github.com/Dipraise1/solflip/issues)
- **Discord**: Join our community for discussions
- **Email**: Contact us for business inquiries

---

**🎮 Ready to experience the future of Web3 gaming? Connect your wallet and start flipping! 🪙✨**

*Built with ❤️ using Next.js, Three.js, and Solana*
