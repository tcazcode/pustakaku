import React, { useState, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Star
} from 'lucide-react';
import { GENRE_OPTIONS, STATUS_OPTIONS } from '../data/initialBooks';

export default function KoleksiView({ books, onSelectBook, onOpenAddBook }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedGenre, setSelectedGenre] = useState('Semua Genre');
  const [sortBy, setSortBy] = useState('newest'); // newest, rating, title, author, progress
  const [viewMode, setViewMode] = useState('grid');

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const q = searchQuery.toLowerCase().trim();
        const matchQuery =
          !q ||
          (book.title || '').toLowerCase().includes(q) ||
          (book.author || '').toLowerCase().includes(q) ||
          (book.notes || '').toLowerCase().includes(q);

        const matchStatus =
          selectedStatus === 'Semua Status' || book.status === selectedStatus;

        const matchGenre =
          selectedGenre === 'Semua Genre' || book.genre === selectedGenre;

        return matchQuery && matchStatus && matchGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'author') {
          return (a.author || '').localeCompare(b.author || '');
        }
        if (sortBy === 'progress') {
          const pctA = ((a.currentPage || 0) / (a.totalPages || 1));
          const pctB = ((b.currentPage || 0) / (b.totalPages || 1));
          return pctB - pctA;
        }
        return 0;
      });
  }, [books, searchQuery, selectedStatus, selectedGenre, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E3DC] dark:border-[#2D302A] pb-6">
        <div>
          <span className="text-xs font-sans uppercase tracking-wider text-[#777970] dark:text-[#9B9D93]">
            Arsip Lengkap
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight mt-1">
            Koleksi Buku
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#777970] dark:text-[#9B9D93] mt-1">
            Total {books.length} buku terdaftar dalam perpustakaan pribadimu.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddBook}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium tracking-wide transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Tambah Buku Baru</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777970] dark:text-[#9B9D93]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, penulis, catatan..."
              className="w-full pl-8 pr-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] placeholder-[#A1A399] dark:placeholder-[#6E7067] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B]"
            />
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] cursor-pointer"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] cursor-pointer"
            >
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] cursor-pointer"
            >
              <option value="newest">Terbaru Ditambahkan</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="title">Judul (A &mdash; Z)</option>
              <option value="author">Penulis (A &mdash; Z)</option>
              <option value="progress">Progres Terbanyak</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex rounded-md border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#F2F0EA] dark:bg-[#252824] text-[#345444] dark:text-[#54826B]'
                    : 'text-[#777970] dark:text-[#9B9D93]'
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#F2F0EA] dark:bg-[#252824] text-[#345444] dark:text-[#54826B]'
                    : 'text-[#777970] dark:text-[#9B9D93]'
                }`}
                title="Tampilan Daftar"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#777970] dark:text-[#9B9D93] pt-1">
          <span>
            Menampilkan <strong className="text-[#252923] dark:text-[#EDECE8] font-medium">{filteredBooks.length}</strong> buku
          </span>
          {(searchQuery || selectedStatus !== 'Semua Status' || selectedGenre !== 'Semua Genre') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('Semua Status');
                setSelectedGenre('Semua Genre');
              }}
              className="text-[#345444] dark:text-[#54826B] hover:underline font-medium cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
                <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-[#F2F0EA] dark:bg-[#252824] border border-[#E5E3DC] dark:border-[#2D302A] book-cover-shadow group-hover:book-cover-shadow-lg transition-all duration-200">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-[#F7F6F2]/90 dark:bg-[#151614]/90 text-[#252923] dark:text-[#EDECE8] border border-[#E5E3DC] dark:border-[#2D302A] backdrop-blur-sm">
                      {book.status}
                    </span>
                  </div>
                  {book.status === 'Sedang Dibaca' && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-black/30">
                      <div
                        className="h-full bg-[#345444] dark:bg-[#54826B]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-2.5 space-y-0.5">
                  <h3
                    className="font-serif text-sm font-medium text-[#252923] dark:text-[#EDECE8] group-hover:text-[#345444] dark:group-hover:text-[#54826B] transition-colors line-clamp-2 leading-snug"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
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
        /* List View */
        <div className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] overflow-hidden">
          <table className="w-full text-left text-xs font-sans">
            <thead className="border-b border-[#E5E3DC] dark:border-[#2D302A] bg-[#F2F0EA]/70 dark:bg-[#252824]/70 text-[#777970] dark:text-[#9B9D93]">
              <tr>
                <th className="py-2.5 px-4 font-medium">Judul & Penulis</th>
                <th className="py-2.5 px-4 font-medium hidden sm:table-cell">Tahun & Penerbit</th>
                <th className="py-2.5 px-4 font-medium hidden md:table-cell">Genre</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium hidden lg:table-cell">Progres Halaman</th>
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
                        className="w-9 h-13 object-cover rounded shrink-0 border border-[#E5E3DC] dark:border-[#2D302A]"
                      />
                      <div className="min-w-0">
                        <p className="font-serif text-sm font-medium text-[#252923] dark:text-[#EDECE8] truncate">
                          {book.title}
                        </p>
                        <p className="text-xs text-[#777970] dark:text-[#9B9D93] truncate">
                          {book.author}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#777970] dark:text-[#9B9D93] hidden sm:table-cell">
                      {book.publishYear || '—'} &bull; {book.publisher || 'Independen'}
                    </td>
                    <td className="py-3 px-4 text-[#777970] dark:text-[#9B9D93] hidden md:table-cell">
                      {book.genre}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#F2F0EA] dark:bg-[#252824] border border-[#E5E3DC] dark:border-[#2D302A] text-[#252923] dark:text-[#EDECE8]">
                        {book.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-[#777970] dark:text-[#9B9D93]">
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
                        <span>Rencana baca</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 text-[#345444] dark:text-[#54826B]">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-mono font-medium">{book.rating || 5}</span>
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
            Tidak ada buku yang sesuai dengan kriteria filter.
          </p>
          <p className="text-xs text-[#777970] dark:text-[#9B9D93]">
            Coba gunakan kata kunci pencarian lain atau setel ulang filter status dan kategori.
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
    </div>
  );
}
