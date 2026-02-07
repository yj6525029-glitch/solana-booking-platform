use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, CloseAccount};
use crate::state::*;
use crate::BookingError;

#[derive(Accounts)]
pub struct CancelBooking<'info> {
    #[account(mut)]
    pub guest: Signer<'info>,

    #[account(
        mut,
        has_one = guest @ BookingError::Unauthorized,
        constraint = booking.status != BookingStatus::Completed @ BookingError::AlreadyCompleted,
        constraint = booking.status != BookingStatus::Cancelled @ BookingError::AlreadyConfirmed,
        seeds = [
            b"booking",
            booking.room.as_ref(),
            guest.key().as_ref(),
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

    /// CHECK: Hotel USDC account - validated by constraint
    #[account(
        mut,
        constraint = hotel_usdc_account.mint == usdc_mint.key(),
    )]
    pub hotel_usdc_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = guest_usdc_account.owner == guest.key(),
        constraint = guest_usdc_account.mint == usdc_mint.key(),
    )]
    pub guest_usdc_account: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, token::Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn cancel_booking(ctx: Context<CancelBooking>) -> Result<()> {
    let booking = &mut ctx.accounts.booking;
    let clock = &ctx.accounts.clock;
    
    let current_time = clock.unix_timestamp;
    
    // Calculate refund amount based on cancellation policy
    let refund_amount = booking.total_amount;
    let penalty = if booking.status == BookingStatus::Pending {
        // No penalty if not yet confirmed
        0
    } else {
        // 20% penalty if confirmed (hotel fees)
        booking.total_amount / 5
    };
    
    let refund_to_guest = refund_amount - penalty;
    let hotel_fee = penalty;

    // Transfer refund to guest if any
    if refund_to_guest > 0 {
        let booking_key = booking.key();
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
        
        token::transfer(cpi_ctx, refund_to_guest)?;
    }

    // Transfer penalty/fee to hotel if any
    if hotel_fee > 0 && booking.status == BookingStatus::Confirmed {
        let booking_key = booking.key();
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
            to: ctx.accounts.hotel_usdc_account.to_account_info(),
            authority: booking.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::transfer(cpi_ctx, hotel_fee)?;
    }

    // Close escrow account
    let booking_key = booking.key();
    let seeds = &[
        b"booking",
        booking.room.as_ref(),
        booking.guest.as_ref(),
        &booking.check_in.to_le_bytes(),
        &[booking.bump],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = CloseAccount {
        account: ctx.accounts.escrow_token_account.to_account_info(),
        destination: ctx.accounts.guest.to_account_info(),
        authority: booking.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    
    token::close_account(cpi_ctx)?;

    booking.status = BookingStatus::Cancelled;

    msg!(
        "Booking cancelled: {} refunded {}",
        booking.key(),
        refund_to_guest
    );
    
    Ok(())
}
