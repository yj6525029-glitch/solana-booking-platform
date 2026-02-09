'use client';

import { useEffect, useState, useCallback } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: Check,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const colors = {
  success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
  error: 'border-rose-500/50 bg-rose-500/10 text-rose-400',
  info: 'border-gold/50 bg-gold/10 text-gold',
  warning: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
};

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const Icon = icons[type];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-4 ${colors[type]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
      <div
        className="absolute bottom-0 left-0 h-1 rounded-b-xl transition-all"
        style={{
          width: `${progress}%`,
          backgroundColor: 'currentColor',
          opacity: 0.3,
        }}
      />
    </div>
  );
}

// Toast hook for easy usage
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
    Toast: toast ? (
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
    ) : null,
  };
}
