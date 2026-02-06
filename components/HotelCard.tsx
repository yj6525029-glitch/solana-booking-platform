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
}

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [booking, setBooking] = useState(false);

  const handleBook = async () => {
    if (hotel.roomsAvailable === 0) {
      alert('No rooms available');
      return;
    }
    setBooking(true);
    // Booking logic will connect to NFT inventory + Solana Pay
    setTimeout(() => {
      alert(`Booking initiated for ${hotel.name}!\n\nThis will:\n1. Check NFT room availability\n2. Create escrow booking\n3. Process Solana Pay payment`);
      setBooking(false);
    }, 2000);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-cyan-500/50 transition">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-cyan-400">{hotel.name}</h2>
          <p className="text-gray-300">{hotel.location}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {hotel.amenities.map((a) => (
              <span key={a} className="text-xs bg-purple-500/30 px-2 py-1 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-400">{hotel.price} USDC</p>
          <p className="text-sm text-gray-400">per night</p>
          <p className={`text-sm mt-1 ${hotel.roomsAvailable > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            {hotel.roomsAvailable > 0 ? `${hotel.roomsAvailable} NFT rooms left` : 'Sold out'}
          </p>
        </div>
      </div>
      <button
        onClick={handleBook}
        disabled={booking || hotel.roomsAvailable === 0}
        className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
      >
        {booking ? 'Processing...' : hotel.roomsAvailable > 0 ? 'Book with Solana Pay' : 'No Rooms Available'}
      </button>
    </div>
  );
}
