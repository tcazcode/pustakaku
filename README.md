# pustaka. — Perpustakaan Digital Pribadi

Aplikasi perpustakaan digital pribadi dan pelacak kebiasaan membaca (*reading tracker*) dengan estetika editorial minimalis. Dibangun menggunakan React 19, Tailwind CSS v4, dan Vite.

---

## ✨ Fitur Utama

- **Beranda & Sapaan Personal**: Menampilkan metrik koleksi buku, sapaan dinamis sesuai waktu, dan status bacaan terkini.
- **Koleksi Arsip Lengkap**: Pencarian instan (judul, penulis, catatan), filter berdasarkan status & genre, serta sorting yang fleksibel.
- **Pelacak Progres Membaca**: Halaman khusus untuk buku yang sedang aktif dibaca dengan kalkulasi persentase dan sisa lembar.
- **Wishlist & Selesai Dibaca**: Mengatur buku yang ingin dibaca atau mengarsipkan buku yang sudah tuntas beserta rating dan ulasannya.
- **Jurnal Catatan & Kutipan**: Menyimpan kutipan berharga per halaman dan catatan refleksi dengan fitur salin kutipan terformat.
- **Statistik & Refleksi**: Analisis kebiasaan membaca, target tahunan (*Reading Challenge*), dan distribusi genre.
- **Manajemen Data Aman (Local-First)**: Penyimpanan otomatis di peramban (`localStorage`) dengan fitur ekspor/impor cadangan berkas JSON.
- **Kompresi Sampul Cerdas**: Unggah gambar sampul buku otomatis dikompres menggunakan HTML5 Canvas agar hemat penyimpanan.
- **Dark & Light Mode**: Desain bertema editorial dengan transisi warna halus tanpa kedipan (*no FOUC*).

---

## 🛠️ Teknologi

- **Frontend**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Bundler**: [Vite](https://vite.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Memulai (Local Development)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
- npm atau pnpm

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 4. Build untuk Produksi
```bash
npm run build
```
Hasil build siap hosting akan berada di dalam folder `dist/`.

---

## 📄 Lisensi
MIT License. Bebas digunakan dan dikembangkan untuk keperluan pribadi maupun edukasi.
