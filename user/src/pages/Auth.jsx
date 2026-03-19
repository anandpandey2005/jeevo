import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import Toast from '../components/Toast.jsx';

const ROLE_OPTIONS = [
  { value: 'donor', label: 'I want to donate' },
  { value: 'hero', label: 'I need blood' },
];

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get('next');
  const initialRole =
    searchParams.get('role') && searchParams.get('role') === 'hero'
      ? 'hero'
      : 'donor';
  const [step, setStep] = useState('email');
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const helperText = useMemo(() => {
    if (step === 'otp') {
      return 'Enter the 6-digit code sent to your email.';
    }
    return 'We will send a one-time password to verify you.';
  }, [step]);

  const resolveNextPath = (userData) => {
    if (!rawNext) return '/pending-requests';
    const decoded = decodeURIComponent(rawNext);
    if (decoded === 'dashboard') {
      const id = userData?._id || 'me';
      return `/dashboard/user/${id}?focus=create`;
    }
    return decoded;
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), role }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to send OTP.');
      }

      setStep('otp');
      setSuccess('OTP sent successfully.');
    } catch (sendError) {
      setError(sendError?.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim()) {
      setError('OTP is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'OTP verification failed.');
      }

      const userData = payload?.data?.user || null;
      if (userData) {
        localStorage.setItem('jeevo_user', JSON.stringify(userData));
      }

      setSuccess('Verified successfully. Redirecting...');
      navigate(resolveNextPath(userData));
    } catch (verifyError) {
      setError(verifyError?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const toastMessage = success || error;
  const toastType = success ? 'success' : 'error';
  const clearToast = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-soft)] px-4 pt-24">
      <div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="mb-6 text-center">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
            <ShieldCheck size={14} />
            Secure OTP Login
          </p>
          <h1 className="text-2xl font-black text-slate-900">
            Welcome back to Jeevo
          </h1>
          <p className="mt-2 text-sm text-slate-500">{helperText}</p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                I am here to
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {ROLE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      role === option.value
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email Address
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-red-500">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                One-Time Password
              </label>
              <input
                type="text"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="Enter 6-digit code"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-red-500"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

      </div>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={clearToast} />
      )}
    </div>
  );
}
