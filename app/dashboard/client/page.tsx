'use client';

import { useState } from 'react';
import { Calendar, Clock, Wallet, Heart, Star, MapPin } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');

  const myBookings = [
    {
      id: 'BK001',
      hotel: 'Solana Grand Hotel',
      location: 'Miami Beach, FL',
      room: 'Ocean View Suite',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
      checkIn: '2026-02-15',
      checkOut: '2026-02-18',
      nights: 3,
      amount: 1050,
      status: 'confirmed' as const,
    },
    {
      id: 'BK002',
      hotel: 'Crypto Valley Resort',
      location: 'Zug, Switzerland',
      room: 'Alpine Suite',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
      checkIn: '2026-03-10',
      checkOut: '2026-03-14',
      nights: 4,
      amount: 2200,
      status: 'pending' as const,
    },
  ];

  const pastBookings = [
    {
      id: 'BK000',
      hotel: 'Blockchain Boutique Tokyo',
      location: 'Tokyo, Japan',
      room: 'Smart Pod',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
      checkIn: '2026-01-05',
      checkOut: '2026-01-08',
      nights: 3,
      amount: 540,
      status: 'completed' as const,
    },
  ];

  const favorites = [
    { id: '1', name: 'Solana Grand Hotel', location: 'Miami Beach, FL', rating: 4.9, price: 250 },
    { id: '2', name: 'DeFi Tower Dubai', location: 'Dubai, UAE', rating: 4.8, price: 380 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userType="client" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
          <p className="text-slate-400">Manage your bookings and favorites</p>
        </div>

        {/* Wallet Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="text-purple-400" size={24} />
              <span className="text-slate-400">USDC Balance</span>
            </div>
            <p className="text-2xl font-bold text-white">3,450.00 USDC</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="text-cyan-400" size={24} />
              <span className="text-slate-400">SOL Balance</span>
            </div>
            <p className="text-2xl font-bold text-white">12.45 SOL</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-green-400" size={24} />
              <span className="text-slate-400">Upcoming Trips</span>
            </div>
            <p className="text-2xl font-bold text-white">2</p>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Bookings</h2>
          <div className="space-y-4">
            {myBookings.map((booking) => (
              <div key={booking.id} className="flex gap-4 p-4 bg-slate-700/30 rounded-lg">
                <img src={booking.image} alt={booking.hotel} className="w-32 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{booking.hotel}</h3>
                      <p className="text-slate-400 text-sm flex items-center gap-1">
                        <MapPin size={14} /> {booking.location}
                      </p>
                      <p className="text-cyan-400 text-sm mt-1">{booking.room}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex gap-6 mt-3 text-sm text-slate-400">
                    <span>Check-in: {booking.checkIn}</span>
                    <span>Check-out: {booking.checkOut}</span>
                    <span>{booking.nights} nights</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-white">{booking.amount} USDC</span>
                    {booking.status === 'pending' && (
                      <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Hotels */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Favorite Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((hotel) => (
              <div key={hotel.id} className="p-4 bg-slate-700/30 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white">{hotel.name}</h3>
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    <MapPin size={14} /> {hotel.location}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="text-white">{hotel.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{hotel.price} USDC</p>
                  <p className="text-slate-400 text-sm">per night</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
