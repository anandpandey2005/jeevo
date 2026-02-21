import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      {/* Navbar Container */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-[#f1f1f1] backdrop-blur-md border-b border-gray-200">
        
        {/* Logo - Use Link to return home */}
        <Link to="/" className="text-3xl font-black text-red-600 tracking-tighter italic shrink-0">
          JEEVO
        </Link>

        {/* Desktop Links - Replaced <a> with <Link> */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Home</Link>
          <Link to="/services" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Service</Link>
          <Link to="/our-mission" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Our Mission</Link>
          <Link to="/pending-requests" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Pending Request</Link>
          <Link to="/testimonials" className="text-slate-800 font-bold hover:text-red-600 transition text-sm uppercase">Testimonial</Link>
        </div>

        {/* Desktop Button */}
        <div className="hidden lg:block">
          <button className="bg-slate-900 text-white px-8 py-2.5 rounded-full font-bold hover:bg-red-600 transition-all shadow-md">
            Make a Sponsor
          </button>
        </div>

        {/* MOBILE HAMBURGER ICON */}
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
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMenu}
        style={{ zIndex: 55 }}
      />

      <div className={`fixed top-0 right-0 w-[80%] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden z-[60] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="text-2xl font-black text-red-600 italic">JEEVO</div>
          <button 
            onClick={closeMenu}
            className="p-2 text-slate-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Links - Replaced <a> with <Link> */}
        <div className="flex flex-col p-8 gap-6">
          <Link to="/" onClick={closeMenu} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600">Home</Link>
          <Link to="/services" onClick={closeMenu} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600">Service</Link>
          <Link to="/our-mission" onClick={closeMenu} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600">Our Mission</Link>
          <Link to="/pending-requests" onClick={closeMenu} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600">Pending Request</Link>
          <Link to="/testimonials" onClick={closeMenu} className="text-slate-800 font-bold text-xl border-b border-gray-100 pb-3 hover:text-red-600">Testimonial</Link>
          
          <button className="mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black text-xl shadow-lg hover:bg-red-600 transition active:scale-95">
            Make a Sponsor
          </button>
        </div>
      </div>
    </div>
  );
}