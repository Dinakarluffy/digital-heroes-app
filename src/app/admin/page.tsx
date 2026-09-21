'use client';

import { useAppStore } from '@/lib/use-store';
import { 
  Users, 
  Trophy, 
  Heart, 
  BarChart3, 
  DollarSign, 
  Flame, 
  CheckCircle2, 
  Clock, 
  TrendingUp 
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { users, charities, draws, winners, scores, store } = useAppStore();

  const totalUsers = users.length;
  const activeSubscribers = users.filter((u) => u.subscription_status === 'active').length;
  const inactiveUsers = users.filter((u) => u.subscription_status === 'inactive').length;
  const lapsedUsers = users.filter((u) => u.subscription_status === 'lapsed').length;

  const totalCharityRaised = charities.reduce((acc, c) => acc + c.total_raised, 0);
  const totalPrizePools = draws.reduce((acc, d) => acc + d.total_prize_pool, 0);
  const latestRollover = store.getLatestRollover();

  const totalWinnersCount = winners.length;
  const verifiedWinnersCount = winners.filter((w) => w.verification_status === 'approved').length;
  const pendingReviewCount = winners.filter((w) => w.verification_status === 'under_review' || w.verification_status === 'pending_proof').length;
  const paidWinnersTotal = winners
    .filter((w) => w.payout_status === 'paid')
    .reduce((acc, w) => acc + w.prize_amount, 0);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Surface 05 (§ 11)</span>
        <h2 className="text-2xl font-bold text-white mt-1">Reports & Platform Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">
          High-level operational reporting on users, cumulative prize pools, charity distributions, and draw statistics.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total Users */}
        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalUsers}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">{activeSubscribers} Active</span>
            <span>•</span>
            <span className="text-rose-400">{lapsedUsers} Lapsed</span>
          </div>
        </div>

        {/* Metric 2: Total Prize Pool */}
        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Prize Pools</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">\${totalPrizePools.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">
            Across {draws.length} published draw {draws.length === 1 ? 'cycle' : 'cycles'}
          </p>
        </div>

        {/* Metric 3: Charity Contribution Totals */}
        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Charity Impact</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">\${totalCharityRaised.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-400 font-medium">
            Directed to {charities.length} vetted foundations
          </p>
        </div>

        {/* Metric 4: Jackpot Rollover Out */}
        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Jackpot Rollover</span>
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">\${latestRollover.toFixed(2)}</div>
          <p className="text-[11px] text-amber-300/80">
            Carried forward to next monthly draw
          </p>
        </div>

      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Draw Logic & Pool Share Distribution (§ 07) */}
        <div className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Prize Pool Tier Split Enforced (§ 07)
          </h3>
          <p className="text-xs text-slate-400">
            Mandatory distribution shares calculated automatically based on active subscribers count:
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-white">Tier 1: 5-Number Match (Jackpot)</span>
                <span className="text-amber-400 font-bold">40% Share + Unclaimed Rollover</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-white">Tier 2: 4-Number Match</span>
                <span className="text-teal-400 font-bold">35% Share (Split equally)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-white">Tier 3: 3-Number Match</span>
                <span className="text-emerald-400 font-bold">25% Share (Split equally)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <strong className="text-white">Rollover Policy: </strong>
            Tier 1 jackpot carries forward if no user achieves a 5-number match. Tiers 2 & 3 do not rollover.
          </div>
        </div>

        {/* Verification & Payout Performance (§ 09) */}
        <div className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Verification & Payout Statistics (§ 09)
          </h3>
          <p className="text-xs text-slate-400">
            Audit throughput for scorecard verification and prize disbursements:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Total Winners Recorded</span>
              <span className="text-2xl font-bold text-white mt-1 block">{totalWinnersCount}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Verified by Admin</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">{verifiedWinnersCount}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Awaiting Verification</span>
              <span className="text-2xl font-bold text-amber-400 mt-1 block">{pendingReviewCount}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Disbursed Winnings</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">\${paidWinnersTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <strong className="text-white">Verification Rule: </strong>
            Applies to prize winners only. Winners upload scorecard screenshots before payment state transitions to Paid.
          </div>
        </div>

      </div>

    </div>
  );
}
