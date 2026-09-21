'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Trophy, 
  Shuffle, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Play, 
  Send, 
  History 
} from 'lucide-react';
import { DrawSimulationResult, DrawType } from '@/types';

export default function AdminDrawsPage() {
  const { draws, store } = useAppStore();
  const [drawType, setDrawType] = useState<DrawType>('algorithmic');
  const [drawTitle, setDrawTitle] = useState('September 2026 Monthly Prize Draw');
  const [drawMonth, setDrawMonth] = useState('2026-09');
  
  // Simulation State
  const [simulation, setSimulation] = useState<DrawSimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const activeTickets = store.getActiveTickets();
  const latestRollover = store.getLatestRollover();

  const handleRunSimulation = () => {
    setSimulating(true);
    setPublishSuccess(null);
    setTimeout(() => {
      const result = store.runDrawSimulation(drawType);
      setSimulation(result);
      setSimulating(false);
    }, 600);
  };

  const handlePublishDraw = () => {
    if (!simulation) return;

    store.publishDraw(drawTitle, drawMonth, simulation);
    setPublishSuccess(`Draw "${drawTitle}" published! ${simulation.winners_tier_5.length + simulation.winners_tier_4.length + simulation.winners_tier_3.length} winners enrolled in verification queue.`);
    setSimulation(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Surface 02 (§ 11)</span>
        <h2 className="text-2xl font-bold text-white mt-1">Draw Engine & Simulation Console</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure draw algorithms, execute pre-publish simulations, evaluate prize pools and rollover rules (§ 06 & § 07).
        </p>
      </div>

      {publishSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{publishSuccess}</span>
        </div>
      )}

      {/* Control Configuration Box */}
      <div className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-amber-400" />
            Configure Draw Mechanics (§ 06)
          </h3>
          <span className="text-xs text-slate-400">
            Active Subscribers in Pool: <strong className="text-white">{activeTickets.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Draw Algorithm Option */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Draw Logic (§ 06)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDrawType('random')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  drawType === 'random'
                    ? 'bg-amber-500/20 border-amber-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs">Standard Random</div>
                <p className="text-[10px] text-slate-400 mt-1">Uniform lottery draw from numbers 1 to 45.</p>
              </button>

              <button
                type="button"
                onClick={() => setDrawType('algorithmic')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  drawType === 'algorithmic'
                    ? 'bg-amber-500/20 border-amber-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1 text-amber-300">
                  <span>Algorithmic</span>
                  <Sparkles className="w-3 h-3" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Weighted sampling by active score frequencies.</p>
              </button>
            </div>
          </div>

          {/* Draw Title & Month */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Draw Title
              </label>
              <input
                type="text"
                value={drawTitle}
                onChange={(e) => setDrawTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Month Identifier
              </label>
              <input
                type="text"
                value={drawMonth}
                onChange={(e) => setDrawMonth(e.target.value)}
                placeholder="YYYY-MM"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Action Button: Run Simulation */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Incoming Rollover Jackpot: <strong>\${latestRollover.toFixed(2)}</strong></span>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs hover:brightness-110 shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{simulating ? 'Simulating...' : 'Run Simulation Before Publish (§ 06)'}</span>
          </button>
        </div>
      </div>

      {/* SIMULATION PREVIEW (§ 06: Simulation before publish) */}
      {simulation && (
        <div className="p-8 rounded-3xl bg-[#121926] border-2 border-amber-500/50 shadow-2xl space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Simulation Preview Mode
                </span>
                <span className="text-xs text-slate-400">
                  Algorithm: <strong className="text-white capitalize">{simulation.draw_type}</strong>
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Simulation Results & Payout Distribution</h3>
            </div>

            <button
              onClick={handlePublishDraw}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Results to Live Platform</span>
            </button>
          </div>

          {/* Drawn Numbers Balls */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase block">Simulated Winning Numbers:</span>
            <div className="flex items-center gap-3">
              {simulation.drawn_numbers.map((num, i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex flex-col items-center justify-center font-black text-xl shadow-lg shadow-amber-500/10"
                >
                  <span>{num}</span>
                  <span className="text-[8px] uppercase font-bold text-amber-200">Ball {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Pool Breakdown Cards (§ 07) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Tier 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-amber-400">Tier 1 (5 Matches)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">40% + Rollover</span>
              </div>
              <div className="text-2xl font-black text-white">\${simulation.tier_5_pool.toFixed(2)}</div>
              <div className="text-xs text-slate-300">
                Winners: <strong>{simulation.winners_tier_5.length}</strong>
                {simulation.winners_tier_5.length > 0 && (
                  <span className="text-emerald-400 font-bold block">
                    Payout each: \${simulation.winners_tier_5[0].prize_amount.toFixed(2)}
                  </span>
                )}
                {simulation.winners_tier_5.length === 0 && (
                  <span className="text-amber-400 text-[11px] block mt-1">
                    Unclaimed! Entire \${simulation.tier_5_pool.toFixed(2)} rolls over.
                  </span>
                )}
              </div>
            </div>

            {/* Tier 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-teal-400">Tier 2 (4 Matches)</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">35% Share</span>
              </div>
              <div className="text-2xl font-black text-white">\${simulation.tier_4_pool.toFixed(2)}</div>
              <div className="text-xs text-slate-300">
                Winners: <strong>{simulation.winners_tier_4.length}</strong>
                {simulation.winners_tier_4.length > 0 && (
                  <span className="text-emerald-400 font-bold block">
                    Payout each: \${simulation.winners_tier_4[0].prize_amount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Tier 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-emerald-400">Tier 3 (3 Matches)</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">25% Share</span>
              </div>
              <div className="text-2xl font-black text-white">\${simulation.tier_3_pool.toFixed(2)}</div>
              <div className="text-xs text-slate-300">
                Winners: <strong>{simulation.winners_tier_3.length}</strong>
                {simulation.winners_tier_3.length > 0 && (
                  <span className="text-emerald-400 font-bold block">
                    Payout each: \${simulation.winners_tier_3[0].prize_amount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Simulated Winners List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Identified Winners ({simulation.winners_tier_5.length + simulation.winners_tier_4.length + simulation.winners_tier_3.length})
            </h4>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {[...simulation.winners_tier_5, ...simulation.winners_tier_4, ...simulation.winners_tier_3].map((w, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{w.user_name}</span>
                    <span className="text-slate-400 text-[11px] ml-2">({w.user_email})</span>
                    <div className="text-[11px] text-emerald-400 mt-0.5">
                      Matched: [{w.matched_numbers.join(', ')}] • {w.match_tier}-number tier
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold text-sm">\${w.prize_amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}

              {simulation.winners_tier_5.length + simulation.winners_tier_4.length + simulation.winners_tier_3.length === 0 && (
                <p className="text-xs text-slate-500 py-3 text-center">No subscriber matched 3 or more numbers in this simulation run.</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Published Draws History */}
      <div className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          Published Draws Archive
        </h3>

        <div className="space-y-3">
          {draws.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="font-bold text-white text-sm">{d.draw_title}</div>
                <div className="text-slate-400 text-[11px]">
                  Published: {new Date(d.draw_date).toLocaleDateString()} • {d.draw_type.toUpperCase()} • Rollover Out: \${d.rollover_jackpot_out.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {d.drawn_numbers.map((n, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
                      {n}
                    </span>
                  ))}
                </div>
                <span className="text-emerald-400 font-bold text-sm">\${d.total_prize_pool.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
