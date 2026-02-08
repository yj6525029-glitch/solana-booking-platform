use anchor_lang::prelude::*;
use anchor_spl::token::{self, CloseAccount, Mint, TokenAccount, Transfer};
use anchor_lang::solana_program::clock::{Clock};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

pub mod instructions;
pub mod state;
pub mod error;

use instructions::*;
use state::*;
use error::BookingError;

#[program]
pub mod solana_booking_agent {
    use super::*;
    
    // Initialize platform
    pub fn initialize(ctx: Context<Initialize>, platform_fee: u16) -> Result<()> {
        instructions::initialize::handler(ctx, platform_fee)
    }
    
    // Hotel management
    pub fn initialize_hotel(
        ctx: Context<InitializeHotel>,
        name: String,
        location: String,
    ) -> Result<()> {
        instructions::initialize_hotel::handler(ctx, name, location)
    }
    
    pub fn create_room(
        ctx: Context<CreateRoom>,
        room_number: u16,
        price_per_night: u64,
    ) -> Result<()> {
        instructions::create_room::handler(ctx, room_number, price_per_night)
    }
    
    // Booking lifecycle
    pub fn book_room(
        ctx: Context<BookRoom>,
        check_in: i64,
        check_out: i64,
    ) -> Result<()> {
        instructions::book_room::handler(ctx, check_in, check_out)
    }
    
    pub fn confirm_booking(ctx: Context<ConfirmBooking>) -> Result<()> {
        instructions::confirm_booking::handler(ctx)
    }
    
    pub fn complete_booking(ctx: Context<CompleteBooking>) -> Result<()> {
        instructions::complete_booking::handler(ctx)
    }
    
    pub fn cancel_booking(ctx: Context<CancelBooking>) -> Result<()> {
        instructions::cancel_booking::handler(ctx)
    }
    
    pub fn release_expired(ctx: Context<ReleaseExpired>) -> Result<()> {
        instructions::release_expired::handler(ctx)
    }
}

// Instruction contexts
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + PlatformState::SIZE
    )]
    pub platform: Account<'info, PlatformState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeHotel<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub platform: Account<'info, PlatformState>,
    #[account(
        init,
        payer = authority,
        space = 8 + HotelState::SIZE
    )]
    pub hotel: Account<'info, HotelState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateRoom<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub hotel: Account<'info, HotelState>,
    #[account(
        init,
        payer = authority,
        space = 8 + RoomState::SIZE
    )]
    pub room: Account<'info, RoomState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BookRoom<'info> {
    #[account(mut)]
    pub guest: Signer<'info>,
    #[account(mut)]
    pub hotel: Account<'info, HotelState>,
    #[account(mut)]
    pub room: Account<'info, RoomState>,
    #[account(
        init,
        payer = guest,
        space = 8 + BookingState::SIZE
    )]
    pub booking: Account<'info, BookingState>,
    /// The escrow account that holds payment
    #[account(
        init,
        payer = guest,
        space = 8 + EscrowState::SIZE
    )]
    pub escrow: Account<'info, EscrowState>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct ConfirmBooking<'info> {
    #[account(mut)]
    pub hotel_authority: Signer<'info>,
    #[account(mut)]
    pub booking: Account<'info, BookingState>,
    #[account(mut)]
    pub escrow: Account<'info, EscrowState>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct CompleteBooking<'info> {
    #[account(mut)]
    pub guest: Signer<'info>,
    #[account(mut)]
    pub hotel: Account<'info, HotelState>,
    #[account(mut)]
    pub booking: Account<'info, BookingState>,
    #[account(mut)]
    pub escrow: Account<'info, EscrowState>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct CancelBooking<'info> {
    #[account(mut)]
    pub guest: Signer<'info>,
    #[account(mut)]
    pub booking: Account<'info, BookingState>,
    #[account(mut)]
    pub escrow: Account<'info, EscrowState>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct ReleaseExpired<'info> {
    pub authority: Signer<'info>,
    #[account(mut)]
    pub booking: Account<'info, BookingState>,
    #[account(mut)]
    pub escrow: Account<'info, EscrowState>,
    #[account(mut, close = authority)]
    pub room: Account<'info, RoomState>,
    pub clock: Sysvar<'info, Clock>,
}
