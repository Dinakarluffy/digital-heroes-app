'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/use-store';
import { 
  Trophy, 
  Heart, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { currentUser, scores, charities, draws, winners, store } = useAppStore();

  const userScores = store.getUserScores(currentUser.id);
  const selectedCharity = charities.find((c) => c.id === currentUser.selected_charity_id);
  const userWinnings = winners.filter((w) => w.user_id === currentUser.id);
  const totalWon = userWinnings.reduce((acc, w) => acc + w.prize_amount, 0);
  const pendingProofWin = userWinnings.find((w) => w.verification_status === 'pending_proof');

  return (
    <div className="space-y-8">

      {/* Action Banner if Proof Upload is Required (§ 09 Winner Verification) */}
      {pendingProofWin && (
        <div className="p-6 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Action Required: You won \${pendingProofWin.prize_amount.toFixed(2)} in the Monthly Draw!
              </p>
              <p className="text-xs text-amber-200/90 mt-0.5">
                Matched {pendingProofWin.match_tier} numbers. Please upload your golf app scorecard screenshot to verify your scores.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/winnings"
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:brightness-110 shrink-0 flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Upload Score Proof</span>
          </Link>
        </div>
      )}

      {/* Top 4 Metric Cards (§ 10 Summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Subscription Status */}
        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Subscription Status
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold capitalize ${
              currentUser.subscription_status === 'active' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {currentUser.subscription_status}
            </span>
            {currentUser.subscription_plan && (
              <span className="text-xs text-slate-300 capitalize">
                ({currentUser.subscription_plan})
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            {currentUser.subscription_period_end
              ? `Renews: ${new Date(currentUser.subscription_period_end).toLocaleDateString()}`
              : 'Not currently renewing'}
          </p>
        </div>

        {/* Metric 2: Active 5-Score Roster */}
        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Active Draw Ticket
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              {userScores.length} / 5
            </span>
            <span className="text-xs text-slate-400">Scores Logged</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {userScores.length === 5 ? '✓ 100% Ready for next draw' : 'Log 5 scores to enter'}
          </p>
        </div>

        {/* Metric 3: Designated Charity */}
        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Selected Charity
          </span>
          <div className="text-base font-bold text-white truncate">
            {selectedCharity ? selectedCharity.name : 'None Selected'}
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold">
            {currentUser.charity_contribution_pct}% of subscription allocated
          </p>
        </div>

        {/* Metric 4: Total Winnings */}
        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Won
          </span>
          <div className="text-xl font-bold text-amber-400">
            \${totalWon.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400">
            {userWinnings.length} winning {userWinnings.length === 1 ? 'draw' : 'draws'} recorded
          </p>
        </div>

      </div>

      {/* Main Grid: Scores + Charity Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: 5-Score Roster (§ 05 & § 10) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-400" />
                Your Latest 5 Stableford Scores
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Only your 5 most recent scores are active. Each serves as a number in the monthly draw.
              </p>
            </div>
            <Link
              href="/dashboard/scores"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Manage Scores</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {userScores.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-3">
                {userScores.map((score, idx) => (
                  <div
                    key={score.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-center space-y-1 hover:border-emerald-500/50 transition-colors"
                  >
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Round {idx + 1}
                    </span>
                    <div className="text-2xl font-extrabold text-white">
                      {score.score}
                    </div>
                    <span className="text-[10px] text-emerald-400 block truncate">
                      {score.score_date}
                    </span>
                  </div>
                ))}
                {/* Empty placeholders if user has less than 5 */}
                {Array.from({ length: Math.max(0, 5 - userScores.length) }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-dashed border-slate-800 text-center flex flex-col items-center justify-center text-slate-600"
                  >
                    <span className="text-[10px] uppercase">Slot {userScores.length + i + 1}</span>
                    <span className="text-xl font-bold">--</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Ordered reverse-chronologically (most recent round first).</span>
                <span className="text-emerald-400 font-medium">Valid Stableford Range: 1–45</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-400">You haven&apos;t entered any golf scores yet.</p>
              <Link
                href="/dashboard/scores"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-semibold"
              >
                Add Your First Score
              </Link>
            </div>
          )}
        </div>

        {/* Right 1 Col: Charity & Impact (§ 08 & § 10) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              Charity Impact
            </h2>
            <Link
              href="/dashboard/charity"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Adjust %
            </Link>
          </div>

          {selectedCharity ? (
            <div className="space-y-4">
              <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={selectedCharity.banner_url}
                  alt={selectedCharity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-2 left-3 text-xs font-bold text-white">
                  {selectedCharity.name}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedCharity.tagline}
              </p>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400">Contribution Rate:</span>
                <span className="text-emerald-400 font-bold">{currentUser.charity_contribution_pct}% of subscription</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400">No charity selected yet.</p>
              <Link
                href="/dashboard/charity"
                className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-semibold"
              >
                Choose Charity
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
