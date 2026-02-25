import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  MapPin, 
  Bell, 
  Gift, 
  Smartphone, 
  Stethoscope, 
  HeartHandshake,
  ArrowRight,
  FileText
} from 'lucide-react';

/**
 * SERVICE PAGE: JEEVO PLATFORM CAPABILITIES
 * Refined for: Legal Compensation Model & Verified Health Logistics
 */

export default function Service() {
  const services = [
    {
      title: "Real-Time Geo-Linking",
      desc: "Our MERN-powered algorithm connects donors to receivers within 10km. No more broad-casting; get surgical precision in emergency.",
      icon: <MapPin className="text-red-600" />,
      tag: "Live Tracking"
    },
    {
      title: "Letterhead Verification",
      desc: "Every request is cross-checked with Hospital Letterheads and Doctor IDs. 0% Fake requests, 100% Transparency.",
      icon: <FileText className="text-blue-600" />,
      tag: "Trust Layer"
    },
    {
      title: "Compensation Wallet",
      desc: "Automated distribution of up to ₹1800 for donor travel and nutrition. Legal, secure, and instant via Escrow.",
      icon: <Gift className="text-pink-600" />,
      tag: "Donor Support"
    },
    {
      title: "90-Day Smart Cooldown",
      desc: "Automated health-safeguard system. Our tech ensures no donor can donate twice within the medical rest period.",
      icon: <Zap className="text-orange-500" />,
      tag: "Health Safety"
    },
    {
      title: "Quarterly Health Scans",
      desc: "The 'Hero Pass' grants 1 Full Body diagnostic test every 3 months. We track your health while you save lives.",
      icon: <Stethoscope className="text-green-600" />,
      tag: "Annual Care"
    },
    {
      title: "Hospital OTP Dashboard",
      desc: "Direct integration for clinics to verify successful donations via secure OTP, releasing rewards instantly.",
      icon: <Smartphone className="text-indigo-600" />,
      tag: "Enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20 font-sans selection:bg-red-500 selection:text-white">
      
      {/* --- HEADER --- */}
      <section className="px-6 max-w-5xl mx-auto text-center mb-24">
        <h2 className="text-sm font-black text-red-600 uppercase tracking-[0.3em] mb-4">The Jeevo Engine</h2>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
          Medical <br /> <span className="text-slate-400 font-light">Infrastructure.</span>
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
            Jeevo
          </div>

          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black italic leading-none mb-8 tracking-tighter uppercase">
              How we <br />Protect You.
            </h2>
            <p className="text-red-100 text-lg font-medium mb-10 leading-relaxed">
              We've created a legal <b>'Donor Support Ecosystem'</b>. Every rupee of the ₹1800 
              compensation is tracked as travel and recovery reimbursement, keeping 
              you and the receiver 100% legally safe.
            </p>
            <div className="flex gap-4">
               <div className="bg-slate-900 px-6 py-4 rounded-2xl">
                  <div className="text-2xl font-black tracking-tighter italic uppercase text-red-500">₹1800</div>
                  <div className="text-[10px] font-bold uppercase opacity-60">Max Support</div>
               </div>
               <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl">
                  <div className="text-2xl font-black tracking-tighter italic uppercase">100%</div>
                  <div className="text-[10px] font-bold uppercase opacity-60">Verified</div>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-4 relative z-10">
            {[
              "1. Requestor Uploads Hospital Proof",
              "2. Jeevo Verifies Doctor Stamp",
              "3. Donor Arrives (Geo-Fence Check)",
              "4. Hospital OTP Unlocks Rewards"
            ].map((step, i) => (
              <div key={i} className="flex justify-between items-center bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/5 hover:bg-white/20 transition-all cursor-default">
                <span className="font-black italic text-lg tracking-tight uppercase">{step}</span>
                <ShieldCheck size={20} className="text-red-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="mt-40 text-center px-6 pb-10">
        <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-100 p-12 rounded-[3.5rem]">
          <h3 className="text-3xl font-black mb-6 italic tracking-tight uppercase">Ready to scale the mission?</h3>
          <p className="text-slate-500 mb-8 font-medium">Register your hospital today to access our automated blood-inventory & donor tracking dashboard.</p>
          <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 mx-auto hover:bg-red-600 transition-all active:scale-95 shadow-xl">
            Register Hospital <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
}