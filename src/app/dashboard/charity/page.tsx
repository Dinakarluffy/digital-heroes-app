'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/use-store';
import { Heart, CheckCircle2, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

export default function DashboardCharityPage() {
  const { currentUser, charities, store } = useAppStore();

  const selectedCharity = charities.find((c) => c.id === currentUser.selected_charity_id) || charities[0];
  const [contributionPct, setContributionPct] = useState<number>(currentUser.charity_contribution_pct || 10);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCharity) {
      store.updateCharitySelection(currentUser.id, selectedCharity.id, contributionPct);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleSwitchCharity = (charityId: string) => {
    store.updateCharitySelection(currentUser.id, charityId, contributionPct);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const monthlyFee = currentUser.subscription_plan === 'yearly' ? 15 : 19;
  const monthlyCharityAmount = (monthlyFee * (contributionPct / 100)).toFixed(2);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Charity & Contribution (§ 08)</span>
        <h2 className="text-2xl font-bold text-white mt-1">Designated Charity & Impact</h2>
        <p className="text-xs text-slate-400 mt-1">
          Every subscription directs a portion of funds to a verified nonprofit. Minimum contribution is 10%.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Charity settings updated successfully!</span>
        </div>
      )}

      {/* Current Charity Card & Percentage Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Selected Charity Spotlight & Slider */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            Your Current Beneficiary
          </h3>

          {selectedCharity && (
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <div className="relative h-44 w-full">
                <img
                  src={selectedCharity.banner_url}
                  alt={selectedCharity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 text-emerald-300 border border-emerald-500/30">
                  {selectedCharity.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h4 className="text-xl font-bold text-white">{selectedCharity.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedCharity.tagline}</p>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Platform Impact:</span>
                  <span className="text-emerald-400 font-bold text-sm">\${selectedCharity.total_raised.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Slider Form */}
          <form onSubmit={handleUpdate} className="space-y-5 pt-4 border-t border-slate-800">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <label className="font-semibold text-slate-300 uppercase tracking-wider">
                  Contribution Percentage: <span className="text-emerald-400 font-bold text-sm">{contributionPct}%</span>
                </label>
                <span className="text-[11px] text-slate-400">Min 10% Required</span>
              </div>

              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={contributionPct}
                onChange={(e) => setContributionPct(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>10% (Baseline)</span>
                <span>25%</span>
                <span>50%</span>
                <span>100% (Maximum Giving)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">Your Monthly Contribution:</span>
              <span className="text-emerald-400 font-bold text-base">\${monthlyCharityAmount} / month</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-colors"
            >
              Save Contribution Settings
            </button>
          </form>
        </div>

        {/* Right 1 Col: Switch Charity List */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Switch Beneficiary</h3>
          <p className="text-xs text-slate-400">Select any partner from our directory:</p>

          <div className="space-y-3 pt-2">
            {charities.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSwitchCharity(c.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  c.id === selectedCharity?.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                  {c.id === selectedCharity?.id && (
                    <span className="text-[10px] bg-emerald-500 text-black px-1.5 py-0.2 rounded font-bold">Selected</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{c.tagline}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              href="/charities"
              className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Complete Charity Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
