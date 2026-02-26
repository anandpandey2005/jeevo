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
} from 'lucide-react';

/**
 * JEEVO MOBILE-FIRST REQUEST CARD
 * Clean, Compact, and High-Conversion UI
 */

export default function RequestCard({ request }) {
  const [isAccepted, setIsAccepted] = useState(false);

  const data = request || {
    bloodGroup: 'O+',
    units: 2,
    hospitalName: 'AIIMS, Delhi',
    district: 'South Delhi',
    postedTime: '2h ago',
    deadline: '28 Feb',
    compensation: 1800,
    note: 'Emergency Case. Need O+ urgently.',
    isVerified: true,
  };

  return (
    <div className="w-full max-w-[360px] bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-lg transition-all active:scale-[0.98]">
      {/* --- TOP: COMPACT HEADER --- */}
      <div className="p-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white shadow-md">
            <span className="text-[18px] font-black italic leading-none">
              {data.bloodGroup}
            </span>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">
              Immediate Need
            </h4>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Clock size={10} /> {data.postedTime} • {data.units} Units
            </div>
          </div>
        </div>
        {data.isVerified && <ShieldCheck size={18} className="text-blue-500" tiltle = "Verified User" />}
      </div>

      {/* --- MIDDLE: LOCATION & REWARD --- */}
      <div className="p-5 space-y-4">
        {/* Hospital Info */}
        <div className="flex gap-3">
          <Landmark className="text-slate-400 shrink-0" size={16} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">
              {data.hospitalName}
            </p>
            <p className="text-[10px] text-slate-500 font-medium truncate italic">
              {data.district}, {data.state || 'New Delhi'}
            </p>
          </div>
          <button className="bg-slate-100 p-2 rounded-lg">
            <MapPin size={14} className="text-red-500" />
          </button>
        </div>

        {/* Note Box */}
        <div className="bg-red-50/50 p-3 rounded-xl border border-red-100/50">
          <p className="text-[10px] font-bold text-red-800 leading-tight italic">
            "{data.note}"
          </p>
        </div>

        {/* Contact Strip (Hidden until Accept) */}
        <div className="flex gap-2">
          <div
            className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-[10px] font-black transition-all ${isAccepted ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
          >
            <Phone size={12} /> {isAccepted ? '+91 98XXX-XXXXX' : 'HIDDEN'}
          </div>
          <div
            className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-[10px] font-black transition-all ${isAccepted ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
          >
            <FileText size={12} /> REQUISITION
          </div>
        </div>
      </div>

      {/* --- BOTTOM: ACTION AREA --- */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase">
              Recovery Support
            </span>
            <span className="text-lg font-black italic text-slate-900 leading-none">
              ₹{data.compensation}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-black text-slate-400 uppercase">
              Deadline
            </span>
            <span className="block text-[10px] font-bold text-red-600">
              {data.deadline}
            </span>
          </div>
        </div>

        {!isAccepted ? (
          <button
            onClick={() => setIsAccepted(true)}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-lg hover:bg-black active:scale-95 transition-all"
          >
            I want to donate <ChevronRight size={14} />
          </button>
        ) : (
          <div className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Mission Accepted
          </div>
        )}

        <div className="mt-4 flex items-start gap-1.5 opacity-50 px-1">
          <AlertCircle size={10} className="mt-0.5 shrink-0" />
          <p className="text-[7px] font-medium text-slate-500 leading-tight">
            Legal: ₹{data.compensation} is for logistics only. JEEVO maintains
            donor-receiver privacy until acceptance.
          </p>
        </div>
      </div>
    </div>
  );
}
