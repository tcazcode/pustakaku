import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  ArrowRight,
  Quote as QuoteIcon,
  ChevronRight,
  Star
} from 'lucide-react';
import { GENRE_OPTIONS } from '../data/initialBooks';

export default function BerandaView({
  books,
  userName = 'Raka',
  onOpenAddBook,
  onSelectBook,
  onOpenAddQuote,
  onNavigateToTab
}) {
  // Filters for "Rak Bukumu"
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedGenre, setSelectedGenre] = useState('Semua Genre');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Time-based Indonesian greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat pagi';
    if (hour >= 11 && hour < 15) return 'Selamat siang';
    if (hour >= 15 && hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  // Formatted date in Indonesian
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  // Metrics
  const totalBuku = books.length;
  const sedangDibaca = books.filter((b) => b.status === 'Sedang Dibaca');
  const selesaiDibaca = books.filter((b) => b.status === 'Selesai');
  const wishlistBuku = books.filter((b) => b.status === 'Wishlist');
  const totalHalamanSelesai = books.reduce((acc, b) => {
    if (b.status === 'Selesai') return acc + (Number(b.totalPages) || 0);
    return acc + (Number(b.currentPage) || 0);
  }, 0);

  // Latest quotes collected across books
  const allQuotes = useMemo(() => {
    const list = [];
    books.forEach((book) => {
      if (Array.isArray(book.quotes)) {
        book.quotes.forEach((q) => {
          list.push({
            ...q,
            bookId: book.id,
            bookTitle: book.title,
            author: book.author,
            coverUrl: book.coverUrl
          });
        });
      }
    });
    return list;
  }, [books]);

  const latestQuote = allQuotes.length > 0 ? allQuotes[0] : null;

  // Filtered books for "Rak Bukumu"
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        (book.title || '').toLowerCase().includes(q) ||
        (book.author || '').toLowerCase().includes(q);

      const matchStatus =
        selectedStatus === 'Semua Status' || book.status === selectedStatus;

      const matchGenre =
        selectedGenre === 'Semua Genre' || book.genre === selectedGenre;

      return matchQuery && matchStatus && matchGenre;
    });
  }, [books, searchQuery, selectedStatus, selectedGenre]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-12">
      {/* 1. Sapaan Personal & Header Editorial */}
      <section className="border-b border-[#E5E3DC] dark:border-[#2D302A] pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93] mb-1.5">
              {todayFormatted}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight">
              {getGreeting()}, <span className="font-medium text-[#345444] dark:text-[#54826B]">{userName}</span>.
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#777970] dark:text-[#9B9D93] mt-1.5">
              Ada cerita yang belum selesai kamu baca.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAddBook}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] dark:hover:bg-[#466e5b] text-[#F7F6F2] text-xs font-medium tracking-wide transition-all duration-150 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Tambah Buku</span>
            </button>
          </div>
        </div>

        {/* Ringkasan Tipografis Besar dengan Separator Garis Tipis (Bukan kartu warna-warni) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 pt-8 mt-4 border-t border-[#E5E3DC]/70 dark:border-[#2D302A]/70">
          {/* Total Buku */}
          <div className="pr-4 lg:border-r border-[#E5E3DC] dark:border-[#2D302A]">
            <p className="text-[11px] font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93]">
              Total Koleksi
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#252923] dark:text-[#EDECE8] tabular-nums">
                {totalBuku}
              </span>
              <span className="text-xs text-[#777970] dark:text-[#9B9D93]">judul</span>
            </div>
          </div>

          {/* Sedang Dibaca */}
          <div className="pr-4 lg:border-r border-[#E5E3DC] dark:border-[#2D302A]">
            <p className="text-[11px] font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93]">
              Sedang Dibaca
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#345444] dark:text-[#54826B] tabular-nums">
                {sedangDibaca.length}
              </span>
              <span className="text-xs text-[#777970] dark:text-[#9B9D93]">buku aktif</span>
            </div>
          </div>

          {/* Selesai Dibaca */}
          <div className="pr-4 lg:border-r border-[#E5E3DC] dark:border-[#2D302A]">
            <p className="text-[11px] font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93]">
              Selesai Dibaca
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#252923] dark:text-[#EDECE8] tabular-nums">
                {selesaiDibaca.length}
              </span>
              <span className="text-xs text-[#777970] dark:text-[#9B9D93]">buku tuntas</span>
            </div>
          </div>

          {/* Wishlist */}
          <div className="pr-4 lg:border-r border-[#E5E3DC] dark:border-[#2D302A]">
            <p className="text-[11px] font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93]">
              Wishlist
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#252923] dark:text-[#EDECE8] tabular-nums">
                {wishlistBuku.length}
              </span>
              <span className="text-xs text-[#777970] dark:text-[#9B9D93]">rencana</span>
            </div>
          </div>

          {/* Total Halaman */}
          <div>
            <p className="text-[11px] font-sans tracking-wider uppercase text-[#777970] dark:text-[#9B9D93]">
              Halaman Dibaca
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#252923] dark:text-[#EDECE8] tabular-nums">
                {totalHalamanSelesai.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-[#777970] dark:text-[#9B9D93]">lembar</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Lanjutkan Membaca (3-4 Buku Sedang Dibaca) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight">
              Lanjutkan Membaca
            </h2>
            <span className="text-xs font-mono text-[#777970] dark:text-[#9B9D93] px-2 py-0.5 rounded-full bg-[#F2F0EA] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A]">
              {sedangDibaca.length}
            </span>
          </div>

          {sedangDibaca.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigateToTab('sedang-dibaca')}
              className="text-xs text-[#345444] dark:text-[#54826B] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Lihat semua progres</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {sedangDibaca.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sedangDibaca.slice(0, 4).map((book) => {
              const current = Number(book.currentPage) || 0;
              const total = Number(book.totalPages) || 1;
              const progressPct = Math.min(100, Math.round((current / total) * 100));

              return (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="group rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-3.5 hover:border-[#345444]/40 dark:hover:border-[#54826B]/50 transition-all duration-150 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    {/* Cover */}
                    <div className="w-16 h-22 shrink-0 rounded overflow-hidden bg-[#F2F0EA] dark:bg-[#252824] book-cover-shadow border border-[#E5E3DC]/80 dark:border-[#2D302A]">
                      <img
                        src={book.coverUrl}
                        alt={`Sampul ${book.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-sans tracking-wide text-[#777970] dark:text-[#9B9D93] truncate block">
                        {book.genre || 'Sastra'}
                      </span>
                      <h3
                        className="font-serif text-sm font-medium text-[#252923] dark:text-[#EDECE8] group-hover:text-[#345444] dark:group-hover:text-[#54826B] transition-colors line-clamp-2 leading-snug mt-0.5"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-[#777970] dark:text-[#9B9D93] truncate mt-0.5 font-sans">
                        {book.author}
                      </p>
                    </div>
                  </div>

                  {/* Progres Bar Tipis Forest Green */}
                  <div className="mt-3 pt-3 border-t border-[#E5E3DC]/60 dark:border-[#2D302A]/60">
                    <div className="flex items-center justify-between text-[11px] text-[#777970] dark:text-[#9B9D93] mb-1.5 font-sans">
                      <span>Hal. {current} dari {total}</span>
                      <span className="font-mono text-[#345444] dark:text-[#54826B] font-semibold">
                        {progressPct}%
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#F2F0EA] dark:bg-[#252824] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#345444] dark:bg-[#54826B] rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-[#A1A399] dark:text-[#6E7067]">
                        Klik untuk detail & catatan
                      </span>
                      <span className="text-[11px] text-[#345444] dark:text-[#54826B] font-medium group-hover:underline flex items-center gap-0.5">
                        Lanjutkan <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-lg border border-dashed border-[#E5E3DC] dark:border-[#2D302A] text-center bg-[#F2F0EA]/40 dark:bg-[#1E201D]/40">
            <p className="font-serif italic text-sm text-[#777970] dark:text-[#9B9D93]">
              Belum ada buku yang sedang dibaca. Pilih salah satu buku dari koleksi untuk mulai membaca.
            </p>
          </div>
        )}
      </section>

      {/* 3. Catatan dari Halaman (Kutipan Terakhir dengan Garis Vertikal Hijau) */}
      {latestQuote && (
        <section className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-6 sm:p-7 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <QuoteIcon className="w-4 h-4 text-[#345444] dark:text-[#54826B]" />
                <span className="text-xs font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
                  Catatan dari Halaman
                </span>
              </div>

              {/* Kutipan dengan garis vertikal hijau tipis */}
              <div className="border-l-2 border-[#345444] dark:border-[#54826B] pl-4 py-1">
                <blockquote className="font-serif italic text-lg sm:text-xl text-[#252923] dark:text-[#EDECE8] leading-relaxed">
                  "{latestQuote.text}"
                </blockquote>
                <p className="text-xs font-sans text-[#777970] dark:text-[#9B9D93] mt-2">
                  &mdash; <strong className="text-[#252923] dark:text-[#EDECE8] font-medium">{latestQuote.author}</strong>,{' '}
                  <span className="font-serif italic">{latestQuote.bookTitle}</span>{' '}
                  {latestQuote.page ? `(Hal. ${latestQuote.page})` : ''}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenAddQuote(latestQuote.bookId)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-[#E5E3DC] dark:border-[#2D302A] text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 stroke-[2]" />
                <span>Tambah Kutipan</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab('catatan-kutipan')}
                className="text-xs text-[#345444] dark:text-[#54826B] hover:underline font-medium cursor-pointer"
              >
                Buka Semua Kutipan &rarr;
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. Rak Bukumu (Katalog Grid, Sampul Sebagai Fokus Visual) */}
      <section className="space-y-5 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E3DC] dark:border-[#2D302A] pb-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight">
              Rak Bukumu
            </h2>
            <p className="text-xs text-[#777970] dark:text-[#9B9D93] font-sans mt-0.5">
              Menampilkan {filteredBooks.length} dari {books.length} buku dalam koleksi pribadimu
            </p>
          </div>

          {/* Search & Grid/List Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777970] dark:text-[#9B9D93]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, penulis..."
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] placeholder-[#A1A399] dark:placeholder-[#6E7067] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] transition-colors"
              />
            </div>

            {/* Genre Select */}
            <div className="relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] cursor-pointer"
              >
                {GENRE_OPTIONS.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center rounded-md border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#F2F0EA] dark:bg-[#252824] text-[#345444] dark:text-[#54826B]'
                    : 'text-[#777970] dark:text-[#9B9D93] hover:text-[#252923]'
                }`}
                title="Tampilan Grid Sampul"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#F2F0EA] dark:bg-[#252824] text-[#345444] dark:text-[#54826B]'
                    : 'text-[#777970] dark:text-[#9B9D93] hover:text-[#252923]'
                }`}
                title="Tampilan Tabel/List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs (Semua, Sedang Dibaca, Selesai, Wishlist) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist">
          {['Semua Status', 'Sedang Dibaca', 'Selesai', 'Wishlist'].map((status) => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#345444] text-[#F7F6F2] dark:bg-[#54826B]'
                    : 'bg-[#F2F0EA] dark:bg-[#1E201D] text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] border border-[#E5E3DC] dark:border-[#2D302A]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Book Catalog Grid (Sampul sebagai fokus visual utama) */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6 pt-2">
            {filteredBooks.map((book) => {
              const current = Number(book.currentPage) || 0;
              const total = Number(book.totalPages) || 1;
              const pct = Math.min(100, Math.round((current / total) * 100));

              return (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Book Cover Container with Authentic Aspect Ratio & Shadow */}
                  <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-[#F2F0EA] dark:bg-[#252824] border border-[#E5E3DC] dark:border-[#2D302A] book-cover-shadow group-hover:book-cover-shadow-lg transition-all duration-200">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                      loading="lazy"
                    />

                    {/* Subtle status tag badge */}
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-[#F7F6F2]/90 dark:bg-[#151614]/90 text-[#252923] dark:text-[#EDECE8] border border-[#E5E3DC] dark:border-[#2D302A] backdrop-blur-sm">
                        {book.status}
                      </span>
                    </div>

                    {/* Subtle progress indicator on bottom of cover */}
                    {book.status === 'Sedang Dibaca' && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-black/30">
                        <div
                          className="h-full bg-[#345444] dark:bg-[#54826B]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Editorial Typography Details Below Cover */}
                  <div className="mt-2.5 space-y-0.5">
                    <h4
                      className="font-serif text-sm font-medium text-[#252923] dark:text-[#EDECE8] group-hover:text-[#345444] dark:group-hover:text-[#54826B] transition-colors line-clamp-2 leading-snug"
                      title={book.title}
                    >
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#777970] dark:text-[#9B9D93] truncate font-sans">
                      {book.author}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[#A1A399] dark:text-[#6E7067] pt-1 font-sans">
                      <span>{book.genre}</span>
                      <div className="flex items-center gap-0.5 text-[#345444] dark:text-[#54826B]">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="tabular-nums font-medium">{book.rating || 5}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List / Table View */
          <div className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-[#E5E3DC] dark:border-[#2D302A] bg-[#F2F0EA]/70 dark:bg-[#252824]/70 text-[#777970] dark:text-[#9B9D93]">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Buku & Penulis</th>
                  <th className="py-2.5 px-4 font-medium hidden sm:table-cell">Genre</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium hidden md:table-cell">Progres Halaman</th>
                  <th className="py-2.5 px-4 font-medium text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DC]/60 dark:divide-[#2D302A]/60 text-[#252923] dark:text-[#EDECE8]">
                {filteredBooks.map((book) => {
                  const current = Number(book.currentPage) || 0;
                  const total = Number(book.totalPages) || 1;
                  const pct = Math.min(100, Math.round((current / total) * 100));

                  return (
                    <tr
                      key={book.id}
                      onClick={() => onSelectBook(book)}
                      className="hover:bg-[#F2F0EA]/60 dark:hover:bg-[#252824]/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-8 h-12 object-cover rounded shrink-0 border border-[#E5E3DC] dark:border-[#2D302A]"
                        />
                        <div className="min-w-0">
                          <p className="font-serif text-sm font-medium text-[#252923] dark:text-[#EDECE8] truncate">
                            {book.title}
                          </p>
                          <p className="text-xs text-[#777970] dark:text-[#9B9D93] truncate">
                            {book.author} ({book.publishYear || '—'})
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#777970] dark:text-[#9B9D93] hidden sm:table-cell">
                        {book.genre}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#F2F0EA] dark:bg-[#252824] border border-[#E5E3DC] dark:border-[#2D302A] text-[#252923] dark:text-[#EDECE8]">
                          {book.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-[#777970] dark:text-[#9B9D93]">
                        {book.status === 'Selesai' ? (
                          <span>Tuntas ({total} hal)</span>
                        ) : book.status === 'Sedang Dibaca' ? (
                          <div className="w-36 space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span>{current} / {total} hal</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="w-full h-1 bg-[#F2F0EA] dark:bg-[#252824] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#345444] dark:bg-[#54826B]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span>Rencana dibaca</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1 text-[#345444] dark:text-[#54826B]">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-medium font-mono">{book.rating || 5}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredBooks.length === 0 && (
          <div className="p-10 rounded-lg border border-dashed border-[#E5E3DC] dark:border-[#2D302A] text-center bg-[#F2F0EA]/30 dark:bg-[#1E201D]/30 space-y-2">
            <p className="font-serif italic text-base text-[#252923] dark:text-[#EDECE8]">
              Tidak ada buku yang sesuai dengan pencarian.
            </p>
            <p className="text-xs text-[#777970] dark:text-[#9B9D93]">
              Coba gunakan kata kunci lain atau bersihkan filter genre/status.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('Semua Status');
                setSelectedGenre('Semua Genre');
              }}
              className="text-xs text-[#345444] dark:text-[#54826B] font-medium underline cursor-pointer mt-2"
            >
              Reset semua filter
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
