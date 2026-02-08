'use client';

import { useEffect, useState } from 'react';
import { encodeURL, createQR, findReference, validateTransfer } from '@solana/pay';
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

export function SolanaPayQR({
  amount,
  recipient,
  label,
  message,
  memo,
  onSuccess,
  onError,
}: SolanaPayQRProps) {
  const [qrRef, setQrRef] = useState<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'pending' | 'processing' | 'confirmed'>('pending');
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    if (!qrRef) return;

    try {
      // Create Solana Pay URL
      const url = encodeURL({
        recipient: new PublicKey(recipient),
        amount: new BigNumber(amount),
        label,
        message,
        memo,
      });

      // Create QR code
      const qr = createQR(url, 360, 'white', '#1a1a2e');
      qrRef.innerHTML = '';
      qr.append(qrRef);
    } catch (err) {
      console.error('QR generation error:', err);
      onError('Failed to generate QR code');
    }
  }, [qrRef, amount, recipient, label, message, memo]);

  // Poll for payment verification
  useEffect(() => {
    if (!qrRef || status !== 'pending') return;

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const recipientPubkey = new PublicKey(recipient);

    const checkPayment = async () => {
      try {
        // Find the reference in recent signatures
        const signatures = await connection.getSignaturesForAddress(recipientPubkey, { limit: 10 });
        
        for (const sig of signatures) {
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

    const interval = setInterval(checkPayment, 3000);
    return () => clearInterval(interval);
  }, [recipient, memo, status, onSuccess]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        ref={setQrRef} 
        className="bg-white p-4 rounded-lg"
        style={{ width: 380, height: 380 }}
      />
      
      <div className="text-center">
        {status === 'pending' && (
          <>
            <p className="text-lg font-semibold text-white mb-2">Scan with Solana Pay</p>
            <p className="text-sm text-gray-400">Amount: {amount} USDC</p>
            <p className="text-xs text-gray-500 mt-2">Waiting for payment...</p>
          </>
        )}
        {status === 'confirmed' && (
          <>
            <p className="text-lg font-semibold text-green-400 mb-2">✅ Payment Received!</p>
            <p className="text-xs text-gray-400">Signature: {signature?.slice(0, 16)}...</p>
          </>
        )}
      </div>
    </div>
  );
}
