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
  ArrowRight
} from 'lucide-react';

/**
 * SERVICE PAGE: JEEVO PLATFORM CAPABILITIES
 * Logic: Showcases the technical features that facilitate the 
 * Donor-Receiver-Sponsor ecosystem.
 */

export default function Service() {
  const services = [
    {
      title: "Real-Time Geo-Linking",
      desc: "Our proprietary algorithm connects donors to receivers within a 10km radius in under 60 seconds.",
      icon: <MapPin className="text-red-600" />,
      tag: "Live Tracking"
    },
    {
      title: "20+ Backer Verification",
      desc: "A crowdsourced trust layer where community members vouch for the urgency of a blood request.",
      icon: <ShieldCheck className="text-blue-600" />,
      tag: "Security"
    },
    {
      title: "Elite Hero Pass",
      desc: "Automatic enrollment for donors into our 1-year health program after fulfilling priority requests.",
      icon: <Gift className="text-pink-600" />,
      tag: "Rewards"
    },
    {
      title: "Smart Push Alerts",
      desc: "Donors get notified only for requests matching their blood type and proximity to avoid notification fatigue.",
      icon: <Bell className="text-orange-500" />,
      tag: "Automation"
    },
    {
      title: "Quarterly Health Scans",
      desc: "Facilitating 1 Full Body checkup every 3 months for our active donor community.",
      icon: <Stethoscope className="text-green-600" />,
      tag: "Annual Care"
    },
    {
      title: "Hospital Dashboard",
      desc: "Custom portal for clinics to verify blood units and distribute Heart Credits instantly via QR.",
      icon: <Smartphone className="text-indigo-600" />,
      tag: "Enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20 font-sans">
      
      {/* --- HEADER --- */}
      <section className="px-6 max-w-5xl mx-auto text-center mb-24">
        <h2 className="text-sm font-black text-red-600 uppercase tracking-[0.3em] mb-4">Our Ecosystem</h2>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
          Integrated <br /> <span className="text-slate-400 font-light">Solutions.</span>
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
        <div className="bg-red-600 rounded-[4rem] p-10 md:p-20 text-white flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
          {/* Background Decorative Text */}
          <div className="absolute -bottom-10 -right-10 text-[15rem] font-black opacity-10 italic select-none pointer-events-none">
            HERO
          </div>

          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black italic leading-none mb-8 tracking-tighter">
              HOW WE <br />REWARD YOU.
            </h2>
            <p className="text-red-100 text-lg font-medium mb-10 leading-relaxed">
              Donating blood shouldn't just be a sacrifice. Through our partnership 
              with <b>120+ Diagnostic Centers</b>, we've automated the health reward 
              cycle for every verified donor.
            </p>
            <div className="flex gap-4">
               <div className="bg-slate-900 px-6 py-4 rounded-2xl">
                  <div className="text-2xl font-black tracking-tighter italic">4X</div>
                  <div className="text-[10px] font-bold uppercase opacity-60">Tests per year</div>
               </div>
               <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl">
                  <div className="text-2xl font-black tracking-tighter italic">0$</div>
                  <div className="text-[10px] font-bold uppercase opacity-60">Donor Cost</div>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-4 relative z-10">
            {[
              "1. Find a 20+ Backed Request",
              "2. Donate at a Verified Hospital",
              "3. QR-Scan for Heart Credit",
              "4. Unlock Q1 Full Body Voucher"
            ].map((step, i) => (
              <div key={i} className="flex justify-between items-center bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/5 hover:bg-white/20 transition-all cursor-default">
                <span className="font-black italic text-lg tracking-tight">{step}</span>
                <HeartHandshake size={20} className="text-red-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="mt-40 text-center px-6">
        <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-100 p-12 rounded-[3.5rem]">
          <h3 className="text-3xl font-black mb-6 italic tracking-tight">Need a customized integration for your Hospital?</h3>
          <p className="text-slate-500 mb-8 font-medium">Join our network of 500+ verified medical centers using Jeevo's real-time dashboard.</p>
          <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 mx-auto hover:bg-red-600 transition-all">
            Get Api Access <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
}