'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Trophy, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ArrowDownCircle
} from 'lucide-react';
import { GolfScore } from '@/types';

export default function ScoreManagementPage() {
  const { currentUser, store } = useAppStore();
  const userScores = store.getUserScores(currentUser.id);

  // Form State
  const [scoreVal, setScoreVal] = useState<string>('36');
  const [scoreDate, setScoreDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [courseName, setCourseName] = useState<string>('St. Andrews Links');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit State
  const [editingScore, setEditingScore] = useState<GolfScore | null>(null);
  const [editVal, setEditVal] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editCourse, setEditCourse] = useState<string>('');
  const [editError, setEditError] = useState<string | null>(null);

  const oldestScore = userScores.length >= 5 ? userScores[userScores.length - 1] : null;

  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const val = parseInt(scoreVal, 10);
    if (isNaN(val) || val < 1 || val > 45) {
      setErrorMessage('Stableford score must be strictly between 1 and 45 points (§ 05).');
      return;
    }

    if (!scoreDate) {
      setErrorMessage('Please select a valid date.');
      return;
    }

    const res = store.addScore(currentUser.id, val, scoreDate, courseName);
    if (!res.success) {
      setErrorMessage(res.message || 'Failed to add score.');
    } else {
      if (oldestScore && userScores.length >= 5) {
        setSuccessMessage(`New round of ${val} pts logged! Oldest score from ${oldestScore.score_date} was automatically replaced.`);
      } else {
        setSuccessMessage(`New round of ${val} pts logged successfully!`);
      }
      setScoreVal('');
    }
  };

  const handleStartEdit = (score: GolfScore) => {
    setEditingScore(score);
    setEditVal(score.score.toString());
    setEditDate(score.score_date);
    setEditCourse(score.course_name || '');
    setEditError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScore) return;

    const val = parseInt(editVal, 10);
    if (isNaN(val) || val < 1 || val > 45) {
      setEditError('Stableford score must be between 1 and 45 points.');
      return;
    }

    const res = store.editScore(editingScore.id, val, editDate, editCourse);
    if (!res.success) {
      setEditError(res.message || 'Failed to update score.');
    } else {
      setEditingScore(null);
      setSuccessMessage('Score updated successfully.');
    }
  };

  const handleDeleteScore = (scoreId: string) => {
    if (confirm('Are you sure you want to remove this score?')) {
      store.deleteScore(scoreId);
      setSuccessMessage('Score deleted.');
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Score Management (§ 05)</span>
        <h2 className="text-2xl font-bold text-white mt-1">Rolling 5-Score Roster</h2>
        <p className="text-xs text-slate-400 mt-1">
          Your 5 latest Stableford scores represent your numbers for the monthly draw. One score per date only.
        </p>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Form + Score List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 1 Col: Add Score Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Log Golf Round
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter Stableford points (1–45) and the round date.
            </p>
          </div>

          {/* Rolling Replacement Notice (§ 05) */}
          {userScores.length >= 5 && oldestScore && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-xs space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                <Info className="w-3.5 h-3.5" />
                <span>5-Score Limit Reached</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Adding this score will automatically replace your oldest score from <strong>{oldestScore.score_date}</strong> ({oldestScore.score} pts).
              </p>
            </div>
          )}

          <form onSubmit={handleAddScore} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Stableford Points (1–45)
              </label>
              <input
                type="number"
                min="1"
                max="45"
                required
                value={scoreVal}
                onChange={(e) => setScoreVal(e.target.value)}
                placeholder="e.g. 36"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-base font-bold focus:border-emerald-500 outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Points relative to your handicap</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Round Date
              </label>
              <input
                type="date"
                required
                value={scoreDate}
                onChange={(e) => setScoreDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Only 1 score permitted per date</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Course Name
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Augusta National"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Score to Active Roster</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Active Scores List */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Active Score Roster ({userScores.length}/5)
              </h3>
              <p className="text-xs text-slate-400">
                Sorted reverse-chronologically (§ 05). Latest round is at the top.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Draw Numbers: [{userScores.map(s => s.score).join(', ') || 'None'}]
            </span>
          </div>

          {userScores.length > 0 ? (
            <div className="space-y-3">
              {userScores.map((score, idx) => (
                <div
                  key={score.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    idx === 0
                      ? 'bg-slate-900/90 border-emerald-500/40 ring-1 ring-emerald-500/20'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#141b27] border border-slate-700 flex flex-col items-center justify-center shrink-0">
                      <span className="text-lg font-black text-white">{score.score}</span>
                      <span className="text-[9px] text-slate-400 uppercase font-semibold">PTS</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {score.course_name || 'Standard Course'}
                        </span>
                        {idx === 0 && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Latest Round
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{score.score_date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(score)}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Edit Score"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteScore(score.id)}
                      className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Score"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm text-slate-400">No active scores.</p>
              <p className="text-xs text-slate-500">Log your first round using the form to enter the upcoming draw.</p>
            </div>
          )}
        </div>

      </div>

      {/* Edit Score Modal */}
      {editingScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#121824] border border-slate-700 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Score Entry</h3>
              <button onClick={() => setEditingScore(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 text-xs">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Stableford Score (1–45)
                </label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  required
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Round Date (Only 1 entry per date)
                </label>
                <input
                  type="date"
                  required
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingScore(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
