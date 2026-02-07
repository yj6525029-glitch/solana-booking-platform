use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, CloseAccount};
use crate::state::*;
use crate::BookingError;

#[derive(Accounts)]
pub struct ReleaseExpired<'info> {
    /// Anyone can call this to release expired bookings
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(
        mut,
        has_one = guest @ BookingError::Unauthorized,
        constraint = booking.status == BookingStatus::Pending @ BookingError::AlreadyConfirmed,
        seeds = [
            b"booking",
            booking.room.as_ref(),
            booking.guest.as_ref(),
            &booking.check_in.to_le_bytes(),
        ],
        bump = booking.bump,
    )]
    pub booking: Account<'info, Booking>,

    /// CHECK: Guest account for refund
    #[account(mut)]
    pub guest: AccountInfo<'info>,

    #[account(
        mut,
        constraint = guest_usdc_account.owner == guest.key(),
        constraint = guest_usdc_account.mint == usdc_mint.key(),
    )]
    pub guest_usdc_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = booking,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, token::Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn release_expired_booking(ctx: Context<ReleaseExpired>) -> Result<()> {
    let booking = &mut ctx.accounts.booking;
    let clock = &ctx.accounts.clock;
    let current_time = clock.unix_timestamp;

    // Verify booking is expired
    require!(
        booking.is_expired(current_time),
        BookingError::NotExpired
    );

    let refund_amount = booking.total_amount;

    // Transfer full refund to guest
    let seeds = &[
        b"booking",
        booking.room.as_ref(),
        booking.guest.as_ref(),
        &booking.check_in.to_le_bytes(),
        &[booking.bump],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_token_account.to_account_info(),
        to: ctx.accounts.guest_usdc_account.to_account_info(),
        authority: booking.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    
    token::transfer(cpi_ctx, refund_amount)?;

    // Close escrow account
    let cpi_accounts = CloseAccount {
        account: ctx.accounts.escrow_token_account.to_account_info(),
        destination: ctx.accounts.caller.to_account_info(),
        authority: booking.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    
    token::close_account(cpi_ctx)?;

    booking.status = BookingStatus::Expired;

    msg!(
        "Expired booking released: {} refunded {} USDC",
        booking.key(),
        refund_amount
    );
    
    msg!(
        "Booking expired because check-in {} was not confirmed by {}",
        booking.check_in,
        booking.get_expiry_time()
    );
    
    Ok(())
}
