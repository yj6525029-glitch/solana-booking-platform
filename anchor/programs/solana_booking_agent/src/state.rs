use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Debug)]
pub enum BookingStatus {
    Pending,    // Initial state, waiting for confirmation
    Confirmed,  // Hotel owner confirmed, funds released
    Cancelled,  // Either party cancelled before confirmation
    Expired,    // Auto-expired after check_in date
}

#[account]
pub struct Booking {
    /// Guest who made the booking
    pub guest: Pubkey,
    /// Hotel owner who receives funds
    pub hotel_owner: Pubkey,
    /// Amount of USDC deposited
    pub amount: u64,
    /// Hotel ID (string bytes)
    pub hotel_id: String,
    /// Room ID (string bytes)
    pub room_id: String,
    /// Check-in timestamp
    pub check_in: i64,
    /// Check-out timestamp
    pub check_out: i64,
    /// Current status of the booking
    pub status: BookingStatus,
    /// Timestamp when booking was created
    pub created_at: i64,
    /// Bump seed for PDA
    pub bump: u8,
}

impl Booking {
    // Calculate space needed for the account
    // discriminator (8) + guest (32) + hotel_owner (32) + amount (8) 
    // + hotel_id (4 + len) + room_id (4 + len) + check_in (8) + check_out (8) 
    // + status (1) + created_at (8) + bump (1)
    // Assuming max 32 chars for hotel_id and room_id each
    pub const SPACE: usize = 8 + 32 + 32 + 8 + (4 + 32) + (4 + 32) + 8 + 8 + 1 + 8 + 1;
}

#[account]
pub struct HotelRegistry {
    /// Hotel owner pubkey
    pub owner: Pubkey,
    /// Hotel name
    pub name: String,
    /// Is active
    pub is_active: bool,
    /// Bump
    pub bump: u8,
}

impl HotelRegistry {
    pub const SPACE: usize = 8 + 32 + (4 + 64) + 1 + 1;
}
