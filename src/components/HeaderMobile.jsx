import React from 'react';
import { Menu, Plus, Sun, Moon } from 'lucide-react';

export default function HeaderMobile({
  onOpenMobileDrawer,
  onOpenAddBook,
  isDarkMode,
  setIsDarkMode
}) {
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#F7F6F2]/95 dark:bg-[#151614]/95 backdrop-blur-sm border-b border-[#E5E3DC] dark:border-[#2D302A]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          className="p-1.5 -ml-1 text-[#252923] dark:text-[#EDECE8] hover:bg-[#E5E3DC]/60 dark:hover:bg-[#2D302A] rounded-md transition-colors cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5 stroke-[1.8]" />
        </button>

        <span className="font-serif text-xl font-medium tracking-tight text-[#252923] dark:text-[#EDECE8]">
          pustaka<span className="text-[#345444] dark:text-[#54826B]">.</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 text-[#777970] dark:text-[#9B9D93] hover:text-[#252923] dark:hover:text-[#EDECE8] rounded-md transition-colors cursor-pointer"
          title="Ubah tema"
        >
          {isDarkMode ? <Sun className="w-4 h-4 stroke-[1.8]" /> : <Moon className="w-4 h-4 stroke-[1.8]" />}
        </button>

        <button
          type="button"
          onClick={onOpenAddBook}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#345444] hover:bg-[#294336] dark:bg-[#54826B] text-[#F7F6F2] text-xs font-medium transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Tambah</span>
        </button>
      </div>
    </header>
  );
}
