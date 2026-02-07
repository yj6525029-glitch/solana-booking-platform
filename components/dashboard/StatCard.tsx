'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  trend?: 'up' | 'down';
  icon: ReactNode;
}

export function StatCard({ title, value, subtitle, change, trend, icon }: StatCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
          {change !== undefined && trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{change}%</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-slate-700/50 rounded-lg text-cyan-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
