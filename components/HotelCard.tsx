'use client';

import { useState } from 'react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  amenities: string[];
  roomsAvailable: number;
  description: string;
  rating: number;
}

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [booking, setBooking] = useState(false);
  const [selectedNights, setSelectedNights] = useState(1);

  const handleBook = async () => {
    if (hotel.roomsAvailable === 0) {
      alert('No rooms available');
      return;
    }
    setBooking(true);
    
    // Simulate booking flow
    await new Promise((r) => setTimeout(r, 1500));
    
    alert(
      `✅ Booking Initiated!\n\n` +
      `Hotel: ${hotel.name}\n` +
      `Location: ${hotel.location}\n` +
      `Duration: ${selectedNights} night${selectedNights > 1 ? 's' : ''}\n` +
      `Total: ${hotel.price * selectedNights} USDC\n\n` +
      `Next steps:\n` +
      `1. NFT room reservation created\n` +
      `2. USDC payment via Solana Pay\n` +
      `3. Confirmation sent to wallet`
    );
    setBooking(false);
  };

  const totalPrice = (hotel.price * selectedNights).toFixed(2);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-cyan-500/50 transition group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur rounded-full px-3 py-1 text-xs font-medium text-white">
          ⭐ {hotel.rating}
        </div>
        <div className="absolute top-3 right-3 bg-cyan-500/90 backdrop-blur rounded-full px-3 py-1 text-xs font-medium text-white">
          {hotel.roomsAvailable} left
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold text-cyan-400">{hotel.name}</h2>
            <p className="text-sm text-gray-300">{hotel.location}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{hotel.description}</p>

        {/* Amenities */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {hotel.amenities.slice(0, 4).map((a) => (
            <span key={a} className="text-xs bg-purple-500/30 px-2 py-1 rounded-full">
              {a}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="text-xs bg-purple-500/30 px-2 py-1 rounded-full">
              +{hotel.amenities.length - 4}
            </span>
          )}
        </div>

        {/* Price & Nights */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-green-400">{totalPrice} USDC</p>
            <p className="text-xs text-gray-400">for {selectedNights} night(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Nights:</label>
            <select
              value={selectedNights}
              onChange={(e) => setSelectedNights(Number(e.target.value))}
              className="bg-black/30 border border-white/30 rounded px-2 py-1 text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((n) => (
                <option key={n} value={n} className="bg-gray-900">
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBook}
          disabled={booking || hotel.roomsAvailable === 0}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {booking ? (
            <>
              <span className="animate-spin">⏳</span> Processing...
            </>
          ) : hotel.roomsAvailable > 0 ? (
            <>
              💳 Book with Solana Pay
            </>
          ) : (
            'Sold Out'
          )}
        </button>
      </div>
    </div>
  );
}
