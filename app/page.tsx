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
  description: string;
  rating: number;
}

// Demo data for Colosseum Hackathon
const demoHotels: Hotel[] = [
  {
    id: '1',
    name: 'Solana Grand Miami',
    location: 'Miami Beach, Florida',
    price: 185,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    amenities: ['Ocean View', 'Infinity Pool', 'Spa', 'Beach Access', 'WiFi'],
    roomsAvailable: 4,
    description: 'Luxury beachfront resort with NFT-verified room authenticity',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Crypto Valley Lodge',
    location: 'Zug, Switzerland',
    price: 275,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    amenities: ['Mountain View', 'Ski Access', 'Hot Tub', 'Fine Dining', 'WiFi'],
    roomsAvailable: 2,
    description: 'Alpine retreat in the heart of Switzerland crypto valley',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Blockchain Boutique Tokyo',
    location: 'Shibuya, Tokyo',
    price: 145,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    amenities: ['Smart Rooms', 'Onsen', 'City View', 'Robot Concierge', 'WiFi'],
    roomsAvailable: 6,
    description: 'Tech-forward hotel with AI concierge and smart contracts',
    rating: 4.6,
  },
  {
    id: '4',
    name: 'Web3 Wellness Retreat',
    location: 'Bali, Indonesia',
    price: 95,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    amenities: ['Yoga Studio', 'Organic Dining', 'Pool', 'Jungle View', 'WiFi'],
    roomsAvailable: 8,
    description: 'Eco-friendly wellness resort accepting USDC payments',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'DeFi Downtown Dubai',
    location: 'Downtown Dubai, UAE',
    price: 320,
    image: 'https://images.unsplash.com/photo-1512918760513-95f192632b13?w=800&q=80',
    amenities: ['Burj View', 'Rooftop Bar', 'Spa', 'Butler Service', 'WiFi'],
    roomsAvailable: 3,
    description: 'Ultra-luxury hotel with instant blockchain payments',
    rating: 4.9,
  },
  {
    id: '6',
    name: 'NFT Art Hotel Barcelona',
    location: 'Gothic Quarter, Barcelona',
    price: 165,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    amenities: ['Art Gallery', 'Rooftop Pool', 'Tapas Bar', 'Historic Location', 'WiFi'],
    roomsAvailable: 5,
    description: 'Boutique hotel featuring NFT artwork and crypto-native booking',
    rating: 4.5,
  },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  const searchHotels = async () => {
    if (!query.trim()) return;
    setLoading(true);
    
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 1200));
    
    // Enhanced search logic
    const queryLower = query.toLowerCase();
    const filtered = demoHotels.filter(
      (h) =>
        h.location.toLowerCase().includes(queryLower) ||
        h.amenities.some((a) => queryLower.includes(a.toLowerCase())) ||
        h.name.toLowerCase().includes(queryLower) ||
        h.description.toLowerCase().includes(queryLower) ||
        (queryLower.includes('luxury') && h.rating >= 4.8) ||
        (queryLower.includes('under $200') && h.price < 200) ||
        (queryLower.includes('cheap') && h.price < 150) ||
        (queryLower.includes('pool') && h.amenities.includes('Pool')) ||
        (queryLower.includes('beach') && h.amenities.includes('Beach Access'))
    );
    
    setResults(filtered.length > 0 ? filtered : demoHotels);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Solana Booking Agent
            </h1>
            <p className="text-lg text-gray-300">
              AI-powered hotel booking on Solana — NFT rooms, instant USDC payments
            </p>
          </div>
          <WalletButton />
        </div>

        {/* Search Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <label className="block text-sm font-medium mb-2 text-cyan-400">
            Describe your ideal hotel:
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Beach resort in Miami with pool, under $200 per night..."
            className="w-full h-24 bg-black/30 border border-white/30 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={searchHotels}
              disabled={loading || !query}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold disabled:opacity-50 hover:opacity-90 transition"
            >
              {loading ? '🤖 AI Searching...' : '🔍 Find Hotels'}
            </button>
            <button
              onClick={() => { setQuery(''); setResults([]); }}
              className="px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Try: "beach resort", "under $200", "luxury with pool", "Barcelona boutique"
          </p>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">
              🏨 {results.length} Hotel{results.length !== 1 && 's'} Found
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {results.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-6xl mb-4">🏖️</p>
            <p className="text-xl mb-2">Ready to find your perfect stay?</p>
            <p className="text-sm">Describe what you're looking for above</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>Powered by Solana • NFT Room Inventory • USDC Payments</p>
          <p className="mt-1">
            <span className="text-cyan-400">Colosseum Hackathon 2026</span> • Built with Next.js & Metaplex
          </p>
        </footer>
      </div>
    </main>
  );
}
