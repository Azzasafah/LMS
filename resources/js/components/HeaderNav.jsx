import React from 'react';
import { 
  List, 
  Bell, 
  CloudCheck, 
  Student, 
  ChalkboardTeacher, 
  CaretRight,
  ShieldCheck,
  House
} from '@phosphor-icons/react';

export default function HeaderNav({ 
  currentRole, 
  setCurrentRole, 
  activeTab, 
  setActiveTab, 
  courseInfo, 
  onToggleSidebar 
}) {
  const isTeacher = currentRole === 'teacher';

  const tabLabels = {
    materi: 'Pilar 1: Materi & Diskusi',
    tugas: 'Pilar 2: Daftar Tugas',
    pengumpulan: 'Pilar 3: Pengumpulan Tugas',
    evaluasi: 'Pilar 4: Evaluasi & Nilai Guru',
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Sidebar Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <List size={22} weight="bold" />
          </button>

          {/* Breadcrumbs (AdminLTE staple) */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-slate-700 hover:text-blue-600">
              <House size={14} />
              <span className="hidden sm:inline">LMS</span>
            </span>
            <CaretRight size={12} className="text-slate-400" />
            <span className="font-semibold text-slate-700 truncate max-w-[120px] sm:max-w-[200px]">
              {courseInfo.code}
            </span>
            <CaretRight size={12} className="text-slate-400" />
            <span className="text-blue-600 font-semibold truncate">
              {tabLabels[activeTab]}
            </span>
          </nav>
        </div>

        {/* Right: Storage Status & Quick Role Pill */}
        <div className="flex items-center gap-3">
          
          {/* Friendly Storage Reassurance Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            <CloudCheck size={16} className="text-emerald-600" />
            <span>Google Drive Direct Upload: <strong>Siap</strong></span>
          </div>

          {/* Role Badge Indicator & Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setCurrentRole('student');
                if (activeTab === 'evaluasi') setActiveTab('materi');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                !isTeacher 
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Student size={14} weight="bold" />
              <span>Siswa</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentRole('teacher');
                setActiveTab('evaluasi');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isTeacher 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ChalkboardTeacher size={14} weight="bold" />
              <span>Guru</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
