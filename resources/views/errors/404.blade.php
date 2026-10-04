<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 — Wah, Kamu Sedang di Luar Ruang Kelas | Ruang Kelas SD</title>

    <!-- Web Favicon & Brand Icons -->
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <link rel="alternate icon" href="{{ asset('favicon.ico') }}">
    <link rel="apple-touch-icon" href="{{ asset('favicon.svg') }}">
    <meta name="theme-color" content="#2563EB">

    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CDN Fallback for Zero-Dependency Error Rendering -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-[#f8fafc] text-slate-800 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-blue-600 selection:text-white">

    <!-- Header Sederhana -->
    <header class="py-4 px-6 sm:px-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div class="max-w-5xl mx-auto flex items-center justify-between">
            <a href="{{ url('/') }}" class="flex items-center gap-3 group">
                <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <!-- Chalkboard Icon SVG -->
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,40H40A16,16,0,0,0,24,56V184a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM216,184H40V56H216V184Zm24,32a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16H232A8,8,0,0,1,240,216Z"/>
                    </svg>
                </div>
                <div>
                    <h1 class="font-bold text-slate-900 text-sm sm:text-base leading-tight">Ruang Kelas SD</h1>
                    <p class="text-[11px] text-slate-500 font-medium">Belajar Mudah & Menyenangkan</p>
                </div>
            </a>

            <a href="{{ url('/') }}" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors">
                <span>Ke Halaman Utama</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
            </a>
        </div>
    </header>

    <!-- Konten Utama 404 -->
    <main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-auto">
        <div class="max-w-2xl w-full text-center space-y-6">

            <!-- Ilustrasi Papan Tulis 404 & Kompas Ceria -->
            <div class="relative inline-block mx-auto">
                <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center shadow-xl mx-auto border-4 border-white transform hover:rotate-2 transition-transform">
                    <span class="text-4xl sm:text-5xl font-extrabold tracking-tight">404</span>
                    <span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-blue-200 mt-1">Luar Kelas</span>
                </div>

                <!-- Floating Badges -->
                <div class="absolute -top-2 -right-3 bg-amber-400 text-amber-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md animate-bounce">
                    🧭 Tersesat?
                </div>
                <div class="absolute -bottom-2 -left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ✨ Yuk Balik!
                </div>
            </div>

            <!-- Teks Judul & Kata-Kata Bijak Indah -->
            <div class="space-y-3">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold border border-blue-200">
                    <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span>Pintu Ruangan Ini Belum Terbuka</span>
                </span>

                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Wah, Kamu Sedang di Luar Ruang Kelas! 🎒
                </h2>

                <!-- Kotak Pesan Indah / Nasihat Hangat -->
                <div class="bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-pink-50/30 border border-blue-200/80 rounded-2xl p-5 text-left shadow-xs max-w-xl mx-auto space-y-2">
                    <div class="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                        <svg class="w-4 h-4 text-rose-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>Pesan Hangat Bu Guru:</span>
                    </div>
                    <blockquote class="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed">
                        &ldquo;Setiap penjelajah hebat terkadang bisa salah melangkah ke lorong yang belum terbuka. Jangan berkecil hati dan jangan cemas! Ruang belajar yang hangat, teman-teman ceria, dan modul pelajaran seru dari Bu Guru selalu menunggumu di dalam kelas yang sudah ada. Mari tetap berada di ruang kelas agar belajarmu tetap terarah, menyenangkan, dan penuh semangat!&rdquo;
                    </blockquote>
                </div>
            </div>

            <!-- 3 Alasan Kenapa Lebih Asyik Tetap di Halaman Kelas -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto pt-1">
                <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors">
                    <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-2">
                        📖
                    </div>
                    <h3 class="text-xs font-bold text-slate-900">Modul & Video</h3>
                    <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Video kartun edukatif & buku bacaan PDF lengkap siap dipelajari.</p>
                </div>

                <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-amber-300 transition-colors">
                    <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-2">
                        ⭐
                    </div>
                    <h3 class="text-xs font-bold text-slate-900">Tugas & Nilai</h3>
                    <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Kumpulkan PR fotomu dan dapatkan bintang apresiasi dari Bu Guru.</p>
                </div>

                <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
                    <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-2">
                        💬
                    </div>
                    <h3 class="text-xs font-bold text-slate-900">Forum Tanya Jawab</h3>
                    <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Tanyakan materi apa saja yang belum kamu pahami langsung di kelas.</p>
                </div>
            </div>

            <!-- Tombol Navigasi Kembali ke Kelas -->
            <div class="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="{{ url('/') }}" class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                    <span>Kembali Masuk ke Ruang Kelas SD</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </a>
            </div>

        </div>
    </main>

    <!-- Footer Ramah -->
    <footer class="py-4 px-6 border-t border-slate-200 bg-white text-xs text-slate-500 text-center">
        Ruang Kelas SD &copy; 2026 — Belajar Ceria, Aman, dan Menginspirasi Masa Depan ✨
    </footer>

</body>
</html>
