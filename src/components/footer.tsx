import Link from 'next/link';
import { Heart, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060a10] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">DIGITAL<span className="text-emerald-400">.</span>HEROES</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              A golf performance and monthly charity draw platform. Bridging individual athletic progress with collective charitable impact.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PCI-Compliant & Verified Draws</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How Draws Work</Link></li>
              <li><Link href="/charities" className="hover:text-white transition-colors">Charity Directory</Link></li>
              <li><Link href="/subscribe" className="hover:text-white transition-colors">Subscription Plans</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Subscriber Dashboard</Link></li>
            </ul>
          </div>

          {/* Core Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Draw Mechanics</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">✦</span> 1–45 Stableford Score Range</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">✦</span> 5-Score Rolling Ticket Roster</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">✦</span> Minimum 10% To Selected Charity</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">✦</span> 40% / 35% / 25% Prize Allocation</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">✦</span> Unclaimed Jackpot Rollover</li>
            </ul>
          </div>

          {/* Admin & Evaluation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Evaluation & Admin</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed for the Digital Heroes Level 1 selection process. Includes simulation engine, verification queue, and dual storage architecture.
            </p>
            <div className="pt-2">
              <Link 
                href="/admin" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
              >
                <Trophy className="w-3.5 h-3.5" />
                Launch Admin Console
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Digital Heroes. Edition 2026 PRD Level 1 Implementation.</p>
          <div className="flex items-center gap-6">
            <span>Emotion-Driven Design</span>
            <span>Zero Fairway Clichés</span>
            <span>Verifiable Draws</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
