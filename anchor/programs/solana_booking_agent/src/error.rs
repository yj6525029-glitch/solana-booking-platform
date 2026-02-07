use anchor_lang::prelude::*;

#[error_code]
pub enum BookingError {
    #[msg("Booking is already confirmed")]
    AlreadyConfirmed,
    
    #[msg("Booking is already cancelled")]
    AlreadyCancelled,
    
    #[msg("Booking has already expired")]
    AlreadyExpired,
    
    #[msg("Booking has not expired yet")]
    NotExpired,
    
    #[msg("Invalid hotel owner")]
    InvalidHotelOwner,
    
    #[msg("Invalid guest")]
    InvalidGuest,
    
    #[msg("Unauthorized caller")]
    Unauthorized,
    
    #[msg("Invalid check-in/check-out dates")]
    InvalidDates,
    
    #[msg("Check-in date is in the past")]
    CheckInPast,
    
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    
    #[msg("Math overflow")]
    MathOverflow,
    
    #[msg("Invalid booking status for this operation")]
    InvalidStatus,
    
    #[msg("Token transfer failed")]
    TokenTransferFailed,
}
