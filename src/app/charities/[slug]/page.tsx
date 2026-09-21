'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Share2, 
  Trophy 
} from 'lucide-react';

export default function CharityProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { charities, currentUser, store } = useAppStore();
  const slug = params?.slug as string;

  const charity = charities.find((c) => c.slug === slug);

  // Independent Donation Modal State (§ 08.1)
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState(currentUser.full_name || '');
  const [donationSuccess, setDonationSuccess] = useState(false);

  if (!charity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Charity Not Found</h1>
        <p className="text-slate-400 text-sm">The requested charity could not be located in our directory.</p>
        <Link href="/charities" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Directory
        </Link>
      </div>
    );
  }

  const isSelected = currentUser.selected_charity_id === charity.id;

  const handleSelectCharity = () => {
    store.updateCharitySelection(currentUser.id, charity.id, currentUser.charity_contribution_pct || 10);
  };

  const handleProcessDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : donationAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) return;

    store.addIndependentDonation(charity.id, finalAmount, donorName);
    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setDonateModalOpen(false);
      setCustomAmount('');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back Link */}
      <Link
        href="/charities"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Charity Directory
      </Link>

      {/* Hero Banner Card */}
      <div className="rounded-3xl bg-[#0f1522] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={charity.banner_url}
            alt={charity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1522] via-[#0f1522]/60 to-transparent" />
          
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-black/70 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              {charity.category}
            </span>
            {charity.featured && (
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amber-500 text-black flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" /> Featured Cause
              </span>
            )}
          </div>
        </div>

        <div className="p-8 sm:p-10 -mt-16 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {charity.name}
              </h1>
              <p className="text-base text-emerald-400/90 font-medium mt-1.5">
                {charity.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Primary Actions */}
              {isSelected ? (
                <div className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-semibold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Selected as Your Monthly Cause ({currentUser.charity_contribution_pct}%)</span>
                </div>
              ) : (
                <button
                  onClick={handleSelectCharity}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Select for My Subscription</span>
                </button>
              )}

              {/* Independent Donation Button (§ 08.1) */}
              <button
                onClick={() => setDonateModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-amber-300 hover:bg-slate-800 font-semibold text-xs transition-all flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                <span>Direct One-Time Donation</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 uppercase tracking-wider block font-semibold text-[10px]">Total Platform Contributions</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">\${charity.total_raised.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 uppercase tracking-wider block font-semibold text-[10px]">Upcoming Golf Events</span>
              <span className="text-2xl font-bold text-white mt-1 block">{charity.events?.length || 0}</span>
            </div>
            {charity.website_url && (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <span className="text-slate-400 uppercase tracking-wider block font-semibold text-[10px]">Official Website</span>
                <a
                  href={charity.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium mt-1"
                >
                  <span>Visit Organization</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Description & Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white">About the Organization</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {charity.description}
            </p>
          </div>

          {/* Upcoming Golf Days (§ 08.2) */}
          <div className="p-8 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Upcoming Charity Golf Days & Outings
              </h2>
              <span className="text-xs text-slate-400">§ 08.2 Charity Events</span>
            </div>

            {charity.events && charity.events.length > 0 ? (
              <div className="space-y-4">
                {charity.events.map((event) => (
                  <div
                    key={event.id}
                    className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Calendar className="w-3.5 h-3.5" /> {event.date}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5" /> {event.location}
                        </span>
                        {event.entry_fee ? (
                          <span className="text-amber-400 font-semibold">
                            Entry: \${event.entry_fee}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{event.description}</p>
                    </div>

                    <button
                      onClick={() => alert(`Registered interest for "${event.title}". Event details and invitation will be sent to ${currentUser.email}.`)}
                      className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:bg-slate-700 text-xs text-white font-medium whitespace-nowrap transition-colors"
                    >
                      Register Interest
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No scheduled golf outings currently. Check back soon!</p>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0f1522] border border-slate-800 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">How Your Support Works</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>10% minimum of every monthly or yearly fee goes directly to this charity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>You can voluntarily increase your giving percentage up to 100% in your dashboard settings.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>One-time direct donations are independent of gameplay and receive verified receipt acknowledgments.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* INDEPENDENT DIRECT DONATION MODAL (§ 08.1) */}
      {donateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#121824] border border-slate-700 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Heart className="w-5 h-5 fill-current" />
                <h3 className="text-lg font-bold text-white">Independent Donation</h3>
              </div>
              <button
                onClick={() => setDonateModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {donationSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Thank You for Giving!</h4>
                <p className="text-xs text-slate-300">
                  Your direct contribution to <strong>{charity.name}</strong> was registered.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProcessDonation} className="space-y-5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Make a direct donation to <strong>{charity.name}</strong>. This is an independent contribution not tied to lottery gameplay (§ 08.1).
                </p>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Select Donation Amount
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[25, 50, 100].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setDonationAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                          donationAmount === amt && !customAmount
                            ? 'bg-amber-500 text-black border-amber-400'
                            : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        \${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Or Enter Custom Amount (\$)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="1"
                    placeholder="e.g. 250"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Donor Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Anonymous or Your Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setDonateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs shadow-lg hover:brightness-110 transition-all"
                  >
                    Complete Donation (\${customAmount || donationAmount})
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
