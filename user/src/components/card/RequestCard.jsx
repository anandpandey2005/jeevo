import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets } from 'lucide-react';

export default function RequestCard() {
  const isLoggedIn = useMemo(() => {
    try {
      return Boolean(localStorage.getItem('jeevo_user'));
    } catch {
      return false;
    }
  }, []);

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl px-4 pb-16">
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Droplets size={14} />
              Live Requests
            </p>
            <h3 className="text-2xl font-black sm:text-3xl">
              Ready to make a life-saving move?
            </h3>
            <p className="mt-2 text-sm text-red-50">
              Browse urgent requests or raise a verified request instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/pending-requests"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
            >
              View Requests
              <ArrowRight size={16} />
            </Link>
            <Link
              to={
                isLoggedIn
                  ? '/dashboard/user/me?focus=create'
                  : '/login?next=dashboard'
              }
              className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Raise a Request
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
