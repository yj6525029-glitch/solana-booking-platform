use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::BookingError;

#[derive(Accounts)]
#[instruction(check_in: i64, check_out: i64)]
pub struct BookRoom<'info> {
    #[account(mut)]
    pub guest: Signer<'info>,

    #[account(
        mut,
        seeds = [b"hotel", hotel.owner.as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,

    #[account(
        mut,
        has_one = hotel @ BookingError::Unauthorized,
        constraint = room.is_active @ BookingError::Unauthorized,
        seeds = [b"room", hotel.key().as_ref(), room.room_number.as_bytes()],
        bump = room.bump,
    )]
    pub room: Account<'info, Room>,

    #[account(
        init,
        payer = guest,
        space = Booking::SIZE,
        seeds = [
            b"booking",
            room.key().as_ref(),
            guest.key().as_ref(),
            &check_in.to_le_bytes(),
        ],
        bump
    )]
    pub booking: Account<'info, Booking>,

    /// Escrow token account to hold payment
    #[account(
        init,
        payer = guest,
        associated_token::mint = usdc_mint,
        associated_token::authority = booking,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = guest_token_account.owner == guest.key(),
        constraint = guest_token_account.mint == usdc_mint.key(),
    )]
    pub guest_token_account: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, token::Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn book_room(
    ctx: Context<BookRoom>,
    check_in: i64,
    check_out: i64,
) -> Result<()> {
    let clock = &ctx.accounts.clock;
    let current_time = clock.unix_timestamp;
    
    // Validate dates
    require!(check_out > check_in, BookingError::InvalidDates);
    require!(check_in > current_time, BookingError::InvalidDates);
    
    let nights = ((check_out - check_in) / (24 * 60 * 60)) as u32;
    require!(nights > 0, BookingError::InvalidDates);

    let room = &ctx.accounts.room;
    let hotel = &ctx.accounts.hotel;
    let total_amount = room.price_per_night * nights as u64;

    // Transfer payment to escrow
    let cpi_accounts = Transfer {
        from: ctx.accounts.guest_token_account.to_account_info(),
        to: ctx.accounts.escrow_token_account.to_account_info(),
        authority: ctx.accounts.guest.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    token::transfer(cpi_ctx, total_amount)?;

    // Create booking record
    let booking = &mut ctx.accounts.booking;
    
    booking.room = room.key();
    booking.guest = ctx.accounts.guest.key();
    booking.hotel = hotel.key();
    booking.check_in = check_in;
    booking.check_out = check_out;
    booking.total_amount = total_amount;
    booking.price_per_night = room.price_per_night;
    booking.nights = nights;
    booking.status = BookingStatus::Pending;
    booking.created_at = current_time;
    booking.bump = ctx.bumps.booking;

    msg!(
        "Booking created: room {} for {} nights ({}) USDC",
        room.room_number,
        nights,
        total_amount
    );
    
    Ok(())
}
