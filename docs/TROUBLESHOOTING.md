# Troubleshooting

## Wallet Won't Connect
- Switch wallet to Devnet
- Use RPC: `https://api.devnet.solana.com`
- Refresh and reconnect

## Payment QR Blank
- Connect wallet first
- Check browser console for errors
- Allow pop-ups

## NFT Mint Fails
Need devnet SOL. Get from faucet:
```bash
solana airdrop 2 <WALLET> --url devnet
```
Requires ~0.02 SOL per mint.

## Type Error BigNumber
Convert to string before BigNumber:
```typescript
const amount = lamports.toString();
```
