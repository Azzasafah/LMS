import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  HourglassMedium, 
  FileZip, 
  FilePdf, 
  VideoCamera, 
  ArrowRight, 
  FileText,
  Star,
  ShieldCheck,
  Check,
  X
} from '@phosphor-icons/react';

export default function Pilar2Tugas({ assignments, onSelectForSubmission, onSelectForReview }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'urgent' | 'submitted' | 'pending'
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);

  const filtered = assignments.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Card */}
      <div className="academic-card rounded-xl p-5 border-t-4 border-t-amber-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Daftar Penugasan Mahasiswa
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Perhatikan batas waktu pengerjaan dan format berkas yang diperbolehkan oleh dosen pengampu.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200 overflow-x-auto">
          {[
            { id: 'all', label: 'Semua Tugas' },
            { id: 'urgent', label: 'Mendekati Deadline' },
            { id: 'submitted', label: 'Sudah Dikumpulkan' },
            { id: 'pending', label: 'Belum Dikerjakan' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                filter === f.id
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Tugas (AdminLTE Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((task) => {
          const isUrgent = task.status === 'urgent';
          const isSubmitted = task.status === 'submitted';

          const topStripeColor = isUrgent
            ? 'border-t-4 border-t-rose-500'
            : isSubmitted
            ? 'border-t-4 border-t-emerald-600'
            : 'border-t-4 border-t-blue-500';

          return (
            <div
              key={task.id}
              className={`academic-card rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${topStripeColor}`}
            >
              <div>
                {/* Header Code & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-slate-700 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {task.code}
                  </span>

                  {isUrgent && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                      <Clock size={14} weight="bold" />
                      {task.timeLeft}
                    </span>
                  )}
                  {isSubmitted && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle size={14} weight="fill" />
                      Sudah Dikumpulkan
                    </span>
                  )}
                  {!isUrgent && !isSubmitted && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      {task.timeLeft}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {task.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {task.description}
                </p>

                {/* Info List */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Format yang diterima:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-[11px]">
                      {task.allowedTypes.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          .{t.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Batas Waktu:</span>
                    <span className="font-medium text-slate-800">{task.deadline}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Nilai Maksimal:</span>
                    <span className="font-bold text-emerald-700 font-mono">{task.maxScore} Poin</span>
                  </div>
                </div>

                {/* Graded notice if submitted */}
                {isSubmitted && task.userSubmission && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-emerald-900">
                      <span>Nilai yang Diperoleh:</span>
                      <span className="text-sm font-mono">{task.userSubmission.score} / 100</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 italic">
                      "{task.userSubmission.feedback}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskDetail(task)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all text-center"
                >
                  Detail & Rubrik
                </button>

                {isSubmitted ? (
                  <button
                    type="button"
                    onClick={() => onSelectForReview(task)}
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all text-center shadow-xs"
                  >
                    Lihat Ulasan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectForSubmission(task)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-xs ${
                      isUrgent
                        ? 'bg-rose-600 hover:bg-rose-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <span>Kumpulkan</span>
                    <ArrowRight size={14} weight="bold" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail Rubrik */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold font-mono text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                  {selectedTaskDetail.code}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {selectedTaskDetail.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTaskDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Petunjuk Pengerjaan:
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedTaskDetail.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Kriteria & Bobot Rubrik Penilaian:
              </h4>
              <div className="space-y-1.5">
                {selectedTaskDetail.rubric.map((r, i) => (
                  <div key={i} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-700">{r.item}</span>
                    <span className="font-mono font-bold text-blue-700">{r.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTaskDetail(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Tutup
              </button>
              {!selectedTaskDetail.userSubmission && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectForSubmission(selectedTaskDetail);
                    setSelectedTaskDetail(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <span>Lanjut Mengumpulkan</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
