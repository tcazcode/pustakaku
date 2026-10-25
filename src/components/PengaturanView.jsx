import React, { useState } from 'react';
import {
  User,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Check
} from 'lucide-react';

export default function PengaturanView({
  userName,
  setUserName,
  isDarkMode,
  setIsDarkMode,
  books,
  onImportData,
  onResetData,
  onShowToast
}) {
  const [nameInput, setNameInput] = useState(userName || 'Raka');
  const [isSavedName, setIsSavedName] = useState(false);

  const handleSaveName = (e) => {
    e.preventDefault();
    const clean = nameInput.trim();
    if (clean) {
      setUserName(clean);
      setIsSavedName(true);
      if (onShowToast) onShowToast(`Nama sapaan diubah menjadi "${clean}"`, 'success');
      setTimeout(() => setIsSavedName(false), 2000);
    }
  };

  // Export JSON file
  const handleExportData = () => {
    const dataStr = JSON.stringify(books, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pustaka_cadangan_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast('Berkas cadangan JSON berhasil diunduh.', 'success');
  };

  // Import JSON file
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onImportData(parsed);
          if (onShowToast) onShowToast('Data koleksi berhasil diimpor.', 'success');
        } else {
          alert('Format berkas JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#E5E3DC] dark:border-[#2D302A] pb-6">
        <span className="text-xs font-sans uppercase tracking-wider text-[#345444] dark:text-[#54826B] font-medium">
          Preferensi & Konfigurasi
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#252923] dark:text-[#EDECE8] font-normal tracking-tight mt-1">
          Pengaturan
        </h1>
        <p className="font-serif italic text-sm sm:text-base text-[#777970] dark:text-[#9B9D93] mt-1">
          Sesuaikan identitas, tampilan antarmuka, dan kelola cadangan data arsipmu.
        </p>
      </div>

      {/* Profil Pembaca */}
      <section className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E5E3DC]/60 dark:border-[#2D302A]/60 pb-3">
          <User className="w-4 h-4 text-[#345444] dark:text-[#54826B]" />
          <h2 className="font-serif text-lg text-[#252923] dark:text-[#EDECE8] font-medium">
            Profil Pembaca
          </h2>
        </div>

        <form onSubmit={handleSaveName} className="space-y-3">
          <div>
            <label htmlFor="user-name-input" className="block text-xs font-medium text-[#777970] dark:text-[#9B9D93] mb-1">
              Nama Sapaan di Beranda
            </label>
            <div className="flex gap-2">
              <input
                id="user-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={30}
                placeholder="Misal: Raka"
                className="max-w-xs w-full px-3 py-1.5 rounded-md bg-[#F7F6F2] dark:bg-[#151614] border border-[#E5E3DC] dark:border-[#2D302A] text-xs text-[#252923] dark:text-[#EDECE8] focus:outline-none focus:border-[#345444] dark:focus:border-[#54826B]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-md bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                {isSavedName ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSavedName ? 'Tersimpan' : 'Simpan Nama'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#A1A399] dark:text-[#6E7067] mt-1">
              Nama ini digunakan pada ucapan sapaan di beranda (misal: "Selamat malam, Raka.").
            </p>
          </div>
        </form>
      </section>

      {/* Tema Visual */}
      <section className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-6 space-y-4">
        <h2 className="font-serif text-lg text-[#252923] dark:text-[#EDECE8] font-medium border-b border-[#E5E3DC]/60 dark:border-[#2D302A]/60 pb-3">
          Tema Tampilan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsDarkMode(false)}
            className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
              !isDarkMode
                ? 'border-[#345444] dark:border-[#54826B] bg-[#EDF3EF] dark:bg-[#202D26] ring-1 ring-[#345444]/20 dark:ring-[#54826B]/20'
                : 'border-[#E5E3DC] dark:border-[#2D302A] hover:bg-[#F2F0EA] dark:hover:bg-[#252824]'
            }`}
          >
            <Sun className={`w-5 h-5 shrink-0 mt-0.5 ${!isDarkMode ? 'text-[#345444] dark:text-[#54826B]' : 'text-[#777970] dark:text-[#9B9D93]'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-semibold text-[#252923] dark:text-[#EDECE8]">
                  Mode Terang (Warm Off-White)
                </p>
                {!isDarkMode && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#345444] text-[#F7F6F2] dark:bg-[#54826B] font-medium tracking-wide shrink-0">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#777970] dark:text-[#9B9D93] mt-1 leading-relaxed">
                Nuansa kertas buku klasik, hangat dan nyaman untuk membaca di siang hari (#F7F6F2).
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsDarkMode(true)}
            className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
              isDarkMode
                ? 'border-[#345444] dark:border-[#54826B] bg-[#EDF3EF] dark:bg-[#202D26] ring-1 ring-[#345444]/20 dark:ring-[#54826B]/20'
                : 'border-[#E5E3DC] dark:border-[#2D302A] hover:bg-[#F2F0EA] dark:hover:bg-[#252824]'
            }`}
          >
            <Moon className={`w-5 h-5 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#345444] dark:text-[#54826B]' : 'text-[#777970] dark:text-[#9B9D93]'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-semibold text-[#252923] dark:text-[#EDECE8]">
                  Mode Gelap (Warm Obsidian)
                </p>
                {isDarkMode && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#345444] text-[#F7F6F2] dark:bg-[#54826B] font-medium tracking-wide shrink-0">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#777970] dark:text-[#9B9D93] mt-1 leading-relaxed">
                Gelap teduh dengan kontras lembut, terinspirasi oleh Readwise Reader di malam hari (#151614).
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Cadangan & Pemulihan Data */}
      <section className="rounded-lg border border-[#E5E3DC] dark:border-[#2D302A] bg-[#FFFFFF] dark:bg-[#1E201D] p-6 space-y-4">
        <h2 className="font-serif text-lg text-[#252923] dark:text-[#EDECE8] font-medium border-b border-[#E5E3DC]/60 dark:border-[#2D302A]/60 pb-3">
          Cadangan & Pemulihan Data
        </h2>

        <p className="text-xs text-[#777970] dark:text-[#9B9D93] leading-relaxed">
          Seluruh koleksi buku, progres membaca, catatan, dan kutipanmu disimpan secara lokal di perambanmu (LocalStorage). Tidak ada data yang dikirim ke server pihak ketiga.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Ekspor JSON */}
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-[#E5E3DC] dark:border-[#2D302A] bg-[#F2F0EA] dark:bg-[#252824] hover:bg-[#E5E3DC] dark:hover:bg-[#2D302A] text-xs font-medium text-[#252923] dark:text-[#EDECE8] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Cadangan (JSON)</span>
          </button>

          {/* Impor JSON */}
          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-[#E5E3DC] dark:border-[#2D302A] bg-[#F2F0EA] dark:bg-[#252824] hover:bg-[#E5E3DC] dark:hover:bg-[#2D302A] text-xs font-medium text-[#252923] dark:text-[#EDECE8] transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Impor Data (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={onResetData}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#252824] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pulihkan Koleksi Contoh Awal</span>
          </button>
        </div>
      </section>
    </div>
  );
}
