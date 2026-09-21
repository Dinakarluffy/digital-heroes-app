'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Heart, 
  Trophy, 
  Shield, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, users, store } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const isAdmin = currentUser.role === 'admin';
  const isSubscriber = currentUser.subscription_status === 'active';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080c14]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
              <span className="font-bold text-lg text-white font-mono tracking-tighter">DH</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-sans">DIGITAL<span className="text-emerald-400">.</span>HEROES</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Golf & Charitable Impact</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/how-it-works" 
            className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/how-it-works' ? 'text-emerald-400' : 'text-slate-300'}`}
          >
            How It Works
          </Link>
          <Link 
            href="/charities" 
            className={`text-sm font-medium transition-colors hover:text-white ${pathname.startsWith('/charities') ? 'text-emerald-400' : 'text-slate-300'}`}
          >
            Charity Directory
          </Link>
          <Link 
            href="/subscribe" 
            className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/subscribe' ? 'text-emerald-400' : 'text-slate-300'}`}
          >
            Membership
          </Link>

          {/* Contextual Dashboards */}
          {isAdmin ? (
            <Link 
              href="/admin" 
              className={`text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                pathname.startsWith('/admin') 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                  : 'text-amber-400/90 border-amber-500/30 hover:bg-amber-500/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          ) : (
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-white ${
                pathname.startsWith('/dashboard') ? 'text-emerald-400' : 'text-slate-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Section: Evaluator Quick Role Switcher + CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* Quick Evaluator Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSwitcherOpen(!switcherOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 text-xs rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 transition-colors text-slate-200"
              title="Test user switch for evaluation"
            >
              <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-400 animate-pulse' : isSubscriber ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span className="font-semibold">{currentUser.full_name}</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {switcherOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#121824] border border-slate-700 shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Evaluation Test Switcher</p>
                  <p className="text-xs text-slate-300 mt-0.5">Switch perspective with 1 click:</p>
                </div>
                <div className="py-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        store.switchUser(u.id);
                        setSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        u.id === currentUser.id ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-white flex items-center gap-1.5">
                          {u.full_name}
                          {u.role === 'admin' && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">Admin</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {u.subscription_status} {u.subscription_plan ? `• ${u.subscription_plan}` : ''}
                        </div>
                      </div>
                      {u.id === currentUser.id && <span className="text-emerald-400 text-xs">✓ Active</span>}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800 px-2 pb-1">
                  <button
                    onClick={() => {
                      store.resetState();
                      setSwitcherOpen(false);
                    }}
                    className="w-full text-center text-[11px] text-slate-400 hover:text-slate-200 py-1 hover:underline"
                  >
                    Reset Demo State to Default
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Action Button */}
          {isAdmin ? (
            <Link
              href="/admin/draws"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs shadow-md hover:brightness-110 transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              Draw Control
            </Link>
          ) : isSubscriber ? (
            <Link
              href="/dashboard/scores"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-md hover:brightness-110 transition-all"
            >
              <span>Enter Scores</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/subscribe"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-xs shadow-md hover:brightness-110 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Join Platform
            </Link>
          )}

        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0c111a] px-4 py-5 space-y-4">
          <nav className="flex flex-col gap-3">
            <Link 
              href="/how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-slate-300 py-1"
            >
              How It Works
            </Link>
            <Link 
              href="/charities" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-slate-300 py-1"
            >
              Charity Directory
            </Link>
            <Link 
              href="/subscribe" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-slate-300 py-1"
            >
              Membership
            </Link>
            {isAdmin ? (
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-amber-400 py-1 font-semibold"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link 
                href="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-emerald-400 py-1 font-semibold"
              >
                Subscriber Dashboard
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-[11px] font-semibold uppercase text-slate-400 mb-2">Switch Test User</p>
            <div className="grid grid-cols-2 gap-2">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    store.switchUser(u.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded text-xs text-left truncate ${
                    u.id === currentUser.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {u.full_name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
