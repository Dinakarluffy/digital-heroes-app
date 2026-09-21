'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Heart, 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  Gift, 
  Users, 
  CheckCircle2, 
  HelpCircle,
  Flame,
  Award
} from 'lucide-react';

export default function HomePage() {
  const { charities, draws, currentUser } = useAppStore();
  const featuredCharities = charities.filter((c) => c.featured).slice(0, 3);
  
  // Interactive Score Matcher Sandbox for Public Visitor Engagement
  const [sandboxScores, setSandboxScores] = useState<number[]>([36, 40, 32, 28, 38]);
  const [sampleDraw] = useState<number[]>([14, 27, 32, 36, 40]);

  const matchedNumbers = sandboxScores.filter(s => sampleDraw.includes(s));
  const latestDraw = draws[0];

  return (
    <div className="space-y-24 pb-20">

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        {/* Subtle Ambient Gradients (No golf grass clichés) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-amber-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium">March 2026 Monthly Prize Pool Open</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Flame className="w-3 h-3" /> \$1,360+ Rollover Jackpot
            </span>
          </div>

          {/* Emotional Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Play with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Purpose</span>.<br />
            Win with <span className="underline decoration-emerald-500/50 underline-offset-8">Impact</span>.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            The modern athletic reward platform. Turn your everyday Stableford golf rounds into charitable funding and participate in monthly draw-based prize pools.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/subscribe"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-base shadow-xl shadow-emerald-500/20 hover:scale-[1.02] hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Join Digital Heroes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/charities"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 font-medium text-base hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Explore Charities</span>
            </Link>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-left">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Charity Allocation</p>
              <p className="mt-1 text-2xl font-bold text-white">Min. 10%</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Adjustable up to 100%</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-left">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Unclaimed Jackpot</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">\$1,360</p>
              <p className="text-[11px] text-amber-300/80 mt-0.5">Carried into March Draw</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-left">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Score Format</p>
              <p className="mt-1 text-2xl font-bold text-white">1–45 Pts</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Stableford handicap rules</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-left">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Verification</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">100%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Admin audited scorecards</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE THREE-STEP LOOP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">The Mechanics</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-bold text-white">How Digital Heroes Works</p>
          <p className="mt-4 text-base text-slate-400">
            A seamless bridge between your golf scorecard, verifiable monthly draws, and direct philanthropic impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-8 rounded-2xl bg-[#0f1522] border border-slate-800 relative group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Log Your 5 Scores</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Enter your last 5 golf rounds using Stableford scoring (1–45 points). Only one score per date is permitted. New rounds automatically replace your oldest score.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Your 5 scores become your lottery ticket</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-2xl bg-[#0f1522] border border-slate-800 relative group hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Empower A Cause</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Select a verified cause from our directory. At least 10% of every monthly subscription is automatically donated. You can increase your contribution anytime or give directly.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Heart className="w-4 h-4" />
              <span>Transparent reporting & direct charity payouts</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-2xl bg-[#0f1522] border border-slate-800 relative group hover:border-teal-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Win Monthly Jackpots</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              On the final day of each month, 5 numbers are drawn. Match 3, 4, or 5 to share in the guaranteed 25%, 35%, and 40% prize pools. Unclaimed 5-match jackpots roll over!
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <Trophy className="w-4 h-4" />
              <span>Upload scorecard screenshot to claim prize</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE MATCH SANDBOX (§ 12 Emotion-driven, dynamic interaction) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#121824] to-[#0d131d] border border-slate-800 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Interactive Preview</span>
              <h3 className="text-2xl font-bold text-white mt-1">See How Your Golf Scores Win</h3>
              <p className="text-xs text-slate-400 mt-1">
                Simulate matching your 5 active scores against recent draw numbers: <span className="font-mono text-amber-300">[14, 27, 32, 36, 40]</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300">Matches:</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
                {matchedNumbers.length} / 5 Numbers
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-slate-300 mb-3 font-medium">Adjust your 5 Stableford scores (1–45):</p>
              <div className="grid grid-cols-5 gap-3">
                {sandboxScores.map((score, idx) => (
                  <div key={idx} className="space-y-1 text-center">
                    <input
                      type="number"
                      min={1}
                      max={45}
                      value={score}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(45, parseInt(e.target.value) || 1));
                        const next = [...sandboxScores];
                        next[idx] = val;
                        setSandboxScores(next);
                      }}
                      className={`w-full py-3 text-center text-lg font-bold rounded-xl border transition-all ${
                        sampleDraw.includes(score)
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-900 border-slate-700 text-white focus:border-slate-500'
                      }`}
                    />
                    <span className="text-[10px] text-slate-400">Score {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome Display */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className={`w-8 h-8 ${matchedNumbers.length >= 3 ? 'text-amber-400 animate-bounce' : 'text-slate-600'}`} />
                <div>
                  <div className="text-sm font-semibold text-white">
                    {matchedNumbers.length === 5 && '🌟 JACKPOT! 5-Number Match! (40% Pool Share)'}
                    {matchedNumbers.length === 4 && '🥈 Tier 2 Winner! 4-Number Match! (35% Pool Share)'}
                    {matchedNumbers.length === 3 && '🥉 Tier 3 Winner! 3-Number Match! (25% Pool Share)'}
                    {matchedNumbers.length < 3 && 'Keep playing rounds to hit 3, 4, or 5 matches!'}
                  </div>
                  <div className="text-xs text-slate-400">
                    Matched: {matchedNumbers.length > 0 ? matchedNumbers.join(', ') : 'None yet'}
                  </div>
                </div>
              </div>
              <Link
                href="/subscribe"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors shrink-0"
              >
                Play with Real Scores
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHARITY SPOTLIGHT (§ 08.2 Featured Charity Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Charitable Spotlight</h2>
            <p className="mt-2 text-3xl font-bold text-white">Where Your Subscriptions Go</p>
            <p className="mt-2 text-sm text-slate-400">
              Each member selects a verified foundation. A minimum of 10% of every payment directly benefits these causes.
            </p>
          </div>
          <Link
            href="/charities"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
          >
            <span>View All Partner Charities</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCharities.map((charity) => (
            <div
              key={charity.id}
              className="rounded-2xl bg-[#0f1522] border border-slate-800 overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={charity.banner_url}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1522] via-[#0f1522]/40 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                    {charity.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {charity.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {charity.tagline}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-semibold block">Total Raised</span>
                      <span className="text-emerald-400 font-bold text-sm">\${charity.total_raised.toLocaleString()}</span>
                    </div>
                    {charity.events && charity.events.length > 0 && (
                      <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        {charity.events.length} Upcoming Event
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/charities/${charity.slug}`}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>View Impact Profile & Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MEMBERSHIP PRICING CTA (§ 04) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/30 p-8 md:p-14 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Join Digital Heroes</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Play for Something Greater?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
              Choose a monthly or discounted yearly plan. Your 5 latest Stableford rounds are automatically enrolled into every monthly prize draw.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/subscribe?plan=monthly"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-semibold text-sm hover:border-emerald-400 transition-all"
              >
                Monthly Plan (\$19 / mo)
              </Link>
              <Link
                href="/subscribe?plan=yearly"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>Yearly Plan (\$180 / yr)</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full uppercase">Save 20%</span>
              </Link>
            </div>

            <p className="text-[11px] text-slate-400 pt-2">
              Cancel anytime • Real-time subscription validation • Real charity impact
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
