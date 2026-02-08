'use client';

import { useState, useCallback } from 'react';
import { 
 encodeURL, 
 createQR,
 findReference,
 FindReferenceError,
 validateTransfer
} from '@solana/pay';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

// Testnet configuration - using SOL for payments (no official USDC on testnet)
const PLATFORM_WALLET_TESTNET = 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS';

export interface PaymentRequest {
 amount: number; // Amount in SOL (not USDC on testnet)
 bookingId: string;
 hotelName: string;
 customerWallet: string;
}

export interface PaymentStatus {
 qrCode: string | null;
 reference: PublicKey | null;
 signature: string | null;
 status: 'idle' | 'pending' | 'confirmed' | 'failed';
 isLoading: boolean;
 error: string | null;
}

export function useSolanaPay(connection: Connection) {
 const [status, setStatus] = useState<PaymentStatus>({
 qrCode: null,
 reference: null,
 signature: null,
 status: 'idle',
 isLoading: false,
 error: null,
 });

 const generatePayment = useCallback(
 async (request: PaymentRequest): Promise<{ qrCode: string; reference: PublicKey } | null> => {
 setStatus({ ...status, isLoading: true, error: null });

 try {
 const reference = new PublicKey(crypto.randomUUID().replace(/-/g, '').slice(0, 32));
 const amountBigNumber = new BigNumber(request.amount.toFixed(9));

 // On testnet, use native SOL (no USDC)
 const url = encodeURL({
 recipient: new PublicKey(PLATFORM_WALLET_TESTNET),
 amount: amountBigNumber,
 reference,
 label: 'Solana Booking Agent',
 message: `Booking ${request.bookingId} - ${request.hotelName}`,
 memo: `BOOKING:${request.bookingId}:${request.customerWallet.slice(0, 8)}`,
 });

 const qr = createQR(url, 300, 'white', 'black');
 const qrDataUrl = await qr.getRawData('png');

 if (!qrDataUrl) {
 throw new Error('Failed to generate QR code');
 }

 const reader = new FileReader();
 const qrCodePromise = new Promise<string>((resolve, reject) => {
 reader.onloadend = () => resolve(reader.result as string);
 reader.onerror = reject;
 reader.readAsDataURL(qrDataUrl as Blob);
 });
 const qrCode = await qrCodePromise;

 setStatus({
 qrCode,
 reference,
 signature: null,
 status: 'pending',
 isLoading: false,
 error: null,
 });

 return { qrCode, reference };
 } catch (error) {
 const message = error instanceof Error ? error.message : 'Payment generation failed';
 setStatus({
 ...status,
 isLoading: false,
 error: message,
 });
 return null;
 }
 },
 [connection]
 );

 const verifyPayment = useCallback(
 async (reference: PublicKey, interval = 5000, timeout = 300000): Promise<string | null> => {
 setStatus((prev) => ({ ...prev, isLoading: true }));
 const startTime = Date.now();

 try {
 while (Date.now() - startTime < timeout) {
 try {
 const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
 
 if (signatureInfo) {
 setStatus((prev) => ({
 ...prev,
 signature: signatureInfo.signature,
 status: 'confirmed',
 isLoading: false,
 }));
 return signatureInfo.signature;
 }
 } catch (e: unknown) {
 if (e instanceof FindReferenceError) {
 await new Promise((resolve) => setTimeout(resolve, interval));
 continue;
 }
 throw e;
 }
 }

 setStatus((prev) => ({
 ...prev,
 status: 'failed',
 isLoading: false,
 error: 'Payment verification timed out',
 }));
 return null;
 } catch (error) {
 const message = error instanceof Error ? error.message : 'Verification failed';
 setStatus((prev) => ({
 ...prev,
 isLoading: false,
 error: message,
 }));
 return null;
 }
 },
 [connection]
 );

 const validatePayment = useCallback(
 async (signature: string, expectedAmount: number, recipient: PublicKey) => {
 try {
 return true;
 } catch (error) {
 console.error('Payment validation error:', error);
 return false;
 }
 },
 [connection]
 );

 const reset = useCallback(() => {
 setStatus({
 qrCode: null,
 reference: null,
 signature: null,
 status: 'idle',
 isLoading: false,
 error: null,
 });
 }, []);

 return {
 ...status,
 generatePayment,
 verifyPayment,
 validatePayment,
 reset,
 };
}
