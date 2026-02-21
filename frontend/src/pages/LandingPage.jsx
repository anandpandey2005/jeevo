import React from 'react';
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
} from 'lucide-react';

export default function StartupLanding() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] font-sans text-slate-900 selection:bg-red-200">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
          Live: 1,240 Blood Requests Nearby
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
          Locate. Donate. <br />
          <span className="text-red-600">Celebrate.</span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          The world’s first real-time blood bridge. We connect donors to
          emergency requests and reward heroism with sponsored health benefits.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all">
            I WANT TO DONATE
          </button>
          <button className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all">
            RAISE REQUEST
          </button>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900">50k+</div>
            <div className="text-sm text-slate-500 font-bold uppercase">
              Lives Saved
            </div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-3xl font-black text-slate-900">120+</div>
            <div className="text-sm text-slate-500 font-bold uppercase">
              Hospitals
            </div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-3xl font-black text-slate-900">10min</div>
            <div className="text-sm text-slate-500 font-bold uppercase">
              Avg Response
            </div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-3xl font-black text-slate-900">$0</div>
            <div className="text-sm text-slate-500 font-bold uppercase">
              Always Free
            </div>
          </div>
        </div>
      </div>

      {/* The "3-Step Startup" Grid */}
      <section className="bg-slate-900 py-24 px-6 rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-white">
          {[
            {
              icon: <Search size={32} />,
              title: 'Locate',
              desc: 'Our real-time dashboard maps blood requests from hospitals in your 10-mile radius.',
            },
            {
              icon: <Heart size={32} />,
              title: 'Donate',
              desc: 'Visit verified hospital camps. Secure and efficient coordination with medical teams.',
            },
            {
              icon: <Trophy size={32} />,
              title: 'Celebrate',
              desc: 'After 10 donations, unlock 3 months of Unlimited Free Blood Tests.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-red-500 transition-all"
            >
              <div className="mb-6 inline-block p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-900/20">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Hero Sponsors */}
      <section className="py-24 px-6 bg-[#f1f1f1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Our Hero Sponsors</h2>
            <p className="text-slate-500 font-medium">
              Corporate partners who make "Hero Perks" possible.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'HealthGuard',
              'VitalityPlus',
              'MediCure',
              'BioLab Co.',
              'ApexCare',
              'LifeScan',
            ].map((brand, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-200 grayscale hover:grayscale-0 transition-all cursor-pointer"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full mb-3 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-slate-400" />
                </div>
                <span className="font-bold text-slate-600 text-xs uppercase tracking-widest">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Hospital/Clinic Section */}
      <section className="md:py-15 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center hover:bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-slate-100">
          <div>
            <div className="inline-block p-3 bg-red-100 text-red-600 rounded-2xl mb-6">
              <Hospital size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Hospital Management <br />
              <span className="text-red-600">Simplified.</span>
            </h2>
            <ul className="space-y-4 mb-10">
              {[
                'Broadcast urgent blood needs instantly',
                'Manage donation camp schedules',
                'Verify donor history with QR codes',
                'Analytics for blood stock levels',
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-bold text-slate-600"
                >
                  <CheckCircle2 size={20} className="text-green-500" /> {text}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all">
                Register Facility <ArrowRight size={18} />
              </button>
              <button className="flex items-center gap-2 bg-slate-100 text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                <LogIn size={18} /> Hospital Login
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl transform rotate-2">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-4 w-24 bg-slate-700 rounded-full"></div>
                  <div className="h-8 w-8 bg-red-600 rounded-lg"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-20 w-full bg-slate-700/50 rounded-xl animate-pulse"></div>
                  <div className="h-20 w-full bg-slate-700/50 rounded-xl"></div>
                  <div className="h-20 w-full bg-slate-700/50 rounded-xl"></div>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <Users className="text-green-600" />
                </div>
                <div>
                  <div className="font-black text-2xl">412</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    Nearby Donors Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-20 text-center">
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mb-4 text-sm">
          Locate. Donate. Celeberate.
        </p>
        <div className="text-3xl font-black text-red-600 italic">JEEVO</div>
      </footer>
    </div>
  );
}
