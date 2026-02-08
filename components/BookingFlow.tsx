'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEscrowPayment } from '@/hooks/useEscrowPayment';
import { Property } from '@/data/listings';
import { X, Check, Loader2 } from 'lucide-react';

interface BookingFlowProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingFlow({ property, isOpen, onClose, onSuccess }: BookingFlowProps) {
  const wallet = useWallet();
  const { createEscrowPayment, status, error } = useEscrowPayment();
  const [nights, setNights] = useState(2);
  const [step, setStep] = useState<'confirm' | 'pay' | 'complete'>('confirm');

  const total = property.pricePerNight * nights;
  const serviceFee = total * 0.2; // 20% platform fee
  const ownerReceives = total - serviceFee;

  if (!isOpen) return null;

  const handleBook = async () => {
    if (!wallet.publicKey) return;
    
    setStep('pay');
    const result = await createEscrowPayment({
      amount: total,
      bookingId: `wander-${property.id}-${Date.now()}`,
      hotelPubkey: property.owner,
      customerWallet: wallet.publicKey.toString(),
    });

    if (result) {
      setStep('complete');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-luxury rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gold">Book Stay</h2>
          <button onClick={onClose} className="text-cream/60 hover:text-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'confirm' && (
          <>
            {/* Property Preview */}
            <div className="flex gap-4 mb-6">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold text-cream">{property.title}</h3>
                <p className="text-sm text-cream/60">{property.location.city}</p>
                <p className="text-gold text-sm">{property.pricePerNight} SOL/night</p>
              </div>
            </div>

            {/* Nights Selector */}
            <div className="mb-6">
              <label className="text-sm text-cream/60 mb-2 block">Nights</label>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 7, 14].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNights(n)}
                    className={`px-4 py-2 rounded-xl transition ${
                      nights === n 
                        ? 'bg-gold text-midnight' 
                        : 'glass-luxury text-cream hover:bg-white/5'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="glass-luxury rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between text-cream/80">
                <span>{nights} nights × {property.pricePerNight} SOL</span>
                <span>{total.toFixed(2)} SOL</span>
              </div>
              <div className="flex justify-between text-cream/60">
                <span>Platform fee (20%)</span>
                <span>{serviceFee.toFixed(2)} SOL</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                <span className="text-cream">Total</span>
                <span className="text-gold">{total.toFixed(2)} SOL</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleBook}
              disabled={!wallet.connected}
              className="btn-luxury w-full py-4 text-lg font-bold"
            >
              {!wallet.connected ? 'Connect Wallet' : 'Confirm & Pay'}
            </button>
          </>
        )}

        {step === 'pay' && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-cream mb-2">Processing Escrow</h3>
            <p className="text-cream/60">Creating secure payment...</p>
            {status === 'failed' && (
              <p className="text-rose-400 mt-4">{error}</p>
            )}
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-cream mb-2">Booking Confirmed!</h3>
            <p className="text-cream/60">NFT receipt minted</p>
            <p className="text-gold text-sm mt-2">{total.toFixed(2)} SOL in escrow</p>
          </div>
        )}
      </div>
    </div>
  );
}
