# 🚀 Deployment Guide

## Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Git Integration

1. Push this repo to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

## Manual Build Verification

```bash
# Build the project
npm run build

# Output will be in dist/
# Verify with:
ls dist/
```

## Demo URL

After deployment, your demo will be live at:
`https://solana-booking-agent-[username].vercel.app`

## Testing the Demo

1. **Connect Wallet**: Click "Select Wallet" → Choose Phantom/Solflare
2. **Search Hotels**: Type queries like:
   - "beach resort in Miami"
   - "luxury hotel with pool under $200"
   - "Bali spiritual retreat"
3. **Book a Room**: Select nights → Click "Book with Solana Pay"

## Environment Variables (Production)

For mainnet deployment, create `.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

## Troubleshooting

### Build fails
- Clear `.next/` and `dist/` folders
- Run `npm install` to ensure dependencies
- Check `next.config.js` has `output: 'export'`

### Wallet connection issues
- Ensure you're using Devnet for demo
- Have test SOL in your wallet

## Files Changed

- `next.config.js` - Static export config
- `vercel.json` - Vercel deployment config
- `app/page.tsx` - Enhanced hotel demo data
- `components/HotelCard.tsx` - Booking flow with night selector
- `README.md` - Complete documentation
- `DEMO.md` - Demo walkthrough & video script
- `LICENSE` - MIT License
