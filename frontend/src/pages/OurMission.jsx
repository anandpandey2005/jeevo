import React from 'react';
import {
  Heart,
  ShieldCheck,
  Zap,
  Hospital,
  Microscope,
  Search,
  Users,
  Activity,
  Calendar,
  Award,
  ArrowRight,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';

/**
 * JEEVO PROFESSIONAL UI REFINEMENT
 * Theme: Medical Modernism (Slate-900, Red-600, Pure White)
 * Concept: The "Hero Compensation" & Recovery Cycle
 */

export default function OurMission() {
  const date = new Date();
  const expirydate = date.getFullYear() + 1;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 pt-32 pb-20 font-sans selection:bg-red-500 selection:text-white">
      {/* --- 1. RESEARCH HEADER --- */}
      <section className="px-6 max-w-7xl mx-auto mb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] mb-8 uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Next-Gen Blood Logistics 2026
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 uppercase italic">
            Empowering <br />
            <span className="text-red-600">Donors.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
            Jeevo bridges the gap between emergency needs and verified donors.
            We ensure every request is backed by hospital proof and offers
            unmatched recovery support for our heroes.
          </p>
        </div>

        {/* Visual Graph Mockup */}
        <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-end gap-2 h-48">
            <div className="w-full bg-slate-200 rounded-t-xl transition-all hover:bg-red-500 h-[30%]"></div>
            <div className="w-full bg-slate-200 rounded-t-xl transition-all hover:bg-red-500 h-[45%]"></div>
            <div className="w-full bg-slate-200 rounded-t-xl transition-all hover:bg-red-500 h-[25%]"></div>
            <div className="w-full bg-red-600 rounded-t-xl h-[90%] relative group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Verified by Hospital
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-t-xl transition-all hover:bg-red-500 h-[60%]"></div>
          </div>
          <div className="mt-6 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Direct Request</span>
            <span className="text-red-600">Sponsored Hero</span>
            <span>Local Community</span>
          </div>
        </div>
      </section>

      {/* --- 2. THE ANNUAL CYCLE (THE REWARD) --- */}
      <section className="max-w-7xl mx-auto px-6 mb-40">
        <div className="bg-slate-900 rounded-[4rem] p-8 md:p-20 text-white relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 italic tracking-tighter leading-none">
                RECOVERY & <br /> REWARDS.
              </h2>
              <p className="text-slate-400 text-lg mb-12">
                Our Sponsored Missions offer up to{' '}
                <b>₹1800 for Travel & Nutrition</b>. Plus, stay at peak health
                with our exclusive 1-Year Health Pass, unlocking diagnostics
                every 90 days.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                  <Activity className="text-red-500 mb-4" />
                  <h4 className="font-black italic text-xl">₹1800</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Max Travel/Food Support
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                  <BarChart3 className="text-blue-400 mb-4" />
                  <h4 className="font-black italic text-xl">4 Health Tests</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Annual Checkup Cycle
                  </p>
                </div>
              </div>
            </div>

            {/* THE PASS CARD (GRAPHIC TYPE UI) */}
            <div className="relative flex justify-center">
              <div className="w-full max-w-sm bg-linear-to-br from-slate-100 to-white rounded-[2.5rem] p-8 text-slate-900 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border border-white">
                <div className="flex justify-between mb-12">
                  <div className="text-2xl font-black italic text-red-600">
                    JEEVO
                  </div>
                  <div className="bg-slate-900 text-white text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                    Gold Donor Card
                  </div>
                </div>

                <div className="space-y-4 mb-16">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 w-[25%] animate-pulse"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                    <span>90-Day Cooldown</span>
                    <span>Next Test: Q2</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                    Donor Incentive
                  </div>
                  <div className="text-xl font-black italic">
                    CONVEYANCE: ₹1800
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black opacity-40 uppercase tracking-tighter">
                  <span>Legal: Travel Reimbursement</span>
                  <span>Exp: ${expirydate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. SYSTEM FEATURES --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: <ShieldCheck className="text-red-600" />,
              title: 'Letterhead Verify',
              desc: 'Every request must upload a valid Hospital Requisition Form before going live.',
            },
            {
              icon: <Users className="text-blue-600" />,
              title: 'Live Geofencing',
              desc: 'See real-time requests within 10km. Save lives right in your neighborhood.',
            },
            {
              icon: <Hospital className="text-green-600" />,
              title: 'Hospital OTP',
              desc: 'Rewards are only released after a secure OTP verification by hospital staff.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-red-100 transition-all hover:shadow-xl hover:shadow-red-500/5"
            >
              <div className="w-12 h-12 mb-6 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-black italic mb-3 uppercase tracking-tighter">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 4. CTA FOOTER --- */}
      <section className="max-w-08xl mx-auto px-6">
        <div className="bg-red-600 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <h2 className="text-4xl md:text-6xl font-black italic mb-8 relative z-10 tracking-tighter leading-none">
            Join the mission <br /> & earn rewards.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="bg-white text-red-600 px-12 py-5 rounded-2xl font-black hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-2xl">
              Register as Donor <ArrowRight size={20} />
            </button>
            <button className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black hover:bg-black transition-colors">
              I Need Blood
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
