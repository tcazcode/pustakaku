import React from 'react';
import {
  Plus,
  CheckCircle2,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function SedangDibacaView({
  books,
  onSelectBook,
  onQuickUpdatePage,
  onMarkAsFinished,
  onOpenAddBook
}) {
  const activeBooks = books.filter((b) => b.status === 'Sedang Dibaca');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#E5E3DC] dark:border-[#2D302A] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-sans uppercase tracking-wider text-[#345444] dark:text-[#54826B] font-medium">
            Fokus Bacaan Aktif
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight mt-1">
            Sedang Dibaca
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#777970] dark:text-[#9B9D93] mt-1">
            Catat progres harianmu dan selesaikan halaman demi halaman tanpa tergesa.
          </p>
        </div>

        <div className="text-xs font-sans text-[#777970] dark:text-[#9B9D93]">
          <strong className="text-[#252923] dark:text-[#EDECE8] font-serif text-2xl tabular-nums">
            {activeBooks.length}
          </strong>{' '}
          buku sedang aktif
        </div>
      </div>

      {activeBooks.length > 0 ? (
        <div className="space-y-6">
          {activeBooks.map((book) => {
            const current = Number(book.currentPage) || 0;
            const total = Number(book.totalPages) || 1;
            const pct = Math.min(100, Math.round((current / total) * 100));
            const remainingPages = Math.max(0, total - current);

            return (
              <div
                key={book.id}
                className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-5 sm:p-6 transition-all duration-150 hover:border-[#345444]/40 dark:hover:border-[#54826B]/50 flex flex-col sm:flex-row gap-5 items-start"
              >
                {/* Book Cover */}
                <div
                  onClick={() => onSelectBook(book)}
                  className="w-24 sm:w-28 aspect-[2/3] shrink-0 rounded overflow-hidden bg-[#F2F0EA] dark:bg-[#252824] border border-[#E5E3DC] dark:border-[#2D302A] book-cover-shadow cursor-pointer group"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Content & Progress Controls */}
                <div className="flex-1 w-full flex flex-col justify-between self-stretch">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
                          {book.genre} &bull; Terbit {book.publishYear || '—'}
                        </span>
                        <h2
                          onClick={() => onSelectBook(book)}
                          className="font-serif text-xl sm:text-2xl text-[#252923] dark:text-[#EDECE8] hover:text-[#345444] dark:hover:text-[#54826B] transition-colors cursor-pointer leading-snug mt-0.5"
                        >
                          {book.title}
                        </h2>
                        <p className="text-xs text-[#777970] dark:text-[#9B9D93] mt-0.5 font-sans">
                          oleh <span className="text-[#252923] dark:text-[#EDECE8] font-medium">{book.author}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectBook(book)}
                        className="text-xs text-[#345444] dark:text-[#54826B] hover:underline font-medium flex items-center gap-0.5 shrink-0 cursor-pointer"
                      >
                        <span>Buka Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {book.notes && (
                      <p className="font-serif italic text-xs text-[#777970] dark:text-[#9B9D93] mt-2 line-clamp-2 border-l border-[#E5E3DC] dark:border-[#2D302A] pl-2.5">
                        "{book.notes}"
                      </p>
                    )}
                  </div>

                  {/* Progress & Quick Adjustment Controls */}
                  <div className="mt-5 pt-4 border-t border-[#E5E3DC]/60 dark:border-[#2D302A]/60 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <span className="text-[#777970] dark:text-[#9B9D93]">
                          Progres saat ini:
                        </span>
                        <strong className="text-[#252923] dark:text-[#EDECE8] font-medium font-mono">
                          Hal. {current} dari {total}
                        </strong>
                        <span className="text-[11px] text-[#A1A399] dark:text-[#6E7067]">
                          (sisa {remainingPages} hal)
                        </span>
                      </div>

                      <span className="font-mono text-sm font-semibold text-[#345444] dark:text-[#54826B]">
                        {pct}% selesai
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#F2F0EA] dark:bg-[#252824] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#345444] dark:bg-[#54826B] rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* Quick Buttons: -5, +5, +10, Tandai Selesai */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-[#777970] dark:text-[#9B9D93] mr-1">
                          Pembaruan Cepat:
                        </span>
                        <button
                          type="button"
                          onClick={() => onQuickUpdatePage(book.id, Math.max(0, current - 5))}
                          disabled={current <= 0}
                          className="px-2 py-1 rounded bg-[#F2F0EA] dark:bg-[#252824] hover:bg-[#E5E3DC] dark:hover:bg-[#2D302A] text-[11px] font-mono text-[#252923] dark:text-[#EDECE8] border border-[#E5E3DC] dark:border-[#2D302A] transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickUpdatePage(book.id, Math.min(total, current + 5))}
                          disabled={current >= total}
                          className="px-2 py-1 rounded bg-[#F2F0EA] dark:bg-[#252824] hover:bg-[#E5E3DC] dark:hover:bg-[#2D302A] text-[11px] font-mono text-[#252923] dark:text-[#EDECE8] border border-[#E5E3DC] dark:border-[#2D302A] transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickUpdatePage(book.id, Math.min(total, current + 10))}
                          disabled={current >= total}
                          className="px-2.5 py-1 rounded bg-[#F2F0EA] dark:bg-[#252824] hover:bg-[#E5E3DC] dark:hover:bg-[#2D302A] text-[11px] font-mono text-[#252923] dark:text-[#EDECE8] border border-[#E5E3DC] dark:border-[#2D302A] transition-colors disabled:opacity-40 cursor-pointer font-medium"
                        >
                          +10 hal
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onMarkAsFinished(book.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-[#345444] dark:text-[#54826B] hover:bg-[#EDF3EF] dark:hover:bg-[#202D26] border border-[#345444]/40 dark:border-[#54826B]/50 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tandai Selesai</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-lg border border-dashed border-[#E5E3DC] dark:border-[#2D302A] text-center bg-[#F2F0EA]/30 dark:bg-[#1E201D]/30 space-y-3">
          <BookOpen className="w-8 h-8 text-[#777970] dark:text-[#9B9D93] mx-auto stroke-[1.5]" />
          <h3 className="font-serif text-lg text-[#252923] dark:text-[#EDECE8]">
            Tidak ada buku yang sedang dibaca saat ini.
          </h3>
          <p className="text-xs text-[#777970] dark:text-[#9B9D93] max-w-sm mx-auto">
            Buka koleksi bukumu dan ubah status salah satu judul menjadi "Sedang Dibaca" untuk mulai melacak progres membaca.
          </p>
          <button
            type="button"
            onClick={onOpenAddBook}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium transition-colors cursor-pointer mt-2"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            <span>Tambah Buku Baru</span>
          </button>
        </div>
      )}
    </div>
  );
}
