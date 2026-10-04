# Product Requirement Document (PRD): Lean LMS 4-Pilar
**Fokus Inti:** Materi • Tugas • Pengumpulan Tugas • Evaluasi  
**Pendekatan:** Design-First (Wireframe & Prototipe Komponen UI Dulu)  
**Tech Stack:** Laravel 11 + Inertia.js + React + Tailwind CSS  
**Infrastruktur:** DomCloud.co (Disk Server ~5 GB) + Google Drive API (Penyimpanan Eksternal File Tugas)

---

## 1. Ringkasan & Ruang Lingkup Sistem

Sistem berfokus penuh pada siklus belajar-mengajar esensial tanpa modul gamifikasi:
1. **Pilar 1: Materi** (Penyampaian bahan ajar + diskusi/komentar).
2. **Pilar 2: Tugas-Tugas** (Pembuatan instruksi tugas, batas waktu, format berkas).
3. **Pilar 3: Pengumpulan Tugas** (Pengunggahan multi-format: video, dokumen PDF/Word, gambar, ZIP langsung ke Google Drive).
4. **Pilar 4: Evaluasi** (Penilaian skor, catatan/feedback dari guru, serta pratinjau berkas siswa).

---

## 2. Fase 1: Design-First (Penyusunan Antarmuka Terlebih Dahulu)

Sebelum coding backend dan konfigurasi database, buat dulu prototipe antarmuka (UI/UX) interaktif menggunakan React + Tailwind CSS dengan *mock data*.

### 2.1 Alur Layar (Screen Flow)
1. **Layar Materi & Diskusi:**
   * Player embed video responsif (YouTube / Drive) dan PDF reader.
   * Format teks materi rapi dan mudah dibaca di layar smartphone.
   * Kolom komentar bertingkat (*thread*) di bawah materi untuk tanya-jawab.
2. **Layar Daftar Tugas (Tugas-Tugas):**
   * Kartu tugas dengan indikator waktu: *Mendekati Deadline*, *Sudah Dikumpulkan*, *Belum Dikerjakan*.
   * Rincian instruksi tugas, rubrik nilai, dan format file yang diizinkan.
3. **Layar Pengumpulan Tugas (Submission Box):**
   * *Drag-and-drop* dropzone dengan indikator progres upload persentase biner.
   * State tombol submit yang jelas (*Idle*, *Uploading*, *Finalizing*, *Success*).
   * Tombol terkunci otomatis saat ditekan untuk mencegah klik ganda.
4. **Layar Evaluasi & Penilaian (Panel Guru):**
   * Tabel daftar pengumpulan per siswa (lengkap dengan timestamp pengumpulan).
   * Antarmuka *split-screen*:
     * Sisi Kiri: Viewer berkas tugas (putar video atau baca PDF langsung tanpa unduh).
     * Sisi Kanan: Input nilai (0–100) dan catatan evaluasi/umpan balik guru.

---

## 3. Rincian Fitur 4-Pilar

### Pilar 1: Modul Materi & Komentar
* **Guru:** Menulis materi (Rich Text), embed video luar (YouTube/Loom/Drive), atau menyematkan dokumen acuan.
* **Siswa:** Menandai materi selesai dipelajari, menulis pertanyaan di kolom komentar.
* **Komentar:** Thread tanya-jawab sederhana antara guru dan siswa per materi.

### Pilar 2: Modul Tugas-Tugas (Assignment Management)
* **Guru:** 
  * Menentukan judul, deskripsi instruksi, batas waktu (deadline) berbasis jam server.
  * Menentukan toleransi pengumpulan terlambat (izinkan/tolak).
  * Menentukan format file yang diizinkan (misal: hanya PDF atau MP4/ZIP).

### Pilar 3: Modul Pengumpulan Tugas (Multi-format & Zero Server Disk)
* **Siswa:** Mengumpulkan file tugas berupa Video, PDF, DOCX, JPG/PNG, atau ZIP.
* **Direct-Upload Google Drive:** Berkas biner **tidak dikirim ke server DomCloud**, melainkan langsung dari browser siswa ke Google Drive via *Google Resumable Upload API*. Server DomCloud hanya menyimpan metadata berupa `file_id`, tautan pratinjau, dan nama berkas.

### Pilar 4: Modul Evaluasi & Penilaian (Grading & Feedback)
* **Guru:**
  * Memeriksa berkas kiriman siswa langsung di dalam web menggunakan embedded preview.
  * Memasukkan skor angka (misal: 85/100) dan catatan revisi/evaluasi.
  * Status tugas berubah menjadi *Dinilai (Graded)*.
* **Siswa:**
  * Menerima notifikasi visual bahwa tugas telah dievaluasi.
  * Melihat nilai akhir dan membaca catatan evaluasi dari guru.

---

## 4. Arsitektur Anti-Race Condition & Anti-Server Crash

Kondisi kritis terjadi ketika puluhan hingga ratusan siswa mengumpulkan tugas bersamaan menjelang detik-detik batas waktu (*deadliners*).

```
[ Siswa Browser (React) ]
       │
       ├── 1. POST /api/submissions/init-upload ──► [ Laravel ]
       │                                                │
       │ ◄── Kirim Google Resumable Session URL ────────┘
       │
       ├── 2. Upload Biner File Langsung (PUT) ──► [ Google Drive API ]
       │                                                │
       │ ◄── Kembalikan Drive File ID & Status Selesai ─┘
       │
       └── 3. POST /api/submissions/finalize ──► [ Laravel Transaction ]
                                                        │
                                                        ├── Cache::lock() (Cegah Double Submit)
                                                        ├── DB Unique Constraint (Idempotency)
                                                        └── Update/Insert Status Tugas
```

### 4.1 Pencegahan Double Submit (Sisi Klien & Server)
* **Client Side:** State `isSubmitting = true` menonaktifkan tombol kirim dan menampilkan animasi proses seketika setelah klik pertama.
* **Server Side (Atomic Lock):**
  Menggunakan penguncian sementara berbasis cache di controller Laravel agar request paralel dari user yang sama ditolak:
  ```php
  use Illuminate\Support\Facades\Cache;

  $lock = Cache::lock("submission_lock_{$user->id}_{$assignmentId}", 10);
  if (! $lock->get()) {
      return response()->json(['message' => 'Tugas sedang diproses, mohon tunggu.'], 429);
  }
  ```

### 4.2 Idempotensi Database (Anti Data Ganda)
* Skema database diberi kunci unik gabungan (`unique composite index`):
  ```php
  $table->unique(['user_id', 'assignment_id'], 'unique_student_assignment');
  ```
* Jika siswa melakukan revisi berkas sebelum deadline, gunakan metode transaksi aman:
  ```php
  DB::transaction(function () use ($data) {
      Submission::updateOrCreate(
          ['user_id' => $data['user_id'], 'assignment_id' => $data['assignment_id']],
          [
              'google_drive_file_id' => $data['file_id'],
              'file_name' => $data['file_name'],
              'submitted_at' => now(),
          ]
      );
  });
  ```

### 4.3 Beban Memori Rendah Saat Lonjakan
* Karena file video ratusan MB tidak transit di PHP-FPM DomCloud, prosesor dan RAM server 5 GB tetap stabil melayani request HTTP biasa.

---

## 5. Strategi Deployment DomCloud (Hemat Disk 5 GB)

1. **Build Aset di Komputer Lokal:**
   * Jalankan `npm run build` di lokal.
   * Hanya unggah folder `public/build` hasil kompilasi ke Git/DomCloud.
   * Folder `node_modules` **tidak boleh diinstal di server DomCloud** (menghemat ~700 MB disk).
2. **Pembersihan Log & Cache:**
   * Set pengaturan `.env`: `LOG_CHANNEL=daily` dan `LOG_MAX_FILES=3` agar file log tidak membesar.
   * Konfigurasi composer produksi:
     ```bash
     composer install --no-dev --prefer-dist --optimize-autoloader
     ```

---

## 6. Skema Database Inti (4 Pilar)

```sql
-- Pengguna (Guru / Siswa)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('teacher', 'student') DEFAULT 'student',
    created_at TIMESTAMP NULL
);

-- Pilar 1: Materi
CREATE TABLE materials (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    video_embed_url TEXT NULL,
    created_at TIMESTAMP NULL
);

-- Komentar pada Materi
CREATE TABLE material_comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    material_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP NULL
);

-- Pilar 2: Tugas-Tugas
CREATE TABLE assignments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    material_id BIGINT UNSIGNED NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    allowed_file_types VARCHAR(255) DEFAULT 'pdf,mp4,docx,zip,jpg,png',
    deadline_at DATETIME NOT NULL,
    max_score INT UNSIGNED DEFAULT 100,
    created_at TIMESTAMP NULL
);

-- Pilar 3 & 4: Pengumpulan & Evaluasi
CREATE TABLE submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    google_drive_file_id VARCHAR(255) NOT NULL,
    google_drive_preview_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    submitted_at DATETIME NOT NULL,
    -- Field Evaluasi (Pilar 4)
    score INT UNSIGNED NULL,
    evaluation_feedback TEXT NULL,
    evaluated_at DATETIME NULL,
    created_at TIMESTAMP NULL,
    UNIQUE KEY unique_user_submission (user_id, assignment_id)
);
```

---

## 7. Tahapan Pengerjaan

1. **Step 1 (UI Wireframe & Mockup):** Buat antarmuka 4 pilar di React + Tailwind CSS memakai data dummy (fokus ke kerapian UX di desktop & mobile).
2. **Step 2 (Database & Auth):** Jalankan migrasi skema 4 pilar di Laravel + Inertia.
3. **Step 3 (Google Drive Bridge):** Pasang endpoint *resumable upload session* ke Google Drive dan pasang *atomic cache lock*.
4. **Step 4 (Modul Evaluasi Guru):** Sambungkan embedded Google Drive preview dengan form input skor dan feedback.
5. **Step 5 (Build & Deploy ke DomCloud):** Kompilasi aset di lokal, dorong kode ke DomCloud, dan uji coba submit serentak.
