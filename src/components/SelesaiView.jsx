import React from 'react';
import { CheckCircle2, Star, Quote } from 'lucide-react';

export default function SelesaiView({ books, onSelectBook }) {
  const finishedBooks = books.filter((b) => b.status === 'Selesai');
  const totalPagesFinished = finishedBooks.reduce((acc, b) => acc + (Number(b.totalPages) || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#E5E3DC] dark:border-[#2D302A] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-sans uppercase tracking-wider text-[#345444] dark:text-[#54826B] font-medium">
            Arsip Bacaan Tuntas
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight mt-1">
            Selesai Dibaca
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#777970] dark:text-[#9B9D93] mt-1">
            Jejak buku yang telah selesai kamu telaah, dinikmati, dan diabadikan dalam ingatan.
          </p>
        </div>

        <div className="text-xs font-sans text-[#777970] dark:text-[#9B9D93] space-y-0.5 sm:text-right">
          <p>
            <strong className="text-[#252923] dark:text-[#EDECE8] font-serif text-2xl tabular-nums">
              {finishedBooks.length}
            </strong>{' '}
            buku selesai
          </p>
          <p className="text-[11px]">
            Total {totalPagesFinished.toLocaleString('id-ID')} halaman tuntas
          </p>
        </div>
      </div>

      {finishedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {finishedBooks.map((book) => {
            const quotesCount = Array.isArray(book.quotes) ? book.quotes.length : 0;

            return (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="group rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-4 sm:p-5 hover:border-[#345444]/40 dark:hover:border-[#54826B]/50 transition-all duration-150 cursor-pointer flex gap-4"
              >
                {/* Book Cover */}
                <div className="w-20 sm:w-24 aspect-[2/3] shrink-0 rounded overflow-hidden bg-[#F2F0EA] dark:bg-[#252824] border border-[#E5E3DC] dark:border-[#2D302A] book-cover-shadow">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
                        {book.genre}
                      </span>
                      <div className="flex items-center gap-0.5 text-[#345444] dark:text-[#54826B]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= (book.rating || 5) ? 'fill-current' : 'text-[#D1CEBF] dark:text-[#3D4039]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h3
                      className="font-serif text-base font-medium text-[#252923] dark:text-[#EDECE8] group-hover:text-[#345444] dark:group-hover:text-[#54826B] transition-colors line-clamp-2 leading-snug mt-1"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#777970] dark:text-[#9B9D93] truncate mt-0.5 font-sans">
                      {book.author}
                    </p>

                    {book.notes && (
                      <p className="font-serif italic text-xs text-[#777970] dark:text-[#9B9D93] mt-2 line-clamp-2">
                        "{book.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#E5E3DC]/60 dark:border-[#2D302A]/60 flex items-center justify-between text-[11px] text-[#A1A399] dark:text-[#6E7067] font-sans">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#345444] dark:text-[#54826B]" />
                      <span>{book.totalPages || 0} halaman tuntas</span>
                    </span>

                    {quotesCount > 0 && (
                      <span className="flex items-center gap-1 text-[#345444] dark:text-[#54826B] font-medium">
                        <Quote className="w-3 h-3" />
                        <span>{quotesCount} kutipan</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-lg border border-dashed border-[#E5E3DC] dark:border-[#2D302A] text-center bg-[#F2F0EA]/30 dark:bg-[#1E201D]/30 space-y-2">
          <p className="font-serif italic text-base text-[#252923] dark:text-[#EDECE8]">
            Belum ada buku yang ditandai selesai.
          </p>
          <p className="text-xs text-[#777970] dark:text-[#9B9D93]">
            Selesaikan buku yang sedang kamu baca untuk melihatnya tercatat di sini.
          </p>
        </div>
      )}
    </div>
  );
}
