import React, { useState, useEffect } from 'react';
import { X, Quote, AlertCircle } from 'lucide-react';

export default function AddQuoteModal({
  isOpen,
  onClose,
  books,
  defaultBookId = null,
  onSaveQuote
}) {
  const [selectedBookId, setSelectedBookId] = useState(defaultBookId || (books[0]?.id || ''));
  const [quoteText, setQuoteText] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [error, setError] = useState('');

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quoteText.trim()) {
      setError('Teks kutipan tidak boleh kosong.');
      return;
    }
    if (!selectedBookId) {
      setError('Pilih buku yang menjadi rujukan kutipan.');
      return;
    }

    const todayStr = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());

    onSaveQuote(selectedBookId, {
      id: `q-${Date.now()}`,
      text: quoteText.trim(),
      page: pageNumber ? Number(pageNumber) : null,
      date: todayStr
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-lg bg-[#F7F6F2] dark:bg-[#151614] border border-[#E5E3DC] dark:border-[#2D302A] p-6 shadow-xl cursor-default animate-fade-in"
      >
        <div className="flex items-center justify-between border-b border-[#E5E3DC] dark:border-[#2D302A] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-[#345444] dark:text-[#54826B]" />
            <h3 className="font-serif text-lg text-[#252923] dark:text-[#EDECE8] font-medium">
              Sematkan Kutipan Berharga
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilih Buku */}
          <div>
            <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
              Rujukan Judul Buku
            </label>
            {books.length > 0 ? (
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] cursor-pointer"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} &mdash; {b.author}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-800/40">
                Belum ada buku dalam arsip. Tambahkan buku terlebih dahulu sebelum menyematkan kutipan.
              </p>
            )}
          </div>

          {/* Teks Kutipan */}
          <div>
            <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
              Kalimat Kutipan <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={quoteText}
              onChange={(e) => {
                setQuoteText(e.target.value);
                if (error) setError('');
              }}
              placeholder="Tuliskan kalimat atau paragraf yang ingin kamu abadikan..."
              className="w-full p-3 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs font-serif italic text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] leading-relaxed"
            />
            {error && (
              <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
          </div>

          {/* Nomor Halaman */}
          <div>
            <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
              Nomor Halaman (Opsional)
            </label>
            <input
              type="number"
              min={1}
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              placeholder="Contoh: 142"
              className="w-32 px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs font-mono text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B]"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E3DC] dark:border-[#2D302A]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={books.length === 0}
              className="px-4 py-1.5 rounded-md bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium transition-colors cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Simpan Kutipan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
