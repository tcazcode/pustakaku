import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import HeaderMobile from './components/HeaderMobile';
import BerandaView from './components/BerandaView';
import KoleksiView from './components/KoleksiView';
import SedangDibacaView from './components/SedangDibacaView';
import SelesaiView from './components/SelesaiView';
import WishlistView from './components/WishlistView';
import CatatanKutipanView from './components/CatatanKutipanView';
import StatistikView from './components/StatistikView';
import PengaturanView from './components/PengaturanView';
import BookDetailModal from './components/BookDetailModal';
import BookFormModal from './components/BookFormModal';
import AddQuoteModal from './components/AddQuoteModal';
import ToastNotification from './components/ToastNotification';
import { INITIAL_BOOKS } from './data/initialBooks';

const LOCAL_STORAGE_BOOKS_KEY = 'pustaka_editorial_books';
const LOCAL_STORAGE_USER_KEY = 'pustaka_editorial_user';
const LOCAL_STORAGE_THEME_KEY = 'pustaka_editorial_theme';

// Helper: Sanitize book object from LocalStorage
const sanitizeBook = (item, index) => {
  if (!item || typeof item !== 'object') return null;
  return {
    id: typeof item.id === 'string' && item.id.trim() ? item.id : `book-${Date.now()}-${index}`,
    title: typeof item.title === 'string' ? item.title.slice(0, 200).trim() : 'Tanpa Judul',
    author: typeof item.author === 'string' ? item.author.slice(0, 150).trim() : 'Anonim',
    publishYear: Number(item.publishYear) || 2024,
    publisher: typeof item.publisher === 'string' ? item.publisher : 'Independen',
    genre: typeof item.genre === 'string' ? item.genre : 'Sastra & Fiksi',
    status: typeof item.status === 'string' ? item.status : 'Sedang Dibaca',
    totalPages: Number(item.totalPages) || 300,
    currentPage: Number(item.currentPage) || 0,
    rating: Number(item.rating) || 5,
    coverUrl: typeof item.coverUrl === 'string' ? item.coverUrl : '',
    synopsis: typeof item.synopsis === 'string' ? item.synopsis : '',
    notes: typeof item.notes === 'string' ? item.notes : '',
    quotes: Array.isArray(item.quotes) ? item.quotes : [],
    dateStarted: typeof item.dateStarted === 'string' ? item.dateStarted : null,
    dateFinished: typeof item.dateFinished === 'string' ? item.dateFinished : null,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString()
  };
};

export default function App() {
  // Books collection state
  const [books, setBooks] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_BOOKS_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeBook).filter(Boolean);
        }
      }
    } catch (e) {
      console.error('Gagal memuat buku dari LocalStorage:', e);
    }
    return INITIAL_BOOKS;
  });

  // User name state
  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_USER_KEY) || 'Raka';
    } catch {
      return 'Raka';
    }
  });

  // Dark mode theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      if (stored !== null) return stored === 'true';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('beranda');

  // Modals state
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteBookId, setQuoteBookId] = useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Derived selectedBook
  const selectedBook = useMemo(() => {
    if (!selectedBookId) return null;
    return books.find((b) => b.id === selectedBookId) || null;
  }, [books, selectedBookId]);

  // Toast feedback
  const [toast, setToast] = useState(null);

  // Apply dark mode class to <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, String(isDarkMode));
    } catch (e) {
      console.error('Gagal menyimpan tema:', e);
    }
  }, [isDarkMode]);

  // Sync books to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKS_KEY, JSON.stringify(books));
    } catch (e) {
      console.error('Gagal menyimpan buku ke LocalStorage:', e);
    }
  }, [books]);

  // Sync user name to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, userName);
    } catch (e) {
      console.error('Gagal menyimpan nama pengguna:', e);
    }
  }, [userName]);

  // Auto-dismiss toast after 3.2s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Mobile drawer Escape listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileDrawerOpen]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Handlers for Books CRUD
  const handleOpenAddBook = () => {
    setBookToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setBookToEdit(book);
    setIsAddModalOpen(true);
  };

  const handleSaveBook = (bookData) => {
    if (bookToEdit) {
      setBooks((prev) =>
        prev.map((b) => (b.id === bookToEdit.id ? { ...b, ...bookData } : b))
      );
      showToast(`"${bookData.title}" berhasil diperbarui.`, 'success');
    } else {
      const newBook = {
        ...bookData,
        id: `book-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setBooks((prev) => [newBook, ...prev]);
      showToast(`"${newBook.title}" ditambahkan ke perpustakaanmu.`, 'success');
    }
    setBookToEdit(null);
  };

  const handleDeleteBook = (bookId) => {
    const target = books.find((b) => b.id === bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    if (selectedBookId === bookId) {
      setSelectedBookId(null);
    }
    showToast(`"${target?.title || 'Buku'}" telah dihapus dari koleksi.`, 'info');
  };

  const handleUpdateStatus = (bookId, nextStatus) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        let nextCurrent = b.currentPage;
        if (nextStatus === 'Selesai') nextCurrent = b.totalPages;
        if (nextStatus === 'Wishlist') nextCurrent = 0;
        if (nextStatus === 'Sedang Dibaca' && b.currentPage === 0) nextCurrent = 1;
        return {
          ...b,
          status: nextStatus,
          currentPage: nextCurrent,
          dateFinished: nextStatus === 'Selesai' ? new Date().toISOString().slice(0, 10) : b.dateFinished
        };
      })
    );
    showToast(`Status buku diubah ke "${nextStatus}".`, 'success');
  };

  const handleUpdateProgress = (bookId, newPage) => {
    let targetBookTitle = '';
    let isCompleted = false;
    let finalPage = 0;

    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        targetBookTitle = b.title;
        const total = Number(b.totalPages) || 1;
        const safePage = Math.min(total, Math.max(0, Number(newPage) || 0));
        finalPage = safePage;
        const isNowFinished = safePage >= total;
        isCompleted = isNowFinished;
        return {
          ...b,
          currentPage: safePage,
          status: isNowFinished ? 'Selesai' : b.status === 'Wishlist' ? 'Sedang Dibaca' : b.status,
          dateFinished: isNowFinished ? (b.dateFinished || new Date().toISOString().slice(0, 10)) : b.dateFinished
        };
      })
    );

    if (isCompleted) {
      showToast(`Selamat! "${targetBookTitle}" tuntas dibaca.`, 'success');
    } else {
      showToast(`Progres membaca diperbarui ke halaman ${finalPage}.`, 'success');
    }
  };

  const handleUpdateNotes = (bookId, newNotes) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, notes: newNotes } : b))
    );
    showToast('Catatan pribadi berhasil disimpan.', 'success');
  };

  const handleMarkAsFinished = (bookId) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          status: 'Selesai',
          currentPage: b.totalPages,
          dateFinished: new Date().toISOString().slice(0, 10)
        };
      })
    );
    showToast('Buku telah ditandai selesai dibaca. Selamat!', 'success');
  };

  const handleStartReading = (bookId) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          status: 'Sedang Dibaca',
          currentPage: b.currentPage > 0 ? b.currentPage : 1,
          dateStarted: new Date().toISOString().slice(0, 10)
        };
      })
    );
    showToast('Buku dipindahkan ke daftar "Sedang Dibaca".', 'success');
  };

  // Quotes handlers
  const handleOpenAddQuote = (bookId = null) => {
    setQuoteBookId(bookId);
    setIsQuoteModalOpen(true);
  };

  const handleSaveQuote = (targetBookId, quoteObj) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== targetBookId) return b;
        const existing = Array.isArray(b.quotes) ? b.quotes : [];
        return {
          ...b,
          quotes: [quoteObj, ...existing]
        };
      })
    );
    showToast('Kutipan berhasil disematkan.', 'success');
  };

  const handleDeleteQuote = (bookId, quoteId) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          quotes: (b.quotes || []).filter((q) => q.id !== quoteId)
        };
      })
    );
    showToast('Kutipan telah dihapus.', 'info');
  };

  // Data management
  const handleImportData = (importedBooks) => {
    if (Array.isArray(importedBooks)) {
      const validated = importedBooks.map(sanitizeBook).filter(Boolean);
      if (validated.length > 0) {
        setBooks(validated);
        setSelectedBookId(null);
        showToast(`Berhasil mengimpor ${validated.length} buku.`, 'success');
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan seluruh arsip ke data contoh kurasi awal?')) {
      setBooks(INITIAL_BOOKS);
      setSelectedBookId(null);
      showToast('Koleksi berhasil dipulihkan ke data kurasi awal.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#151614] text-[#252923] dark:text-[#EDECE8] flex transition-colors duration-200">
      {/* 1. Permanent Desktop Sidebar (240px / w-60) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          books={books}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          userName={userName}
          onOpenAddBook={handleOpenAddBook}
        />
      </div>

      {/* 2. Mobile Drawer Navigation */}
      {isMobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsMobileDrawerOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-64 h-full bg-[#F7F6F2] dark:bg-[#151614] shadow-2xl animate-fade-in"
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              books={books}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              userName={userName}
              onOpenAddBook={() => {
                setIsMobileDrawerOpen(false);
                handleOpenAddBook();
              }}
              onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 3. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Top Header Bar */}
        <HeaderMobile
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onOpenAddBook={handleOpenAddBook}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Tab View Content */}
        <main className="flex-1 pb-16">
          {activeTab === 'beranda' && (
            <BerandaView
              books={books}
              userName={userName}
              onOpenAddBook={handleOpenAddBook}
              onSelectBook={(b) => setSelectedBookId(b.id)}
              onOpenAddQuote={handleOpenAddQuote}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onQuickUpdatePage={handleUpdateProgress}
            />
          )}

          {activeTab === 'koleksi' && (
            <KoleksiView
              books={books}
              onSelectBook={(b) => setSelectedBookId(b.id)}
              onOpenAddBook={handleOpenAddBook}
            />
          )}

          {activeTab === 'sedang-dibaca' && (
            <SedangDibacaView
              books={books}
              onSelectBook={(b) => setSelectedBookId(b.id)}
              onQuickUpdatePage={handleUpdateProgress}
              onMarkAsFinished={handleMarkAsFinished}
              onOpenAddBook={handleOpenAddBook}
            />
          )}

          {activeTab === 'selesai' && (
            <SelesaiView
              books={books}
              onSelectBook={(b) => setSelectedBookId(b.id)}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'wishlist' && (
            <WishlistView
              books={books}
              onSelectBook={(b) => setSelectedBookId(b.id)}
              onStartReading={handleStartReading}
              onOpenAddBook={handleOpenAddBook}
            />
          )}

          {activeTab === 'catatan-kutipan' && (
            <CatatanKutipanView
              books={books}
              onOpenAddQuote={handleOpenAddQuote}
              onDeleteQuote={handleDeleteQuote}
              onSelectBook={(b) => setSelectedBookId(b.id)}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'statistik' && (
            <StatistikView books={books} />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanView
              userName={userName}
              setUserName={setUserName}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              books={books}
              onImportData={handleImportData}
              onResetData={handleResetData}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Subtle Editorial Footer */}
        <footer className="border-t border-[#E5E3DC] dark:border-[#2D302A] py-6 px-4 sm:px-8 text-xs text-[#777970] dark:text-[#9B9D93] bg-[#F7F6F2] dark:bg-[#151614] transition-colors">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-medium text-[#252923] dark:text-[#EDECE8]">
                pustaka<span className="text-[#345444] dark:text-[#54826B]">.</span>
              </span>
              <span className="text-[#A1A399] dark:text-[#6E7067]">&bull;</span>
              <span>Perpustakaan digital pribadi untuk pembaca mandiri</span>
            </div>

            <p className="text-[11px] text-[#A1A399] dark:text-[#6E7067]">
              Tersimpan aman di peramban lokal &bull; Tanpa iklan, murni untuk literasi
            </p>
          </div>
        </footer>
      </div>

      {/* 4. Detail Buku Modal */}
      {selectedBook && (
        <BookDetailModal
          key={selectedBook.id}
          book={selectedBook}
          onClose={() => setSelectedBookId(null)}
          onEditBook={handleOpenEditBook}
          onDeleteBook={handleDeleteBook}
          onUpdateStatus={handleUpdateStatus}
          onUpdateProgress={handleUpdateProgress}
          onUpdateNotes={handleUpdateNotes}
          onOpenAddQuote={handleOpenAddQuote}
          onDeleteQuote={handleDeleteQuote}
        />
      )}

      {/* 5. Form Tambah / Edit Buku Modal */}
      {isAddModalOpen && (
        <BookFormModal
          key={bookToEdit ? `edit-${bookToEdit.id}` : 'create-new'}
          isOpen={isAddModalOpen}
          bookToEdit={bookToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setBookToEdit(null);
          }}
          onSaveBook={handleSaveBook}
        />
      )}

      {/* 6. Tambah Kutipan Modal */}
      {isQuoteModalOpen && (
        <AddQuoteModal
          key={quoteBookId || 'add-quote'}
          isOpen={isQuoteModalOpen}
          books={books}
          defaultBookId={quoteBookId}
          onClose={() => {
            setIsQuoteModalOpen(false);
            setQuoteBookId(null);
          }}
          onSaveQuote={handleSaveQuote}
        />
      )}

      {/* 7. Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
