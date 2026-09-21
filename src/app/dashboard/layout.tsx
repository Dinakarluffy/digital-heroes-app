'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/use-store';
import { 
  Layers, 
  Trophy, 
  Heart, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser } = useAppStore();

  const isRestricted = currentUser.subscription_status !== 'active';

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Layers },
    { name: '5-Score Tracker', href: '/dashboard/scores', icon: Trophy },
    { name: 'Charity Giving', href: '/dashboard/charity', icon: Heart },
    { name: 'Draw Participation', href: '/dashboard/draws', icon: Calendar },
    { name: 'Winnings & Proof', href: '/dashboard/winnings', icon: DollarSign },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome, {currentUser.full_name}
            </h1>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
              currentUser.subscription_status === 'active'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {currentUser.subscription_status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registered Subscriber Account • {currentUser.email}
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          {isRestricted ? (
            <Link
              href="/subscribe"
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs hover:brightness-110 flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Activate Full Membership</span>
            </Link>
          ) : (
            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Plan Renewal</span>
              <span className="text-white font-medium">
                {currentUser.subscription_period_end 
                  ? new Date(currentUser.subscription_period_end).toLocaleDateString()
                  : 'Active'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Restricted Access Alert (§ 04) */}
      {isRestricted && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">Restricted Access Mode: </span>
              Your subscription is {currentUser.subscription_status}. Score entry and monthly draw eligibility require an active membership.
            </div>
          </div>
          <Link
            href="/subscribe"
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold shrink-0 hover:brightness-110"
          >
            Renew Subscription
          </Link>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div>{children}</div>

    </div>
  );
}
