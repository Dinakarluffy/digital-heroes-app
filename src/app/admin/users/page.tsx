'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Users, 
  Search, 
  Edit3, 
  Trophy, 
  Check, 
  X, 
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { GolfScore, SubscriptionPlan, SubscriptionStatus, UserProfile, UserRole } from '@/types';

export default function AdminUsersPage() {
  const { users, scores, store } = useAppStore();
  const [search, setSearch] = useState('');

  // Edit User Profile Modal State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>('active');
  const [subPlan, setSubPlan] = useState<SubscriptionPlan | null>('monthly');

  // Inspect & Edit User Scores Modal State
  const [inspectingUser, setInspectingUser] = useState<UserProfile | null>(null);
  const [newScoreVal, setNewScoreVal] = useState<string>('');
  const [newScoreDate, setNewScoreDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [scoreError, setScoreError] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenEditUser = (u: UserProfile) => {
    setEditingUser(u);
    setName(u.full_name);
    setEmail(u.email);
    setRole(u.role);
    setSubStatus(u.subscription_status);
    setSubPlan(u.subscription_plan || null);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    store.updateProfile(editingUser.id, {
      full_name: name,
      email: email,
      role: role,
      subscription_status: subStatus,
      subscription_plan: subPlan,
    });
    setEditingUser(null);
  };

  const handleAddAdminScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingUser) return;
    setScoreError(null);

    const val = parseInt(newScoreVal, 10);
    if (isNaN(val) || val < 1 || val > 45) {
      setScoreError('Score must be between 1 and 45.');
      return;
    }

    const res = store.addScore(inspectingUser.id, val, newScoreDate, 'Admin Override Entry');
    if (!res.success) {
      setScoreError(res.message || 'Error adding score.');
    } else {
      setNewScoreVal('');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Surface 01 (§ 11)</span>
          <h2 className="text-2xl font-bold text-white mt-1">User & Subscription Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Search, inspect user profiles, override subscription states, and audit golf scores.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-[#0f1522] border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
              <th className="pb-3 px-3">Subscriber</th>
              <th className="pb-3 px-3">Role</th>
              <th className="pb-3 px-3">Subscription</th>
              <th className="pb-3 px-3">Plan</th>
              <th className="pb-3 px-3">Active Scores</th>
              <th className="pb-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredUsers.map((u) => {
              const uScores = store.getUserScores(u.id);
              return (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-3">
                    <div className="font-bold text-white text-sm">{u.full_name}</div>
                    <div className="text-slate-400 text-[11px]">{u.email}</div>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      u.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      u.subscription_status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : u.subscription_status === 'lapsed'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {u.subscription_status}
                    </span>
                  </td>
                  <td className="py-4 px-3 capitalize text-slate-300">
                    {u.subscription_plan || 'None'}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{uScores.length}/5</span>
                      {uScores.length > 0 && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          [{uScores.map((s) => s.score).join(', ')}]
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInspectingUser(u)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Audit / Edit Golf Scores"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                      <button
                        onClick={() => handleOpenEditUser(u)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit User Profile & Subscription"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* EDIT USER PROFILE MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#121824] border border-slate-700 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Profile & Subscription</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Subscription</label>
                  <select
                    value={subStatus}
                    onChange={(e) => setSubStatus(e.target.value as SubscriptionStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="lapsed">Lapsed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Plan</label>
                <select
                  value={subPlan || ''}
                  onChange={(e) => setSubPlan((e.target.value as SubscriptionPlan) || null)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="">No Plan</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:brightness-110 text-black font-bold text-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT & EDIT USER SCORES MODAL */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#121824] border border-slate-700 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Scores for {inspectingUser.full_name}</h3>
                <p className="text-xs text-slate-400">Admin Scorecard Audit & Overrides (§ 11.01)</p>
              </div>
              <button onClick={() => setInspectingUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Current 5 Scores */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase block">Active 5-Score Roster:</span>
              <div className="space-y-2">
                {store.getUserScores(inspectingUser.id).map((sc, i) => (
                  <div
                    key={sc.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center">
                        {sc.score}
                      </span>
                      <div>
                        <div className="font-semibold text-white">{sc.course_name || 'Golf Course'}</div>
                        <div className="text-[10px] text-slate-400">{sc.score_date}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => store.deleteScore(sc.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"
                      title="Delete Score"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {store.getUserScores(inspectingUser.id).length === 0 && (
                  <p className="text-xs text-slate-500 py-3 text-center">User has no scores logged.</p>
                )}
              </div>
            </div>

            {/* Add Score Override Form */}
            <form onSubmit={handleAddAdminScore} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-white block">Add Score Override</span>
              {scoreError && (
                <div className="text-rose-400 text-xs">{scoreError}</div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="1"
                  max="45"
                  required
                  placeholder="Score (1–45)"
                  value={newScoreVal}
                  onChange={(e) => setNewScoreVal(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                />
                <input
                  type="date"
                  required
                  value={newScoreDate}
                  onChange={(e) => setNewScoreDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:brightness-110"
              >
                Insert Score (Applies Rolling 5-Prune)
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
