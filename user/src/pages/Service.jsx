import React from 'react';
import {
  Zap,
  ShieldCheck,
  MapPin,
  Bell,
  Activity,
  Smartphone,
  Stethoscope,
  HeartPulse,
  ArrowRight,
  FileText,
} from 'lucide-react';

/**
 * SERVICE PAGE: JEEVO PLATFORM CAPABILITIES
 * Refined for: 2026 Non-Remunerated Health Reward Model
 * Focus: Wellness Incentives & Institutional Logistics
 */

export default function Service() {
  const services = [
    {
      title: 'Real-Time Geo-Linking',
      desc: 'Our proprietary algorithm connects donors to receivers within 10km. Precise mapping ensures help arrives within the critical golden hour.',
      icon: <MapPin className="text-red-600" />,
      tag: 'Live Tracking',
    },
    {
      title: 'Letterhead Verification',
      desc: 'All requests must undergo AI-verification of Hospital Letterheads and Doctor Stamps. We eliminate fake requests to protect donor time.',
      icon: <FileText className="text-blue-600" />,
      tag: 'Trust Layer',
    },
    {
      title: 'Elite Wellness Credits',
      desc: 'Donors earn points for health vouchers. No cash, just care—supporting your health journey with every life you save.',
      icon: <Activity className="text-pink-600" />,
      tag: 'Donor Wellness',
    },
    {
      title: '120-Day Recovery Guard',
      desc: 'Strict medical safety. Our tech prevents any elite donor from donating before the 4-month biological recovery period is complete.',
      icon: <Zap className="text-orange-500" />,
      tag: 'Medical Safety',
    },
    {
      title: "The 'Hero Pass' System",
      desc: 'Elite donors (6+ donations) unlock 2 Full Body Diagnostic Scans per year. We monitor your vitals while you support the community.',
      icon: <Stethoscope className="text-green-600" />,
      tag: 'Premium Health',
    },
    {
      title: 'Hospital OTP Gateway',
      desc: 'Direct B2B dashboard for clinics to confirm successful donations. Secure OTP verification unlocks donor health rewards instantly.',
      icon: <Smartphone className="text-indigo-600" />,
      tag: 'Institutional',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20 font-sans selection:bg-red-500 selection:text-white">
      {/* --- HEADER --- */}
      <section className="px-6 max-w-5xl mx-auto text-center mb-24">
        <h2 className="text-sm font-black text-red-600 uppercase tracking-[0.3em] mb-4">
          The Jeevo Engine
        </h2>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
          Health <br />{' '}
          <span className="text-slate-400 font-light">Infrastructure.</span>
        </h1>
      </section>

      {/* --- SERVICE GRID --- */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item, index) => (
          <div
            key={index}
            className="group bg-white border border-slate-100 p-10 rounded-[3rem] hover:bg-slate-900 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-500/20"
          >
            <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-red-600 group-hover:scale-110 transition-all duration-500">
              <span className="group-hover:text-white transition-colors">
                {item.icon}
              </span>
            </div>

            <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 group-hover:bg-white/10 group-hover:text-red-400">
              {item.tag}
            </div>

            <h3 className="text-2xl font-black italic mb-4 group-hover:text-white transition-colors">
              {item.title}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* --- REWARD WORKFLOW SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 mt-40">
        <div className="bg-red-600 rounded-[4rem] p-10 md:p-20 text-white flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative shadow-2xl shadow-red-500/30">
          {/* Background Decorative Text */}
          <div className="absolute -bottom-10 -right-10 text-[15rem] font-black opacity-10 italic select-none pointer-events-none uppercase">
            Hero
          </div>

          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black italic leading-none mb-8 tracking-tighter uppercase">
              Wellness <br />
              Over Wealth.
            </h2>
            <p className="text-red-100 text-lg font-medium mb-10 leading-relaxed">
              Jeevo operates on a <b>Non-Remunerated Model</b>. We replace illegal cash incentives 
              with high-value health benefits. Our Elite Donors receive free diagnostic 
              coverage, ensuring they stay healthy while saving lives.
            </p>
            <div className="flex gap-4">
              <div className="bg-slate-900 px-6 py-4 rounded-2xl">
                <div className="text-2xl font-black tracking-tighter italic uppercase text-red-500">
                  2X
                </div>
                <div className="text-[10px] font-bold uppercase opacity-60">
                  Annual Body Scans
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl">
                <div className="text-2xl font-black tracking-tighter italic uppercase">
                  120d
                </div>
                <div className="text-[10px] font-bold uppercase opacity-60">
                  Recovery Period
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-4 relative z-10">
            {[
              '1. Requester Uploads Digital Prescription',
              '2. AI-Engine Verifies Medical Urgency',
              '3. Donor Checks-in via Geo-Fence',
              '4. Hospital OTP Unlocks Health Rewards',
            ].map((step, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/5 hover:bg-white/20 transition-all cursor-default"
              >
                <span className="font-black italic text-lg tracking-tight uppercase">
                  {step}
                </span>
                <ShieldCheck size={20} className="text-red-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="mt-40 text-center px-6 pb-10">
        <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-100 p-12 rounded-[3.5rem]">
          <h3 className="text-3xl font-black mb-6 italic tracking-tight uppercase">
            Partner with the mission
          </h3>
          <p className="text-slate-500 mb-8 font-medium">
            Hospitals can access our verified donor network and automated camp management
            dashboard. Join the network that prioritizes safety.
          </p>
          <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 mx-auto hover:bg-red-600 transition-all active:scale-95 shadow-xl">
            Register Hospital <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}