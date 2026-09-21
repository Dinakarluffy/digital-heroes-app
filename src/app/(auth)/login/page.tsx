'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/use-store';
import { Shield, User, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { users, store } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      store.switchUser(found.id);
      if (found.role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    } else {
      setError('User not found. Use one of the quick test accounts below or register.');
    }
  };

  const handleQuickLogin = (userId: string, role: string) => {
    store.switchUser(userId);
    if (role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
        <p className="text-xs text-slate-400">Sign in to manage your Stableford scores and draw participation.</p>
      </div>

      {/* Evaluator Quick Access Box */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Evaluator Quick Sign-In (1-Click)</span>
        </div>
        <p className="text-xs text-slate-300">
          Click any persona below to authenticate instantly with full state:
        </p>
        <div className="space-y-2 pt-1">
          <button
            onClick={() => handleQuickLogin('a0000000-0000-0000-0000-000000000001', 'admin')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:bg-slate-800 text-xs text-white flex items-center justify-between transition-colors"
          >
            <div>
              <div className="font-semibold text-amber-300">Alex Vance (Platform Admin)</div>
              <div className="text-[10px] text-slate-400">admin@digitalheroes.com • Full 5 Control Surfaces</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={() => handleQuickLogin('b0000000-0000-0000-0000-000000000002', 'user')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 hover:bg-slate-800 text-xs text-white flex items-center justify-between transition-colors"
          >
            <div>
              <div className="font-semibold text-emerald-300">Sarah Jenkins (Active Subscriber)</div>
              <div className="text-[10px] text-slate-400">sarah@example.com • 5 Active Scores • Pending Winner</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={() => handleQuickLogin('b0000000-0000-0000-0000-000000000006', 'user')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs text-white flex items-center justify-between transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-300">Lucas Campbell (Non-Subscriber)</div>
              <div className="text-[10px] text-slate-400">lucas@example.com • Restricted Access Testing</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleCustomLogin} className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-colors"
        >
          Sign In
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-emerald-400 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </form>

    </div>
  );
}
