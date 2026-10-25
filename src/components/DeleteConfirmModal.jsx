import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, book, onConfirm, onCancel }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !book) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      onClick={onCancel}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-[#F7F6F2] dark:bg-[#151614] border border-[#E5E3DC] dark:border-[#2D302A] p-6 shadow-xl cursor-default animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <h3 id="delete-dialog-title" className="font-serif text-lg font-medium text-[#252923] dark:text-[#EDECE8]">
              Hapus dari Koleksi?
            </h3>
            <p className="text-xs text-[#777970] dark:text-[#9B9D93] mt-1.5 leading-relaxed font-sans">
              Apakah kamu yakin ingin menghapus <strong className="text-[#252923] dark:text-[#EDECE8] font-medium">"{book.title}"</strong> karya {book.author}? Seluruh catatan dan kutipan terkait buku ini juga akan dihapus.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Ya, Hapus Buku</span>
          </button>
        </div>
      </div>
    </div>
  );
}
