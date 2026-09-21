'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/use-store';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  Heart, 
  CheckSquare, 
  ShieldAlert, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, store } = useAppStore();

  const isAdmin = currentUser.role === 'admin';

  const surfaces = [
    { name: '05 Reports & Analytics', href: '/admin', icon: BarChart3 },
    { name: '01 User Management', href: '/admin/users', icon: Users },
    { name: '02 Draw Management', href: '/admin/draws', icon: Trophy },
    { name: '03 Charity Management', href: '/admin/charities', icon: Heart },
    { name: '04 Winners Management', href: '/admin/winners', icon: CheckSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/30 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Operational Command Console (§ 11)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Five control surfaces covering users, draw simulation, charities, verification, and reporting.
          </p>
        </div>

        {/* Admin Access Switcher if logged in as regular user */}
        {!isAdmin && (
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-amber-200">
              You are currently viewing as a regular subscriber.
            </div>
            <button
              onClick={() => store.switchUser('a0000000-0000-0000-0000-000000000001')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:brightness-110 shrink-0"
            >
              Switch to Admin
            </button>
          </div>
        )}
      </div>

      {/* Surface Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {surfaces.map((surface) => {
          const Icon = surface.icon;
          const isActive = pathname === surface.href;
          return (
            <Link
              key={surface.href}
              href={surface.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{surface.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Admin Surface Content */}
      <div>{children}</div>

    </div>
  );
}
