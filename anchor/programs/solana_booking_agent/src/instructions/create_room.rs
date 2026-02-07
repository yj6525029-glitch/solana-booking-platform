use anchor_lang::prelude::*;
use crate::state::*;
use crate::BookingError;

#[derive(Accounts)]
pub struct CreateRoom<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        has_one = owner @ BookingError::Unauthorized,
        seeds = [b"hotel", owner.key().as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,

    #[account(
        init,
        payer = owner,
        space = Room::SIZE,
        seeds = [b"room", hotel.key().as_ref(), room_number.as_bytes()],
        bump
    )]
    pub room: Account<'info, Room>,

    pub system_program: Program<'info, System>,
}

pub fn create_room(
    ctx: Context<CreateRoom>,
    room_number: String,
    price_per_night: u64,
) -> Result<()> {
    require!(room_number.len() <= 20, BookingError::RoomNumberTooLong);
    require!(price_per_night > 0, BookingError::InsufficientPayment);

    let hotel = &mut ctx.accounts.hotel;
    let room = &mut ctx.accounts.room;

    room.hotel = hotel.key();
    room.room_number = room_number;
    room.price_per_night = price_per_night;
    room.is_active = true;
    room.bump = ctx.bumps.room;

    hotel.room_count += 1;

    msg!("Room created: {} with price {} USDC per night", room.room_number, price_per_night);
    
    Ok(())
}
