'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Heart, 
  Search, 
  Filter, 
  Calendar, 
  ArrowRight, 
  ExternalLink,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function CharitiesDirectoryPage() {
  const { charities } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(charities.map((c) => c.category)))];

  const filteredCharities = charities.filter((charity) => {
    const matchesSearch =
      charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || charity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Giving Directory (§ 08)</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Partner Charities & Impact Foundations
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Every Digital Heroes member directs a minimum of 10% of their subscription to one of these organizations. Discover their missions and support them through golf events or direct contributions.
        </p>
      </div>

      {/* Filters & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f1522] border border-slate-800">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, cause, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              {cat === 'all' ? 'All Causes' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* Charity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCharities.map((charity) => (
          <div
            key={charity.id}
            className="rounded-2xl bg-[#0f1522] border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all shadow-lg"
          >
            <div>
              {/* Banner Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={charity.banner_url}
                  alt={charity.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1522] via-[#0f1522]/40 to-transparent" />
                
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                  {charity.category}
                </span>

                {charity.featured && (
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/90 text-black flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {charity.name}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {charity.tagline}
                </p>

                {/* Raised & Events summary */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Raised</span>
                    <span className="text-emerald-400 font-bold text-base">\${charity.total_raised.toLocaleString()}</span>
                  </div>

                  {charity.events && charity.events.length > 0 ? (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Upcoming</span>
                      <span className="text-amber-400 font-medium text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {charity.events.length} Golf Day
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500">No events scheduled</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 pt-0 flex items-center gap-3">
              <Link
                href={`/charities/${charity.slug}`}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCharities.length === 0 && (
        <div className="text-center py-16 bg-[#0f1522] rounded-3xl border border-slate-800 space-y-3">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No charities match your search</h3>
          <p className="text-xs text-slate-400">Try adjusting your keywords or clearing the category filter.</p>
        </div>
      )}

    </div>
  );
}
