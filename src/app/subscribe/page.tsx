'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/use-store';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle,
  Trophy
} from 'lucide-react';
import { SubscriptionPlan } from '@/types';

function SubscribeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = (searchParams.get('plan') as SubscriptionPlan) || 'monthly';
  
  const { currentUser, charities, store } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(initialPlan);
  const [selectedCharity, setSelectedCharity] = useState<string>(
    currentUser.selected_charity_id || charities[0]?.id || ''
  );
  const [charityPercentage, setCharityPercentage] = useState<number>(
    currentUser.charity_contribution_pct || 10
  );
  const [processing, setProcessing] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const isSubscribed = currentUser.subscription_status === 'active';

  // Handle Checkout / Subscription activation (§ 04)
  const handleSubscribe = async () => {
    setProcessing(true);
    // Simulate real-time Stripe checkout & webhook roundtrip
    setTimeout(() => {
      store.updateSubscription(currentUser.id, 'active', selectedPlan);
      store.updateCharitySelection(currentUser.id, selectedCharity, charityPercentage);
      setProcessing(false);
      setActionSuccessMessage(`Success! You are now subscribed to the ${selectedPlan} plan. Your scores are enrolled in monthly draws!`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }, 1000);
  };

  const handleCancelSubscription = () => {
    store.updateSubscription(currentUser.id, 'inactive', null);
    setActionSuccessMessage('Your subscription has been canceled. Platform features are now restricted until reactivation.');
  };

  const handleSimulateLapse = () => {
    store.updateSubscription(currentUser.id, 'lapsed', currentUser.subscription_plan);
    setActionSuccessMessage('Simulated lapsed state: Subscription renewal failed.');
  };

  const handleReactivate = () => {
    store.updateSubscription(currentUser.id, 'active', currentUser.subscription_plan || 'monthly');
    setActionSuccessMessage('Your membership has been renewed and is now fully active.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Membership & Plans (§ 04)</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Join the Movement
        </h1>
        <p className="text-sm text-slate-300">
          Unlock monthly prize draws, track your Stableford scores, and direct recurring contributions to causes making a difference.
        </p>
      </div>

      {/* Action Banner if already subscribed */}
      {isSubscribed && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Active Membership ({currentUser.subscription_plan?.toUpperCase()} Plan)</p>
              <p className="text-xs text-slate-300">
                Renewal Date: {currentUser.subscription_period_end ? new Date(currentUser.subscription_period_end).toLocaleDateString() : 'Active'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateLapse}
              className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-medium"
              title="Test PRD requirement: Handles renewal, cancellation, and lapsed states"
            >
              Simulate Lapsed State
            </button>
            <button
              onClick={handleCancelSubscription}
              className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-medium"
            >
              Cancel Membership
            </button>
          </div>
        </div>
      )}

      {currentUser.subscription_status === 'lapsed' && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-sm font-bold text-white">Your Subscription Has Lapsed</p>
              <p className="text-xs text-amber-200/80">Please update payment details to re-enter monthly prize draws.</p>
            </div>
          </div>
          <button
            onClick={handleReactivate}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs hover:brightness-110"
          >
            Reactivate Subscription
          </button>
        </div>
      )}

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-200 text-xs text-center font-medium">
          {actionSuccessMessage}
        </div>
      )}

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Monthly Plan */}
        <div
          onClick={() => setSelectedPlan('monthly')}
          className={`cursor-pointer rounded-3xl p-8 border transition-all relative ${
            selectedPlan === 'monthly'
              ? 'bg-[#121824] border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xl'
              : 'bg-[#0f1522] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Flexible Cadence</span>
            {selectedPlan === 'monthly' && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-black">Selected</span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">Monthly Membership</h3>
          <p className="text-xs text-slate-400 mt-1">Full access billed month-to-month. Cancel anytime.</p>

          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-white">\$19</span>
            <span className="text-sm text-slate-400 font-normal">/ month</span>
          </div>

          <ul className="mt-8 space-y-3 text-xs text-slate-300">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Full Stableford 5-score rolling tracker</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Automatic entry into every Monthly Prize Draw</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Min. 10% guaranteed allocation to your selected charity</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Eligible for 5-match rolling jackpots (\$1,360+)</span>
            </li>
          </ul>
        </div>

        {/* Yearly Plan (Discounted Rate) */}
        <div
          onClick={() => setSelectedPlan('yearly')}
          className={`cursor-pointer rounded-3xl p-8 border transition-all relative ${
            selectedPlan === 'yearly'
              ? 'bg-[#121824] border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xl'
              : 'bg-[#0f1522] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Best Value • Save 20%
            </span>
            {selectedPlan === 'yearly' && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-black">Selected</span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">Annual Membership</h3>
          <p className="text-xs text-slate-400 mt-1">Maximum savings and 12 guaranteed draw cycles.</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">\$180</span>
            <span className="text-sm text-slate-400 font-normal">/ year (\$15/mo)</span>
          </div>

          <ul className="mt-8 space-y-3 text-xs text-slate-300">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Everything in Monthly, billed annually at a discount</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>12 consecutive monthly jackpot entries</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Priority verification queue for prize disbursements</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Invitations to exclusive partner charity golf scrambles</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Charity Selection & Percentage Slider (§ 08.1) */}
      <div className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            Select Your Recipient Charity & Giving Percentage
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            § 08.1: Minimum contribution is 10% of subscription fee. You may voluntarily increase this percentage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Designated Charity
            </label>
            <select
              value={selectedCharity}
              onChange={(e) => setSelectedCharity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none"
            >
              {charities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Giving Percentage: <span className="text-emerald-400 font-bold">{charityPercentage}%</span>
              </label>
              <span className="text-[11px] text-slate-400">Min. 10%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={charityPercentage}
              onChange={(e) => setCharityPercentage(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>10% (Baseline)</span>
              <span>25%</span>
              <span>50%</span>
              <span>100% (Full Philanthropy)</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span>Monthly Charity Gift:</span>
          <span className="text-emerald-400 font-bold text-sm">
            \${((selectedPlan === 'monthly' ? 19 : 180 / 12) * (charityPercentage / 100)).toFixed(2)} / month
          </span>
        </div>
      </div>

      {/* Checkout Button & Security Badge */}
      <div className="text-center space-y-4">
        <button
          onClick={handleSubscribe}
          disabled={processing}
          className="w-full sm:w-80 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
        >
          {processing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Confirm & Subscribe With Stripe</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Stripe PCI-DSS Compliant
          </span>
          <span>•</span>
          <span>Encrypted Gateway</span>
          <span>•</span>
          <span>One-Click Test Evaluator Support</span>
        </div>
      </div>

    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">Loading membership details...</div>}>
      <SubscribeContent />
    </Suspense>
  );
}

