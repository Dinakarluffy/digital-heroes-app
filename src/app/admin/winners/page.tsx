'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  DollarSign, 
  AlertCircle, 
  Clock, 
  Filter,
  Check,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { DrawWinner, VerificationStatus } from '@/types';

export default function AdminWinnersPage() {
  const { winners, draws, store } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'needs_audit' | 'approved' | 'unpaid'>('all');

  // Audit Modal State
  const [selectedWinner, setSelectedWinner] = useState<DrawWinner | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const filteredWinners = winners.filter((w) => {
    if (filter === 'needs_audit') return w.verification_status === 'under_review';
    if (filter === 'approved') return w.verification_status === 'approved';
    if (filter === 'unpaid') return w.payout_status === 'pending';
    return true;
  });

  const handleOpenAudit = (w: DrawWinner) => {
    setSelectedWinner(w);
    setAdminNotes(w.admin_notes || 'Verified against platform scorecard logs.');
    setRejectReason('');
  };

  const handleApprove = () => {
    if (!selectedWinner) return;
    store.updateWinnerStatus(selectedWinner.id, 'approved', adminNotes);
    setSelectedWinner(null);
  };

  const handleReject = () => {
    if (!selectedWinner) return;
    const notes = rejectReason ? `Rejected: ${rejectReason}` : 'Scorecard proof was invalid or points did not match.';
    store.updateWinnerStatus(selectedWinner.id, 'rejected', notes);
    setSelectedWinner(null);
  };

  const handleMarkPaid = (winnerId: string) => {
    store.markPayoutCompleted(winnerId);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Surface 04 (§ 11)</span>
          <h2 className="text-2xl font-bold text-white mt-1">Winner Verification & Payout Pipeline</h2>
          <p className="text-xs text-slate-400 mt-1">
            Audit submitted golf score screenshots (§ 09), approve/reject claims, and disburse prize payouts.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Winners' },
            { id: 'needs_audit', label: 'Needs Audit (Under Review)' },
            { id: 'approved', label: 'Approved' },
            { id: 'unpaid', label: 'Pending Payout' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f.id
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Winners List Table */}
      <div className="p-6 rounded-3xl bg-[#0f1522] border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
              <th className="pb-3 px-3">Winner Details</th>
              <th className="pb-3 px-3">Draw</th>
              <th className="pb-3 px-3">Tier & Matches</th>
              <th className="pb-3 px-3">Prize Amount</th>
              <th className="pb-3 px-3">Verification Status (§ 09)</th>
              <th className="pb-3 px-3">Payout State</th>
              <th className="pb-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredWinners.map((w) => {
              const draw = draws.find((d) => d.id === w.draw_id);
              return (
                <tr key={w.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-3">
                    <div className="font-bold text-white text-sm">{w.user_name || 'Subscriber'}</div>
                    <div className="text-slate-400 text-[11px]">{w.user_email || 'Verified user'}</div>
                  </td>
                  <td className="py-4 px-3 text-slate-300 font-medium">
                    {draw?.draw_title || 'Monthly Draw'}
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-bold text-amber-400">{w.match_tier}-Match Tier</span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      [{w.matched_numbers.join(', ')}]
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-extrabold text-white text-sm">\${w.prize_amount.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      w.verification_status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : w.verification_status === 'under_review'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                        : w.verification_status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {w.verification_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      w.payout_status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {w.payout_status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenAudit(w)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Audit Proof</span>
                      </button>

                      {w.verification_status === 'approved' && w.payout_status === 'pending' && (
                        <button
                          onClick={() => handleMarkPaid(w.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-black font-bold hover:brightness-110 flex items-center gap-1 text-[11px]"
                          title="Transition from Pending to Paid (§ 09)"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Mark Paid</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredWinners.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            No winners matching this filter.
          </div>
        )}
      </div>

      {/* AUDIT & VERIFICATION MODAL (§ 09) */}
      {selectedWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#121824] border border-slate-700 p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Scorecard Verification Audit (§ 09)</h3>
                <p className="text-xs text-slate-400">Winner: {selectedWinner.user_name} • Prize: \${selectedWinner.prize_amount.toFixed(2)}</p>
              </div>
              <button onClick={() => setSelectedWinner(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Score Details to compare */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Matched Numbers Required:</span>
                <span className="font-mono font-bold text-emerald-400">[{selectedWinner.matched_numbers.join(', ')}]</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Match Tier:</span>
                <span className="font-bold text-white">{selectedWinner.match_tier}-Number Match Tier</span>
              </div>
            </div>

            {/* Uploaded Scorecard Screenshot Display */}
            <div>
              <span className="text-xs font-semibold text-slate-300 uppercase block mb-2">
                Submitted Scorecard Proof:
              </span>
              {selectedWinner.proof_image_url ? (
                <div className="rounded-2xl border border-slate-700 overflow-hidden bg-black max-h-72 flex items-center justify-center">
                  <img
                    src={selectedWinner.proof_image_url}
                    alt="Submitted proof screenshot"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-700 text-center text-xs text-amber-300">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                  Winner has not yet uploaded proof screenshot (Status: Pending Proof).
                </div>
              )}
            </div>

            {/* Admin Audit Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">
                Verification Notes / Audit Log
              </label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Verified Stableford points against club handicap log."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>

            {/* Reject Reason input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-rose-400 uppercase block">
                Rejection Reason (If rejecting)
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Scorecard date does not match round registered."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-rose-900/50 text-white text-xs outline-none focus:border-rose-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Reject Proof</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedWinner(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Submission</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
