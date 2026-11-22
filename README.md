# WebKita - Platform Katalog & Penyimpanan Website Portofolio

Aplikasi Web Full-Stack modern untuk menyimpan, mengelola, dan memamerkan seluruh website yang sudah Anda buat, dengan desain antarmuka (UI) hijau emerald elegan sesuai referensi.

---

## 🌐 Pembagian Alamat Link (URL)

Sistem ini membedakan link antara pengunjung umum dan admin:

1. **Web untuk Umum (Pengunjung / Klien):**
   - **Beranda & Showcase:** [http://localhost:5000/](http://localhost:5000/)
     - Hero Section dengan badge, stats (+300%), social proof (+1.000 klien)
     - 4 Keunggulan (Cepat & Ringan, Aman & Terpercaya, Desain Modern, Support 24/7)
     - Portofolio Carousel 3D (Website Sekolah, Website Bisnis, Website UMKM)
     - Filter Kategori & Modal Demo Interaktif
     - Paket Harga (Starter, Profesional, Enterprise)
     - Testimoni Pelanggan & Rating Bintang
     - CTA Banner & Kontak Footer
   - **Katalog Lengkap:** [http://localhost:5000/katalog](http://localhost:5000/katalog)
     - Pencarian real-time nama web, teknologi, dan deskripsi
     - Filter kategori (Sekolah, Bisnis, UMKM, E-Commerce, SaaS, dll.)
     - Filter berdasarkan teknologi tech stack
     - Urutkan (Terbaru, Terpopuler, Abjad)

2. **Web untuk Admin (Khusus Pemilik):**
   - **Dashboard Admin:** [http://localhost:5000/admin](http://localhost:5000/admin)
   - **PIN Default:** `123456`
   - **Fitur Admin:**
     - ➕ Tambah Website Baru ke katalog
     - 📸 Upload gambar screenshot langsung ATAU masukkan URL gambar
     - ✏️ Edit info website (Judul, Kategori, Deskripsi, Link Demo, GitHub, Tech Stack, Klien)
     - 🗑️ Hapus website dari katalog
     - ⭐ Toggle status "Unggulan" untuk tampil di carousel utama
     - 📊 Statistik Total Website, Kategori, dan Total Dilihat

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi backend dan frontend sudah disatukan dan dapat dijalankan dengan perintah:

```bash
# 1. Menjalankan Server Utama (Port 5000)
node server/index.js
```
Lalu buka browser di:
- **Web Publik:** `http://localhost:5000`
- **Web Admin:** `http://localhost:5000/admin`

Untuk mode pengembangan frontend terpisah (Vite Hot-Reload):
```bash
npm run dev
```

---

## 📂 Struktur File

```
SAAS WEBKU/
├── data/
│   └── websites.json       # Database JSON lokal penyimpan katalog website
├── uploads/                # Folder penyimpanan screenshot yang diupload
├── server/
│   └── index.js            # Server Express (CRUD API, Upload Multer, SPA router)
├── src/
│   ├── components/         # Komponen UI (Navbar, Hero, Portofolio, Modal, dll.)
│   ├── pages/
│   │   ├── HomePage.jsx    # Halaman Utama Publik (/)
│   │   ├── KatalogPage.jsx # Halaman Katalog Lengkap (/katalog)
│   │   └── AdminPage.jsx   # Panel Dashboard Admin (/admin)
│   ├── App.jsx             # Router aplikasi
│   └── index.css           # Styling Tailwind CSS
├── tailwind.config.js
└── vite.config.js
```
