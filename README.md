# 🎒 Ruang Kelas SD — Learning Management System (LMS) Ceria & Ramah Anak

<p align="center">
  <img src="public/favicon.svg" width="96" height="96" alt="Ruang Kelas SD Logo" />
</p>

<p align="center">
  <strong>Aplikasi Pembelajaran Digital Terpadu yang Ringan, Bersih, dan Mudah Digunakan Khusus Guru & Siswa Sekolah Dasar (SD).</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 11" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Lisensi-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

---

## 📌 Latar Belakang & Masalah (Problem Statement)

Banyak platform **LMS (Learning Management System)** populer saat ini (seperti Moodle, Canvas, atau portal perguruan tinggi) dirancang dengan alur kerja yang terlalu birokratis, hierarki menu bertumpuk, dan sarat teks teknis. Ketika diterapkan di tingkat **Sekolah Dasar (SD)**, sistem tersebut justru membuat guru SD dan anak-anak murid merasa kewalahan serta bingung.

**Ruang Kelas SD** hadir sebagai solusi berbasis *human-centered design* untuk pendidikan dasar:
* 🧸 **Antarmuka Ramah Anak & Guru**: Mengusung konsep *AdminLTE Light Modern* dipadukan estetika *EdTech* ceria dengan tipografi **Plus Jakarta Sans**.
* ⚡ **Tanpa Distraksi Rumit**: Alur menu fokus pada 4 kebutuhan pokok pembelajaran: **Daftar Kelas**, **Pelajaran & Materi**, **Tugas PR**, serta **Periksa Nilai**.
* 🎯 **Pengalaman Multi-Peran Alami**: Tampilan untuk guru berfokus pada manajemen kelas dan evaluasi, sementara tampilan siswa dirancang bersih hanya untuk membaca modul dan mengumpulkan PR tanpa distraksi pengaturan sistem.

---

## ✨ Fitur Utama (Core Highlights)

### 1. 🔐 Halaman Login Interaktif (Role-Based Demo)
* Desain elegan *split-screen* bertema pendidikan nasional dengan badge keamanan & Dapodik.
* Tab peran terpisah antara **Guru Kelas SD** dan **Siswa / Murid**.
* **1-Click Demo Login**:
  * Masuk cepat sebagai **Ibu Siti Rahmawati, S.Pd.** (Wali Kelas 4-B).
  * Masuk cepat sebagai **Muhammad Fathan** (Siswa Kelas 4-B).

### 2. 🏫 Manajemen Multi-Kelas Guru (CRUD Kelas)
* **Kelola Seluruh Kelas Binaan**: Guru dapat mengajar lebih dari 1 kelas (misal: Kelas 4-A Al-Kindi, Kelas 4-B Al-Farabi, Kelas 5-A).
* **Operasi CRUD Lengkap**: Tambah kelas baru, ubah nama/tingkat kelas, lihat jumlah murid terdaftar, dan hapus kelas yang sudah selesai semester.
* **Quick Class Switcher**: Ganti ruang kelas aktif dengan 1 klik melalui header bar atas.

### 3. 📖 Pelajaran & Materi Belajar (Video & Dokumen PDF)
* **Unggah Berkas Langsung (File Upload)**:
  * 🎬 **Upload Video Pelajaran**: Mendukung berkas `.mp4`, `.mov`, `.mkv`, dan `.webm` hingga 200MB dengan pemutar video terintegrasi.
  * 📑 **Upload Buku Modul PDF**: Mendukung modul pembelajaran tematik `.pdf` dengan ukuran berkas tercatat dan tombol unduh/baca.
* **Modal CRUD Materi**: Guru dapat menambah, menyunting, dan menghapus materi pelajaran dengan live file preview & replace buttons.
* **Forum Diskusi Ceria**: Kolom tanya jawab interaktif antara murid dan guru pada setiap sesi materi.

### 4. 📝 Tugas & PR Murid (Homework Submission)
* **Instruksi Tugas Visual**: Mendukung tugas pengumpulan foto buku tulis, video bercerita, atau ringkasan dokumen.
* **Mode Kumpul PR Siswa**: Formulir pengumpulan tugas yang simpel dengan drag & drop upload berkas dan catatan anak untuk guru.
* **Status Penyelesaian**: Indikator jelas (*Tersedia*, *Ada PR Mendesak*, *Sudah Dikumpulkan*, *Sudah Dinilai*).

### 5. 🌟 Periksa & Beri Nilai (Gradebook & Catatan Guru)
* **Koreksi Terpadu**: Guru dapat melihat lampiran tugas murid secara langsung.
* **Input Nilai & Apresiasi**: Nilai angka (0–100) dilengkapi dengan catatan motivasi/pemberian bintang prestasi.
* **Buku Nilai Siswa**: Siswa dapat langsung melihat nilai PR mereka beserta pesan penyemangat dari Bu Guru.

---

## 🛠️ Arsitektur & Teknologi

| Lapisan | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Backend** | [Laravel 11](https://laravel.com) | Framework PHP modern dengan performa tinggi & routing bersih. |
| **Frontend UI** | [React 19](https://react.dev) | Komponen UI reaktif, declarative, dan modular. |
| **Bundler** | [Vite 6](https://vitejs.dev) | Hot Module Replacement (HMR) kilat & build optimal. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Engine CSS berbasis CSS variables dengan performa generasi terbaru. |
| **Icons** | [Phosphor Icons](https://phosphoricons.com) | Paket ikon vektor modern bertema edukasi dan konsisten. |
| **Tipografi** | Plus Jakarta Sans & JetBrains Mono | Font modern Google Fonts yang nyaman dibaca anak-anak. |

---

## 📂 Struktur Direktori Proyek

```plaintext
LMS/
├── app/                      # Kontroler & Model Laravel
├── public/                   # Asset Publik
│   ├── favicon.svg           # Ikon Web Resmi Ruang Kelas SD
│   └── build/                # Kompilasi Aset Vite (JS & CSS)
├── resources/
│   ├── css/
│   │   └── app.css           # Styling Utama & Tailwind v4 Tokens
│   ├── js/
│   │   ├── app.jsx           # Root App, State Global & Header Nav
│   │   ├── data/
│   │   │   └── mockData.js   # Dataset Awal: Kelas, Siswa, Materi & PR
│   │   └── components/
│   │       ├── Sidebar.jsx           # Navigasi Menu & Tab Logout Khusus
│   │       ├── LoginPage.jsx         # Halaman Autentikasi Demo Split-Screen
│   │       ├── KelasListView.jsx     # Manajemen CRUD Daftar Kelas
│   │       ├── MateriView.jsx        # Pengelolaan Modul, Video & PDF Upload
│   │       ├── TugasUploadView.jsx   # Pengumpulan PR Murid & Tugas
│   │       └── NilaiEvaluasiView.jsx # Penilaian & Koreksi Nilai Guru
│   └── views/
│       └── welcome.blade.php # Shell Blade Laravel untuk SPA React
├── routes/
│   └── web.php               # Web Routing
└── vite.config.js            # Konfigurasi Vite & Laravel Plugin
```

---

## 🚀 Panduan Menjalankan Proyek (Installation & Setup)

### 1. Kebutuhan Sistem (Prerequisites)
Pastikan laptop/komputer Anda telah terpasang:
* **PHP** >= 8.2
* **Composer** >= 2.x
* **Node.js** >= 18.x & **NPM**

### 2. Kloning Repository
```bash
git clone https://github.com/Azzasafah/LMS.git
cd LMS
```

### 3. Instalasi Dependensi Backend & Frontend
```bash
# Instal dependensi PHP Laravel
composer install

# Instal dependensi JavaScript & React
npm install
```

### 4. Konfigurasi Lingkungan (.env)
```bash
# Salin konfigurasi environment contoh
cp .env.example .env

# Generate Application Key
php artisan key:generate
```

### 5. Menjalankan Server Pengembangan (Dev Mode)

Jalankan perintah berikut di dua terminal terpisah:

**Terminal 1 — Server Laravel:**
```bash
php artisan serve
```
> Server aktif di: `http://127.0.0.1:8000`

**Terminal 2 — Vite Dev Server:**
```bash
npm run dev
```

Atau untuk mem-build bundle produksi secara statis:
```bash
npm run build
```

Buka browser Anda dan akses `http://127.0.0.1:8000`. Anda dapat langsung mencoba login dengan 1-klik sebagai **Ibu Siti Rahmawati** (Guru) atau **Muhammad Fathan** (Siswa)!

---

## 🎨 Prinsip Desain UI/UX

1. **Light & Warm Visual Hierarchy**: Mengutamakan palet warna putih, biru sekolah (`#2563EB`), dan aksen hijau toska (`#059669`) untuk menghadirkan suasana kelas ceria dan bebas intimidasi.
2. **Accessible Form Controls**: Form input dibuat lega dengan label ramah, placeholder kontekstual, dan tombol konfirmasi yang jelas.
3. **Responsive Multi-Device**: Nyaman digunakan di laptop guru, tablet sekolah, maupun smartphone orang tua di rumah.

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi terbuka [MIT License](LICENSE). Bebas digunakan, dipelajari, dan dikembangkan untuk kemajuan pendidikan anak bangsa.
