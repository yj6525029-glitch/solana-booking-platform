'use client';

import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  SystemProgram, 
  Transaction,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { findReference, FindReferenceError } from '@solana/pay';

// Platform wallet that receives escrow
const PLATFORM_ESCROW_WALLET = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');
const PLATFORM_FEE_PERCENT = 20; // 20% platform fee

interface EscrowRequest {
  amount: number; // in SOL
  bookingId: string;
  hotelPubkey: string;
  customerWallet: string;
}

interface EscrowResult {
  status: 'idle' | 'created' | 'paid' | 'confirmed' | 'refunded' | 'failed';
  escrowPubkey: string | null;
  signature: string | null;
  error: string | null;
}

/**
 * Real Escrow Payment Hook
 * Creates a PDA that holds payment until booking is confirmed
 */
export function useEscrowPayment() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [state, setState] = useState<EscrowResult>({
    status: 'idle',
    escrowPubkey: null,
    signature: null,
    error: null,
  });

  /**
   * Create escrow and send payment
   * Funds go to platform wallet with booking ID memo
   */
  const createEscrowPayment = useCallback(
    async (request: EscrowRequest): Promise<{ signature: string } | null> => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        setState({ ...state, error: 'Wallet not connected', status: 'failed' });
        return null;
      }

      try {
        setState({ ...state, status: 'created' });

        // Create unique escrow PDA from booking ID
        const bookingHash = Buffer.from(request.bookingId).slice(0, 32);
        const [escrowPDA] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('escrow'),
            wallet.publicKey.toBuffer(),
            new PublicKey(request.hotelPubkey).toBuffer(),
            bookingHash
          ],
          SystemProgram.programId
        );

        const amountLamports = Math.floor(request.amount * LAMPORTS_PER_SOL);

        // Build transaction
        const transaction = new Transaction();
        
        // Create escrow account (rent-exempt)
        const rentExempt = await connection.getMinimumBalanceForRentExemption(0);
        transaction.add(
          SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: escrowPDA,
            lamports: rentExempt,
            space: 0,
            programId: SystemProgram.programId,
          })
        );

        // Transfer booking amount to escrow
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: escrowPDA,
            lamports: amountLamports,
          })
        );

        // Send transaction
        transaction.feePayer = wallet.publicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        const signed = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signed.serialize());

        await connection.confirmTransaction(signature, 'confirmed');

        setState({
          status: 'paid',
          escrowPubkey: escrowPDA.toString(),
          signature,
          error: null,
        });

        return { signature };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Escrow creation failed';
        setState({ ...state, error: message, status: 'failed' });
        return null;
      }
    },
    [wallet.publicKey, wallet.signTransaction, connection]
  );

  /**
   * Release funds to hotel (called after booking confirmed)
   */
  const releaseEscrow = useCallback(
    async (escrowPubkey: string, hotelPubkey: string, amount: number): Promise<string | null> => {
      if (!wallet.signTransaction) return null;

      try {
        setState({ ...state, status: 'confirmed' });

        const escrow = new PublicKey(escrowPubkey);
        const hotel = new PublicKey(hotelPubkey);

        const amountLamports = Math.floor(amount * LAMPORTS_PER_SOL);
        const platformFee = Math.floor(amountLamports * PLATFORM_FEE_PERCENT / 100);
        const hotelAmount = amountLamports - platformFee;

        const transaction = new Transaction();

        // Transfer to hotel (80%)
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: escrow,
            toPubkey: hotel,
            lamports: hotelAmount,
          })
        );

        // Transfer platform fee (20%)
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: escrow,
            toPubkey: PLATFORM_ESCROW_WALLET,
            lamports: platformFee,
          })
        );

        // Transfer remaining rent back to guest (close by emptying)
        const rentExempt = await connection.getMinimumBalanceForRentExemption(0);
        const remainingBalance = await connection.getBalance(escrow) - rentExempt;
        if (remainingBalance > 0) {
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: escrow,
              toPubkey: wallet.publicKey!,
              lamports: remainingBalance,
            })
          );
        }

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey!;

        const signed = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signed.serialize());
        
        await connection.confirmTransaction(signature, 'confirmed');

        return signature;
      } catch (error) {
        console.error('Release escrow error:', error);
        return null;
      }
    },
    [wallet.signTransaction, connection]
  );

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      escrowPubkey: null,
      signature: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    createEscrowPayment,
    releaseEscrow,
    reset,
  };
}
