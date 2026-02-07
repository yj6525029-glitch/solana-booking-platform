use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, CloseAccount};
use crate::state::*;
use crate::BookingError;

#[derive(Accounts)]
pub struct CompleteBooking<'info> {
    #[account(mut)]
    pub completer: Signer<'info>,

    #[account(
        mut,
        has_one = hotel_owner @ BookingError::Unauthorized,
        seeds = [b"hotel", hotel_owner.key().as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,

    /// CHECK: Hotel owner account
    #[account(mut)]
    pub hotel_owner: AccountInfo<'info>,

    /// CHECK: Platform fee wallet
    #[account(mut)]
    pub platform_wallet: AccountInfo<'info>,

    #[account(
        mut,
        has_one = hotel @ BookingError::Unauthorized,
        constraint = booking.status == BookingStatus::Confirmed @ BookingError::NotConfirmed,
        seeds = [
            b"booking",
            booking.room.as_ref(),
            booking.guest.as_ref(),
            &booking.check_in.to_le_bytes(),
        ],
        bump = booking.bump,
    )]
    pub booking: Account<'info, Booking>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = booking,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = hotel_usdc_account.owner == hotel_owner.key(),
        constraint = hotel_usdc_account.mint == usdc_mint.key(),
    )]
    pub hotel_usdc_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = platform_usdc_account.owner == platform_wallet.key(),
        constraint = platform_usdc_account.mint == usdc_mint.key(),
    )]
    pub platform_usdc_account: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, token::Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn complete_booking(ctx: Context<CompleteBooking>) -> Result<()> {
    let booking = &mut ctx.accounts.booking;
    let hotel = &ctx.accounts.hotel;
    let clock = &ctx.accounts.clock;

    // Can be completed by hotel owner OR guest after check-out
    let is_hotel_owner = ctx.accounts.completer.key() == hotel.owner;
    let is_guest = ctx.accounts.completer.key() == booking.guest;
    let after_checkout = clock.unix_timestamp >= booking.check_out;
    
    require!(
        is_hotel_owner || (is_guest && after_checkout),
        BookingError::Unauthorized
    );

    // Calculate payouts
    let commission = booking.total_amount * hotel.commission_rate as u64 / 10000;
    let hotel_payout = booking.total_amount - commission;

    let booking_key = booking.key();
    let seeds = &[
        b"booking",
        booking.room.as_ref(),
        booking.guest.as_ref(),
        &booking.check_in.to_le_bytes(),
        &[booking.bump],
    ];
    let signer = &[&seeds[..]];

    // Transfer commission to platform
    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_token_account.to_account_info(),
        to: ctx.accounts.platform_usdc_account.to_account_info(),
        authority: booking.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    
    token::transfer(cpi_ctx, commission)?;

    // Transfer payout to hotel
    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_token_account.to_account_info(),
        to: ctx.accounts.hotel_usdc_account.to_account_info(),
        authority: booking.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        signer
    );
    
    token::transfer(cpi_ctx, hotel_payout)?;

    // Close escrow account (return rent to guest)
    let cpi_accounts = CloseAccount {
        account: ctx.accounts.escrow_token_account.to_account_info(),
        destination: ctx.accounts.hotel_owner.clone(),
        authority: booking.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        signer
    );
    
    token::close_account(cpi_ctx)?;

    // Update booking status
    booking.status = BookingStatus::Completed;

    msg!(
        "Booking completed: hotel earned {} USDC (commission {})",
        hotel_payout,
        commission
    );
    
    Ok(())
}
