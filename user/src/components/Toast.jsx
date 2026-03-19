import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-slate-200 bg-white text-slate-700',
};

export default function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;
  const Icon = ICONS[type] || ICONS.info;
  const styleClass = STYLES[type] || STYLES.info;

  return (
    <div className="fixed top-6 right-6 z-[60] w-full max-w-sm px-4">
      <div
        className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl ${styleClass}`}
      >
        <Icon size={18} className="mt-0.5" />
        <div className="flex-1">{message}</div>
      </div>
    </div>
  );
}
