import React, { useState } from 'react';
import { 
  Chalkboard, 
  BookOpenText, 
  FileArrowUp, 
  CheckSquareOffset, 
  GraduationCap, 
  User, 
  ArrowsLeftRight,
  CaretRight,
  SquaresFour,
  CaretDown,
  Plus,
  Star,
  ChalkboardTeacher,
  Student,
  SignOut
} from '@phosphor-icons/react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentRole, 
  setCurrentRole, 
  isSidebarOpen, 
  setIsSidebarOpen,
  classes = [],
  activeClass,
  onSelectClass,
  onLogout
}) {
  const isTeacher = currentRole === 'teacher';

  // Jumlah tugas murid yang belum dinilai
  const pendingGradingCount = activeClass?.submissions?.filter((s) => s.gradeStatus === 'ungraded').length || 0;
  const urgentCount = activeClass?.assignments?.filter((a) => a.status === 'urgent').length || 0;

  const navItems = isTeacher ? [
    {
      id: 'kelas',
      title: 'Daftar Kelas Saya',
      subtitle: `${classes.length} Kelas Tersedia`,
      icon: SquaresFour,
      badge: `${classes.length} Kelas`,
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'materi',
      title: 'Pelajaran & Materi',
      subtitle: `${activeClass?.materials?.length || 0} Pelajaran`,
      icon: BookOpenText,
      badge: `${activeClass?.materials?.length || 0}`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'tugas',
      title: 'Tugas & PR Murid',
      subtitle: 'Instruksi Pengumpulan Berkas',
      icon: FileArrowUp,
      badge: urgentCount > 0 ? `${urgentCount} Baru` : `${activeClass?.assignments?.length || 0}`,
      badgeColor: urgentCount > 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100 text-slate-700'
    },
    {
      id: 'evaluasi',
      title: 'Periksa & Beri Nilai',
      subtitle: 'Koreksi Tugas & Nilai Anak',
      icon: CheckSquareOffset,
      badge: pendingGradingCount > 0 ? `${pendingGradingCount} Perlu Nilai` : null,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold'
    }
  ] : [
    {
      id: 'materi',
      title: 'Bahan Pelajaran',
      subtitle: `${activeClass?.materials?.length || 0} Pelajaran`,
      icon: BookOpenText,
      badge: `${activeClass?.materials?.length || 0}`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'tugas',
      title: 'Kirimkan Tugas (PR)',
      subtitle: 'Kirim Foto Buku / Video',
      icon: FileArrowUp,
      badge: urgentCount > 0 ? `${urgentCount} Ada PR` : null,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold'
    },
    {
      id: 'evaluasi',
      title: 'Buku Nilai & Catatan',
      subtitle: 'Lihat Nilai & Pujian Guru',
      icon: Star,
    }
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      
      {/* 1. Logo & Judul Aplikasi Ramah SD */}
      <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Chalkboard size={22} weight="fill" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm leading-tight tracking-tight">
              Ruang Kelas SD
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Belajar Mudah & Menyenangkan
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-slate-700 p-1"
        >
          ✕
        </button>
      </div>

      {/* 2. Profil Pengguna yang Bersih & Lega */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
            isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {isTeacher ? 'SR' : 'MF'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {isTeacher ? 'Ibu Siti Rahmawati' : 'Muhammad Fathan'}
            </p>
            <p className="text-[10.5px] text-slate-500 truncate">
              {isTeacher ? 'Guru Kelas SD' : `Siswa • ${activeClass?.title || 'Kelas 4-B'}`}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Menu Navigasi Sederhana & Lega */}
      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu Kelas
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <div className="min-w-0 flex-1">
                  <span className="block font-bold truncate text-slate-800">{item.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal block leading-tight truncate">{item.subtitle}</span>
                </div>
              </div>

              {item.badge ? (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center leading-normal ml-2 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              ) : (
                isActive && <CaretRight size={14} className="text-blue-600 shrink-0 ml-1" />
              )}
            </button>
          );
        })}

        {/* Pemisah Menu Akun & Sesi */}
        <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 mt-2">
          Akun & Sesi
        </div>

        {/* TAB SENDIRI: KELUAR / LOGOUT */}
        {onLogout && (
          <button
            type="button"
            onClick={() => {
              onLogout();
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-medium text-rose-600 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all cursor-pointer group shadow-2xs bg-white"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-rose-50 group-hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors shrink-0">
                <SignOut size={18} weight="bold" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-bold truncate text-slate-800 group-hover:text-rose-700">
                  Keluar Akun
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-rose-500 font-normal block leading-tight truncate">
                  Selesai sesi belajar & logout
                </span>
              </div>
            </div>

            <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors shrink-0">
              Keluar
            </span>
          </button>
        )}
      </nav>

      {/* 4. Ganti Tampilan Guru / Siswa */}
      <div className="p-3.5 border-t border-slate-100 bg-white shrink-0">
        <button
          type="button"
          onClick={() => {
            const next = isTeacher ? 'student' : 'teacher';
            setCurrentRole(next);
            if (next === 'teacher') setActiveTab('kelas');
            else setActiveTab('materi');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowsLeftRight size={16} className="text-slate-500" />
          <span>Ganti: {isTeacher ? 'Mode Siswa / Murid' : 'Mode Guru SD'}</span>
        </button>
      </div>

    </aside>
  );
}
