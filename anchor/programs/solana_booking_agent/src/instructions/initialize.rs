use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::error::BookingError;
use crate::state::{Booking, BookingStatus};

#[derive(Accounts)]
#[instruction(hotel_id: String, room_id: String)]
pub struct InitializeBooking<'info> {
    #[account(mut)]
    pub guest: Signer<'info>,

    /// CHECK: Hotel owner account - verified in instruction
    pub hotel_owner: AccountInfo<'info>,

    #[account(
        init,
        payer = guest,
        space = Booking::SPACE,
        seeds = [b"booking", hotel_id.as_bytes(), room_id.as_bytes(), guest.key().as_ref()],
        bump
    )]
    pub booking: Account<'info, Booking>,

    #[account(
        init,
        payer = guest,
        token::mint = usdc_mint,
        token::authority = booking,
        seeds = [b"escrow", booking.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = guest,
    )]
    pub guest_token_account: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn initialize_booking(
    ctx: Context<InitializeBooking>,
    hotel_id: String,
    room_id: String,
    amount: u64,
    check_in: i64,
    check_out: i64,
) -> Result<()> {
    // Validate inputs
    require!(amount > 0, BookingError::InvalidAmount);
    require!(check_out > check_in, BookingError::InvalidDates);
    require!(check_in > ctx.accounts.clock.unix_timestamp, BookingError::CheckInPast);
    require!(
        hotel_id.len() <= 32 && room_id.len() <= 32,
        BookingError::InvalidDates
    );

    let booking = &mut ctx.accounts.booking;
    let clock = &ctx.accounts.clock;

    // Initialize booking state
    booking.guest = ctx.accounts.guest.key();
    booking.hotel_owner = ctx.accounts.hotel_owner.key();
    booking.amount = amount;
    booking.hotel_id = hotel_id;
    booking.room_id = room_id;
    booking.check_in = check_in;
    booking.check_out = check_out;
    booking.status = BookingStatus::Pending;
    booking.created_at = clock.unix_timestamp;
    booking.bump = *ctx.bumps.get("booking").unwrap();

    // Transfer USDC from guest to escrow
    let cpi_accounts = Transfer {
        from: ctx.accounts.guest_token_account.to_account_info(),
        to: ctx.accounts.escrow_token_account.to_account_info(),
        authority: ctx.accounts.guest.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    token::transfer(cpi_ctx, amount)?;

    msg!("Booking initialized: {} -> {}", hotel_id, room_id);
    msg!("Amount escrowed: {} USDC", amount);
    msg!("Check-in: {}, Check-out: {}", check_in, check_out);

    Ok(())
}
