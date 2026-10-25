import React from 'react';
import { Target } from 'lucide-react';

export default function StatistikView({ books }) {
  const total = books.length;
  const selesai = books.filter((b) => b.status === 'Selesai');
  const sedangDibaca = books.filter((b) => b.status === 'Sedang Dibaca');
  const wishlist = books.filter((b) => b.status === 'Wishlist');

  // Total pages
  const totalPagesRead = books.reduce((acc, b) => {
    if (b.status === 'Selesai') return acc + (Number(b.totalPages) || 0);
    return acc + (Number(b.currentPage) || 0);
  }, 0);

  // Average rating of rated books
  const ratedBooks = books.filter((b) => b.rating && Number(b.rating) > 0);
  const avgRating =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce((acc, b) => acc + Number(b.rating), 0) /
          ratedBooks.length
        ).toFixed(1)
      : '5.0';

  // Genre distribution
  const genreCounts = {};
  books.forEach((b) => {
    const g = b.genre || 'Lainnya';
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);

  // Annual reading goal (target 12 books per year)
  const annualTarget = 12;
  const annualProgressPct = Math.min(100, Math.round((selesai.length / annualTarget) * 100));

  // Longest book
  const longestBook = [...books].sort((a, b) => (b.totalPages || 0) - (a.totalPages || 0))[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-10">
      {/* Editorial Header */}
      <div className="border-b border-[#E5E3DC] dark:border-[#2D302A] pb-6">
        <span className="text-xs font-sans uppercase tracking-wider text-[#345444] dark:text-[#54826B] font-medium">
          Refleksi Membaca
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight mt-1">
          Statistik & Catatan Waktu
        </h1>
        <p className="font-serif italic text-sm sm:text-base text-[#777970] dark:text-[#9B9D93] mt-1">
          Bukan semata tentang angka kuantitatif, melainkan ritme dan kedalaman perjalanan literasimu.
        </p>
      </div>

      {/* Editorial Typographic Metric Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-[#E5E3DC] dark:border-[#2D302A]">
        <div className="pr-4 md:border-r border-[#E5E3DC] dark:border-[#2D302A]">
          <p className="text-[11px] font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93]">
            Halaman Selesai
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] tabular-nums font-normal">
              {totalPagesRead.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[11px] text-[#A1A399] dark:text-[#6E7067] mt-1 font-sans">
            dari seluruh buku aktif
          </p>
        </div>

        <div className="pr-4 md:border-r border-[#E5E3DC] dark:border-[#2D302A]">
          <p className="text-[11px] font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93]">
            Buku Tuntas
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#345444] dark:text-[#54826B] tabular-nums font-normal">
              {selesai.length}
            </span>
            <span className="text-xs text-[#777970] dark:text-[#9B9D93]">/ {total} buku</span>
          </div>
          <p className="text-[11px] text-[#A1A399] dark:text-[#6E7067] mt-1 font-sans">
            tingkat tuntas {total > 0 ? Math.round((selesai.length / total) * 100) : 0}% &bull; {sedangDibaca.length} sedang dibaca
          </p>
        </div>

        <div className="pr-4 md:border-r border-[#E5E3DC] dark:border-[#2D302A]">
          <p className="text-[11px] font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93]">
            Rata-rata Rating
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] tabular-nums font-normal">
              {avgRating}
            </span>
            <span className="text-xs text-[#777970] dark:text-[#9B9D93]">dari 5.0</span>
          </div>
          <p className="text-[11px] text-[#A1A399] dark:text-[#6E7067] mt-1 font-sans">
            dari {ratedBooks.length} buku dinilai
          </p>
        </div>

        <div>
          <p className="text-[11px] font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93]">
            Rencana Baca
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] tabular-nums font-normal">
              {wishlist.length}
            </span>
            <span className="text-xs text-[#777970] dark:text-[#9B9D93]">judul</span>
          </div>
          <p className="text-[11px] text-[#A1A399] dark:text-[#6E7067] mt-1 font-sans">
            dalam daftar keinginan
          </p>
        </div>
      </section>

      {/* Target Membaca Tahunan */}
      <section className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#345444] dark:text-[#54826B]" />
            <h2 className="font-serif text-lg text-[#252923] dark:text-[#EDECE8] font-normal">
              Target Membaca Tahun Ini
            </h2>
          </div>
          <span className="font-mono text-xs text-[#345444] dark:text-[#54826B] font-semibold">
            {selesai.length} dari {annualTarget} buku ({annualProgressPct}%)
          </span>
        </div>

        <div className="w-full h-2 bg-[#F2F0EA] dark:bg-[#252824] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#345444] dark:bg-[#54826B] rounded-full transition-all duration-300"
            style={{ width: `${annualProgressPct}%` }}
          />
        </div>

        <p className="text-xs text-[#777970] dark:text-[#9B9D93] font-serif italic pt-1">
          {annualProgressPct >= 100
            ? 'Selamat! Target membaca tahunan telah berhasil kamu capai dengan cemerlang.'
            : `Tersisa ${Math.max(0, annualTarget - selesai.length)} buku lagi untuk mencapai target ritme membacamu tahun ini.`}
        </p>
      </section>

      {/* Distribusi Genre */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl text-[#252923] dark:text-[#EDECE8] font-normal">
          Distribusi Kategori & Minat Baca
        </h2>

        <div className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-6 space-y-3.5">
          {sortedGenres.length > 0 ? (
            sortedGenres.map(([genre, count]) => {
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={genre} className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-[#252923] dark:text-[#EDECE8] font-medium">{genre}</span>
                    <span className="text-[#777970] dark:text-[#9B9D93] font-mono">
                      {count} buku ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F2F0EA] dark:bg-[#252824] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#345444] dark:bg-[#54826B] rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="font-serif italic text-xs text-[#777970] dark:text-[#9B9D93]">
              Belum ada data kategori buku dalam arsip.
            </p>
          )}
        </div>
      </section>

      {/* Catatan Buku Terpanjang */}
      {longestBook && (
        <section className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#F2F0EA]/40 dark:bg-[#1E201D]/40 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
              Buku Tertebal dalam Arsip
            </p>
            <h3 className="font-serif text-base text-[#252923] dark:text-[#EDECE8] font-medium mt-0.5">
              {longestBook.title}
            </h3>
            <p className="text-xs text-[#777970] dark:text-[#9B9D93] mt-0.5">
              karya {longestBook.author} &bull; {longestBook.totalPages} halaman
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#FFFFFF] dark:bg-[#252824] border border-[#E5E3DC] dark:border-[#2D302A] text-[#345444] dark:text-[#54826B] font-semibold">
            {longestBook.totalPages} hal
          </span>
        </section>
      )}
    </div>
  );
}
