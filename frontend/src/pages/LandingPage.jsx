import React, { useState } from 'react';
import {
  Search,
  Heart,
  Trophy,
  Activity,
  Hospital,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  LogIn,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function StartupLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900 selection:bg-red-200 overflow-x-hidden">
   
      <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-[10px] md:text-sm font-bold mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
          Live: 1,240 Verified Requests Nearby
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter uppercase italic">
          Locate. Donate. <br />
          <span className="text-red-600">Celebrate.</span>
        </h1>
 
        <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          The world’s first hyper-local blood bridge. Connect with emergency
          requests and earn{' '}
          <span className="text-slate-900 font-bold underline decoration-red-500 underline-offset-4">
            Elite Health Rewards
          </span>{' '}
          for your heroism.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
          <button className="bg-red-600 text-white px-8 md:px-10 py-5 rounded-[1.5rem] font-black text-lg md:text-xl shadow-2xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95">
            I WANT TO DONATE
          </button>
          <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 md:px-10 py-5 rounded-[1.5rem] font-black text-lg md:text-xl hover:bg-slate-100 transition-all active:scale-95">
            RAISE REQUEST
          </button>
        </div>
      </section>

      {/* --- TRUST STATS --- */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/60 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { val: '50k+', label: 'Lives Saved' },
            { val: '120+', label: 'Hospitals' },
            { val: '10min', label: 'Avg Response' },
            { val: '0', label: 'Processing Fees', prefix: '₹' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`text-center ${i !== 0 ? 'lg:border-l border-slate-100' : ''}`}
            >
              <div className="text-4xl font-black text-slate-900 italic tracking-tighter">
                {stat.prefix}
                {stat.val}
              </div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- THE 3-STEP FLOW --- */}
      <section className="bg-slate-900 py-24 px-4 md:px-6 rounded-[3rem] md:rounded-[5rem] mx-2 md:mx-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-white">
          {[
            {
              icon: <Search size={32} />,
              title: 'Locate',
              desc: 'Real-time dashboard mapping requests from certified hospitals within 10km.',
            },
            {
              icon: <Heart size={32} />,
              title: 'Donate',
              desc: 'Secure coordination with medical teams at verified emergency camps.',
            },
            {
              icon: <Trophy size={32} />,
              title: 'Celebrate',
              desc: 'Reach the 6-donation milestone to unlock 2 full-body scans per year.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group p-10 rounded-[2.5rem] bg-slate-800/40 border border-slate-700 hover:border-red-500 transition-all duration-500"
            >
              <div className="mb-8 inline-block p-5 bg-red-600 rounded-2xl shadow-xl shadow-red-900/40 group-hover:rotate-6 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-3xl font-black italic mb-4 uppercase tracking-tighter">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- REWARDS PREVIEW --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8 italic uppercase">
              Health <br />
              <span className="text-red-600">Reimagined.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">
              Jeevo elite donors receive premium health benefits sponsored by
              our partners. No cash—just unmatched care for those who care for
              the community.
            </p>
            <div className="space-y-4">
              {[
                'Biannual Full Body Scans',
                'Priority Emergency Support',
                'Digital Health Vault Access',
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="font-bold text-sm uppercase tracking-tight">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full max-w-md bg-slate-900 rounded-[3rem] p-10 text-white relative shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 blur-[60px] opacity-30 group-hover:opacity-60 transition-opacity"></div>
            <div className="text-xl font-black italic mb-20">JEEVO</div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-2 italic">
              Elite Membership
            </div>
            <div className="text-4xl font-black italic mb-12 uppercase tracking-tighter leading-none">
              Hero
              <br />
              Pass.
            </div>
            <div className="space-y-6">
              <div className="h-1.5 w-full bg-slate-800 rounded-full">
                <div className="h-full bg-red-600 w-2/3 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                <span>Progress: 4/6 Donations</span>
                <span>Next Scan: Q2 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOSPITAL MANAGEMENT --- */}
      <section id="hospitals" className="pb-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl shadow-slate-200 border border-slate-100 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block p-4 bg-red-50 text-red-600 rounded-2xl mb-8 italic">
              <Hospital size={40} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
              Hospital <br />
              <span className="text-red-600 font-light italic">
                Infrastructure.
              </span>
            </h2>
            <ul className="space-y-5 mb-12 text-slate-600 font-bold text-sm md:text-base">
              {[
                'Broadcast urgent blood needs instantly',
                'Manage donation camp schedules',
                'Verify donor history with OTP codes',
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4">
                  <CheckCircle2
                    size={22}
                    className="text-green-500 flex-shrink-0"
                  />{' '}
                  {text}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg active:scale-95">
                Register Facility <ArrowRight size={18} />
              </button>
              <button className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                <LogIn size={18} /> Staff Login
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-8">
                  <div className="h-4 w-24 bg-slate-700 rounded-full"></div>
                  <div className="h-10 w-10 bg-red-600 rounded-xl"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-16 w-full bg-slate-700/50 rounded-xl animate-pulse"></div>
                  <div className="h-16 w-full bg-slate-700/50 rounded-xl"></div>
                  <div className="h-16 w-full bg-slate-700/50 rounded-xl"></div>
                </div>
              </div>
            </div>
            {/* Floating Live Badge */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 flex items-center gap-4 animate-bounce duration-[3000ms]">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="text-green-600" />
              </div>
              <div>
                <div className="font-black text-2xl tracking-tighter italic">
                  412
                </div>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Active Donors Nearby
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
