import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Star,
  Upload,
  Sparkles,
  Loader2,
  BookOpen,
  Pencil,
  AlertCircle
} from 'lucide-react';
import { GENRE_OPTIONS, STATUS_OPTIONS, SAMPLE_CURATED_COVERS } from '../data/initialBooks';

// Helper: Compress and resize image to lightweight base64
const compressImageFile = (file, maxWidth = 600, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Gagal memproses berkas gambar.'));
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas.'));
  });
};

export default function BookFormModal({
  isOpen,
  onClose,
  onSaveBook,
  bookToEdit = null
}) {
  const [title, setTitle] = useState(bookToEdit?.title || '');
  const [author, setAuthor] = useState(bookToEdit?.author || '');
  const [publishYear, setPublishYear] = useState(bookToEdit?.publishYear || new Date().getFullYear());
  const [publisher, setPublisher] = useState(bookToEdit?.publisher || '');
  const [genre, setGenre] = useState(bookToEdit?.genre || 'Sastra & Fiksi');
  const [status, setStatus] = useState(bookToEdit?.status || 'Sedang Dibaca');
  const [totalPages, setTotalPages] = useState(bookToEdit?.totalPages || 320);
  const [currentPage, setCurrentPage] = useState(bookToEdit?.currentPage || 0);
  const [rating, setRating] = useState(bookToEdit?.rating || 5);
  const [coverUrl, setCoverUrl] = useState(bookToEdit?.coverUrl || '');
  const [synopsis, setSynopsis] = useState(bookToEdit?.synopsis || '');
  const [notes, setNotes] = useState(bookToEdit?.notes || '');

  const [imageMode, setImageMode] = useState(
    bookToEdit?.coverUrl && !bookToEdit.coverUrl.startsWith('data:image/') ? 'url' : 'upload'
  );
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    const parsedTotal = Math.max(1, Number(totalPages) || 300);
    if (newStatus === 'Selesai') {
      setCurrentPage(parsedTotal);
    } else if (newStatus === 'Wishlist') {
      setCurrentPage(0);
    } else if (newStatus === 'Sedang Dibaca' && (currentPage === 0 || currentPage === parsedTotal)) {
      setCurrentPage(1);
    }
  };

  // Close on Escape key
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

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Berkas harus berupa gambar (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran gambar terlalu besar (maksimal 10MB).');
      return;
    }

    try {
      setIsCompressing(true);
      setUploadError('');
      const compressed = await compressImageFile(file);
      setCoverUrl(compressed);
      if (errors.cover) setErrors((prev) => ({ ...prev, cover: null }));
    } catch (err) {
      setUploadError(err.message || 'Gagal memproses gambar.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const cleanTitle = title.trim();
    const cleanAuthor = author.trim();

    if (!cleanTitle) {
      newErrors.title = 'Judul buku wajib diisi.';
    }
    if (!cleanAuthor) {
      newErrors.author = 'Nama penulis wajib diisi.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const defaultCover =
      SAMPLE_CURATED_COVERS[0].url;

    const parsedTotal = Math.max(1, Number(totalPages) || 300);
    const parsedCurrent = status === 'Selesai'
      ? parsedTotal
      : status === 'Wishlist'
      ? 0
      : Math.min(parsedTotal, Math.max(0, Number(currentPage) || 0));

    onSaveBook({
      title: cleanTitle,
      author: cleanAuthor,
      publishYear: Number(publishYear) || new Date().getFullYear(),
      publisher: publisher.trim() || 'Independen',
      genre,
      status,
      totalPages: parsedTotal,
      currentPage: parsedCurrent,
      rating: Number(rating) || 5,
      coverUrl: coverUrl.trim() || defaultCover,
      synopsis: synopsis.trim(),
      notes: notes.trim(),
      quotes: bookToEdit?.quotes || []
    });

    onClose();
  };

  const availableGenres = GENRE_OPTIONS.filter((g) => g !== 'Semua Genre');
  const availableStatuses = STATUS_OPTIONS.filter((s) => s !== 'Semua Status');

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-lg bg-[#F7F6F2] dark:bg-[#151614] border border-[#E5E3DC] dark:border-[#2D302A] shadow-xl overflow-hidden cursor-default my-auto animate-fade-in"
      >
        {/* Header Bar */}
        <div className="shrink-0 px-6 py-4 border-b border-[#E5E3DC] dark:border-[#2D302A] flex items-center justify-between bg-[#FFFFFF] dark:bg-[#1E201D]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#EDF3EF] dark:bg-[#202D26] text-[#345444] dark:text-[#54826B] flex items-center justify-center">
              {bookToEdit ? <Pencil className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-[#252923] dark:text-[#EDECE8] leading-tight">
                {bookToEdit ? 'Edit Informasi Buku' : 'Tambah Buku Baru ke Koleksi'}
              </h2>
              <p className="text-[11px] text-[#777970] dark:text-[#9B9D93] font-sans">
                {bookToEdit ? 'Perbarui rincian buku dalam arsip pribadimu' : 'Lengkapi metadata buku untuk melacak perjalanan membacanya'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(92vh-130px)]">
            {/* Judul & Penulis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                  Judul Buku <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: null });
                  }}
                  placeholder="Contoh: Laut Bercerita"
                  className={`w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border ${
                    errors.title
                      ? 'border-rose-500'
                      : 'border-[#E5E3DC] dark:border-[#2D302A] focus:border-[#345444] dark:focus:border-[#54826B]'
                  } text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none`}
                />
                {errors.title && (
                  <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                  Nama Penulis <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    if (errors.author) setErrors({ ...errors, author: null });
                  }}
                  placeholder="Contoh: Leila S. Chudori"
                  className={`w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border ${
                    errors.author
                      ? 'border-rose-500'
                      : 'border-[#E5E3DC] dark:border-[#2D302A] focus:border-[#345444] dark:focus:border-[#54826B]'
                  } text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none`}
                />
                {errors.author && (
                  <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.author}
                  </p>
                )}
              </div>
            </div>

            {/* Genre, Status, Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                  Kategori / Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] cursor-pointer"
                >
                  {availableGenres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                  Status Membaca
                </label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] cursor-pointer"
                >
                  {availableStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                  Rating Penilaian
                </label>
                <div className="flex items-center gap-1 py-1.5 px-2.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-0.5 cursor-pointer text-[#345444] dark:text-[#54826B]"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          s <= rating ? 'fill-current' : 'text-[#D1CEBF] dark:text-[#3D4039]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono ml-auto font-medium text-[#777970] dark:text-[#9B9D93]">
                    {rating}.0
                  </span>
                </div>
              </div>
            </div>

            {/* Total Halaman, Halaman Saat Ini, Tahun, Penerbit */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                  Total Halaman
                </label>
                <input
                  type="number"
                  min={1}
                  value={totalPages}
                  onChange={(e) => setTotalPages(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs font-mono text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                  Halaman Sekarang
                </label>
                <input
                  type="number"
                  min={0}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  disabled={status !== 'Sedang Dibaca'}
                  className="w-full px-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs font-mono text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                  Tahun Terbit
                </label>
                <input
                  type="number"
                  value={publishYear}
                  onChange={(e) => setPublishYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs font-mono text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                  Penerbit
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Misal: Gramedia"
                  className="w-full px-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B]"
                />
              </div>
            </div>

            {/* Sampul Buku (Upload / URL / Presets) */}
            <div className="space-y-2 pt-1 border-t border-[#E5E3DC]/60 dark:border-[#2D302A]/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#777970] dark:text-[#9B9D93]">
                  Gambar Sampul Buku
                </label>
                <div className="flex rounded-md border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-0.5">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                      imageMode === 'upload'
                        ? 'bg-[#345444] text-[#F7F6F2] dark:bg-[#54826B]'
                        : 'text-[#777970] dark:text-[#9B9D93]'
                    }`}
                  >
                    Unggah Berkas
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                      imageMode === 'url'
                        ? 'bg-[#345444] text-[#F7F6F2] dark:bg-[#54826B]'
                        : 'text-[#777970] dark:text-[#9B9D93]'
                    }`}
                  >
                    Tautan URL
                  </button>
                </div>
              </div>

              {imageMode === 'upload' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const f = e.dataTransfer?.files?.[0];
                      if (f) processFile(f);
                    }}
                    className={`border border-dashed ${
                      isDragging
                        ? 'border-[#345444] bg-[#EDF3EF] dark:border-[#54826B] dark:bg-[#202D26]'
                        : 'border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] hover:border-[#345444]'
                    } rounded-md p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5`}
                  >
                    {isCompressing ? (
                      <Loader2 className="w-5 h-5 animate-spin text-[#345444] dark:text-[#54826B]" />
                    ) : (
                      <Upload className="w-5 h-5 text-[#777970] dark:text-[#9B9D93]" />
                    )}
                    <p className="text-xs text-[#252923] dark:text-[#EDECE8]">
                      {isCompressing ? 'Memproses berkas gambar...' : 'Klik atau seret gambar sampul ke sini'}
                    </p>
                    <p className="text-[10px] text-[#A1A399] dark:text-[#6E7067]">
                      Mendukung PNG, JPG, WebP (otomatis dioptimalkan)
                    </p>
                  </div>
                  {uploadError && (
                    <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {uploadError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B]"
                  />
                </div>
              )}

              {/* Curated Sample Covers */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-[#777970] dark:text-[#9B9D93] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#345444] dark:text-[#54826B]" />
                  Pilihan sampul kurasi:
                </span>
                {SAMPLE_CURATED_COVERS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setCoverUrl(sample.url)}
                    className="text-[10px] px-2 py-0.5 rounded border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] transition-colors cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              {coverUrl && (
                <div className="flex items-center gap-3 p-2 rounded border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D]">
                  <img
                    src={coverUrl}
                    alt="Pratinjau sampul"
                    className="w-8 h-12 object-cover rounded border border-[#E5E3DC] dark:border-[#2D302A]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#252923] dark:text-[#EDECE8]">
                      Pratinjau Sampul Aktif
                    </p>
                    <p className="text-[10px] text-[#777970] dark:text-[#9B9D93] truncate">
                      {coverUrl.startsWith('data:image/') ? 'Berkas unggahan lokal' : coverUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCoverUrl('')}
                    className="text-[11px] text-rose-500 hover:underline px-2 cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>

            {/* Sinopsis */}
            <div>
              <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                Sinopsis Singkat
              </label>
              <textarea
                rows={2}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Rangkuman atau latar belakang cerita dari buku ini..."
                className="w-full p-2.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] leading-relaxed resize-none"
              />
            </div>

            {/* Catatan Pribadi Awal */}
            <div>
              <label className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
                Catatan / Alasan Membaca
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mengapa buku ini ingin/sedang kamu baca..."
                className="w-full p-2.5 rounded-md bg-[#FFFFFF] dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B] leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="shrink-0 px-6 py-3.5 border-t border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium transition-colors cursor-pointer shadow-sm"
            >
              {bookToEdit ? 'Simpan Perubahan' : 'Masukkan ke Rak'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
