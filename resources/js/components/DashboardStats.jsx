import React from 'react';
import { 
  BookOpen, 
  ClockCountdown, 
  CloudArrowUp, 
  Star,
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react';

export default function DashboardStats({ 
  assignments, 
  submissions, 
  onNavigateTab 
}) {
  const urgentCount = assignments.filter((a) => a.status === 'urgent').length;
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;
  const gradedCount = submissions.filter((s) => s.gradeStatus === 'graded').length;

  const stats = [
    {
      tabId: 'materi',
      title: 'Materi Kuliah',
      value: 'Sesi 04 Aktif',
      subtitle: 'Video 32m + Modul PDF 14 Hal',
      icon: BookOpen,
      iconBg: 'bg-blue-600 text-white',
      borderAccent: 'border-t-4 border-t-blue-600',
      actionText: 'Buka Materi',
    },
    {
      tabId: 'tugas',
      title: 'Daftar Tugas',
      value: `${assignments.length} Tugas Diberikan`,
      subtitle: urgentCount > 0 ? `${urgentCount} Tugas mendekati deadline!` : 'Semua tugas terpantau',
      icon: ClockCountdown,
      iconBg: urgentCount > 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-emerald-600 text-white',
      borderAccent: urgentCount > 0 ? 'border-t-4 border-t-amber-500' : 'border-t-4 border-t-emerald-600',
      actionText: 'Lihat Tugas',
    },
    {
      tabId: 'pengumpulan',
      title: 'Pengumpulan Berkas',
      value: 'Direct Google Drive',
      subtitle: 'Bebas macet & hemat kuota server',
      icon: CloudArrowUp,
      iconBg: 'bg-emerald-600 text-white',
      borderAccent: 'border-t-4 border-t-emerald-600',
      actionText: 'Kirim Berkas',
    },
    {
      tabId: 'evaluasi',
      title: 'Evaluasi & Nilai',
      value: `${gradedCount} dari ${submissions.length} Dinilai`,
      subtitle: 'Skor transparan & ulasan guru',
      icon: Star,
      iconBg: 'bg-purple-600 text-white',
      borderAccent: 'border-t-4 border-t-purple-600',
      actionText: 'Periksa Nilai',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((box, idx) => {
        const Icon = box.icon;
        return (
          <div
            key={idx}
            className={`academic-card rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${box.borderAccent}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {box.title}
                </span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-xs ${box.iconBg}`}>
                  <Icon size={20} weight="fill" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
                {box.value}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {box.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigateTab(box.tabId)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                <span>{box.actionText}</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
