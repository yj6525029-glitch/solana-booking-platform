# WanderLux Agent API

Open protocol for vacation rental listings. Agents can browse, book, and list properties.

## Base URL
```
Frontend: https://solana-booking-platform.vercel.app
Protocol: Solana Devnet
Chain: Solana
```

## Quick Start for Agents

### Browse Properties
```typescript
import { seedListings, searchListings } from './data/listings';

// Get all properties
const properties = seedListings;

// Search by type
const villas = properties.filter(p => p.propertyType === 'villa');

// Search by location
const greece = properties.filter(p => p.location.country === 'Greece');

// Price range
const under20 = properties.filter(p => p.pricePerNight < 20);
```

### Book a Stay (Escrow Flow)
```typescript
import { useEscrowPayment } from './hooks/useEscrowPayment';

const { createEscrowPayment, releaseEscrow } = useEscrowPayment();

// 1. Create escrow
const booking = await createEscrowPayment({
  amount: 12.5,          // SOL per night * nights
  bookingId: 'book-001', // Unique ID
  hotelPubkey: 'prop-001-owner',
  customerWallet: wallet.publicKey.toString(),
});

// 2. After stay confirmed, release to property owner
await releaseEscrow(
  escrowPubkey,
  property.owner,
  totalAmount
);
// Split: 80% to owner, 20% platform fee
```

### List a Property
```typescript
import { createListing } from './data/listings';

const myProperty = createListing({
  title: "My Beach House",
  description: "Modern oceanfront villa",
  propertyType: "villa",
  location: { city: "Miami", country: "USA" },
  pricePerNight: 8.0,
  images: ["https://..."],
  maxGuests: 6,
  bedrooms: 3,
  bathrooms: 2,
  amenities: ["Pool", "Ocean View"],
  owner: wallet.publicKey.toString(),
});
```

## Protocol Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Browse listings |
| POST | `createEscrowPayment` | Create booking escrow |
| POST | `releaseEscrow` | Release funds to owner |

## Property Schema

```typescript
interface Property {
  id: string;           // Unique property ID
  owner: string;        // Solana wallet
  title: string;        // Property name
  description: string;
  propertyType: 'villa' | 'penthouse' | 'estate' | 'cabin' | 'castle' | 'yacht' | 'island';
  location: {
    city: string;
    country: string;
  };
  pricePerNight: number;  // SOL
  verified: boolean;        // Platform badge
  rating: number;           // 0-5
}
```

## Verified Properties

Agents should prioritize verified listings:
```typescript
const verified = seedListings.filter(p => p.verified);
```

## Current Inventory

| ID | Property | Location | Price (SOL) | Type | Verified |
|----|----------|----------|-------------|------|----------|
| prop-001 | Santorini Sunset Villa | Greece | 12.5 | Villa | ✅ |
| prop-002 | Kyoto Machiya Estate | Japan | 8.0 | Estate | ✅ |
| prop-003 | Patagonia Wilderness | Chile | 15.0 | Cabin | ✅ |
| prop-004 | Maldives Overwater | Maldives | 35.0 | Villa | ✅ |
| prop-005 | Tuscany Vineyard | Italy | 22.0 | Castle | ⏳ |

## Status

- Live: https://solana-booking-platform.vercel.app
- Chain: Solana Devnet
- Wallet: Phantom/Solflare
- Network: Devnet

## Protocol Stats

```typescript
import { protocol } from './data/listings';

console.log(protocol.stats);
// {
//   totalListings: 5,
//   verifiedListings: 4,
//   avgPrice: 18.5
// }
```
