'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Building2,
  Heart,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userType?: 'hotel' | 'client';
}

export function Sidebar({ activeTab, onTabChange, userType = 'hotel' }: SidebarProps) {
  const hotelNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: Building2 },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const clientNavItems = [
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = userType === 'hotel' ? hotelNavItems : clientNavItems;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          {userType === 'hotel' ? 'Hotel Portal' : 'Travel Dashboard'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {userType === 'hotel' ? 'Manage your property' : 'Manage your trips'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {userType === 'hotel' ? 'H' : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">
              {userType === 'hotel' ? 'Hotel Owner' : 'Traveler'}
            </p>
            <p className="text-slate-400 text-sm truncate">
              {userType === 'hotel' ? 'Solana Grand' : 'Guest Account'}
            </p>
          </div>
        </div>
        
        <button className="w-full mt-4 flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
          <LogOut size={20} />
          <span>Disconnect</span>
        </button>
      </div>
    </aside>
  );
}
