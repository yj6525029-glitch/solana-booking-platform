'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  BedDouble,
  Calendar,
  DollarSign,
  Settings,
  Heart,
  Wallet,
  Building2,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  userType: 'hotel' | 'client';
}

const hotelLinks = [
  { href: '/dashboard/hotel', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/hotel/rooms', label: 'Rooms', icon: BedDouble },
  { href: '/dashboard/hotel/bookings', label: 'Bookings', icon: Calendar },
  { href: '/dashboard/hotel/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/dashboard/hotel/settings', label: 'Settings', icon: Settings },
];

const clientLinks = [
  { href: '/dashboard/client', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/client/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard/client/wallet', label: 'Wallet', icon: Wallet },
];

export function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname();
  const links = userType === 'hotel' ? hotelLinks : clientLinks;
  const title = userType === 'hotel' ? 'Hotel Owner' : 'My Account';
  const Icon = userType === 'hotel' ? Building2 : Wallet;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <Icon className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-xl font-bold text-white">SolanaBooking</h1>
            <p className="text-xs text-slate-400">{title}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Disconnect</span>
        </button>
      </div>
    </aside>
  );
}
