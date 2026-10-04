import React, { useState } from 'react';
import { 
  CheckSquareOffset, 
  CheckCircle, 
  Star, 
  FilePdf, 
  VideoCamera, 
  Clock, 
  Check, 
  Image as ImageIcon,
  Sparkle,
  Student,
  ChalkboardTeacher,
  Heart,
  Trash,
  ArrowCounterClockwise,
  Eye,
  MagnifyingGlass,
  X,
  FileText,
  Printer,
  PencilSimple,
  ShieldCheck,
  Funnel,
  TrendUp
} from '@phosphor-icons/react';

export default function NilaiEvaluasiView({ 
  currentRole, 
  assignments = [], 
  submissions = [], 
  onUpdateGrade,
  onResetGrade,
  onDeleteSubmission,
  activeClass 
}) {
  const isTeacher = currentRole === 'teacher';

  // State Filter & Pencarian (CRUD Read)
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'pending' | 'graded'
  const [taskFilter, setTaskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [gradingModalSub, setGradingModalSub] = useState(null); // Submisi yang sedang dinilai/diedit
  const [previewModalSub, setPreviewModalSub] = useState(null); // Submisi yang berkasnya sedang di-preview
  const [confirmDeleteSub, setConfirmDeleteSub] = useState(null); // Submisi yang akan dihapus
  const [confirmResetSub, setConfirmResetSub] = useState(null); // Submisi yang nilainya akan direset

  // Form State Penilaian
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Kalkulasi Statistik Kelas (AdminLTE Stats Cards)
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter(
    (s) => s.gradeStatus === 'graded' && s.score !== null
  );
  const gradedCount = gradedSubmissions.length;
  const pendingCount = totalSubmissions - gradedCount;
  
  const averageScore = gradedCount > 0
    ? (gradedSubmissions.reduce((acc, curr) => acc + Number(curr.score || 0), 0) / gradedCount).toFixed(1)
    : '-';

  // Filter Submisi Berdasarkan Tab, Tugas, dan Kata Kunci
  const filteredSubmissions = submissions.filter((sub) => {
    // 1. Filter Status Penilaian
    if (filterTab === 'pending' && (sub.gradeStatus === 'graded' && sub.score !== null)) {
      return false;
    }
    if (filterTab === 'graded' && (sub.gradeStatus !== 'graded' || sub.score === null)) {
      return false;
    }

    // 2. Filter Berdasarkan Tugas PR
    if (taskFilter !== 'all' && sub.assignmentTitle !== taskFilter) {
      return false;
    }

    // 3. Filter Pencarian Nama Siswa / No Absen / Nama File
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.studentName?.toLowerCase().includes(q);
      const matchNim = sub.nim?.toLowerCase().includes(q);
      const matchFile = sub.fileName?.toLowerCase().includes(q);
      const matchTask = sub.assignmentTitle?.toLowerCase().includes(q);
      if (!matchName && !matchNim && !matchFile && !matchTask) return false;
    }

    return true;
  });

  // Handler Buka Modal Penilaian (Beri Nilai / Ubah Nilai)
  const handleOpenGradingModal = (sub) => {
    setGradingModalSub(sub);
    setGradeInput(sub.score !== null && sub.score !== undefined ? String(sub.score) : '');
    setFeedbackInput(sub.feedback || 'Tugas sudah diperiksa oleh Bu Guru. Bagus sekali nak!');
  };

  // Handler Simpan Nilai (Create & Update Grade)
  const handleSaveGradeSubmit = (e) => {
    e.preventDefault();
    if (!gradingModalSub || gradeInput === '') return;

    const numScore = Math.min(100, Math.max(0, Number(gradeInput)));

    if (onUpdateGrade) {
      onUpdateGrade(gradingModalSub.id, {
        score: numScore,
        feedback: feedbackInput || 'Tugas sudah diperiksa oleh Bu Guru.',
        evaluatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        gradeStatus: 'graded',
      });
    }

    setGradingModalSub(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Handler Konfirmasi Reset Nilai (Delete Grade)
  const handleExecuteResetGrade = () => {
    if (!confirmResetSub) return;
    if (onResetGrade) {
      onResetGrade(confirmResetSub.id);
    }
    setConfirmResetSub(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Handler Konfirmasi Hapus Kiriman (Delete Submission)
  const handleExecuteDeleteSubmission = () => {
    if (!confirmDeleteSub) return;
    if (onDeleteSubmission) {
      onDeleteSubmission(confirmDeleteSub.id);
    }
    setConfirmDeleteSub(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Preset Pujian Cepat untuk Guru SD
  const handleQuickCompliment = (text) => {
    setFeedbackInput(text);
  };

  // Helper Ikon Berkas
  const getFileBadge = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <VideoCamera size={14} weight="fill" /> Video
        </span>
      );
    }
    if (['pdf'].includes(ext)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          <FilePdf size={14} weight="fill" /> Dokumen PDF
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
        <ImageIcon size={14} weight="fill" /> Foto Buku
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Toast Notifikasi Sukses */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
            <Check size={16} weight="bold" />
          </div>
          <div>
            <p className="font-bold">Berhasil Diperbarui!</p>
            <p className="text-slate-300 text-xs">Perubahan nilai dan catatan murid tersimpan.</p>
          </div>
        </div>
      )}

      {/* 1. Header Banner Penilaian (AdminLTE Light Style) */}
      <div className="academic-card rounded-2xl p-5 sm:p-6 bg-white border border-slate-200 shadow-2xs border-t-4 border-t-blue-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200">
              {activeClass?.title}
            </span>
            <span>•</span>
            <span className="text-slate-500">{activeClass?.section}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isTeacher ? 'Manajemen Penilaian & Pemeriksaan Tugas Murid' : 'Buku Nilai & Catatan Bu Guru'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isTeacher 
              ? 'Kelola kiriman tugas murid, berikan nilai skor (0-100), pesan pujian penyemangat, dan cetak rekap nilai kelas.'
              : 'Lihat hasil nilai tugas dan pesan bimbingan dari Bu Guru untuk setiap pekerjaan rumah yang sudah kamu kumpulkan.'}
          </p>
        </div>

        {/* Tombol Aksi Cepat Cetak Rekap */}
        {isTeacher && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => alert(`Mencetak Rekap Nilai untuk ${activeClass?.title} (${submissions.length} murid terdaftar). Dokumen siap diunduh!`)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Printer size={16} />
              <span>Cetak Rekap Nilai</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. MODE GURU SD: DASHBOARD CRUD MANAJEMEN PENILAIAN       */}
      {/* ========================================================= */}
      {isTeacher ? (
        <div className="space-y-6">

          {/* A. Kartu Statistik Kelas (AdminLTE Stats Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Kiriman */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Tugas Masuk</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FileText size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                {totalSubmissions}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Berkas dikumpulkan murid</p>
            </div>

            {/* Perlu Dinilai */}
            <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-2xs bg-linear-to-b from-rose-50/30 to-white">
              <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
                <span>Perlu Dinilai</span>
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Clock size={18} weight="bold" />
                </div>
              </div>
              <p className="text-2xl font-bold text-rose-700 mt-2 font-mono">
                {pendingCount}
              </p>
              <p className="text-[11px] text-rose-500 mt-0.5">Menunggu koreksi Bu Guru</p>
            </div>

            {/* Sudah Dinilai */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs bg-linear-to-b from-emerald-50/30 to-white">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
                <span>Sudah Dinilai</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle size={18} weight="fill" />
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
                {gradedCount}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Telah diberi skor & catatan</p>
            </div>

            {/* Rata-Rata Kelas */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Rata-rata Nilai Kelas</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <TrendUp size={18} weight="bold" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                {averageScore}
              </p>
              <p className="text-[11px] text-amber-600 mt-0.5 flex items-center gap-1 font-medium">
                <Star size={12} weight="fill" /> Prestasi memuaskan
              </p>
            </div>

          </div>

          {/* B. Filter & Pencarian Manajemen CRUD */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Tabs Filter Status */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === 'all'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Semua ({totalSubmissions})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === 'pending'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Perlu Dinilai ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('graded')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === 'graded'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Sudah Dinilai ({gradedCount})
                </button>
              </div>

              {/* Filter Dropdown & Search Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-lg">
                
                {/* Filter Berdasarkan Tugas PR */}
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 focus:outline-none focus:border-blue-600"
                >
                  <option value="all">Semua Tugas PR</option>
                  {assignments.map((a) => (
                    <option key={a.id} value={a.title}>
                      {a.code}: {a.title}
                    </option>
                  ))}
                </select>

                {/* Pencarian Siswa */}
                <div className="relative flex-1">
                  <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama murid, absen, atau berkas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* C. Tabel Rekap Manajemen Penilaian (AdminLTE Light Style) */}
          <div className="academic-card rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Daftar Kiriman & Rekap Nilai Siswa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menampilkan {filteredSubmissions.length} dari {totalSubmissions} berkas tugas murid
                </p>
              </div>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <CheckSquareOffset size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700">Tidak ada berkas tugas ditemukan</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Coba ganti filter tab atau kata kunci pencarian Anda untuk melihat kiriman tugas murid.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Murid (Siswa SD)</th>
                      <th className="py-3 px-4">Tugas PR</th>
                      <th className="py-3 px-4">Berkas yang Dikumpulkan</th>
                      <th className="py-3 px-4">Nilai & Catatan Guru</th>
                      <th className="py-3 px-4 text-right">Aksi Kelola (CRUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.map((sub) => {
                      const isGraded = sub.gradeStatus === 'graded' && sub.score !== null;

                      return (
                        <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors">
                          
                          {/* 1. Profil Murid */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                                {sub.studentName.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 leading-tight">
                                  {sub.studentName}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {sub.nim || 'Siswa Kelas'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* 2. Tugas PR */}
                          <td className="py-3.5 px-4 align-top">
                            <p className="font-bold text-slate-800 leading-tight">
                              {sub.assignmentTitle}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                              <Clock size={12} />
                              <span>{sub.submittedAt}</span>
                              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold text-[10px]">
                                {sub.submissionStatus || 'Tepat Waktu'}
                              </span>
                            </div>
                          </td>

                          {/* 3. Berkas Tugas */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                {getFileBadge(sub.fileName)}
                                <span className="text-[11px] text-slate-500">
                                  {sub.fileSize}
                                </span>
                              </div>
                              <p className="font-mono text-xs text-slate-700 truncate max-w-[180px]">
                                {sub.fileName}
                              </p>
                              <button
                                type="button"
                                onClick={() => setPreviewModalSub(sub)}
                                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye size={12} /> Pratinjau Berkas
                              </button>
                            </div>
                          </td>

                          {/* 4. Nilai & Catatan Guru */}
                          <td className="py-3.5 px-4 align-top">
                            {isGraded ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-base text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                                    {sub.score} / 100
                                  </span>
                                  <div className="flex items-center text-amber-500">
                                    <Star size={14} weight="fill" />
                                    <Star size={14} weight="fill" />
                                    <Star size={14} weight="fill" />
                                  </div>
                                </div>
                                {sub.feedback && (
                                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200/70 max-w-xs leading-relaxed">
                                    "{sub.feedback}"
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                                  <Clock size={14} weight="bold" /> Belum Diperiksa
                                </span>
                                <p className="text-[11px] text-slate-400 mt-1">
                                  Silakan klik Beri Nilai di samping.
                                </p>
                              </div>
                            )}
                          </td>

                          {/* 5. Aksi Kelola (CRUD Buttons) */}
                          <td className="py-3.5 px-4 align-top text-right">
                            <div className="inline-flex items-center gap-1.5">
                              
                              {/* Tombol Beri Nilai / Edit Nilai */}
                              <button
                                type="button"
                                onClick={() => handleOpenGradingModal(sub)}
                                title={isGraded ? 'Ubah Nilai / Catatan' : 'Beri Nilai Murid'}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                  isGraded
                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                                }`}
                              >
                                {isGraded ? (
                                  <>
                                    <PencilSimple size={14} weight="bold" />
                                    <span>Ubah Nilai</span>
                                  </>
                                ) : (
                                  <>
                                    <Check size={14} weight="bold" />
                                    <span>Beri Nilai</span>
                                  </>
                                )}
                              </button>

                              {/* Tombol Reset Nilai (jika sudah dinilai) */}
                              {isGraded && (
                                <button
                                  type="button"
                                  onClick={() => setConfirmResetSub(sub)}
                                  title="Reset Nilai (Kosongkan Skor)"
                                  className="p-2 rounded-xl text-amber-700 hover:bg-amber-50 border border-amber-200/80 transition-colors cursor-pointer"
                                >
                                  <ArrowCounterClockwise size={15} weight="bold" />
                                </button>
                              )}

                              {/* Tombol Hapus Kiriman (Delete Submission) */}
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteSub(sub)}
                                title="Hapus Berkas Kiriman Siswa"
                                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors cursor-pointer"
                              >
                                <Trash size={15} />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* ========================================================= */
        /* 3. MODE MURID SD: BUKU NILAI & CATATAN PUJIAN BU GURU    */
        /* ========================================================= */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-center gap-2.5">
            <Sparkle size={20} weight="fill" className="text-amber-500 shrink-0" />
            <p>
              Halo <strong>Muhammad Fathan</strong>! Di sini kamu bisa melihat nilai tugas pekerjaan rumahmu dan membaca pesan penyemangat dari Bu Guru Siti.
            </p>
          </div>

          <div className="space-y-4">
            {assignments.map((task) => {
              const hasSubmission = task.userSubmission;
              const isGraded = hasSubmission && hasSubmission.score !== null;

              return (
                <div key={task.id} className="academic-card rounded-2xl p-6 bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {task.code}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-medium">Batas Waktu: {task.deadline}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                    
                    {hasSubmission && (
                      <p className="text-xs text-slate-600">
                        Berkas yang kamu kumpulkan: <strong className="text-slate-800">{hasSubmission.fileName}</strong> ({hasSubmission.fileSize})
                      </p>
                    )}

                    {isGraded && hasSubmission.feedback && (
                      <div className="mt-3 p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <Heart size={15} weight="fill" className="text-rose-500" />
                          <span>Pesan Pujian dari Bu Guru:</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                          "{hasSubmission.feedback}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-left sm:text-right sm:border-l sm:border-slate-100 sm:pl-6 shrink-0">
                    {isGraded ? (
                      <div>
                        <span className="text-xs text-slate-500 block mb-0.5">Nilai Tugas:</span>
                        <span className="text-4xl font-bold font-mono text-emerald-600 block">
                          {hasSubmission.score}
                          <span className="text-sm text-slate-400 font-normal"> / 100</span>
                        </span>
                        <div className="flex items-center sm:justify-end gap-1 mt-1 text-amber-500">
                          <Star size={18} weight="fill" />
                          <Star size={18} weight="fill" />
                          <Star size={18} weight="fill" />
                        </div>
                        <p className="text-xs text-emerald-700 font-bold mt-1">Sangat Baik!</p>
                      </div>
                    ) : hasSubmission ? (
                      <span className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 inline-block">
                        Sedang Diperiksa Bu Guru ⏳
                      </span>
                    ) : (
                      <span className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium inline-block">
                        Belum Dikumpulkan
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL FORM: BERI / UBAH NILAI (CREATE & UPDATE GRADE)  */}
      {/* ========================================================= */}
      {gradingModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {gradingModalSub.assignmentTitle}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Beri Nilai & Catatan Guru
                </h3>
                <p className="text-xs text-slate-500">
                  Murid: <strong className="text-slate-800">{gradingModalSub.studentName}</strong> ({gradingModalSub.nim})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGradingModalSub(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Info Berkas yang Dikumpulkan */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ImageIcon size={18} weight="fill" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {gradingModalSub.fileName}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {gradingModalSub.fileSize} • Dikirim: {gradingModalSub.submittedAt}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalSub(gradingModalSub)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline shrink-0 ml-2"
              >
                Lihat Berkas
              </button>
            </div>

            {/* Form Input Nilai */}
            <form onSubmit={handleSaveGradeSubmit} className="space-y-4">
              
              {/* Input Angka & Tombol Cepat */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nilai Angka (Skala 0 – 100) *
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    placeholder="95"
                    required
                    autoFocus
                    className="w-28 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xl font-mono font-bold text-blue-700 focus:outline-none focus:border-blue-600"
                  />

                  {/* Tombol Nilai Cepat Guru SD */}
                  <div className="flex flex-wrap gap-1.5">
                    {[75, 80, 85, 90, 95, 100].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGradeInput(String(num))}
                        className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          gradeInput === String(num)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tombol Pujian Favorit Bu Guru SD */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Pilih Pujian Cepat untuk Murid:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickCompliment("Pintar sekali nak! Tugasmu sangat rapi dan lengkap. Pertahankan prestasimu ya! ⭐⭐⭐")}
                    className="p-2 text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition-colors cursor-pointer"
                  >
                    ⭐ Pintar & Rapi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickCompliment("Masya Allah hebat! Penjelasannya sangat jelas dan percaya diri. Bagus sekali! 👍")}
                    className="p-2 text-left rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-medium transition-colors cursor-pointer"
                  >
                    👍 Hebat & Percaya Diri
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickCompliment("Bagus nak sudah mengumpulkan tepat waktu. Jangan lupa periksa kembali hitungannya ya! 😊")}
                    className="p-2 text-left rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium transition-colors cursor-pointer"
                  >
                    😊 Rajin & Semangat
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickCompliment("Hasil yang baik! Perhatikan lagi ketelitian perhitungannya ya, tetap semangat belajar! ✨")}
                    className="p-2 text-left rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-medium transition-colors cursor-pointer"
                  >
                    ✨ Terus Belajar
                  </button>
                </div>
              </div>

              {/* Textarea Catatan Guru */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catatan & Bimbingan Bu Guru:
                </label>
                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Tuliskan catatan pujian atau bimbingan untuk anak..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              {/* Tombol Aksi Simpan */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingModalSub(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={16} weight="bold" />
                  <span>Simpan & Kirim Nilai</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL PREVIEW BERKAS TUGAS SISWA                      */}
      {/* ========================================================= */}
      {previewModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Pratinjau Berkas Tugas Murid
                </h3>
                <p className="text-xs text-slate-500">
                  {previewModalSub.studentName} • {previewModalSub.fileName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalSub(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Simulasi Tampilan Kertas Tugas Murid SD */}
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3 font-serif">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-dashed border-amber-200 pb-2">
                <span>Nama: <strong>{previewModalSub.studentName}</strong></span>
                <span>Kelas: 4-A / Absen 14</span>
              </div>
              <div className="py-4 text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-2xs border border-amber-200 flex items-center justify-center mx-auto text-blue-600">
                  <ImageIcon size={32} weight="fill" />
                </div>
                <p className="font-bold text-slate-800 text-sm font-sans">
                  Foto Buku Catatan Matematika (Perkalian 1-10)
                </p>
                <p className="text-xs text-slate-500 font-sans">
                  Tersimpan di Google Drive Sekolah • Aman & Terverifikasi
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200/70 text-xs font-mono text-slate-700 leading-relaxed">
                <p>1. 14 x 12 = 168 (Benar)</p>
                <p>2. 25 x 15 = 375 (Benar)</p>
                <p>3. 32 x 18 = 576 (Benar)</p>
                <p className="text-emerald-700 font-bold mt-1">Status: Jawaban tulisan tangan rapi & jelas.</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                ID Berkas: {previewModalSub.driveFileId || 'DRV-SD-9921'}
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalSub(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Tutup Pratinjau
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL KONFIRMASI RESET NILAI (DELETE GRADE)            */}
      {/* ========================================================= */}
      {confirmResetSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <ArrowCounterClockwise size={24} weight="bold" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Reset Nilai Siswa Ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Bu Guru ingin mengosongkan nilai dan catatan untuk <strong>{confirmResetSub.studentName}</strong>? Statusnya akan kembali menjadi "Perlu Dinilai".
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetSub(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteResetGrade}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
              >
                Ya, Reset Nilai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MODAL KONFIRMASI HAPUS KIRIMAN (DELETE SUBMISSION)     */}
      {/* ========================================================= */}
      {confirmDeleteSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash size={24} weight="bold" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Kiriman Berkas Murid?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Berkas kiriman tugas dari <strong>{confirmDeleteSub.studentName}</strong> ({confirmDeleteSub.fileName}) akan dihapus dari kelas ini sehingga murid dapat mengunggah berkas perbaikan baru jika diperlukan.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteSub(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteSubmission}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Ya, Hapus Berkas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
