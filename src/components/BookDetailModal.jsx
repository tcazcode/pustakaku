import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Quote as QuoteIcon,
  Pencil,
  Trash2,
  Plus,
  Save,
  Check
} from 'lucide-react';

export default function BookDetailModal({
  book,
  onClose,
  onEditBook,
  onDeleteBook,
  onUpdateStatus,
  onUpdateProgress,
  onUpdateNotes,
  onOpenAddQuote,
  onDeleteQuote
}) {
  const [currentPageInput, setCurrentPageInput] = useState(book?.currentPage || 0);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState(book?.notes || '');
  const [isSavedNotes, setIsSavedNotes] = useState(false);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  if (!book) return null;

  const current = Number(book.currentPage) || 0;
  const total = Number(book.totalPages) || 1;
  const progressPct = Math.min(100, Math.round((current / total) * 100));

  const handleSavePage = (e) => {
    e.preventDefault();
    const val = Math.min(total, Math.max(0, Number(currentPageInput) || 0));
    onUpdateProgress(book.id, val);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(book.id, notesContent);
    setIsEditingNotes(false);
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg bg-[#F7F6F2] dark:bg-[#151614] border border-[#E5E3DC] dark:border-[#2D302A] shadow-xl overflow-hidden cursor-default my-auto animate-fade-in"
      >
        {/* Header Bar */}
        <div className="shrink-0 px-6 py-3.5 border-b border-[#E5E3DC] dark:border-[#2D302A] flex items-center justify-between bg-[#FFFFFF] dark:bg-[#1E201D]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
              Detail Buku &bull; {book.genre}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditBook(book);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Buku</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded flex items-center justify-center text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Sampul Besar */}
            <div className="w-full md:w-64 shrink-0 flex flex-col items-center md:items-start space-y-4">
              <div className="w-48 sm:w-56 md:w-full aspect-[2/3] rounded-md overflow-hidden bg-[#F2F0EA] dark:bg-[#252824] border border-[#E5E3DC] dark:border-[#2D302A] book-cover-shadow-lg">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Selector Pill */}
              <div className="w-full space-y-2">
                <label className="text-[11px] font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93] block">
                  Ubah Status Baca
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A]">
                  {['Sedang Dibaca', 'Selesai', 'Wishlist'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onUpdateStatus(book.id, st)}
                      className={`py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                        book.status === st
                          ? 'bg-[#345444] text-[#F7F6F2] dark:bg-[#54826B]'
                          : 'text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8]'
                      }`}
                    >
                      {st === 'Sedang Dibaca' ? 'Baca' : st === 'Selesai' ? 'Selesai' : 'Wishlist'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Metadata Facts */}
              <div className="w-full pt-3 border-t border-[#E5E3DC] dark:border-[#2D302A] space-y-2 text-xs font-sans text-[#777970] dark:text-[#9B9D93]">
                <div className="flex items-center justify-between">
                  <span>Tahun Terbit</span>
                  <strong className="text-[#252923] dark:text-[#EDECE8] font-medium font-mono">
                    {book.publishYear || '—'}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Penerbit</span>
                  <span className="text-[#252923] dark:text-[#EDECE8] font-medium truncate max-w-[130px]">
                    {book.publisher || 'Independen'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tebal Halaman</span>
                  <strong className="text-[#252923] dark:text-[#EDECE8] font-medium font-mono">
                    {book.totalPages || '—'} hal
                  </strong>
                </div>
              </div>
            </div>

            {/* Right Column: Judul, Penulis, Progres, Sinopsis, Catatan, Kutipan */}
            <div className="flex-1 space-y-6">
              {/* Header Title & Author */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#252923] dark:text-[#EDECE8] font-medium leading-snug tracking-tight">
                  {book.title}
                </h1>
                <p className="font-serif italic text-base text-[#777970] dark:text-[#9B9D93] mt-1">
                  oleh <span className="text-[#252923] dark:text-[#EDECE8] font-medium not-italic">{book.author}</span>
                </p>

                {/* Rating Stars */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#E5E3DC]/70 dark:border-[#2D302A]/70">
                  <div className="flex items-center gap-1 text-[#345444] dark:text-[#54826B]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (book.rating || 5)
                            ? 'fill-current text-[#345444] dark:text-[#54826B]'
                            : 'text-[#D1CEBF] dark:text-[#3D4039]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-[#777970] dark:text-[#9B9D93]">
                    {book.rating || 5} dari 5.0
                  </span>
                </div>
              </div>

              {/* Progres Membaca Interaktif */}
              <div className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-[#777970] dark:text-[#9B9D93]">
                    Progres Membaca:
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#345444] dark:text-[#54826B]">
                    Hal. {current} dari {total} ({progressPct}%)
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#F2F0EA] dark:bg-[#252824] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#345444] dark:bg-[#54826B] rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Quick Page Update Form */}
                <form onSubmit={handleSavePage} className="flex flex-wrap items-center gap-2 pt-1">
                  <label htmlFor="current-page-quick" className="text-xs text-[#777970] dark:text-[#9B9D93]">
                    Perbarui halaman:
                  </label>
                  <input
                    id="current-page-quick"
                    type="number"
                    min={0}
                    max={total}
                    value={currentPageInput}
                    onChange={(e) => setCurrentPageInput(e.target.value)}
                    className="w-20 px-2 py-1 rounded bg-[#F7F6F2] dark:bg-[#151614] border border-[#E5E3DC] dark:border-[#2D302A] text-xs font-mono text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium transition-colors cursor-pointer"
                  >
                    Simpan Progres
                  </button>

                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.max(0, current - 5);
                        setCurrentPageInput(next);
                        onUpdateProgress(book.id, next);
                      }}
                      className="px-2 py-1 rounded bg-[#F2F0EA] dark:bg-[#252824] text-[11px] font-mono border border-[#E5E3DC] dark:border-[#2D302A] cursor-pointer"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.min(total, current + 5);
                        setCurrentPageInput(next);
                        onUpdateProgress(book.id, next);
                      }}
                      className="px-2 py-1 rounded bg-[#F2F0EA] dark:bg-[#252824] text-[11px] font-mono border border-[#E5E3DC] dark:border-[#2D302A] cursor-pointer"
                    >
                      +5
                    </button>
                  </div>
                </form>
              </div>

              {/* Sinopsis Buku */}
              {book.synopsis && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
                    Sinopsis & Gambaran Karya
                  </h3>
                  <p className="font-serif text-sm text-[#252923] dark:text-[#EDECE8] leading-relaxed">
                    {book.synopsis}
                  </p>
                </div>
              )}

              {/* Kutipan dari Buku Ini */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-[#E5E3DC] dark:border-[#2D302A] pb-2">
                  <div className="flex items-center gap-1.5">
                    <QuoteIcon className="w-3.5 h-3.5 text-[#345444] dark:text-[#54826B]" />
                    <h3 className="text-xs font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
                      Kutipan dari Buku Ini ({book.quotes ? book.quotes.length : 0})
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenAddQuote(book.id)}
                    className="text-xs text-[#345444] dark:text-[#54826B] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Kutipan</span>
                  </button>
                </div>

                {Array.isArray(book.quotes) && book.quotes.length > 0 ? (
                  <div className="space-y-3">
                    {book.quotes.map((q) => (
                      <div
                        key={q.id}
                        className="rounded border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-3.5 relative group"
                      >
                        <blockquote className="border-l-2 border-[#345444] dark:border-[#54826B] pl-3 font-serif italic text-sm text-[#252923] dark:text-[#EDECE8] leading-relaxed">
                          "{q.text}"
                        </blockquote>
                        <div className="flex items-center justify-between text-[11px] text-[#777970] dark:text-[#9B9D93] mt-2 font-sans">
                          <span>{q.page ? `Halaman ${q.page}` : 'Tanpa nomor halaman'}</span>
                          {onDeleteQuote && (
                            <button
                              type="button"
                              onClick={() => onDeleteQuote(book.id, q.id)}
                              className="text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-serif italic text-xs text-[#777970] dark:text-[#9B9D93]">
                    Belum ada kutipan yang disematkan untuk buku ini.
                  </p>
                )}
              </div>

              {/* Catatan & Resensi Pribadi */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between border-b border-[#E5E3DC] dark:border-[#2D302A] pb-2">
                  <h3 className="text-xs font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
                    Catatan & Resensi Pribadi
                  </h3>
                  {!isEditingNotes && (
                    <button
                      type="button"
                      onClick={() => setIsEditingNotes(true)}
                      className="text-xs text-[#345444] dark:text-[#54826B] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>{book.notes ? 'Edit Catatan' : 'Tulis Catatan'}</span>
                    </button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={notesContent}
                      onChange={(e) => setNotesContent(e.target.value)}
                      placeholder="Tulis kesan, analisis, atau intisari penting dari buku ini..."
                      className="w-full p-3 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs font-serif text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] leading-relaxed"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingNotes(false)}
                        className="px-3 py-1 rounded text-xs text-[#777970] dark:text-[#9B9D93] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        className="px-3.5 py-1 rounded bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        {isSavedNotes ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                        <span>{isSavedNotes ? 'Tersimpan' : 'Simpan Catatan'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {book.notes ? (
                      <p className="font-serif italic text-sm text-[#252923] dark:text-[#EDECE8] leading-relaxed bg-[#FFFFFF] dark:bg-[#1E201D] p-3.5 rounded border border-[#E5E3DC] dark:border-[#2D302A]">
                        "{book.notes}"
                      </p>
                    ) : (
                      <p className="font-serif italic text-xs text-[#777970] dark:text-[#9B9D93]">
                        Belum ada catatan pribadi yang ditulis.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="shrink-0 px-6 py-3 border-t border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Hapus "${book.title}" dari koleksi perpustakaanmu?`)) {
                onDeleteBook(book.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Buku</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-[#E5E3DC] dark:border-[#2D302A] text-xs font-medium text-[#252923] dark:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
