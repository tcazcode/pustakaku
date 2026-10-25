import React from 'react';
import {
  Home,
  Clock,
  CheckCircle2,
  Bookmark,
  Quote,
  BarChart2,
  Settings,
  Sun,
  Moon,
  Plus,
  BookMarked
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  books,
  isDarkMode,
  setIsDarkMode,
  userName,
  onOpenAddBook,
  onCloseMobileDrawer
}) {
  const sedangDibacaCount = books.filter((b) => b.status === 'Sedang Dibaca').length;
  const selesaiCount = books.filter((b) => b.status === 'Selesai').length;
  const wishlistCount = books.filter((b) => b.status === 'Wishlist').length;
  const totalQuotesCount = books.reduce((acc, b) => acc + (b.quotes ? b.quotes.length : 0), 0);

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'koleksi', label: 'Koleksi Buku', icon: BookMarked, badge: books.length },
    { id: 'sedang-dibaca', label: 'Sedang Dibaca', icon: Clock, badge: sedangDibacaCount },
    { id: 'selesai', label: 'Selesai Dibaca', icon: CheckCircle2, badge: selesaiCount },
    { id: 'wishlist', label: 'Wishlist', icon: Bookmark, badge: wishlistCount },
    { id: 'catatan-kutipan', label: 'Catatan & Kutipan', icon: Quote, badge: totalQuotesCount },
    { id: 'statistik', label: 'Statistik', icon: BarChart2 },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onCloseMobileDrawer) onCloseMobileDrawer();
  };

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col justify-between border-r border-[#E5E3DC] dark:border-[#2D302A] bg-[#F7F6F2] dark:bg-[#151614] select-none transition-colors duration-200">
      {/* Top Header & Brand */}
      <div>
        <div className="px-6 pt-7 pb-6 flex items-center justify-between border-b border-[#E5E3DC]/60 dark:border-[#2D302A]/60">
          <div
            onClick={() => handleNavClick('beranda')}
            className="cursor-pointer group flex items-baseline gap-1"
          >
            <span className="font-serif text-2xl font-medium tracking-tight text-[#252923] dark:text-[#EDECE8] group-hover:text-[#345444] dark:group-hover:text-[#54826B] transition-colors">
              pustaka<span className="text-[#345444] dark:text-[#54826B]">.</span>
            </span>
          </div>
          <span className="text-[10px] font-sans tracking-widest uppercase text-[#777970] dark:text-[#9B9D93] px-1.5 py-0.5 rounded border border-[#E5E3DC] dark:border-[#2D302A]">
            v2.0
          </span>
        </div>

        {/* Quick Add Button */}
        <div className="px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={onOpenAddBook}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] dark:hover:bg-[#466e5b] text-[#F7F6F2] text-xs font-medium tracking-wide shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Tambah Buku</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-3 space-y-0.5" aria-label="Navigasi Utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer group text-left ${
                  isActive
                    ? 'text-[#345444] dark:text-[#54826B] bg-[#EDF3EF] dark:bg-[#202D26] font-semibold border-l-2 border-[#345444] dark:border-[#54826B]'
                    : 'text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#F2F0EA] dark:hover:bg-[#1E201D]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 stroke-[1.6] transition-colors ${
                      isActive
                        ? 'text-[#345444] dark:text-[#54826B]'
                        : 'text-[#777970] dark:text-[#9B9D93] group-hover:text-[#252923] dark:group-hover:text-[#EDECE8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'text-[#345444] dark:text-[#54826B] bg-[#E2ECE5] dark:bg-[#293B32] font-semibold'
                        : 'text-[#A1A399] dark:text-[#6E7067] group-hover:text-[#777970]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Theme Switcher */}
      <div className="p-3 border-t border-[#E5E3DC]/70 dark:border-[#2D302A]/70 space-y-2">
        {/* Reader Profile Pill */}
        <div className="px-3 py-2 rounded-lg bg-[#F2F0EA]/70 dark:bg-[#1E201D] border border-[#E5E3DC] dark:border-[#2D302A] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-[#345444] dark:bg-[#54826B] text-[#F7F6F2] font-serif text-xs font-semibold flex items-center justify-center shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : 'R'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-[#252923] dark:text-[#EDECE8] truncate leading-tight">
                {userName || 'Raka Pratama'}
              </p>
              <p className="text-[10px] text-[#777970] dark:text-[#9B9D93] truncate leading-tight">
                Pembaca Aktif
              </p>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] hover:bg-[#E5E3DC]/60 dark:hover:bg-[#2D302A] transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 stroke-[1.8]" /> : <Moon className="w-3.5 h-3.5 stroke-[1.8]" />}
          </button>
        </div>

        <p className="text-[10px] text-[#A1A399] dark:text-[#6E7067] text-center font-sans tracking-wide">
          Estetika editorial &bull; Arsip pribadi
        </p>
      </div>
    </aside>
  );
}
