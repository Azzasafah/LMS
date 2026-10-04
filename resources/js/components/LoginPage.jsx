import React, { useState } from 'react';
import { 
  ChalkboardTeacher, 
  Student, 
  LockKey, 
  EnvelopeSimple, 
  Eye, 
  EyeSlash, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Sparkle, 
  GraduationCap, 
  Check, 
  IdentificationCard,
  BookOpen,
  FileArrowUp,
  Star
} from '@phosphor-icons/react';

export default function LoginPage({ onLogin }) {
  // 'teacher' (Guru SD) | 'student' (Murid / Siswa SD)
  const [role, setRole] = useState('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form Inputs
  const [identifier, setIdentifier] = useState('siti.rahmawati@sekolah.belajar.id');
  const [password, setPassword] = useState('guru12345');
  const [isLoading, setIsLoading] = useState(false);

  // Ganti Tab Role (Otomatis isi demo credentials untuk kemudahan showcase)
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'teacher') {
      setIdentifier('siti.rahmawati@sekolah.belajar.id');
      setPassword('guru12345');
    } else {
      setIdentifier('NISN-00481923');
      setPassword('fathan123');
    }
  };

  // Submit Login
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'teacher') {
        onLogin({
          role: 'teacher',
          name: 'Ibu Siti Rahmawati, S.Pd.',
          avatar: 'SR',
          title: 'Guru Kelas SD & Wali Kelas 4-A',
          email: identifier
        });
      } else {
        onLogin({
          role: 'student',
          name: 'Muhammad Fathan',
          avatar: 'MF',
          title: 'Siswa Kelas 4-A (Absen 14)',
          nisn: identifier
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. Header Minimalis */}
      <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs font-bold">
            <GraduationCap size={22} weight="fill" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm leading-tight tracking-tight">
              Ruang Kelas SD
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Sistem Belajar Ceria, Mudah & Ramah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span className="hidden sm:inline">Terhubung Aman ke Server Sekolah</span>
        </div>
      </header>

      {/* 2. Area Konten Login Split Screen */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* SISI KIRI: Branding & Informasi Edukasi (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                <Sparkle size={14} weight="fill" className="text-amber-500" />
                <span>Portal Belajar Terintegrasi 2026</span>
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Belajar Mudah, Tugas Rapi, Nilai Transparan.
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Platform pembelajaran Sekolah Dasar yang dirancang tanpa kerumitan teknis. Dibuat khusus agar Ibu/Bapak Guru dan anak-anak dapat fokus belajar dengan riang gembira.
              </p>
            </div>

            {/* 3 Pilar Keunggulan Platform */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <BookOpen size={20} weight="fill" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900">Bahan Pelajaran & Video Edukasi</h3>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Materi dilengkapi modul PDF dan video kartun animasi yang menarik bagi siswa.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <FileArrowUp size={20} weight="fill" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900">Pengumpulan Foto Buku Tugas & Video</h3>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Murid cukup memfoto buku tulis atau mengunggah video tugas dengan mudah.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Star size={20} weight="fill" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900">Penilaian Penuh Bintang & Pujian Guru</h3>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Koreksi cepat, rekap nilai kelas otomatis, dan catatan penyemangat untuk anak.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Ringkas */}
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 leading-relaxed italic">
              "Tampilannya sangat ramah dan tidak bikin bingung. Anak-anak semangat mengumpulkan foto PR dan orang tua bisa memantau catatan guru secara langsung."
              <span className="block not-italic font-bold text-slate-800 mt-1.5 font-sans">
                — Bu Siti Rahmawati, S.Pd. (Wali Kelas 4 SD)
              </span>
            </div>

          </div>

          {/* SISI KANAN: Kartu Login Interaktif (7 cols) */}
          <div className="lg:col-span-7">
            <div className="academic-card rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 max-w-lg mx-auto space-y-6">
              
              {/* Tab Pemilih Peran (Role Switcher Ceria) */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">
                  Pilih Cara Masuk Anda:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('teacher')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ChalkboardTeacher size={18} weight={role === 'teacher' ? 'fill' : 'regular'} />
                    <span>Guru / Pengajar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('student')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Student size={18} weight={role === 'student' ? 'fill' : 'regular'} />
                    <span>Siswa & Orang Tua</span>
                  </button>
                </div>
              </div>

              {/* Greeting Form Sesuai Peran */}
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  {role === 'teacher' ? 'Selamat Datang, Bapak/Ibu Guru!' : 'Halo Anak Hebat & Orang Tua!'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {role === 'teacher'
                    ? 'Masuk menggunakan Akun Belajar.id atau NIP untuk mengelola kelas.'
                    : 'Masuk dengan Nomor Induk Siswa (NISN) untuk belajar dan kirim PR.'}
                </p>
              </div>

              {/* Form Login */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Input 1: NIP / Email Guru atau NISN Siswa */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {role === 'teacher' ? 'Email Akun Belajar.id / NIP Guru *' : 'Nomor Induk Siswa Nasional (NISN) / No. Absen *'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3 text-slate-400">
                      {role === 'teacher' ? (
                        <EnvelopeSimple size={18} />
                      ) : (
                        <IdentificationCard size={18} />
                      )}
                    </div>
                    <input
                      type={role === 'teacher' ? 'email' : 'text'}
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={role === 'teacher' ? 'nama.guru@sekolah.belajar.id' : 'Contoh: NISN-00481923'}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Input 2: Kata Sandi */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Kata Sandi *
                    </label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Silakan hubungi staf Tata Usaha (TU) atau Operator Sekolah untuk mereset kata sandi Anda.');
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Lupa Sandi?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3 text-slate-400">
                      <LockKey size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Checkbox Ingat Saya */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span>Ingat saya di perangkat ini</span>
                  </label>
                </div>

                {/* Tombol Masuk */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] ${
                    role === 'teacher'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Memverifikasi Masuk...</span>
                    </span>
                  ) : (
                    <>
                      <span>Masuk ke Ruang Kelas</span>
                      <ArrowRight size={16} weight="bold" />
                    </>
                  )}
                </button>

              </form>

              {/* Bantuan Akun Uji Coba Cepat (Demo Showcase) */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Akun Demo Siap Uji Coba:
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange('teacher');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-bold text-[11px] text-blue-700">Demo Guru SD</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">Ibu Siti Rahmawati</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange('student');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      role === 'student'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-bold text-[11px] text-emerald-700">Demo Siswa SD</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">Muhammad Fathan</p>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* 3. Footer Bersih */}
      <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        Ruang Kelas SD &copy; 2026 — Platform Belajar Ceria, Mudah & Ramah Guru-Murid.
      </footer>

    </div>
  );
}
