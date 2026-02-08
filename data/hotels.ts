export interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  image: string;
  amenities: string[];
  roomsAvailable: number;
  description: string;
  rating: number;
  itinerary: DayItinerary[];
}

export interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
  dining: string[];
}

export const hotels: Hotel[] = [
  {
    id: '1',
    name: 'Santorini Sunset Villas',
    location: 'Oia, Santorini, Greece',
    country: 'Greece',
    price: 420,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    amenities: ['Infinity Pool', 'Private Terrace', 'Sea View', 'Breakfast Included', 'WiFi', 'Air Conditioning'],
    roomsAvailable: 3,
    description: 'Luxury cliffside villas with breathtaking caldera views and traditional Greek architecture',
    rating: 4.9,
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Sunset',
        activities: [
          'Check-in with welcome wine tasting',
          'Explore Oia Castle ruins',
          'Sunset viewing from famous blue-domed churches',
          'Evening stroll through whitewashed streets'
        ],
        dining: ['Recommended: Ambrosia restaurant - cliffside dining', 'Local taverna: Taverna Katina - fresh seafood']
      },
      {
        day: 2,
        title: 'Island Exploration',
        activities: [
          'Morning catamaran cruise to volcanic hot springs',
          'Red Beach visit and snorkeling',
          'Wine tasting at Venetsanos Winery',
          'Relaxation at hotel infinity pool'
        ],
        dining: ['Lunch: Naoussa restaurant in Fira', 'Dinner: Selene - gourmet Greek cuisine']
      },
      {
        day: 3,
        title: 'Cultural Immersion',
        activities: [
          'Ancient Akrotiri archaeological site tour',
          'Pyrgos village exploration',
          'Traditional pottery workshop',
          'Sunset sailing cruise with dinner'
        ],
        dining: ['Traditional bakery breakfast', 'Sunset dinner cruise included']
      }
    ]
  },
  {
    id: '2',
    name: 'Tokyo Cyber Ninjas Hotel',
    location: 'Shinjuku, Tokyo, Japan',
    country: 'Japan',
    price: 285,
    image: 'https://images.unsplash.com/photo-1540959733?w=800&q=80',
    amenities: ['Smart Rooms', 'Onsen Spa', 'Robot Concierge', 'High-Speed WiFi', 'Metro Access', 'Late Checkout'],
    roomsAvailable: 5,
    description: 'Futuristic tech-forward hotel in the heart of Tokyo\'s entertainment district',
    rating: 4.7,
    itinerary: [
      {
        day: 1,
        title: 'Neon Tokyo',
        activities: [
          'Check-in with biometric keycard',
          'Explore Shinjuku Golden Gai alleyways',
          'Tokyo Metropolitan Government Building observatory (free!)',
          'Late-night ramen in Memory Lane (Omoide Yokocho)'
        ],
        dining: ['Ichiran Ramen - famous tonkotsu', 'Robot Restaurant show with bento']
      },
      {
        day: 2,
        title: 'Tradition Meets Future',
        activities: [
          'Morning onsen spa session at hotel',
          'Meiji Shrine visit',
          'Harajuku fashion district shopping',
          'Shibuya Crossing experience',
          'TeamLab Borderless digital art museum'
        ],
        dining: ['Breakfast: 7-Eleven onigiri + convenience store coffee', 'Sushi at Daiwa Sushi Tsukiji', 'Robot Restaurant show with bento', 'Sushi at Daiwa Sushi Tsukiji', 'Sushi at Daiwa Sushi Tsukiji', 'Sushi at Daiwa Sushi Tsukiji', 'Sushi at Daiwa Sushi Tsukiji']
      },
      {
        day: 3,
        title: 'Digital Culture',
        activities: [
          'Akihabara electronics district',
          'Maid cafe experience',
          'Nakano Broadway for anime memorabilia',
          'Night photography tour'
        ],
        dining: ['Kawaii Monster Cafe', 'Gonpachi - Kill Bill restaurant']
      }
    ]
  },
  {
    id: '3',
    name: 'Patagonia Eco Lodge',
    location: 'Torres del Paine, Chile',
    country: 'Chile',
    price: 380,
    image: 'https://images.unsplash.com/photo-1531761535209-1808e40d91b5?w=800&q=80',
    amenities: ['Eco-Friendly', 'Hiking Trails', 'All Meals', 'Spa', 'Guided Tours', 'Stargazing'],
    roomsAvailable: 8,
    description: 'Sustainable luxury eco-lodge in the heart of Patagonian wilderness',
    rating: 4.8,
    itinerary: [
      {
        day: 1,
        title: 'Wilderness Arrival',
        activities: [
          'Scenic transfer from Puerto Natales',
          'Welcome pisco sour ceremony',
          'Lake Grey glacier viewing',
          'Gentle orientation hike',
          'Evening stargazing session'
        ],
        dining: ['Local lamb asado dinner', 'Patagonian craft beers']
      },
      {
        day: 2,
        title: 'Torres del Paine Trek',
        activities: [
          'Early breakfast (4:30 AM)',
          'Full-day W Trek to Base Torres',
          'Alpine lakes viewing',
          'Condor sighting at Mirador Condor',
          'Spa recovery session'
        ],
        dining: ['Packed trail lunch', 'Gourmet dinner featuring local king crab']
      },
      {
        day: 3,
        title: 'Glacier Adventure',
        activities: [
          'Boat tour of Grey Glacier',
          'Ice hiking with crampons',
          'Kayaking on Lake Grey',
          'Farewell dinner with traditional folklore'
        ],
        dining: ['Breakfast with Patagonian honey', 'Glacier picnic', 'Award-winning restaurant BordeBaker']
      }
    ]
  }
];

// Helper function to get itinerary for a specific hotel
export function getHotelItinerary(hotelId: string): DayItinerary[] | null {
  const hotel = hotels.find(h => h.id === hotelId);
  return hotel?.itinerary || null;
}

// Export for AI search
export interface SearchableHotel {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  amenities: string[];
  description: string;
  rating: number;
  tags: string[];
}

export const searchableHotels: SearchableHotel[] = hotels.map(h => ({
  id: h.id,
  name: h.name,
  location: h.location,
  country: h.country,
  price: h.price,
  amenities: h.amenities,
  description: h.description,
  rating: h.rating,
  tags: [
    h.country.toLowerCase(),
    ...h.amenities.map(a => a.toLowerCase().replace(' ', '-'))
  ]
}));
