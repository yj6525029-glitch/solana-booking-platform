import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey, Commitment } from '@solana/web3.js';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

// Import IDL
import idl from '../anchor/target/idl/solana_booking_agent.json';

// Program ID from anchor config
export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

// Token constants
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // Mainnet USDC
export const USDC_MINT_DEVNET = new PublicKey('4zMMC9srt5Ri5X14GAgXhaEiiq2QBH3xqCmCEz1hAHkb'); // Devnet USDC

// Commitment level
export const COMMITMENT: Commitment = 'confirmed';

// Booking status enum
export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Completed = 2,
  Cancelled = 3,
}

// Booking account interface
export interface BookingAccount {
  bookingId: string;
  guest: PublicKey;
  hotel: PublicKey;
  checkIn: number;
  checkOut: number;
  roomCount: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: number;
  updatedAt: number;
}

// Hotel account interface
export interface HotelAccount {
  hotelId: string;
  name: string;
  owner: PublicKey;
  pricePerNight: number;
  currency: PublicKey;
  totalRooms: number;
  isActive: boolean;
}

// Custom program type from IDL
type SolanaBookingAgent = typeof idl;

/**
 * Get the appropriate USDC mint for the current network
 */
export function getUSDCMint(network: string): PublicKey {
  return network === 'devnet' ? USDC_MINT_DEVNET : USDC_MINT;
}

/**
 * Create an Anchor provider with the given connection and wallet
 */
export function createProvider(
  connection: Connection,
  wallet: any
): AnchorProvider | null {
  if (!wallet) return null;
  
  return new AnchorProvider(
    connection,
    wallet,
    {
      commitment: COMMITMENT,
      preflightCommitment: COMMITMENT,
    }
  );
}

/**
 * Create the program instance
 */
export function createProgram(provider: AnchorProvider): Program<SolanaBookingAgent> {
  return new Program(idl as unknown as SolanaBookingAgent, provider);
}

/**
 * React hook to get the Anchor program instance
 */
export function useProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return createProvider(connection, wallet);
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return createProgram(provider);
  }, [provider]);

  return { program, provider, connection, wallet };
}

/**
 * Derive booking PDA from booking ID and guest public key
 */
export function getBookingPDA(bookingId: string, guest: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('booking'),
      Buffer.from(bookingId),
      guest.toBuffer(),
    ],
    PROGRAM_ID
  );
}

/**
 * Derive hotel PDA from hotel ID
 */
export function getHotelPDA(hotelId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('hotel'),
      Buffer.from(hotelId),
    ],
    PROGRAM_ID
  );
}

/**
 * Derive escrow token account PDA
 */
export function getEscrowPDA(booking: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('escrow'),
      booking.toBuffer(),
    ],
    PROGRAM_ID
  );
}

// Re-export commonly used types
export { PublicKey, Connection };
export type { SolanaBookingAgent };
