// WanderLux Protocol — Open Vacation Rental Marketplace
// Anyone can list. Curated by community.

export interface Property {
  id: string;
  owner: string; // Wallet address of lister
  title: string;
  description: string;
  propertyType: 'villa' | 'penthouse' | 'estate' | 'cabin' | 'castle' | 'yacht' | 'island';
  location: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  pricePerNight: number; // in SOL
  images: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  available: boolean;
  verified: boolean; // Platform verified badge
  rating: number;
  reviewCount: number;
  createdAt: string;
}

// PREMIUM SEED LISTINGS (for demo)
export const seedListings: Property[] = [
  {
    id: 'prop-001',
    owner: '3x9mP...K2z7',
    title: 'Santorini Sunset Villa',
    description: 'Perched on caldera cliffs. Infinity pool. Private chef available.',
    propertyType: 'villa',
    location: { city: 'Oia', country: 'Greece' },
    pricePerNight: 12.5,
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    ],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Infinity Pool', 'Sea View', 'Private Chef', 'Concierge', 'Helipad'],
    available: true,
    verified: true,
    rating: 4.9,
    reviewCount: 127,
    createdAt: '2026-01-15',
  },
  {
    id: 'prop-002',
    owner: '7kR2x...M9p4',
    title: 'Kyoto Machiya Estate',
    description: 'Traditional wooden townhouse. Zen garden. Tea room.',
    propertyType: 'estate',
    location: { city: 'Kyoto', country: 'Japan' },
    pricePerNight: 8.0,
    images: [
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800',
    ],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['Zen Garden', 'Tea Room', 'Onsen Access', 'Kimono Experience'],
    available: true,
    verified: true,
    rating: 4.8,
    reviewCount: 89,
    createdAt: '2026-01-20',
  },
  {
    id: 'prop-003',
    owner: '2nQ8v...L3w1',
    title: 'Patagonia Wilderness Lodge',
    description: 'Remote eco-lodge. Glacier views. Guided treks included.',
    propertyType: 'cabin',
    location: { city: 'Torres del Paine', country: 'Chile' },
    pricePerNight: 15.0,
    images: [
      'https://images.unsplash.com/photo-1531761535209-1808e40d91b5?w=800',
    ],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Guided Treks', 'All Meals', 'Spa', 'Stargazing Dome'],
    available: true,
    verified: true,
    rating: 4.9,
    reviewCount: 203,
    createdAt: '2026-02-01',
  },
  {
    id: 'prop-004',
    owner: '9xY4m...K7z2',
    title: 'Maldives Overwater Villa',
    description: 'Glass-floor villa. Private reef. Underwater dining.',
    propertyType: 'villa',
    location: { city: 'Baa Atoll', country: 'Maldives' },
    pricePerNight: 35.0,
    images: [
      'https://images.unsplash.com/photo-1573843981267-be1999ff5cd2?w=800',
    ],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Glass Floor', 'Private Reef', 'Butler', 'Seaplane Transfer'],
    available: true,
    verified: true,
    rating: 5.0,
    reviewCount: 56,
    createdAt: '2026-02-05',
  },
  {
    id: 'prop-005',
    owner: '4kM9p...X2w8',
    title: 'Tuscany Vineyard Estate',
    description: '15th-century villa. Wine cellar. Truffle hunting.',
    propertyType: 'castle',
    location: { city: 'Florence', country: 'Italy' },
    pricePerNight: 22.0,
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3b036d7fd?w=800',
    ],
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4,
    amenities: ['Wine Cellar', 'Pool', 'Chef', 'Truffle Tours', 'Olive Grove'],
    available: true,
    verified: false,
    rating: 4.7,
    reviewCount: 34,
    createdAt: '2026-02-06',
  },
];

// In-memory storage for runtime (would be on-chain in production)
let listings: Property[] = [...seedListings];

// CRUD Operations
export function createListing(property: Omit<Property, 'id' | 'createdAt'>): Property {
  const newProperty: Property = {
    ...property,
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    rating: 0,
    reviewCount: 0,
  };
  listings.push(newProperty);
  return newProperty;
}

export function getListings(): Property[] {
  return listings;
}

export function getListingById(id: string): Property | null {
  return listings.find(p => p.id === id) || null;
}

export function searchListings(query: string): Property[] {
  const q = query.toLowerCase();
  return listings.filter(p => 
    p.title.toLowerCase().includes(q) ||
    p.location.city.toLowerCase().includes(q) ||
    p.location.country.toLowerCase().includes(q) ||
    p.propertyType.toLowerCase().includes(q) ||
    p.amenities.some(a => a.toLowerCase().includes(q)) ||
    (p.pricePerNight <= parseInt(q) && !isNaN(parseInt(q)))
  );
}

// Agent API-friendly exports
export const protocol = {
  name: 'WanderLux',
  version: '1.0',
  chain: 'Solana',
  listings: seedListings,
  stats: {
    totalListings: seedListings.length,
    verifiedListings: seedListings.filter(l => l.verified).length,
    avgPrice: seedListings.reduce((a, b) => a + b.pricePerNight, 0) / seedListings.length,
  }
};
