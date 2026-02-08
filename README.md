# 🏨 Solana Booking Agent

**AI-powered hotel booking platform using Solana blockchain to eliminate overbooking and payment errors.**

[![Solana](https://img.shields.io/badge/Solana-14F195?style=flat&logo=solana&logoColor=white)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org)

## Quick Start
```bash
npm install
npm run dev
# Open http://localhost:3000
# Connect Phantom wallet (devnet)
# Search: "beach hotel under $200"
```

---

## 🎯 Problem Statement

Traditional hotel booking systems suffer from critical issues:

- **Overbooking** due to database sync failures across OTA platforms
- **Payment errors** with manual processing and chargebacks
- **Poor customer support** availability during peak hours
- **High commissions** (15-20%) extracted by intermediaries

## 💡 Solution

| Feature | Technology | Benefit |
|---------|------------|---------|
| 🧠 AI Natural Language Search | LLM-powered queries | "Find beach resorts under $200 with pool" |
| 🎫 NFT Room Inventory | Metaplex cNFTs | Prevents double-booking, real-time availability |
| ⚡ Smart Contract Escrow | Solana Programs | Auto-refunds, instant payouts, trustless |
| 💰 Solana Pay | Fast, low-cost | Sub-second payments, $0.00025 fees |

---

## 🚀 Demo

**🌐 Live URL:** [https://solana-booking-platform.vercel.app](https://solana-booking-platform.vercel.app)

Try it: Click "Connect Wallet" → Type "luxury beach hotel in Miami under $200" → Book!

---

## 🛠️ Tech Stack

```
Frontend:  Next.js 14 + TypeScript + Tailwind CSS
Blockchain: Solana Web3.js + Wallet Adapter
NFT:       Metaplex UMI + cNFTs
Payments:  Solana Pay
AI:        NVIDIA NIM Integration
```

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/solana-booking-agent.git
cd solana-booking-agent

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   User Query    │────▶│  AI Search   │────▶│  Filter Hotels  │
│  (Natural Lang) │     │   NVIDIA     │     │                 │
└─────────────────┘     └──────────────┘     └─────────────────┘
                                                      │
                                                      ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Confirmation   │◁────│  Solana Pay  │◁────│  Book Room NFT  │
│   + Receipt     │     │  Transaction │     │  (cNFT Mint)    │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

---

## ✨ Key Features

### 🤖 AI Natural Language Booking
- Users describe their ideal hotel in plain English
- System understands price ranges, locations, amenities
- Smart matching based on preferences

### 🎫 NFT-Based Room Inventory
- Each room is a compressed NFT (cNFT)
- Real-time availability tracking
- Prevents double-booking by design
- Immutable booking records

### ⚡ Instant Solana Pay
- USDC payments processed in seconds
- Transaction fees: $0.00025
- Built-in escrow via smart contracts
- Automatic refunds for cancellations

### 🔐 Wallet Integration
- Phantom, Solflare, Torus support
- Devnet for demo purposes
- Easy wallet connection via Solana Wallet Adapter

---

## 📁 Project Structure

```
solana-booking-agent/
├── app/
│   ├── page.tsx          # Main booking interface
│   ├── layout.tsx        # Root layout with providers
│   ├── providers.tsx     # Solana wallet setup
│   └── globals.css       # Global styles
├── components/
│   ├── HotelCard.tsx     # Hotel listing card
│   └── WalletButton.tsx  # Wallet connection
├── public/
│   └── (static assets)
├── next.config.js        # Next.js configuration
├── vercel.json           # Vercel deployment config
├── tailwind.config.js    # Tailwind CSS config
└── package.json
```

---

## 🔧 Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Build
```bash
npm run build
# Output directory: dist/
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/awesome`)
3. Commit your changes (`git commit -am 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome`)
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 🏆 Submission

**Submitted for:** Colosseum Agent Hackathon 2026

**Project Type:** AI + Web3 Integration

**Team:** solo-dev

---

<p align="center">
  <strong>Built with 💜 on Solana</strong>
</p>
