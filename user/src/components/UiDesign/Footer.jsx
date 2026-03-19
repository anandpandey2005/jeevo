import React from 'react';
import {
  Heart,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  ShieldAlert,
} from 'lucide-react';

/**
 * JEEVO LEGAL-SAFE FOOTER
 * Includes: Legal Disclaimers, Non-Profit terminology, and Compliance notes.
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-6 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black italic tracking-tighter text-red-600">
                JEEVO
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              India's first incentivized health-logistics platform. Bridging the
              gap between life-saving donors and emergency needs through a
              verified, legal, and community-backed ecosystem.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-red-500 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black italic uppercase tracking-widest text-xs mb-6 text-red-500">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Find Donors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Hospital Login
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Elite Hero Program
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Health Pass Verification
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="font-black italic uppercase tracking-widest text-xs mb-6 text-red-500">
              Legal
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Compliance (NBTC Guidelines)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black italic uppercase tracking-widest text-xs mb-6 text-red-500">
              Support
            </h4>
            <div className="space-y-4 text-sm font-bold text-slate-300">
              <p className="flex items-center gap-2 hover:text-white cursor-pointer">
                <Mail size={16} /> support@jeevo.org
              </p>
              <p className="text-slate-500 font-medium">
                Available 24/7 for <br /> Emergency Blood Coordination.
              </p>
            </div>
          </div>
        </div>

        {/* --- IMPORTANT LEGAL SAFEGUARD NOTE --- */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-red-600/20 p-3 rounded-2xl">
              <ShieldAlert className="text-red-500" size={24} />
            </div>
            <div>
              <h5 className="font-black italic text-lg mb-2 uppercase tracking-tight">
                Legal & Ethical Compliance Note
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                JEEVO (Jeevo Health Foundation) strictly adheres to the National
                Blood Transfusion Council (NBTC) and the Drugs and Cosmetics Act
                of India.
                <span className="text-white">
                  {' '}
                  We do not buy or sell blood.
                </span>{' '}
                Blood is a voluntary donation. The incentive of up to ₹1,800 is
                strictly for
                <strong>
                  {' '}
                  Conveyance, Nutritional Support, and Work-loss Compensation
                </strong>{' '}
                provided voluntarily by the requestor to the donor. JEEVO is a
                technology facilitator and does not operate a blood bank. All
                donations take place at licensed medical facilities.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            © {currentYear} JEEVO HEALTH PLATFORM. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Engineered for <span className="text-red-600">Humanity.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
