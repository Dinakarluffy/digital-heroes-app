'use client';

import Link from 'next/link';
import { 
  Trophy, 
  HelpCircle, 
  CheckCircle2, 
  Calendar, 
  Percent, 
  FileCheck, 
  ArrowRight, 
  Shuffle, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Clear & Transparent Rules</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          How the Platform & Prize Draws Work
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Digital Heroes merges regular golf performance with lottery mechanics and nonprofit fundraising. Here is the complete breakdown of every rule and calculation.
        </p>
      </div>

      {/* 1. STABLEFORD SCORING & 5-SCORE ROSTER */}
      <section className="p-8 md:p-10 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            01
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Score Management System (§ 05)</h2>
            <p className="text-xs text-slate-400">Stableford Points & The Rolling 5-Score Roster</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-300 leading-relaxed">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Stableford Format (1–45 Points)
            </h3>
            <p>
              Unlike traditional stroke play where lower scores are better, Stableford awards points per hole based on your net score relative to par (e.g. 2 points for par, 3 points for birdie). Typical 18-hole rounds produce scores between 1 and 45 points.
            </p>
            <p>
              Your 5 latest registered scores serve directly as your 5 unique numbers in the monthly prize draw.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              The Rolling 5-Score Constraint
            </h3>
            <p>
              To maintain current athletic authenticity, each subscriber’s account holds strictly their <strong>latest 5 scores</strong>:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Date Uniqueness</strong>: Only one score is permitted per date. Duplicate entries for the same date are rejected.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Automatic Replacement</strong>: Whenever you log a 6th score, the system automatically prunes and drops your oldest score by date.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Reverse Chronological Order</strong>: Your scores are always displayed with the most recent round first.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. DRAW MECHANICS & PRIZE POOL ALLOCATION */}
      <section className="p-8 md:p-10 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            02
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Monthly Prize Pool Logic (§ 06 & § 07)</h2>
            <p className="text-xs text-slate-400">Pre-defined distribution, tiers, and jackpot rollovers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Tier 1 Match</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">Rollover: YES</span>
            </div>
            <p className="text-2xl font-extrabold text-white">5-Number Match</p>
            <p className="text-3xl font-bold text-amber-400">40% <span className="text-xs font-normal text-slate-400">of Pool + Rollover</span></p>
            <p className="text-xs text-slate-400 leading-relaxed">
              If multiple players match all 5 numbers, the jackpot splits equally. If unclaimed, the entire 40% pool carries forward into the next month!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Tier 2 Match</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">Rollover: NO</span>
            </div>
            <p className="text-2xl font-extrabold text-white">4-Number Match</p>
            <p className="text-3xl font-bold text-teal-400">35% <span className="text-xs font-normal text-slate-400">of Pool</span></p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Awarded to subscribers matching any 4 of the 5 drawn numbers. Split equally across all qualified winners.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tier 3 Match</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">Rollover: NO</span>
            </div>
            <p className="text-2xl font-extrabold text-white">3-Number Match</p>
            <p className="text-3xl font-bold text-emerald-400">25% <span className="text-xs font-normal text-slate-400">of Pool</span></p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Awarded to subscribers matching any 3 of the 5 drawn numbers. Highest winning frequency tier.
            </p>
          </div>
        </div>

        {/* Draw Logic Types */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 shrink-0">
            <Shuffle className="w-6 h-6" />
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <h4 className="text-sm font-semibold text-white">Dual Engine Draw Options: Random vs Algorithmic</h4>
            <p>
              <strong>Random Mode:</strong> Standard lottery-style draw selecting 5 unique numbers uniformly from 1 to 45.
            </p>
            <p>
              <strong>Algorithmic Mode:</strong> Weighted sampling based on the score frequency distribution across all active player scorecards. Numbers that players shoot more often receive higher mathematical likelihood.
            </p>
            <p className="text-slate-400">
              All draws undergo an admin simulation and review phase before being irreversibly published on the platform.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WINNER VERIFICATION WORKFLOW (§ 09) */}
      <section className="p-8 md:p-10 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            03
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Winner Verification & Payouts (§ 09)</h2>
            <p className="text-xs text-slate-400">Maintaining fairness and integrity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-mono text-emerald-400 text-sm font-bold">Step 1</span>
            <h4 className="font-semibold text-white text-sm">Draw Announcement</h4>
            <p className="text-slate-400">Qualified winners see an alert in their dashboard with their match tier and prize amount.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-mono text-emerald-400 text-sm font-bold">Step 2</span>
            <h4 className="font-semibold text-white text-sm">Proof Upload</h4>
            <p className="text-slate-400">Winner uploads screenshot(s) of their scores from Golfshot, Garmin, or club app.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-mono text-emerald-400 text-sm font-bold">Step 3</span>
            <h4 className="font-semibold text-white text-sm">Admin Audit</h4>
            <p className="text-slate-400">Platform administrator verifies dates, points, and score consistency before approval.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-mono text-emerald-400 text-sm font-bold">Step 4</span>
            <h4 className="font-semibold text-white text-sm">Payout Disbursal</h4>
            <p className="text-slate-400">State transitions from <code className="text-amber-300">Pending</code> to <code className="text-emerald-400">Paid</code> via direct payment disbursement.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <div className="text-center pt-8">
        <Link
          href="/subscribe"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-transform"
        >
          <span>Choose Your Membership</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
