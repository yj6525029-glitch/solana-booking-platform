'use client';

import { useState, useEffect } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { PropertyCard } from '@/components/PropertyCard';
import { seedListings, Property } from '@/data/listings';
import { Crown, Search, Plus, TrendingUp } from 'lucide-react';
import { ListPropertyModal } from '@/components/ListPropertyModal';

export default function Home() {
  const [query, setQuery] = useState('');
  const [listings, setListings] = useState<Property[]>(seedListings);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'villa' | 'penthouse' | 'estate' | 'verified'>('all');
  const [listModalOpen, setListModalOpen] = useState(false);

  const filteredListings = listings.filter(prop => {
    if (activeFilter === 'verified') return prop.verified;
    if (activeFilter !== 'all') return prop.propertyType === activeFilter;
    return true;
  }).filter(prop => {
    if (!query) return true;
    const q = query.toLowerCase();
    return prop.title.toLowerCase().includes(q) ||
           prop.location.city.toLowerCase().includes(q) ||
           prop.location.country.toLowerCase().includes(q) ||
           prop.amenities.some(a => a.toLowerCase().includes(q));
  });

  const stats = {
    total: listings.length,
    verified: listings.filter(l => l.verified).length,
    avgPrice: (listings.reduce((a, b) => a + b.pricePerNight, 0) / listings.length).toFixed(1),
  };

  return (
    <main className="min-h-screen luxury-gradient text-cream">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-shimmer flex items-center justify-center">
                <Crown className="w-5 h-5 text-midnight" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gold">WanderLux</h1>
                <p className="text-xs text-cream/60">Curated Stays Protocol</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setListModalOpen(true)} className="flex items-center gap-2 px-4 py-2 glass-luxury rounded-xl text-sm hover:bg-white/5 transition">
                <Plus className="w-4 h-4 text-gold" />
                List Property
              </button>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="gold-shimmer bg-clip-text text-transparent">
            Curated Stays
          </span>
          <br />
          <span className="text-cream/90">Verified On-Chain</span>
        </h2>
        <p className="text-xl text-cream/60 max-w-2xl mx-auto mb-10">
          Open marketplace for luxury vacation rentals. 
          Anyone can list. Curated by the community.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="glass-luxury px-6 py-4 rounded-2xl text-center">
            <p className="text-3xl font-bold text-gold">{stats.total}</p>
            <p className="text-sm text-cream/60">Properties</p>
          </div>
          <div className="glass-luxury px-6 py-4 rounded-2xl text-center">
            <p className="text-3xl font-bold text-gold">{stats.verified}</p>
            <p className="text-sm text-cream/60">Verified</p>
          </div>
          <div className="glass-luxury px-6 py-4 rounded-2xl text-center">
            <p className="text-3xl font-bold text-gold">{stats.avgPrice}</p>
            <p className="text-sm text-cream/60">Avg SOL/night</p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search villa, city, or amenity..."
              className="w-full glass-luxury rounded-2xl pl-12 pr-4 py-4 text-cream placeholder-cream/40 focus:outline-none focus:border-gold/30"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mt-6">
          {(['all', 'villa', 'penthouse', 'estate', 'verified'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm transition ${
                activeFilter === filter 
                  ? 'bg-gold text-midnight' 
                  : 'glass-luxury text-cream/80 hover:bg-white/5'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-cream">
              {activeFilter === 'all' ? 'Featured Properties' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Stays`}
            </h3>
            <div className="flex items-center gap-2 text-sm text-cream/60">
              <TrendingUp className="w-4 h-4" />
              Trending this week
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-cream/40 mb-4">No properties found</p>
              <p className="text-cream/60">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold-light font-bold text-xl mb-2">WanderLux</p>
          <p className="text-cream/40 text-sm mb-4">
            Open protocol for curated vacation rentals.
            <br />Built for the Colosseum Agent Hackathon.
          </p>
          <div className="flex justify-center gap-6 text-xs text-cream/40">
            <span>7884bb75</span>
            <span>Built by AI Agents</span>
            <span>Powered by Solana</span>
          </div>
        </div>
      </footer>
 <ListPropertyModal isOpen={listModalOpen} onClose={() => setListModalOpen(false)} />
    </main>
  );
}
