'use client';

import { useState, useCallback } from 'react';
import { SolanaPayQR } from './SolanaPayQR';

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
}

interface BookingModalProps {
  hotel: Hotel;
  nights: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Devnet hotel escrow wallet - in production this would be your program's vault
const HOTEL_ESCROW_WALLET = '4Z3r4pWk7v8d9s1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u';

export function BookingModal({ hotel, nights, isOpen, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState<'confirm' | 'payment' | 'minting' | 'complete'>('confirm');
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = hotel.price * nights;
  const memo = `BOOKING-${hotel.id}-${Date.now()}`;

  const handlePaymentSuccess = useCallback((signature: string) => {
    setTxSignature(signature);
    setStep('minting');
    
    // Simulate NFT minting delay (will be replaced with actual Metaplex call)
    setTimeout(() => {
      setStep('complete');
      onSuccess();
    }, 2000);
  }, [onSuccess]);

  const handlePaymentError = useCallback((err: string) => {
    setError(err);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 px-6 py-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Book Room</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>
        </div>

        <div className="p-6">
          {step === 'confirm' && (
            <>
              <div className="mb-6">
                <img src={hotel.image} alt={hotel.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold text-cyan-400">{hotel.name}</h3>
                <p className="text-gray-400 text-sm">{hotel.location}</p>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Price per night</span>
                  <span className="text-white">{hotel.price} USDC</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Nights</span>
                  <span className="text-white">{nights}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-lg font-bold text-green-400">{totalAmount} USDC</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition">
                  Cancel
                </button>
                <button 
                  onClick={() => setStep('payment')} 
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Proceed to Payment
                </button>
              </div>
            </>
          )}

          {step === 'payment' && (
            <>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">Pay with Solana Pay</h3>
                <p className="text-sm text-gray-400">Scan the QR code with your Solana wallet</p>
              </div>

              <SolanaPayQR
                amount={totalAmount}
                recipient={HOTEL_ESCROW_WALLET}
                label={hotel.name}
                message={`Booking at ${hotel.name} for ${nights} night(s)`}
                memo={memo}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />

              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
            </>
          )}

          {step === 'minting' && (
            <div className="text-center py-12">
              <div className="animate-spin text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold text-white mb-2">Minting Your NFT...</h3>
              <p className="text-gray-400">Creating your booking confirmation</p>
              {txSignature && (
                <p className="text-xs text-gray-500 mt-4">TX: {txSignature.slice(0, 16)}...</p>
              )}
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
              <p className="text-gray-400 mb-4">Your reservation is secured on-chain</p>
              
              {txSignature && (
                <a 
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm hover:bg-cyan-500/30 transition"
                >
                  View on Explorer ↗
                </a>
              )}

              <button 
                onClick={onClose} 
                className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
