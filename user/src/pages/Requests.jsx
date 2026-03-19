import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Filter,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import Toast from '../components/Toast.jsx';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DEFAULT_FILTERS = {
  search: '',
  pincode: '',
  state: '',
  district: '',
  bloodGroup: '',
  urgency: '',
  status: 'pending',
};

const INITIAL_FORM = {
  patientName: '',
  patientPhone: '',
  hospitalName: '',
  addressLine1: '',
  state: '',
  district: '',
  pincode: '',
  bloodGroup: '',
  quantity: '',
  unit: 'units',
  urgency: 'normal',
  note: '',
  latitude: '',
  longitude: '',
};

const buildQuery = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : '';
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

export default function Requests() {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('view') === 'mine' ? 'mine' : 'donate';
  const loginRedirect = `/login?next=${encodeURIComponent('/pending-requests?view=mine')}`;

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [form, setForm] = useState(INITIAL_FORM);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [authRequired, setAuthRequired] = useState(false);
  const [success, setSuccess] = useState('');
  const [viewMode, setViewMode] = useState(initialView);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem('jeevo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const fetchRequests = useCallback(async (activeFilters = DEFAULT_FILTERS, mode = 'donate') => {
    setLoading(true);
    setError('');
    setAuthRequired(false);

    try {
      const endpoint =
        mode === 'mine' ? '/api/requests/mine' : '/api/requests';
      const response = await fetch(
        `${endpoint}${buildQuery(activeFilters)}`,
        {
          credentials: 'include',
        }
      );

      const payload = await response.json().catch(() => null);
      if (response.status === 401) {
        setAuthRequired(true);
        throw new Error('Please login to view your requests.');
      }

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to fetch requests.');
      }

      setRequests(Array.isArray(payload?.data) ? payload.data : []);
    } catch (fetchError) {
      setError(fetchError?.message || 'Unable to load requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const seedFilters =
      initialView === 'mine'
        ? { ...DEFAULT_FILTERS, status: '' }
        : DEFAULT_FILTERS;
    setFilters(seedFilters);
    fetchRequests(seedFilters, initialView);
  }, [fetchRequests, initialView]);

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleApplyFilters = () => {
    fetchRequests(filters, viewMode);
  };

  const handleClearFilters = () => {
    const resetFilters =
      viewMode === 'mine' ? { ...DEFAULT_FILTERS, status: '' } : DEFAULT_FILTERS;
    setFilters(resetFilters);
    fetchRequests(resetFilters, viewMode);
  };

  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCreateRequest = async (event) => {
    event.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const requestPayload = {
        ...form,
        quantity: form.quantity ? Number(form.quantity) : 0,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
      };
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestPayload),
      });

      const responsePayload = await response.json().catch(() => null);
      if (response.status === 401) {
        setAuthRequired(true);
        throw new Error('Please login to create a request.');
      }

      if (!response.ok || !responsePayload?.success) {
        throw new Error(
          responsePayload?.message || 'Failed to create request.'
        );
      }

      setForm(INITIAL_FORM);
      setSuccess('Request created successfully.');
      fetchRequests(filters, viewMode);
    } catch (createError) {
      setError(createError?.message || 'Unable to create request.');
    } finally {
      setCreating(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setSuccess('Location captured successfully.');
        setLocating(false);
      },
      () => {
        setError('Unable to fetch your location.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const totalRequests = useMemo(() => requests.length, [requests.length]);
  const toastMessage = success || error;
  const toastType = success ? 'success' : 'error';
  const clearToast = () => {
    setError('');
    setSuccess('');
  };

  const handleToggleView = (mode) => {
    setViewMode(mode);
    setEditingRequestId(null);
    setEditForm(null);
    const nextFilters =
      mode === 'mine' ? { ...DEFAULT_FILTERS, status: '' } : DEFAULT_FILTERS;
    setFilters(nextFilters);
    fetchRequests(nextFilters, mode);
  };

  const handleEnroll = async (requestId) => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/requests/${requestId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const payload = await response.json().catch(() => null);
      if (response.status === 401) {
        setAuthRequired(true);
        throw new Error('Please login to enroll as a donor.');
      }
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to enroll.');
      }
      setSuccess('Enrollment sent to requestor.');
      fetchRequests(filters, viewMode);
    } catch (enrollError) {
      setError(enrollError?.message || 'Unable to enroll.');
    }
  };

  const handleApprove = async (requestId, donorId) => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ donorId }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to approve donor.');
      }
      setSuccess('Donor approved successfully.');
      fetchRequests(filters, viewMode);
    } catch (approveError) {
      setError(approveError?.message || 'Unable to approve donor.');
    }
  };

  const handleReject = async (requestId, donorId) => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ donorId }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to reject donor.');
      }
      setSuccess('Donor rejected.');
      fetchRequests(filters, viewMode);
    } catch (rejectError) {
      setError(rejectError?.message || 'Unable to reject donor.');
    }
  };

  const handleMarkDonated = async (requestId, donorId) => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/requests/${requestId}/mark-donated`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ donorId }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to mark donation.');
      }
      setSuccess('Donation marked and donor level updated.');
      fetchRequests(filters, viewMode);
    } catch (donateError) {
      setError(donateError?.message || 'Unable to mark donation.');
    }
  };

  const startEditing = (request) => {
    setEditingRequestId(request._id);
    setEditForm({
      patientName: request.patientDetails?.name || '',
      hospitalName: request.patientDetails?.address?.hospitalName || '',
      addressLine1: request.patientDetails?.address?.line1 || '',
      state: request.patientDetails?.address?.state || '',
      district: request.patientDetails?.address?.district || '',
      pincode: request.patientDetails?.address?.pincode || '',
      bloodGroup: request.requirement?.bloodGroup || '',
      quantity: request.requirement?.quantity || '',
      unit: request.requirement?.unit || 'units',
      urgency: request.urgency || 'normal',
      note: request.note || '',
      status: request.status || 'pending',
    });
  };

  const handleEditChange = (field) => (event) => {
    setEditForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleUpdateRequest = async (event) => {
    event.preventDefault();
    if (!editingRequestId || !editForm) return;
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/requests/${editingRequestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update request.');
      }
      setSuccess('Request updated successfully.');
      setEditingRequestId(null);
      setEditForm(null);
      fetchRequests(filters, viewMode);
    } catch (updateError) {
      setError(updateError?.message || 'Unable to update request.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-soft)] px-4 pt-24 pb-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <Search size={14} />
                Live Requests
              </p>
              <h1 className="text-2xl font-black sm:text-3xl">
                {viewMode === 'mine' ? 'My Requests' : 'Active Blood Requests'}
              </h1>
              <p className="mt-2 text-sm text-red-50">
                {totalRequests} requests visible right now.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fetchRequests(filters)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </header>

        <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleToggleView('donate')}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                viewMode === 'donate'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              Donate
            </button>
            <button
              type="button"
              onClick={() => handleToggleView('mine')}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                viewMode === 'mine'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              My Requests
            </button>
          </div>
          {viewMode === 'mine' && !currentUser && (
            <p className="mt-4 text-sm font-semibold text-amber-600">
              Login required to manage your requests.
            </p>
          )}
        </section>

        <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
            <Filter size={16} />
            Filter Requests
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <input
              value={filters.search}
              onChange={handleFilterChange('search')}
              placeholder="Search hospital or patient"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
            />
            <input
              value={filters.pincode}
              onChange={handleFilterChange('pincode')}
              placeholder="Pincode"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
            />
            <input
              value={filters.state}
              onChange={handleFilterChange('state')}
              placeholder="State"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
            />
            <input
              value={filters.district}
              onChange={handleFilterChange('district')}
              placeholder="District"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
            />
            <select
              value={filters.bloodGroup}
              onChange={handleFilterChange('bloodGroup')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <select
              value={filters.urgency}
              onChange={handleFilterChange('urgency')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
            >
              <option value="">All Urgency</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={filters.status}
              onChange={handleFilterChange('status')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleApplyFilters}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300"
            >
              Clear
            </button>
          </div>
        </section>

        {viewMode === 'mine' && editingRequestId && editForm && (
          <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 text-sm font-black uppercase tracking-wide text-slate-500">
              Update Request
            </div>
            <form onSubmit={handleUpdateRequest} className="grid gap-4 md:grid-cols-2">
              <input
                value={editForm.patientName}
                onChange={handleEditChange('patientName')}
                placeholder="Patient Name"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              />
              <input
                value={editForm.hospitalName}
                onChange={handleEditChange('hospitalName')}
                placeholder="Hospital Name"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              />
              <input
                value={editForm.addressLine1}
                onChange={handleEditChange('addressLine1')}
                placeholder="Hospital Address"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              />
              <input
                value={editForm.state}
                onChange={handleEditChange('state')}
                placeholder="State"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              />
              <input
                value={editForm.district}
                onChange={handleEditChange('district')}
                placeholder="District"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              />
              <input
                value={editForm.pincode}
                onChange={handleEditChange('pincode')}
                placeholder="Pincode"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              />
              <select
                value={editForm.bloodGroup}
                onChange={handleEditChange('bloodGroup')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <input
                value={editForm.quantity}
                onChange={handleEditChange('quantity')}
                placeholder="Quantity Needed"
                type="number"
                min="1"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              />
              <select
                value={editForm.unit}
                onChange={handleEditChange('unit')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              >
                <option value="units">Units</option>
                <option value="ml">ML</option>
                <option value="liters">Liters</option>
              </select>
              <select
                value={editForm.urgency}
                onChange={handleEditChange('urgency')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
              <select
                value={editForm.status}
                onChange={handleEditChange('status')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
              <textarea
                value={editForm.note}
                onChange={handleEditChange('note')}
                placeholder="Additional notes"
                className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                rows={3}
              />
              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingRequestId(null);
                    setEditForm(null);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {viewMode === 'mine' && !authRequired && (
          <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
              <Plus size={16} />
              Create New Request
            </div>

            <form
              onSubmit={handleCreateRequest}
              className="grid gap-4 md:grid-cols-2"
            >
              <input
                value={form.patientName}
                onChange={handleFormChange('patientName')}
                placeholder="Patient Name"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                required
              />
              <input
                value={form.patientPhone}
                onChange={handleFormChange('patientPhone')}
                placeholder="Patient Phone"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              />
              <input
                value={form.hospitalName}
                onChange={handleFormChange('hospitalName')}
                placeholder="Hospital Name"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                required
              />
              <input
                value={form.addressLine1}
                onChange={handleFormChange('addressLine1')}
                placeholder="Hospital Address"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                required
              />
              <input
                value={form.state}
                onChange={handleFormChange('state')}
                placeholder="State"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                required
              />
              <input
                value={form.district}
                onChange={handleFormChange('district')}
                placeholder="District"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                required
              />
              <input
                value={form.pincode}
                onChange={handleFormChange('pincode')}
                placeholder="Pincode"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                required
              />
              <select
                value={form.bloodGroup}
                onChange={handleFormChange('bloodGroup')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                required
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <input
                value={form.quantity}
                onChange={handleFormChange('quantity')}
                placeholder="Quantity Needed"
                type="number"
                min="1"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                required
              />
              <select
                value={form.unit}
                onChange={handleFormChange('unit')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              >
                <option value="units">Units</option>
                <option value="ml">ML</option>
                <option value="liters">Liters</option>
              </select>
              <select
                value={form.urgency}
                onChange={handleFormChange('urgency')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
              <textarea
                value={form.note}
                onChange={handleFormChange('note')}
                placeholder="Additional notes"
                className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
                rows={3}
              />

              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300"
                  disabled={locating}
                >
                  <MapPin size={14} />
                  {locating ? 'Locating...' : 'Use My Location'}
                </button>
                <input
                  value={form.latitude}
                  onChange={handleFormChange('latitude')}
                  placeholder="Latitude"
                  className="min-w-[120px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-red-500"
                />
                <input
                  value={form.longitude}
                  onChange={handleFormChange('longitude')}
                  placeholder="Longitude"
                  className="min-w-[120px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {creating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Request'
                )}
              </button>
            </form>
          </section>
        )}

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
            <MapPin size={16} />
            Request Feed
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm font-semibold text-slate-500">
              <Loader2 size={18} className="mr-2 animate-spin" />
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
              No requests found for the selected filters.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {requests.map((request) => {
                const urgency = request.urgency || 'normal';
                const urgencyClass =
                  urgency === 'critical'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : urgency === 'urgent'
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200';
                const statusLabel =
                  request.status?.charAt(0).toUpperCase() +
                    request.status?.slice(1) || 'Pending';
                const address = request.patientDetails?.address || {};
                const location = [address.district, address.state, address.pincode]
                  .filter(Boolean)
                  .join(', ');

                const enrolledIds = Array.isArray(request.enrolledUsers)
                  ? request.enrolledUsers.map((item) =>
                      typeof item === 'string' ? item : item?._id
                    )
                  : [];
                const approvedIds = Array.isArray(request.approvedUsers)
                  ? request.approvedUsers.map((item) =>
                      typeof item === 'string' ? item : item?._id
                    )
                  : [];
                const isOwner =
                  viewMode === 'mine' ||
                  (currentUser &&
                    String(request.createdBy) === String(currentUser._id));
                const isEnrolled =
                  currentUser && enrolledIds.includes(currentUser._id);
                const isApproved =
                  currentUser && approvedIds.includes(currentUser._id);
                const contactVisible =
                  request.contactVisible ||
                  Boolean(
                    request.patientDetails?.phone?.number ||
                      request.patientDetails?.address?.line1
                  );
                const cardBorderClass =
                  urgency === 'critical'
                    ? 'border-l-4 border-red-500'
                    : urgency === 'urgent'
                      ? 'border-l-4 border-amber-500'
                      : 'border-l-4 border-emerald-500';

                return (
                  <article
                    key={request._id}
                    className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${cardBorderClass}`}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {request.patientDetails?.name || 'Unknown patient'}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500">
                          {request.patientDetails?.address?.hospitalName ||
                            'Hospital not provided'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${urgencyClass}`}
                        >
                          {urgency}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                    <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                      <p>
                        Blood Group:{' '}
                        {request.requirement?.bloodGroup || 'N/A'}
                      </p>
                      <p>
                        Quantity:{' '}
                        {request.requirement?.quantity || 0}{' '}
                        {request.requirement?.unit || ''}
                      </p>
                      <p>Location: {location || 'Not provided'}</p>
                      <p>Created: {formatDate(request.createdAt)}</p>
                    </div>

                    <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                      {contactVisible ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          <p>
                            Contact:{' '}
                            {request.patientDetails?.phone?.number
                              ? `${request.patientDetails?.phone?.country || ''} ${request.patientDetails?.phone?.number}`.trim()
                              : 'Not provided'}
                          </p>
                          <p>
                            Address:{' '}
                            {request.patientDetails?.address?.line1 ||
                              'Hidden'}
                          </p>
                        </div>
                      ) : (
                        <p>
                          Contact details will be visible after the requestor
                          approves your enrollment.
                        </p>
                      )}
                      {request.location?.lat && request.location?.lng && (
                        <a
                          href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-600"
                        >
                          Open on Google Maps
                        </a>
                      )}
                    </div>

                    {viewMode === 'donate' && !isOwner && (
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEnroll(request._id)}
                          className="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-600"
                          disabled={isEnrolled || isApproved || request.status === 'closed'}
                        >
                          {isApproved
                            ? 'Approved'
                            : isEnrolled
                              ? 'Enrolled'
                              : 'Enroll to Donate'}
                        </button>
                      </div>
                    )}

                    {viewMode === 'mine' && isOwner && (
                      <div className="mt-4 space-y-4">
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => startEditing(request)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300"
                          >
                            Edit Request
                          </button>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            Enrolled Donors
                          </p>
                          {request.enrolledUsers?.length ? (
                            <div className="mt-3 space-y-3">
                              {request.enrolledUsers.map((donor) => (
                                <div
                                  key={donor._id || donor}
                                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
                                >
                                  <div>
                                    <p className="text-sm font-bold text-slate-800">
                                      {donor?.name?.first || 'Donor'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {donor?.gmail || donor?._id || donor}
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleApprove(request._id, donor._id || donor)
                                      }
                                      className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleReject(request._id, donor._id || donor)
                                      }
                                      className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700"
                                    >
                                      Reject
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleMarkDonated(
                                          request._id,
                                          donor._id || donor
                                        )
                                      }
                                      className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-700"
                                    >
                                      Mark Donated
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-3 text-xs text-slate-500">
                              No donors enrolled yet.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {toastMessage && (
          <Toast message={toastMessage} type={toastType} onClose={clearToast} />
        )}
        {authRequired && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            <AlertTriangle size={18} className="mt-0.5" />
            Please login with OTP to view or create requests.
            <Link
              to={loginRedirect}
              className="rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
