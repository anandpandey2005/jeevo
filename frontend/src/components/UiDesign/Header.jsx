import React, { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      {/* Navbar Container */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-[#f1f1f1] backdrop-blur-md border-b border-gray-200">
        
        {/* Logo */}
        <div className="text-3xl font-black text-red-600 tracking-tighter italic shrink-0">
          JEEVO
        </div>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Home</a>
          <a href="#" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Service</a>
          <a href="#" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Our Mission</a>
          <a href="#" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Pending Request</a>
          <a href="#" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Testimonial</a>
        </div>

        {/* Desktop Button */}
        <div className="hidden lg:block">
          <button className="bg-slate-900 text-white px-8 py-2.5 rounded-full font-bold hover:bg-red-600 transition-all shadow-md">
            Make a Sponsor
          </button>
        </div>

        {/* --- MOBILE HAMBURGER ICON (Opens Menu) --- */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsOpen(true)}
            className="text-slate-900 p-2 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR MENU --- */}
      {/* Background Overlay (Click to close) */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        style={{ zIndex: 55 }}
      />

      {/* Menu Drawer */}
      <div className={`fixed top-0 right-0 w-[80%] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden z-[60] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* CLOSE BUTTON INSIDE DRAWER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="text-2xl font-black text-red-600 italic">JEEVO</div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex flex-col p-8 gap-6">
          <a href="#" onClick={() => setIsOpen(false)} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600 transition-colors">Home</a>
          <a href="#" onClick={() => setIsOpen(false)} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600 transition-colors">Service</a>
          <a href="#" onClick={() => setIsOpen(false)} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600 transition-colors">Our Mission</a>
          <a href="#" onClick={() => setIsOpen(false)} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600 transition-colors">Pending Request</a>
          <a href="#" onClick={() => setIsOpen(false)} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600 transition-colors">Testimonial</a>
          
          <button className="mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black text-xl shadow-lg hover:bg-red-600 transition active:scale-95">
            Make a Sponsor
          </button>
        </div>
      </div>
    </div>
  );
}