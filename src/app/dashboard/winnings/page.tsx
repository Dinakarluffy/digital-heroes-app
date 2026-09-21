'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Trophy, 
  DollarSign, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  X, 
  ShieldCheck,
  Eye
} from 'lucide-react';
import { DrawWinner } from '@/types';

export default function WinningsPage() {
  const { currentUser, winners, draws, store } = useAppStore();
  const userWinnings = winners.filter((w) => w.user_id === currentUser.id);

  const [selectedWinner, setSelectedWinner] = useState<DrawWinner | null>(null);
  const [proofUrl, setProofUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const totalWon = userWinnings.reduce((acc, w) => acc + w.prize_amount, 0);
  const totalPaid = userWinnings
    .filter((w) => w.payout_status === 'paid')
    .reduce((acc, w) => acc + w.prize_amount, 0);
  const totalPending = totalWon - totalPaid;

  const handleOpenUpload = (winner: DrawWinner) => {
    setSelectedWinner(winner);
    setProofUrl(winner.proof_image_url || 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&fit=crop');
    setUploadSuccess(false);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWinner || !proofUrl) return;

    setIsUploading(true);
    setTimeout(() => {
      store.submitWinnerProof(selectedWinner.id, proofUrl);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedWinner(null);
      }, 1500);
    }, 800);
  };

  // Mock sample image presets for fast testing
  const sampleProofImages = [
    { label: 'Garmin Golf App Scorecard', url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&fit=crop' },
    { label: 'Golfshot GPS Handicap Round', url: 'https://images.unsplash.com/photo-1593111774642-a116f199857d?w=800&fit=crop' },
    { label: 'Official Club Hand-Marked Card', url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&fit=crop' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Winner Verification (§ 09)</span>
        <h2 className="text-2xl font-bold text-white mt-1">Winnings & Verification Queue</h2>
        <p className="text-xs text-slate-400 mt-1">
          To claim your monthly draw winnings, upload a scorecard screenshot from your golf platform for admin verification.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Career Winnings</span>
          <span className="text-3xl font-extrabold text-amber-400 mt-1 block">\${totalWon.toFixed(2)}</span>
          <p className="text-[11px] text-slate-500 mt-1">{userWinnings.length} Prize awards</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Disbursed & Paid</span>
          <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">\${totalPaid.toFixed(2)}</span>
          <p className="text-[11px] text-emerald-400/80 mt-1">Verified & transferred</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f1522] border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Pending Verification</span>
          <span className="text-3xl font-extrabold text-slate-300 mt-1 block">\${totalPending.toFixed(2)}</span>
          <p className="text-[11px] text-amber-300 mt-1">Awaiting proof / review</p>
        </div>
      </div>

      {/* Winnings Records List */}
      <div className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Prize Records & Claims (§ 09 & § 10)
        </h3>

        {userWinnings.length > 0 ? (
          <div className="space-y-4">
            {userWinnings.map((win) => {
              const draw = draws.find((d) => d.id === win.draw_id);
              return (
                <div
                  key={win.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white">
                        {draw ? draw.draw_title : 'Monthly Draw'}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {win.match_tier}-Number Match Tier
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Matched Numbers:</span>
                      <div className="flex gap-1">
                        {win.matched_numbers.map((num, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono font-bold"
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>

                    {win.admin_notes && (
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                        <span className="text-amber-400 font-semibold">Admin Note: </span>
                        {win.admin_notes}
                      </div>
                    )}
                  </div>

                  {/* Status Badges & Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-400 block">
                        \${win.prize_amount.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Verification Status Badge */}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          win.verification_status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : win.verification_status === 'under_review'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : win.verification_status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        }`}>
                          {win.verification_status.replace('_', ' ')}
                        </span>

                        {/* Payout Status Badge */}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          win.payout_status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          Payout: {win.payout_status}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {win.verification_status === 'pending_proof' && (
                        <button
                          onClick={() => handleOpenUpload(win)}
                          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:brightness-110 text-black font-bold text-xs shadow-md flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Proof</span>
                        </button>
                      )}

                      {win.verification_status === 'under_review' && (
                        <button
                          onClick={() => setPreviewImage(win.proof_image_url || null)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Submitted Proof</span>
                        </button>
                      )}

                      {win.verification_status === 'approved' && (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-slate-500">
            No prize winnings recorded yet. Ensure your 5 scores are logged for the upcoming monthly draw!
          </div>
        )}
      </div>

      {/* PROOF UPLOAD MODAL (§ 09) */}
      {selectedWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#121824] border border-slate-700 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Upload className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Upload Golf Score Proof (§ 09)</h3>
              </div>
              <button onClick={() => setSelectedWinner(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {uploadSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Proof Submitted!</h4>
                <p className="text-xs text-slate-300">
                  Your scorecard screenshot has been queued for admin verification. Status updated to <strong>Under Review</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProof} className="space-y-5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Upload a screenshot or photo of your official golf round scores (from Golfshot, Garmin Golf, GHIN, or paper scorecard) validating your {selectedWinner.matched_numbers.join(', ')} pts.
                </p>

                {/* Quick Preset Selector for Fast Evaluation */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Select a Test Screenshot or Enter URL:
                  </label>
                  <div className="space-y-2">
                    {sampleProofImages.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setProofUrl(preset.url)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                          proofUrl === preset.url
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{preset.label}</span>
                        {proofUrl === preset.url && <span className="text-emerald-400 text-xs font-bold">Selected</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Proof Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Thumbnail Preview */}
                {proofUrl && (
                  <div className="rounded-xl border border-slate-800 overflow-hidden h-32 w-full relative">
                    <img src={proofUrl} alt="Scorecard proof" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-white">Preview</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedWinner(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:brightness-110 text-black font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isUploading ? 'Submitting...' : 'Submit Proof to Admin'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Image Preview Lightbox */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="max-w-2xl w-full rounded-3xl bg-[#121824] border border-slate-700 p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-300 font-semibold">Submitted Scorecard Proof</span>
              <button onClick={() => setPreviewImage(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="max-h-[70vh] overflow-hidden rounded-2xl">
              <img src={previewImage} alt="Submitted proof" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
