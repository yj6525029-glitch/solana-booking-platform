use anchor_lang::prelude::*;
use crate::state::*;
use crate::BookingError;

#[derive(Accounts)]
pub struct InitializeHotel<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = Hotel::SIZE,
        seeds = [b"hotel", owner.key().as_ref()],
        bump
    )]
    pub hotel: Account<'info, Hotel>,

    pub system_program: Program<'info, System>,
}

pub fn initialize_hotel(
    ctx: Context<InitializeHotel>,
    name: String,
    commission_rate: u16,
) -> Result<()> {
    require!(name.len() <= 100, BookingError::NameTooLong);
    require!(commission_rate < 10000, BookingError::InvalidCommission);

    let hotel = &mut ctx.accounts.hotel;
    
    hotel.owner = ctx.accounts.owner.key();
    hotel.name = name;
    hotel.commission_rate = commission_rate;
    hotel.room_count = 0;
    hotel.bump = ctx.bumps.hotel;

    msg!("Hotel initialized: {}", hotel.name);
    
    Ok(())
}
