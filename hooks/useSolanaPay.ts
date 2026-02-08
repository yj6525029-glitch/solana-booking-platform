'use client';

import { useState, useCallback } from 'react';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';
import QRCode from 'qrcode';

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // Mainnet USDC
const USDC_DEVNET = new PublicKey('4zMMC9sft5hLUsduh5EuG9XGTgPscsEStFcG7dd9j6cR'); // Devnet USDC

export interface PaymentRequest {
  amount: number;
  bookingId: string;
  hotelName: string;
}

export interface SolanaPayState {
  qrCode: string | null;
  paymentUrl: string | null;
  reference: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useSolanaPay() {
  const [state, setState] = useState<SolanaPayState>({
    qrCode: null,
    paymentUrl: null,
    reference: null,
    isLoading: false,
    error: null,
  });

  const generatePayment = useCallback(async (params: PaymentRequest) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      // Create unique reference for this booking
      const reference = crypto.randomUUID();
      
      // Merchant wallet (would be the hotel's wallet in production)
      const merchantWallet = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');
      
      // Create Solana Pay URL
      const url = encodeURL({
        recipient: merchantWallet,
        amount: BigInt(params.amount * 1_000_000), // USDC has 6 decimals
        splToken: USDC_DEVNET,
        reference: new PublicKey(reference),
        label: `Booking: ${params.hotelName}`,
        message: `Room reservation ${params.bookingId}`,
        memo: `HACKATHON:${params.bookingId}`,
      });

      // Generate QR code
      const qrCode = await QRCode.toDataURL(url.toString(), {
        width: 300,
        margin: 2,
        color: {
          dark: '#00D4AA',
          light: '#00000000',
        },
      });

      setState({
        qrCode,
        paymentUrl: url.toString(),
        reference,
        isLoading: false,
        error: null,
      });

      return { success: true, reference, url: url.toString() };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to generate payment';
      setState({ ...state, isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  }, []);

  const clearPayment = useCallback(() => {
    setState({
      qrCode: null,
      paymentUrl: null,
      reference: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    generatePayment,
    clearPayment,
  };
}
