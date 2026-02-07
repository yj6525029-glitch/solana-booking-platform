'use client';

import { useState } from 'react';
import { Building2, DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function HotelDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = [
    { title: 'Total Revenue', value: '12,450 USDC', change: 24, trend: 'up' as const, icon: <DollarSign size={24} /> },
    { title: 'Active Bookings', value: '23', change: 12, trend: 'up' as const, icon: <Calendar size={24} /> },
    { title: 'Total Rooms', value: '45', subtitle: '8 available', icon: <Building2 size={24} /> },
    { title: 'Guests This Month', value: '156', change: 8, trend: 'up' as const, icon: <Users size={24} /> },
  ];

  const pendingBookings = [
    { id: 'BK001', guest: 'Alice Crypto', room: 'Ocean Suite', dates: 'Feb 15-18', amount: 1050 },
    { id: 'BK002', guest: 'Bob Solana', room: 'Deluxe King', dates: 'Feb 20-22', amount: 760 },
    { id: 'BK003', guest: 'Charlie DeFi', room: 'Standard', dates: 'Mar 1-3', amount: 500 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Hotel Dashboard</h1>
          <p className="text-slate-400">Manage your property and bookings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Pending Bookings */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Pending Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Guest</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Dates</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-700/50">
                    <td className="py-4 text-cyan-400">{booking.id}</td>
                    <td className="py-4 text-white">{booking.guest}</td>
                    <td className="py-4 text-slate-300">{booking.room}</td>
                    <td className="py-4 text-slate-300">{booking.dates}</td>
                    <td className="py-4 text-green-400">{booking.amount} USDC</td>
                    <td className="py-4">
                      <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition">
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Revenue Overview</h2>
          <div className="h-48 flex items-end justify-between gap-2 px-4">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85].map((h, i) => (
              <div 
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500/50 to-purple-500/50 rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-slate-400 text-sm">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
      </main>
    </div>
  );
}
