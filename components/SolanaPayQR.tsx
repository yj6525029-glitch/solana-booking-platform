'use client';

import { useEffect, useState } from 'react';
import { encodeURL, createQR } from '@solana/pay';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

interface SolanaPayQRProps {
  amount: number;
  recipient: string;
  label: string;
  message: string;
  memo: string;
  onSuccess: (signature: string) => void;
  onError: (error: string) => void;
}

// Devnet USDC mint address
const USDC_DEVNET = new PublicKey('4zMMC9sft5hLUsduh5EuG9XGTgPscsEStFcG7dd9j6cR');

export function SolanaPayQR({ amount, recipient, label, message, memo, onSuccess, onError }: SolanaPayQRProps) {
  const [qrRef, setQrRef] = useState<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'pending' | 'confirmed'>('pending');
  const [signature, setSignature] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('');

  // Generate QR code
  useEffect(() => {
    if (!qrRef) return;
    
    try {
      // Create Solana Pay URL for USDC
      const payUrl = encodeURL({
        recipient: new PublicKey(recipient),
        amount: new BigNumber(amount),
        splToken: USDC_DEVNET,
        label,
        message,
        memo,
      });
      
      setUrl(payUrl.toString());
      
      // Generate QR code
      const qr = createQR(payUrl, 320, 'white', '#1a1a2e');
      qrRef.innerHTML = '';
      qr.append(qrRef);
    } catch (err) {
      console.error('QR generation error:', err);
      onError('Failed to generate QR code: ' + (err instanceof Error ? err.message : String(err)));
    }
  }, [qrRef, amount, recipient, label, message, memo, onError]);

  // Poll for payment
  useEffect(() => {
    if (!url || status !== 'pending') return;
    
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const recipientPubkey = new PublicKey(recipient);
    
    const checkPayment = async () => {
      try {
        // Look for the memo in recent transactions
        const sigs = await connection.getSignaturesForAddress(recipientPubkey, { limit: 20 });
        
        for (const sig of sigs) {
          if (sig.memo?.includes(memo)) {
            setStatus('confirmed');
            setSignature(sig.signature);
            onSuccess(sig.signature);
            return;
          }
        }
      } catch (err) {
        console.error('Payment check error:', err);
      }
    };

    const interval = setInterval(checkPayment, 4000);
    return () => clearInterval(interval);
  }, [recipient, memo, status, onSuccess, url]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={setQrRef} className="bg-white p-4 rounded-lg" style={{ width: 340, height: 340 }} />
      
      <div className="text-center">
        {status === 'pending' && (
          <>
            <p className="text-lg font-semibold text-white mb-2">Pay with Solana Pay</p>
            <p className="text-sm text-cyan-400">{amount} USDC</p>
            <p className="text-xs text-gray-500 mt-2">Scan with Phantom or Solflare</p>
          </>
        )}
        {status === 'confirmed' && (
          <>
            <p className="text-lg font-semibold text-green-400 mb-2">✅ Payment Received!</p>
            <a 
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 underline"
            >
              View on Explorer
            </a>
          </>
        )}
      </div>
    </div>
  );
}
