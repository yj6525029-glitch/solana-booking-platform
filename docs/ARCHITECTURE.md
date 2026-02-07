# Architecture Documentation

## System Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   User Query    │────▶│  AI Search   │────▶│ Filter Hotels   │
│ (Natural Lang)  │     │   (NVIDIA)   │     │                 │
└─────────────────┘     └──────────────┘     └─────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Confirmation   │◁────│  Solana Pay │◁────│  Book Room NFT  │
│   + Receipt     │     │ Transaction │     │   (cNFT Mint)   │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Blockchain | Solana Web3.js + Wallet Adapter |
| NFT | Metaplex UMI + cNFTs |
| Payments | Solana Pay |
| Smart Contracts | Anchor Framework (Rust) |
| AI | NVIDIA NIM (configured) |

## Project Structure

```
solana-booking-agent/
├── app/
│   ├── page.tsx              # Main booking interface
│   ├── layout.tsx            # Root layout
│   ├── providers.tsx         # Solana wallet setup
│   ├── globals.css           # Global styles
│   └── dashboard/
│       ├── client/           # Client dashboard
│       └── hotel/            # Hotel dashboard
├── components/
│   ├── HotelCard.tsx         # Hotel listing card
│   ├── WalletButton.tsx      # Wallet connection
│   └── dashboard/
│       └── Sidebar.tsx       # Dashboard navigation
├── anchor/
│   └── programs/
│       └── solana_booking_agent/
│           └── src/
│               └── lib.rs    # Anchor program
├── data/
│   └── hotels.json           # Demo hotel data
├── docs/                     # Documentation
└── public/                   # Static assets
```

## Anchor Program Structure

**Program ID:** `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

- Escrow management
- Booking state validation
- Payment release conditions

## Network Configuration

| Environment | Cluster | RPC Endpoint |
|-------------|---------|--------------|
| Demo | Devnet | https://api.devnet.solana.com |
| Production | Mainnet | TBD |
