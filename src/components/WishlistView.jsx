import React from 'react';
import { Plus, BookOpen } from 'lucide-react';

export default function WishlistView({
  books,
  onSelectBook,
  onStartReading,
  onOpenAddBook
}) {
  const wishlistBooks = books.filter((b) => b.status === 'Wishlist');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#E5E3DC] dark:border-[#2D302A] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-sans uppercase tracking-wider text-[#345444] dark:text-[#54826B] font-medium">
            Rencana & Daftar Keinginan
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight mt-1">
            Wishlist
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#777970] dark:text-[#9B9D93] mt-1">
            Kumpulan judul yang ingin kamu baca selanjutnya atau masukkan ke dalam rak fisik.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddBook}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium tracking-wide transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Tambah ke Wishlist</span>
        </button>
      </div>

      {wishlistBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlistBooks.map((book) => {
            return (
              <div
                key={book.id}
                className="group rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-4 hover:border-[#345444]/40 dark:hover:border-[#54826B]/50 transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => onSelectBook(book)}
                    className="flex gap-3 cursor-pointer"
                  >
                    <div className="w-16 h-24 shrink-0 rounded overflow-hidden bg-[#F2F0EA] dark:bg-[#252824] border border-[#E5E3DC] dark:border-[#2D302A] book-cover-shadow">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
                        {book.genre}
                      </span>
                      <h3
                        className="font-serif text-sm font-medium text-[#252923] dark:text-[#EDECE8] group-hover:text-[#345444] dark:group-hover:text-[#54826B] transition-colors line-clamp-2 leading-snug mt-0.5"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-[#777970] dark:text-[#9B9D93] truncate font-sans mt-0.5">
                        {book.author}
                      </p>
                      <p className="text-[11px] text-[#A1A399] dark:text-[#6E7067] font-sans mt-1">
                        {book.totalPages ? `${book.totalPages} hal` : 'Tebal belum tercatat'}
                      </p>
                    </div>
                  </div>

                  {book.notes && (
                    <p className="font-serif italic text-xs text-[#777970] dark:text-[#9B9D93] mt-3 line-clamp-2 border-l border-[#E5E3DC] dark:border-[#2D302A] pl-2.5">
                      "{book.notes}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E3DC]/60 dark:border-[#2D302A]/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectBook(book)}
                    className="text-[11px] text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] font-sans cursor-pointer"
                  >
                    Detail buku
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartReading(book.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#EDF3EF] dark:bg-[#202D26] hover:bg-[#345444] hover:text-[#F7F6F2] dark:hover:bg-[#54826B] text-[#345444] dark:text-[#54826B] text-xs font-medium transition-all duration-150 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Mulai Baca</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-lg border border-dashed border-[#E5E3DC] dark:border-[#2D302A] text-center bg-[#F2F0EA]/30 dark:bg-[#1E201D]/30 space-y-2">
          <p className="font-serif italic text-base text-[#252923] dark:text-[#EDECE8]">
            Wishlist bacaanmu saat ini kosong.
          </p>
          <p className="text-xs text-[#777970] dark:text-[#9B9D93]">
            Temukan judul menarik dan masukkan ke daftar impian ini agar tidak terlewat.
          </p>
        </div>
      )}
    </div>
  );
}
