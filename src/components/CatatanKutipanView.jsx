import React, { useState, useMemo } from 'react';
import { Plus, Copy, Check, Trash2 } from 'lucide-react';

export default function CatatanKutipanView({
  books,
  onOpenAddQuote,
  onDeleteQuote,
  onSelectBook,
  onShowToast
}) {
  const [selectedBookId, setSelectedBookId] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Flatten all quotes
  const quotesList = useMemo(() => {
    const list = [];
    books.forEach((book) => {
      if (Array.isArray(book.quotes)) {
        book.quotes.forEach((q) => {
          list.push({
            ...q,
            bookId: book.id,
            bookTitle: book.title,
            author: book.author,
            coverUrl: book.coverUrl,
            genre: book.genre
          });
        });
      }
    });
    return list;
  }, [books]);

  // Filtered by selected book
  const filteredQuotes = useMemo(() => {
    if (selectedBookId === 'all') return quotesList;
    return quotesList.filter((q) => q.bookId === selectedBookId);
  }, [quotesList, selectedBookId]);

  // Copy quote text to clipboard
  const handleCopyQuote = (quote) => {
    const citation = `"${quote.text}" — ${quote.author}, ${quote.bookTitle}${quote.page ? ` (Hal. ${quote.page})` : ''}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedId(quote.id);
      if (onShowToast) onShowToast('Kutipan berhasil disalin ke papan klip.', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#E5E3DC] dark:border-[#2D302A] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-sans uppercase tracking-wider text-[#345444] dark:text-[#54826B] font-medium">
            Jurnal Literasi
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight mt-1">
            Catatan & Kutipan
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#777970] dark:text-[#9B9D93] mt-1">
            Kumpulan kalimat berharga dan perenungan yang disematkan dari lembar-lembar buku.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenAddQuote()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium tracking-wide transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Tambah Kutipan</span>
        </button>
      </div>

      {/* Filter by Book */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#777970] dark:text-[#9B9D93]">Filter Buku:</span>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] cursor-pointer"
          >
            <option value="all">Semua Buku ({quotesList.length} kutipan)</option>
            {books
              .filter((b) => Array.isArray(b.quotes) && b.quotes.length > 0)
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.quotes.length})
                </option>
              ))}
          </select>
        </div>

        <span className="text-xs text-[#777970] dark:text-[#9B9D93] font-mono">
          {filteredQuotes.length} kutipan tersimpan
        </span>
      </div>

      {/* Quotes Stream */}
      {filteredQuotes.length > 0 ? (
        <div className="space-y-6">
          {filteredQuotes.map((quote) => (
            <article
              key={quote.id}
              className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-5 sm:p-6 transition-all duration-150 hover:border-[#345444]/40 dark:hover:border-[#54826B]/50"
            >
              {/* Quote Content with Thin Green Border */}
              <div className="border-l-2 border-[#345444] dark:border-[#54826B] pl-4 sm:pl-5 py-1">
                <blockquote className="font-serif italic text-base sm:text-lg text-[#252923] dark:text-[#EDECE8] leading-relaxed">
                  "{quote.text}"
                </blockquote>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5E3DC]/40 dark:border-[#2D302A]/40 text-xs text-[#777970] dark:text-[#9B9D93]">
                  <p className="font-sans">
                    &mdash; <strong className="text-[#252923] dark:text-[#EDECE8] font-medium">{quote.author}</strong>,{' '}
                    <span
                      onClick={() => {
                        const targetBook = books.find((b) => b.id === quote.bookId);
                        if (targetBook) onSelectBook(targetBook);
                      }}
                      className="font-serif italic hover:underline cursor-pointer text-[#345444] dark:text-[#54826B]"
                    >
                      {quote.bookTitle}
                    </span>{' '}
                    {quote.page ? `(Hal. ${quote.page})` : ''}
                  </p>

                  <div className="flex items-center gap-3">
                    {quote.date && (
                      <span className="text-[11px] text-[#A1A399] dark:text-[#6E7067]">
                        {quote.date}
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopyQuote(quote)}
                        title="Salin kutipan & rujukan"
                        className="p-1 rounded text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#2D302A] transition-colors cursor-pointer"
                      >
                        {copiedId === quote.id ? (
                          <Check className="w-3.5 h-3.5 text-[#345444] dark:text-[#54826B]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {onDeleteQuote && (
                        <button
                          type="button"
                          onClick={() => onDeleteQuote(quote.bookId, quote.id)}
                          title="Hapus kutipan"
                          className="p-1 rounded text-[#777970] dark:text-[#9B9D93] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-lg border border-dashed border-[#E5E3DC] dark:border-[#2D302A] text-center bg-[#F2F0EA]/30 dark:bg-[#1E201D]/30 space-y-2">
          <p className="font-serif italic text-base text-[#252923] dark:text-[#EDECE8]">
            Belum ada kutipan yang dicatat.
          </p>
          <p className="text-xs text-[#777970] dark:text-[#9B9D93]">
            Temukan kalimat berkesan saat membaca dan simpan di sini agar tak lekang oleh waktu.
          </p>
          <button
            type="button"
            onClick={() => onOpenAddQuote()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium transition-colors cursor-pointer mt-2"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            <span>Tambah Kutipan Pertama</span>
          </button>
        </div>
      )}
    </div>
  );
}
