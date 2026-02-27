import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  Landmark,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Activity,
  Trophy,
} from 'lucide-react';

/**
 * JEEVO MOBILE-FIRST REQUEST CARD
 * Updated for: Elite Wellness & Hero Pass Model
 */

export default function RequestCard({ request }) {
  const [isAccepted, setIsAccepted] = useState(false);

  // Default data structure reflecting the non-remunerated model
  const data = request || {
    bloodGroup: 'O+',
    units: 2,
    hospitalName: 'AIIMS, Delhi',
    district: 'South Delhi',
    postedTime: '2h ago',
    deadline: 'Today, 11 PM',
    rewardTier: 'Elite',
    note: 'Emergency Surgery. Verified hospital requisition attached.',
    isVerified: true,
  };

  return (
    <div className="w-full max-w-[360px] bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl active:scale-[0.98]">
      
      {/* --- TOP: COMPACT HEADER --- */}
      <div className="p-5 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-red-200">
            <span className="text-[20px] font-black italic leading-none">
              {data.bloodGroup}
            </span>
          </div>
          <div>
            <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-900 flex items-center gap-1">
              Immediate Need <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-0.5">
              <Clock size={10} /> {data.postedTime} • {data.units} Units
            </div>
          </div>
        </div>
        {data.isVerified && (
          <div className="bg-blue-50 p-2 rounded-xl">
            <ShieldCheck size={18} className="text-blue-600" />
          </div>
        )}
      </div>

      {/* --- MIDDLE: LOCATION & REWARD --- */}
      <div className="p-6 space-y-5">
        {/* Hospital Info */}
        <div className="flex gap-3">
          <div className="bg-slate-100 p-3 rounded-xl h-fit">
            <Landmark className="text-slate-500" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tighter">
              {data.hospitalName}
            </p>
            <p className="text-[10px] text-slate-500 font-bold truncate italic uppercase opacity-60">
              {data.district}, New Delhi
            </p>
          </div>
          <button className="bg-red-50 p-3 rounded-xl hover:bg-red-100 transition-colors">
            <MapPin size={18} className="text-red-600" />
          </button>
        </div>

        {/* Note Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
            "{data.note}"
          </p>
        </div>

        {/* Verification Assets */}
        <div className="flex gap-2">
          <div
            className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
              isAccepted ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <Phone size={14} className={isAccepted ? 'text-green-600' : 'text-slate-300'} />
            <span className={`text-[9px] font-black uppercase ${isAccepted ? 'text-green-700' : 'text-slate-400'}`}>
              {isAccepted ? 'Contact' : 'Locked'}
            </span>
          </div>
          <div
            className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
              isAccepted ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <FileText size={14} className={isAccepted ? 'text-blue-600' : 'text-slate-300'} />
            <span className={`text-[9px] font-black uppercase ${isAccepted ? 'text-blue-700' : 'text-slate-400'}`}>
              Proof Docs
            </span>
          </div>
        </div>
      </div>

      {/* --- BOTTOM: REWARD & ACTION --- */}
      <div className="px-6 pb-6">
        <div className="bg-slate-900 rounded-3xl p-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600/20 p-2 rounded-lg">
              <Trophy size={16} className="text-red-500" />
            </div>
            <div>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Wellness Reward
              </span>
              <span className="text-xs font-black italic text-white uppercase">
                Hero Pass Credit
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Urgency
            </span>
            <span className="text-[10px] font-black text-red-500 uppercase italic">
              {data.deadline}
            </span>
          </div>
        </div>

        {!isAccepted ? (
          <button
            onClick={() => setIsAccepted(true)}
            className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 shadow-xl shadow-red-100 hover:bg-red-700 active:scale-95 transition-all"
          >
            Accept Mission <ChevronRight size={16} />
          </button>
        ) : (
          <div className="w-full bg-green-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 animate-in zoom-in-95 duration-300">
            <CheckCircle2 size={16} /> Ready to Save Life
          </div>
        )}

        <div className="mt-4 flex items-start gap-2 px-1">
          <Activity size={12} className="text-slate-300 mt-0.5" />
          <p className="text-[8px] font-bold text-slate-400 uppercase leading-tight tracking-tighter">
            Note: Acceptance starts the 120-day health cycle. Rewards are OTP-released by hospital staff only.
          </p>
        </div>
      </div>
    </div>
  );
}