# Anchor Smart Contract Architecture

## Overview
The solana-booking-agent program provides trustless hotel booking escrow on Solana.

## Program ID
- **Devnet:** To be deployed (placeholder: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`)
- **Current:** Frontend uses stub escrow for demo

## Instructions

### 1. `initialize(platform_fee: u16)`
Initialize platform registry.
- Creates `PlatformState` account
- Sets fee percentage (e.g., 250 = 2.5%)

### 2. `initialize_hotel(name: String, location: String)`
Hotel onboarding.
- Creates `HotelState` PDA
- Links to platform authority

### 3. `create_room(room_number: u16, price_per_night: u64)`
Add room inventory.
- Creates `RoomState` account
- Sets nightly rate in lamports

### 4. `book_room(check_in: i64, check_out: i64)`
Create booking with escrow.
- Creates `BookingState` PDA
- Creates `EscrowState` account
- Transfers funds to escrow
- Emits `BookingCreated` event

### 5. `confirm_booking()`
Hotel confirms reservation.
- Transfers 80% to hotel
- Transfers 20% platform fee to platform wallet
- Updates booking status: `Confirmed`

### 6. `complete_booking()`
Guest checks out, releases funds.
- Verifies check-out date passed
- Transfers escrow to hotel (if not already released)
- Closes escrow account
- Updates booking: `Completed`

### 7. `cancel_booking()`
Guest cancellation with refund rules.
- < 24h: 50% refund
- 24-72h: 75% refund
- > 72h: 90% refund
- Remainder to hotel as cancellation fee

### 8. `release_expired()`
Platform intervention for expired bookings.
- Called by platform authority
- Releases escrow after check-out + grace period
- Protects against no-show hotels

## State Accounts

### PlatformState
```rust
pub struct PlatformState {
    pub authority: Pubkey,        // Platform admin
    pub fee_percentage: u16,      // Basis points (250 = 2.5%)
    pub total_bookings: u64,
    pub total_volume: u64,
}
```

### HotelState
```rust
pub struct HotelState {
    pub authority: Pubkey,        // Hotel owner
    pub name: String,             // Hotel name
    pub location: String,
    pub room_count: u16,
    pub active: bool,
}
```

### RoomState
```rust
pub struct RoomState {
    pub hotel: Pubkey,
    pub room_number: u16,
    pub price_per_night: u64,     // Lamports
    pub is_available: bool,
    pub current_booking: Option<Pubkey>,
}
```

### BookingState
```rust
pub enum BookingStatus {
    Pending,      // Created, awaiting confirmation
    Confirmed,    // Hotel confirmed
    Completed,    // Stay finished, funds released
    Cancelled,    // Guest cancelled
    Expired,      // No show/refund
}

pub struct BookingState {
    pub guest: Pubkey,
    pub hotel: Pubkey,
    pub room: Pubkey,
    pub check_in: i64,
    pub check_out: i64,
    pub total_amount: u64,
    pub status: BookingStatus,
    pub escrow: Pubkey,
    pub created_at: i64,
    pub nft_mint: Option<Pubkey>,  // Metaplex cNFT receipt
}
```

### EscrowState
```rust
pub struct EscrowState {
    pub booking: Pubkey,
    pub guest: Pubkey,
    pub hotel: Pubkey,
    pub amount: u64,
    pub created_at: i64,
}
```

## Security Considerations

- **Escrow Design:** Funds never held by hotel until service rendered
- **PDA Seeds:** Deterministic seeds prevent account squatting
- **Time Locks:** Grace periods prevent premature fund release
- **Refund Logic:** Transparent cancellation policy enforced on-chain
- **Event Emissions:** All state changes emit events for off-chain indexing

## Frontend Integration

Current implementation uses stub escrow:
```typescript
// Real: await program.methods.bookRoom(checkIn, checkOut)
//              .accounts({...}).rpc();

// Demo: Solana Pay + NFT mint (payment flows to devnet wallet)
```

Full integration requires:
1. Anchor IDL generation
2. Program deployment
3. Provider configuration
4. Transaction signing via wallet adapter

## Deployment Status

- **Code:** Complete (907 lines Rust)
- **Build:** Ready (requires `anchor build`)
- **Deploy:** Pending (requires devnet SOL)
- **Frontend:** Uses stub for demo

## Test Commands

```bash
# Build
anchor build

# Test
anchor test --skip-local-validator

# Deploy (after funding)
anchor deploy --provider.cluster devnet
```
