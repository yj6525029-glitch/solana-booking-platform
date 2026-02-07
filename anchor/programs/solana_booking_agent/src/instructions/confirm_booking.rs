use anchor_lang::prelude::*;
use crate::state::*;
use crate::BookingError;

#[derive(Accounts)]
pub struct ConfirmBooking<'info> {
    #[account(mut)]
    pub hotel_owner: Signer<'info>,

    #[account(
        has_one = hotel_owner @ BookingError::Unauthorized,
        seeds = [b"hotel", hotel_owner.key().as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,

    #[account(
        has_one = hotel @ BookingError::Unauthorized,
        seeds = [b"room", hotel.key().as_ref(), room.room_number.as_bytes()],
        bump = room.bump,
    )]
    pub room: Account<'info, Room>,

    #[account(
        mut,
        has_one = room @ BookingError::Unauthorized,
        has_one = hotel @ BookingError::Unauthorized,
        constraint = booking.status == BookingStatus::Pending @ BookingError::AlreadyConfirmed,
        seeds = [
            b"booking",
            room.key().as_ref(),
            booking.guest.as_ref(),
            &booking.check_in.to_le_bytes(),
        ],
        bump = booking.bump,
    )]
    pub booking: Account<'info, Booking>,

    pub clock: Sysvar<'info, Clock>,
}

pub fn confirm_booking(ctx: Context<ConfirmBooking>) -> Result<()> {
    let clock = &ctx.accounts.clock;
    let booking = &mut ctx.accounts.booking;

    // Check if booking is expired
    require!(
        !booking.is_expired(clock.unix_timestamp),
        BookingError::BookingExpired
    );

    booking.status = BookingStatus::Confirmed;

    msg!(
        "Booking confirmed: {} for guest {}",
        booking.key(),
        booking.guest
    );
    
    Ok(())
}
