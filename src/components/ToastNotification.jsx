import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] text-[#252923] dark:text-[#EDECE8] shadow-lg max-w-sm text-xs font-sans">
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-[#345444] dark:text-[#54826B] shrink-0" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-[#777970] dark:text-[#9B9D93] shrink-0" />
        )}

        <span className="font-medium flex-1">{toast.message}</span>

        <button
          type="button"
          onClick={onClose}
          className="text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] p-0.5 rounded cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
