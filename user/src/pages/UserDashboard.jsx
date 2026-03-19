import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  Clock3,
  Droplets,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Target,
  Trophy,
} from 'lucide-react';

const DEFAULT_STATS = {
  level: 1,
  profileCompletion: 0,
  totalRequestsCreated: 0,
  pendingRequests: 0,
  closedRequests: 0,
  requestedUnits: 0,
  fulfilledUnits: 0,
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatAddress = (address = {}) =>
  [
    address.cityOrTown,
    address.district,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(', ') || 'Address not added';

export default function UserDashboard() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [recentRequests, setRecentRequests] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    if (!id) {
      setError('User id is missing in URL.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/user/dashboard/${encodeURIComponent(id)}`,
        {
          credentials: 'include',
        }
      );

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load dashboard data.');
      }

      const data = payload?.data || {};
      setUser(data.user || null);
      setStats({ ...DEFAULT_STATS, ...(data.stats || {}) });
      setRecentRequests(
        Array.isArray(data.recentRequests) ? data.recentRequests : []
      );
    } catch (fetchError) {
      setError(fetchError?.message || 'Unable to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fullName = useMemo(() => {
    const firstName = user?.fullName?.firstName || '';
    const lastName = user?.fullName?.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unnamed Hero';
  }, [user]);

  const avatarUrl = useMemo(() => {
    if (user?.avatar) return user.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=dc2626&color=ffffff`;
  }, [fullName, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-slate-700 shadow-lg">
          <Loader2 className="animate-spin text-red-600" size={20} />
          <p className="text-sm font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 shadow-lg">
          <div className="mb-4 flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <p className="text-base font-bold">Dashboard failed to load</p>
          </div>
          <p className="mb-6 text-sm text-slate-600">{error}</p>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow">
          No user data found.
        </p>
      </div>
    );
  }

  const heroStatus = user.isGenuineHero ? 'Verified' : 'Pending';
  const heroStatusColor = user.isGenuineHero
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : 'bg-amber-100 text-amber-700 border-amber-200';

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900 m-auto pt-15">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-6 text-white shadow-xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <Droplets size={14} />
                Jeevo Donor Dashboard
              </p>
              <h1 className="text-2xl font-black sm:text-3xl">{fullName}</h1>
              <p className="mt-2 text-sm text-red-50">{user._id}</p>
            </div>
            <button
              type="button"
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex items-center gap-4">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-red-100"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black text-slate-900">
                    {fullName}
                  </h2>
                  <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Blood Group: {user.bloodGroup || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Level {stats.level}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${heroStatusColor}`}
                >
                  {heroStatus}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <p className="inline-flex items-start gap-2">
                  <Phone size={16} className="mt-0.5 text-slate-400" />
                  <span>{user.phone || 'Phone not added'}</span>
                </p>
                <p className="inline-flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-slate-400" />
                  <span>{formatAddress(user.address)}</span>
                </p>
                <p className="inline-flex items-start gap-2">
                  <Clock3 size={16} className="mt-0.5 text-slate-400" />
                  <span>Joined: {formatDate(user.createdAt)}</span>
                </p>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-500">
                Profile Completion
              </h3>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                <span>Profile score</span>
                <span>{stats.profileCompletion}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                  style={{ width: `${stats.profileCompletion}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Add missing profile details to improve request matching.
              </p>
            </section>
          </aside>

          <section className="space-y-6 lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Target size={14} />
                  Total Requests
                </p>
                <p className="text-2xl font-black">{stats.totalRequestsCreated}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Activity size={14} />
                  Pending
                </p>
                <p className="text-2xl font-black">{stats.pendingRequests}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <ShieldCheck size={14} />
                  Closed
                </p>
                <p className="text-2xl font-black">{stats.closedRequests}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Trophy size={14} />
                  Fulfilled Units
                </p>
                <p className="text-2xl font-black">
                  {stats.fulfilledUnits}/{stats.requestedUnits}
                </p>
              </div>
            </div>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">
                  Recent Requests
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Latest {recentRequests.length}
                </p>
              </div>

              {recentRequests.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  No requests created yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentRequests.map((request) => {
                    const statusClass =
                      request.status === 'Closed'
                        ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                        : 'border-amber-200 bg-amber-100 text-amber-700';

                    return (
                      <article
                        key={request._id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {request.patientName}
                          </h4>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                          <p>Blood Type: {request.bloodType}</p>
                          <p>
                            Units: {request.unitFullFilled || 0}/
                            {request.unitsRequired || 0}
                          </p>
                          <p>
                            Location:{' '}
                            {request.customAddress?.cityOrTown || 'Not available'}
                          </p>
                          <p>Created: {formatDate(request.createdAt)}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
