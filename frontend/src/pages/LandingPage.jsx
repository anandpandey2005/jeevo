import React from "react";
import {
  Search,
  Heart,
  Trophy,
  Activity,
  Hospital,
  ArrowRight,
} from "lucide-react";

export default function StartupLanding() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] font-sans text-slate-900">
      {/* Header / Navbar */}
      <nav className="flex justify-between items-center px-8 py-5  sticky top-0 bg-white/10 backdrop-blur-md z-50">
        <div className="text-3xl font-black text-red-600 tracking-tighter italic">
          JEEVO
        </div>

        <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition">
          Make a Sponser
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8">
          <Activity size={16} /> Live: 1,240 Blood Requests Nearby
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8">
          Locate. Donate. <br />
          <span className="text-red-600">Celebrate.</span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          The world’s first real-time blood bridge. We connect donors to
          emergency requests and reward your heroism with sponsored health
          benefits.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-transform">
            I WANT TO DONATE
          </button>
          <button className="bg-slate-100 text-slate-700 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-200 transition">
            RAISE REQUEST
          </button>
        </div>
      </section>

      {/* The "3-Step Startup" Grid */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="group">
            <div className="mb-6 inline-block p-4 bg-white rounded-3xl shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors ">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Locate</h3>
            <p className="text-slate-500 leading-relaxed">
              Our real-time dashboard maps blood requests from hospitals and
              individuals in your 10-mile radius. No more scrolling social media
              for leads.
            </p>
          </div>

          <div className="group">
            <div className="mb-6 inline-block p-4 bg-white rounded-3xl shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Heart size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Donate</h3>
            <p className="text-slate-500 leading-relaxed">
              Visit verified hospital camps or direct requestors. Secure,
              verified, and efficient coordination between you and the medical
              team.
            </p>
          </div>

          <div className="group">
            <div className="mb-6 inline-block p-4 bg-white rounded-3xl shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Trophy size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Celebrate</h3>
            <p className="text-slate-500 leading-relaxed">
              Receive "Hero Perks" from sponsors. After 10 donations, unlock 3
              months of <b>Unlimited Free Blood Tests</b> at partner diagnostic
              centers.
            </p>
          </div>
        </div>
      </section>

      {/* Hospital Partnership CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Are you a Hospital or Clinic?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Automate your blood bank needs. Create donation camps and reach
              thousands of nearby donors in seconds.
            </p>
            <button className="flex items-center gap-2 mx-auto bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition">
              <Hospital size={20} /> Register Your Facility{" "}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
