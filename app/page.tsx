'use client';

import { useState, useEffect } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { HotelCard } from '@/components/HotelCard';
import { hotels, Hotel } from '@/data/hotels';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Load all hotels initially
  useEffect(() => {
    setResults(hotels);
  }, []);

  const searchHotels = async () => {
    if (!query.trim()) return;
    setLoading(true);
    
    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 1200));
    
    const queryLower = query.toLowerCase();
    const filtered = hotels.filter(
      (h) =>
        h.location.toLowerCase().includes(queryLower) ||
        h.amenities.some((a) => queryLower.includes(a.toLowerCase())) ||
        h.name.toLowerCase().includes(queryLower) ||
        h.description.toLowerCase().includes(queryLower) ||
        h.itinerary.some(day => 
          day.title.toLowerCase().includes(queryLower) ||
          day.activities.some(a => a.toLowerCase().includes(queryLower)) ||
          day.dining.some(d => d.toLowerCase().includes(queryLower))
        ) ||
        (queryLower.includes('luxury') && h.rating >= 4.8) ||
        (queryLower.includes('under $300') && h.price < 300) ||
        (queryLower.includes('under $400') && h.price < 400) ||
        (queryLower.includes('cheap') && h.price < 200) ||
        (queryLower.includes('pool') && h.amenities.includes('Infinity Pool')) ||
        (queryLower.includes('greek') && h.country === 'Greece') ||
        (queryLower.includes('japan') && h.country === 'Japan') ||
        (queryLower.includes('chile') && h.country === 'Chile') ||
        (queryLower.includes('beach') && h.amenities.includes('Sea View')) ||
        (queryLower.includes('hiking') && h.amenities.includes('Hiking Trails'))
    );
    
    setResults(filtered.length > 0 ? filtered : hotels);
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
              AI-powered hotel booking with itineraries — Book rooms, mint NFT receipts
            </p>
          </div>
          <WalletButton />
        </div>

        {/* Search Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <label className="block text-sm font-medium mb-2 text-cyan-400">
            Describe your ideal hotel or destination:
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Luxury Greek villas with sea view, or Tokyo with robot concierge, or hiking in Patagonia..."
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
              onClick={() => { setQuery(''); setResults(hotels); }}
              className="px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              Show All
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Try: "Greek sea view", "under $300", "Tokyo tech", "Patagonia hiking", "luxury with pool"
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
          <p>Powered by Solana Testnet • NFT Booking Confirmations • Real SOL Payments</p>
          <p className="mt-1">
            <span className="text-cyan-400">Colosseum Agent Hackathon 2026</span> • Built with Next.js & Anchor
          </p>
          <p className="mt-2 text-xs">
            <span className="text-yellow-400">Demo Hotels:</span> Santorini, Tokyo, Patagonia
          </p>
        </footer>
      </div>
    </main>
  );
}
