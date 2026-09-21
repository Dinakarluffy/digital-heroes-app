'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/use-store';
import { 
  Trophy, 
  Calendar, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  Clock
} from 'lucide-react';

export default function DashboardDrawsPage() {
  const { currentUser, draws, winners, store } = useAppStore();
  const userScores = store.getUserScores(currentUser.id);
  const ticketNumbers = userScores.map((s) => s.score);

  const publishedDraws = draws.filter((d) => d.status === 'published');
  const latestRollover = store.getLatestRollover();

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Monthly Draws (§ 06 & § 07)</span>
        <h2 className="text-2xl font-bold text-white mt-1">Participation & Draw History</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review your enrolled ticket numbers for the next draw and inspect past published results.
        </p>
      </div>

      {/* Upcoming Draw Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#141d2c] via-[#0f1724] to-[#121622] border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Next Upcoming Draw
              </span>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Rollover Jackpot Active
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mt-2">September 2026 Monthly Prize Draw</h3>
            <p className="text-xs text-slate-400 mt-0.5">Scheduled for September 30, 2026 • 20:00 UTC</p>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Estimated Pool</span>
              <span className="text-3xl font-extrabold text-amber-400">\${(3400 + latestRollover).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* User's Enrolled Ticket Numbers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">
              Your Enrolled Ticket Numbers (5 Scores):
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {ticketNumbers.length === 5 ? '✓ 5/5 Scores Validated' : `${ticketNumbers.length}/5 Scores (Add more to qualify)`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {ticketNumbers.map((num, idx) => (
              <div
                key={idx}
                className="w-14 h-14 rounded-2xl bg-slate-900 border border-emerald-500/50 flex flex-col items-center justify-center text-white shadow-lg"
              >
                <span className="text-xl font-black">{num}</span>
                <span className="text-[8px] text-emerald-400 uppercase font-bold">PTS</span>
              </div>
            ))}
            {Array.from({ length: Math.max(0, 5 - ticketNumbers.length) }).map((_, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-2xl border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-sm font-bold"
              >
                --
              </div>
            ))}
          </div>

          {ticketNumbers.length < 5 && (
            <div className="pt-2">
              <Link
                href="/dashboard/scores"
                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline"
              >
                <span>Log your remaining scores to be eligible for this draw</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Prize Pool Breakdown Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tier 1 (5 Matches)</span>
            <span className="text-amber-400 font-bold text-sm">40% + \${latestRollover.toFixed(0)} Rollover</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tier 2 (4 Matches)</span>
            <span className="text-teal-400 font-bold text-sm">35% Pool Share</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tier 3 (3 Matches)</span>
            <span className="text-emerald-400 font-bold text-sm">25% Pool Share</span>
          </div>
        </div>
      </div>

      {/* Past Published Draws */}
      <div className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Past Published Draws (§ 06)
        </h3>

        <div className="space-y-4">
          {publishedDraws.map((draw) => {
            const userDrawWinners = winners.filter(
              (w) => w.draw_id === draw.id && w.user_id === currentUser.id
            );
            return (
              <div
                key={draw.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="text-base font-bold text-white">{draw.draw_title}</h4>
                    <p className="text-xs text-slate-400">
                      Conducted on {new Date(draw.draw_date).toLocaleDateString()} • {draw.draw_type.toUpperCase()} Algorithm
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Distributed</span>
                    <span className="text-emerald-400 font-bold text-base">\${draw.total_prize_pool.toLocaleString()}</span>
                  </div>
                </div>

                {/* Winning Numbers */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium mr-2">Drawn Numbers:</span>
                  {draw.drawn_numbers.map((num, i) => (
                    <span
                      key={i}
                      className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-sm flex items-center justify-center"
                    >
                      {num}
                    </span>
                  ))}
                </div>

                {/* User match outcome */}
                {userDrawWinners.length > 0 ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-emerald-400" />
                      You won \${userDrawWinners[0].prize_amount.toFixed(2)} with a {userDrawWinners[0].match_tier}-number match!
                    </span>
                    <Link
                      href="/dashboard/winnings"
                      className="text-emerald-400 font-bold hover:underline"
                    >
                      View & Claim Winnings →
                    </Link>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">
                    No winning match in this draw cycle.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
