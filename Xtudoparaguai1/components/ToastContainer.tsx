
import React from 'react';
import { useToast, Toast, ToastType } from '../context/ToastContext';

const TOAST_STYLES: Record<ToastType, { bar: string; icon: string; defaultIcon: string }> = {
    success: {
        bar: 'bg-emerald-500',
        icon: 'text-emerald-600 bg-emerald-50',
        defaultIcon: '✓',
    },
    error: {
        bar: 'bg-red-500',
        icon: 'text-red-600 bg-red-50',
        defaultIcon: '✕',
    },
    warning: {
        bar: 'bg-amber-500',
        icon: 'text-amber-600 bg-amber-50',
        defaultIcon: '⚠',
    },
    info: {
        bar: 'bg-indigo-500',
        icon: 'text-indigo-600 bg-indigo-50',
        defaultIcon: 'ℹ',
    },
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
    const style = TOAST_STYLES[toast.type];

    return (
        <div
            className="relative flex items-center gap-4 bg-white rounded-2xl shadow-2xl border border-slate-100 px-5 py-4 min-w-[300px] max-w-sm overflow-hidden animate-toast-in"
            style={{ animation: 'toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
        >
            {/* Left color bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar} rounded-l-2xl`} />

            {/* Icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${style.icon}`}>
                {toast.icon ?? style.defaultIcon}
            </div>

            {/* Text */}
            <p className="text-sm font-semibold text-slate-800 flex-1 leading-snug pr-2">
                {toast.message}
            </p>

            {/* Close button */}
            <button
                onClick={onRemove}
                className="flex-shrink-0 text-slate-300 hover:text-slate-600 transition-colors text-lg leading-none"
                aria-label="Fechar notificação"
            >
                ×
            </button>

            {/* Progress bar */}
            <div
                className={`absolute bottom-0 left-0 h-[3px] ${style.bar} opacity-30 rounded-full`}
                style={{ animation: 'toastProgress 3.5s linear forwards' }}
            />
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <>
            <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(120%) scale(0.9); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
            <div
                className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3"
                aria-live="polite"
                aria-atomic="false"
            >
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onRemove={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </>
    );
};

export default ToastContainer;
