# Deployment Guide

## Live Demo
**URL:** https://solana-booking-agent.vercel.app

## Deploy to Vercel

### Prerequisites
- Vercel CLI: `npm i -g vercel`
- Vercel account linked

### Steps

```bash
# Navigate to project
cd solana-booking-agent

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

## Build Locally

```bash
# Install dependencies
npm install

# Build
npm run build

# Output directory: dist/
```

## Anchor Deployment

```bash
cd anchor

# Build program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Verify deployment
solana program show <PROGRAM_ID>
```

## Verification Checklist

- [ ] Vercel deployment successful
- [ ] Demo loads without errors
- [ ] Wallet connection works
- [ ] Search returns results
- [ ] Booking flow completes
- [ ] Responsive on mobile

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Node.js version (18+) |
| Wallet fails | Verify devnet RPC endpoint |
| Images not loading | Check Unsplash URLs |

## GitHub Repository
https://github.com/yj6525029-glitch/solana-booking-platform
