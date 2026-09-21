'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/use-store';
import { Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SubscriptionPlan, UserProfile } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const { charities, store } = useAppStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<SubscriptionPlan>('monthly');
  const [selectedCharity, setSelectedCharity] = useState(charities[0]?.id || '');
  const [contributionPct, setContributionPct] = useState(10);
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const newUserId = 'b_' + Math.random().toString(36).substring(2, 9);
    const newUser: UserProfile = {
      id: newUserId,
      email,
      full_name: fullName,
      role: 'user',
      subscription_status: 'active',
      subscription_plan: plan,
      subscription_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
      selected_charity_id: selectedCharity,
      charity_contribution_pct: contributionPct,
      created_at: new Date().toISOString(),
    };

    // Add user and switch active session
    const currentUsers = store.getState().users;
    store.getState().users = [...currentUsers, newUser];
    store.switchUser(newUserId);

    setSubmitted(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Join Digital Heroes</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Create Your Subscriber Account</h1>
        <p className="text-xs text-slate-400">Enter your details and select the charity you wish to support.</p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-[#0f1522] border border-emerald-500/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Welcome, {fullName}!</h2>
          <p className="text-xs text-slate-300">Your account and initial subscription are setup. Redirecting to your dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleSignup} className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jordan Spieth"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Plan selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Subscription Plan (§ 04)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlan('monthly')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                    plan === 'monthly'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Monthly Plan</div>
                  <div className="text-emerald-400 mt-0.5">\$19 / month</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPlan('yearly')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                    plan === 'yearly'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Yearly Plan</div>
                  <div className="text-amber-400 mt-0.5">\$180 / yr (Save 20%)</div>
                </button>
              </div>
            </div>

            {/* Charity selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Choose Charity Partner (§ 08.1)
              </label>
              <select
                value={selectedCharity}
                onChange={(e) => setSelectedCharity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none"
              >
                {charities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Contribution slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold uppercase tracking-wider">Charity Contribution:</span>
                <span className="text-emerald-400 font-bold">{contributionPct}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={contributionPct}
                onChange={(e) => setContributionPct(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500">Minimum 10% enforced by PRD</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Create Account & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

        </form>
      )}

    </div>
  );
}
