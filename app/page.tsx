'use client';

import { useState } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { HotelCard } from '@/components/HotelCard';

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  amenities: string[];
  roomsAvailable: number;
}

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Solana Grand Hotel',
    location: 'Miami, FL',
    price: 250,
    image: '/hotel1.jpg',
    amenities: ['Pool', 'WiFi', 'Gym', 'Beach Access'],
    roomsAvailable: 5,
  },
  {
    id: '2',
    name: 'Crypto Valley Resort',
    location: 'Zug, Switzerland',
    price: 420,
    image: '/hotel2.jpg',
    amenities: ['Spa', 'WiFi', 'Restaurant', 'Mountain View'],
    roomsAvailable: 3,
  },
  {
    id: '3',
    name: 'Blockchain Boutique',
    location: 'Tokyo, Japan',
    price: 180,
    image: '/hotel3.jpg',
    amenities: ['WiFi', 'Smart Rooms', 'Onsen', 'City View'],
    roomsAvailable: 8,
  },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  const searchHotels = async () => {
    if (!query.trim()) return;
    setLoading(true);
    // Simulate AI processing - will connect to NVIDIA API
    await new Promise((r) => setTimeout(r, 1500));
    const filtered = mockHotels.filter(
      (h) =>
        h.location.toLowerCase().includes(query.toLowerCase()) ||
        h.amenities.some((a) => query.toLowerCase().includes(a.toLowerCase())) ||
        (query.toLowerCase().includes('luxury') && h.price > 300)
    );
    setResults(filtered.length > 0 ? filtered : mockHotels);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Solana Booking Agent
            </h1>
            <p className="text-xl text-gray-300">
              AI-powered hotel booking on Solana — NFT rooms, instant payments, zero overbooking
            </p>
          </div>
          <WalletButton />
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <label className="block text-sm font-medium mb-2 text-cyan-400">
            Describe your ideal hotel:
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Luxury beach resort in Miami with pool, under $300 per night..."
            className="w-full h-24 bg-black/30 border border-white/30 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          <button
            onClick={searchHotels}
            disabled={loading || !query}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold disabled:opacity-50 hover:opacity-90 transition"
          >
            {loading ? 'AI Thinking...' : 'Find Hotels'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="grid gap-6">
            {results.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
