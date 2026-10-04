import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  FileArrowUp, 
  UploadSimple, 
  CheckCircle, 
  Clock, 
  FilePdf, 
  VideoCamera, 
  Image as ImageIcon, 
  FileText,
  LockKey,
  ShieldCheck,
  ArrowClockwise,
  Check,
  X,
  Camera,
  Star,
  Sparkle,
  Plus,
  PencilSimple,
  Trash,
  ArrowLeft,
  ArrowRight,
  Eye,
  MagnifyingGlass,
  TrendUp
} from '@phosphor-icons/react';

export default function TugasUploadView({ 
  assignments = [], 
  onSubmissionSuccess, 
  activeClass,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  currentRole
}) {
  const isTeacher = currentRole === 'teacher';

  // 'list' (Tabel Manajemen CRUD) | 'submit' (Halaman Pengumpulan Tugas)
  const [viewMode, setViewMode] = useState(isTeacher ? 'list' : 'submit');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'submitted' | 'empty'
  const [selectedTaskId, setSelectedTaskId] = useState(assignments[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State CRUD
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deletingAssignment, setDeletingAssignment] = useState(null);

  // Form State (Tambah & Edit Tugas)
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formMaxScore, setFormMaxScore] = useState(100);
  const [formDescription, setFormDescription] = useState('');

  // Submission Box State
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitPhase, setSubmitPhase] = useState('idle'); // 'idle' | 'uploading' | 'finalizing' | 'success'
  const [progress, setProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [receipt, setReceipt] = useState(null);

  const fileInputRef = useRef(null);

  // Sync selectedTaskId when assignments update
  React.useEffect(() => {
    if (assignments.length > 0 && (!selectedTaskId || !assignments.some(a => a.id === selectedTaskId))) {
      setSelectedTaskId(assignments[0].id);
      setSelectedFile(null);
      setSubmitPhase('idle');
      setProgress(0);
      setReceipt(null);
    }
  }, [assignments]);

  const currentTask = assignments.find((a) => a.id === selectedTaskId) || assignments[0];

  // Hitung Statistik Tugas PR
  const totalTasks = assignments.length;
  const submissions = activeClass?.submissions || [];
  const totalSubmissions = submissions.length;
  const pendingGrading = submissions.filter((s) => s.gradeStatus !== 'graded' || s.score === null).length;
  const nearestDeadline = assignments[0]?.deadline || 'Jumat, 20:00 WIB';

  // Filter Assignments
  const filteredAssignments = assignments.filter((a) => {
    const subCount = submissions.filter(
      (s) => s.assignmentTitle?.includes(a.title) || s.assignmentTitle?.includes(a.code)
    ).length;

    if (filterTab === 'submitted' && subCount === 0) return false;
    if (filterTab === 'empty' && subCount > 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchCode = a.code.toLowerCase().includes(q);
      const matchDesc = a.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchDesc) return false;
    }

    return true;
  });

  // 1. Buka Modal Tambah Tugas
  const handleOpenCreateModal = () => {
    const nextNum = assignments.length + 1;
    setFormCode(`TUGAS-0${nextNum}`);
    setFormTitle('');
    setFormDeadline('Hari Jumat, Pukul 20:00 WIB');
    setFormMaxScore(100);
    setFormDescription('');
    setShowCreateModal(true);
  };

  // 2. Submit Tambah Tugas (Create)
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newAssignment = {
      id: 'asg-' + Date.now(),
      code: formCode || `TUGAS-0${assignments.length + 1}`,
      title: formTitle,
      status: 'urgent',
      deadline: formDeadline || 'Jumat, 20:00 WIB',
      timeLeft: 'Sisa beberapa hari lagi',
      allowedTypes: ['Foto Buku / Gambar', 'Video / Rekaman Suara', 'PDF'],
      maxScore: Number(formMaxScore) || 100,
      description: formDescription || 'Kerjakan tugas dengan teliti dan kumpulkan sebelum batas waktu berakhir.',
      rubric: [
        { item: 'Kerapian Pengerjaan', weight: '50%' },
        { item: 'Kebenaran Jawaban', weight: '50%' }
      ],
      userSubmission: null
    };

    if (onAddAssignment) {
      onAddAssignment(newAssignment);
    }
    setShowCreateModal(false);
    setSelectedTaskId(newAssignment.id);
  };

  // 3. Buka Modal Edit Tugas (Update)
  const handleOpenEditModal = (taskItem) => {
    setEditingAssignment(taskItem);
    setFormCode(taskItem.code);
    setFormTitle(taskItem.title);
    setFormDeadline(taskItem.deadline);
    setFormMaxScore(taskItem.maxScore || 100);
    setFormDescription(taskItem.description);
  };

  // 4. Submit Edit Tugas (Update)
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingAssignment || !formTitle.trim()) return;

    const updated = {
      ...editingAssignment,
      code: formCode,
      title: formTitle,
      deadline: formDeadline,
      maxScore: Number(formMaxScore) || 100,
      description: formDescription
    };

    if (onUpdateAssignment) {
      onUpdateAssignment(updated);
    }
    setEditingAssignment(null);
  };

  // 5. Submit Hapus Tugas (Delete)
  const handleConfirmDelete = () => {
    if (!deletingAssignment) return;
    if (onDeleteAssignment) {
      onDeleteAssignment(deletingAssignment.id);
    }
    setDeletingAssignment(null);
  };

  // 6. Alur Pengumpulan Berkas (Dropzone)
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setSubmitPhase('idle');
    setProgress(0);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'mkv', 'avi'].includes(ext)) {
      return <VideoCamera size={44} weight="fill" className="text-blue-600" />;
    }
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      return <ImageIcon size={44} weight="fill" className="text-emerald-600" />;
    }
    if (['pdf'].includes(ext)) {
      return <FilePdf size={44} weight="fill" className="text-rose-600" />;
    }
    return <FileText size={44} weight="fill" className="text-slate-600" />;
  };

  const handleSubmit = async () => {
    if (!selectedFile || submitPhase !== 'idle' || !currentTask) return;

    setSubmitPhase('uploading');
    const fileSize = selectedFile.size || 5200000;

    const totalSteps = 15;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((r) => setTimeout(r, 70));
      const pct = Math.round((i / totalSteps) * 100);
      setProgress(pct);
      setUploadedBytes(Math.round((fileSize * i) / totalSteps));
    }

    setSubmitPhase('finalizing');
    await new Promise((r) => setTimeout(r, 400));

    const receiptData = {
      assignmentId: currentTask.id,
      assignmentTitle: currentTask.title,
      fileName: selectedFile.name,
      fileSize: (fileSize / (1024 * 1024)).toFixed(1) + ' MB',
      driveId: 'drive_sd_' + Math.random().toString(36).substring(2, 9),
      submittedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    setReceipt(receiptData);
    setSubmitPhase('success');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#ec4899']
      });
    } catch (e) {}

    if (onSubmissionSuccess) {
      onSubmissionSuccess(currentTask.id, receiptData);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSubmitPhase('idle');
    setProgress(0);
    setReceipt(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. Header Banner Manajemen Tugas PR */}
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
            {isTeacher ? 'Manajemen Tugas & Pekerjaan Rumah (PR)' : 'Kirimkan Pekerjaan Rumah (PR)'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isTeacher 
              ? 'Kelola instruksi tugas PR, batas waktu pengumpulan, pantau berkas yang dikumpulkan murid, dan buat tugas baru.'
              : 'Pilih tugas yang ingin kamu kumpulkan, lalu unggah foto buku tugas atau rekaman video penjelasanmu di sini.'}
          </p>
        </div>

        {/* Action Toggle & Add Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'list' ? 'submit' : 'list')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            {viewMode === 'list' ? (
              <>
                <Eye size={16} />
                <span>Buka Form Kumpulkan</span>
              </>
            ) : (
              <>
                <ArrowLeft size={16} />
                <span>Kembali ke Tabel Manajemen</span>
              </>
            )}
          </button>

          {isTeacher && (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus size={18} weight="bold" />
              <span>Buat Tugas Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. VIEW MODE: TABEL & MANAJEMEN CRUD TUGAS (LIST VIEW)   */}
      {/* ========================================================= */}
      {viewMode === 'list' ? (
        <div className="space-y-6">

          {/* A. 4 Kartu Statistik Tugas PR (AdminLTE Stats Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Tugas */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Tugas PR</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FileArrowUp size={18} weight="fill" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                {totalTasks}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tugas aktif di kelas ini</p>
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
                {pendingGrading}
              </p>
              <p className="text-[11px] text-rose-500 mt-0.5">Menunggu koreksi Bu Guru</p>
            </div>

            {/* Murid Mengumpulkan */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs bg-linear-to-b from-emerald-50/30 to-white">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
                <span>Berkas Dikumpulkan</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle size={18} weight="fill" />
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
                {totalSubmissions}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Kiriman tugas dari murid</p>
            </div>

            {/* Batas Waktu Terdekat */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Batas Waktu Terdekat</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Clock size={18} weight="bold" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-3 truncate font-mono">
                {nearestDeadline}
              </p>
              <p className="text-[11px] text-amber-600 mt-0.5 flex items-center gap-1 font-medium">
                Kumpulkan tepat waktu ya
              </p>
            </div>

          </div>

          {/* B. Filter & Pencarian Manajemen CRUD */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Tabs Filter Tugas */}
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
                  Semua Tugas ({totalTasks})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('submitted')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === 'submitted'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Ada Kiriman Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('empty')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === 'empty'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Belum Ada Kiriman
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari kode atau judul tugas PR..."
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

          {/* C. Tabel Rekap Manajemen Tugas (AdminLTE Light Style) */}
          <div className="academic-card rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Daftar Tugas & Pekerjaan Rumah (PR) Murid
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menampilkan {filteredAssignments.length} dari {totalTasks} tugas PR di kelas ini
                </p>
              </div>
            </div>

            {filteredAssignments.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FileArrowUp size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700">Tidak ada tugas ditemukan</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Coba sesuaikan filter atau buat tugas PR baru dengan tombol di atas.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Kode & Judul Tugas</th>
                      <th className="py-3 px-4">Batas Waktu Pengumpulan</th>
                      <th className="py-3 px-4">Nilai Maksimal</th>
                      <th className="py-3 px-4">Murid Mengumpulkan</th>
                      <th className="py-3 px-4 text-right">Aksi Kelola (CRUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAssignments.map((task) => {
                      const isSelected = task.id === currentTask?.id;
                      const submittedCount = submissions.filter(
                        (s) => s.assignmentTitle?.includes(task.title) || s.assignmentTitle?.includes(task.code)
                      ).length;

                      return (
                        <tr 
                          key={task.id} 
                          className={`transition-colors ${
                            isSelected ? 'bg-amber-50/40' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          
                          {/* 1. Kode & Judul Tugas */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                                <FileArrowUp size={20} weight="fill" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 leading-tight">
                                    {task.title}
                                  </span>
                                  {isSelected && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full">
                                      Terpilih
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-sm">
                                  <strong className="text-blue-700">{task.code}</strong> • {task.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* 2. Batas Waktu */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                              <Clock size={14} className="text-amber-600" />
                              <span>{task.deadline}</span>
                            </div>
                            <span className="inline-block mt-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.2 rounded border border-amber-200">
                              {task.timeLeft}
                            </span>
                          </td>

                          {/* 3. Nilai Maksimal */}
                          <td className="py-3.5 px-4 align-top">
                            <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                              {task.maxScore || 100} Poin
                            </span>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Kerapian 50% • Jawaban 50%
                            </p>
                          </td>

                          {/* 4. Murid Mengumpulkan */}
                          <td className="py-3.5 px-4 align-top">
                            {submittedCount > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                                <CheckCircle size={14} weight="fill" className="text-emerald-600" />
                                <span>{submittedCount} Murid Mengumpulkan</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                                Belum ada berkas
                              </span>
                            )}
                          </td>

                          {/* 5. Aksi Kelola (CRUD) */}
                          <td className="py-3.5 px-4 align-top text-right">
                            <div className="inline-flex items-center gap-1.5">
                              
                              {/* Tombol Kumpulkan / Buka Form */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTaskId(task.id);
                                  setViewMode('submit');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                              >
                                <span>{isTeacher ? 'Buka Form' : 'Kirim Tugas'}</span>
                                <ArrowRight size={14} weight="bold" />
                              </button>

                              {/* Tombol Edit Tugas (Guru) */}
                              {isTeacher && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(task)}
                                  title="Ubah Tugas PR"
                                  className="p-2 rounded-xl text-blue-700 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                                >
                                  <PencilSimple size={15} weight="bold" />
                                </button>
                              )}

                              {/* Tombol Hapus Tugas (Guru) */}
                              {isTeacher && (
                                <button
                                  type="button"
                                  onClick={() => setDeletingAssignment(task)}
                                  title="Hapus Tugas PR"
                                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                                >
                                  <Trash size={15} />
                                </button>
                              )}

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
        /* 3. VIEW MODE: FORM PENGUMPULAN TUGAS (DROPZONE)           */
        /* ========================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sisi Kiri: Petunjuk Tugas */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="academic-card rounded-2xl p-6 bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {currentTask?.code}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  {currentTask?.deadline}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {currentTask?.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {currentTask?.description}
                </p>
              </div>

              {/* Rubrik Penilaian Bu Guru */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold text-slate-700">Kriteria Penilaian Bu Guru:</p>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>1. Kerapian Buku Tulis & Kebersihan</span>
                    <strong className="text-slate-800">50%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Kebenaran Jawaban & Ketelitian</span>
                    <strong className="text-slate-800">50%</strong>
                  </div>
                </div>
              </div>

              {/* Format Berkas */}
              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Format yang dibolehkan:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    📷 Foto Buku Tulis (.jpg, .png)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    🎥 Video / Rekaman Suara (.mp4)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                    📄 Berkas PDF (.pdf)
                  </span>
                </div>
              </div>
            </div>

            {/* Selector Ganti Tugas */}
            <div className="academic-card rounded-2xl p-4 bg-white border border-slate-200 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Pilih Tugas Lain untuk Dikumpulkan:
              </label>
              <select
                value={currentTask?.id}
                onChange={(e) => {
                  setSelectedTaskId(e.target.value);
                  resetForm();
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:border-blue-600"
              >
                {assignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code}: {a.title}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Sisi Kanan: Area Unggah Berkas & Dropzone */}
          <div className="lg:col-span-7">
            <div className="academic-card rounded-2xl p-6 bg-white border border-slate-200 shadow-2xs space-y-5">
              
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Form Unggah Berkas Tugas
                  </h4>
                  <p className="text-xs text-slate-500">
                    Kirimkan pekerjaan rumahmu langsung ke Bu Guru Siti.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Google Drive Terhubung
                </span>
              </div>

              {submitPhase === 'success' && receipt ? (
                /* Sukses Pengumpulan */
                <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-4 animate-scale-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Check size={28} weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900">
                      Alhamdulillah, Tugas Berhasil Terkumpul! 🎉
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1">
                      Berkasmu telah tersimpan rapi dan siap diperiksa oleh Bu Guru.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-emerald-200/80 text-left text-xs space-y-2 font-mono text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5 font-sans">
                      <span className="text-slate-500">Nama Tugas:</span>
                      <strong className="text-slate-900">{receipt.assignmentTitle}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nama Berkas:</span>
                      <span className="text-slate-900 font-bold">{receipt.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ukuran & Waktu:</span>
                      <span>{receipt.fileSize} • {receipt.submittedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ID Tanda Terima:</span>
                      <span className="text-emerald-700 font-bold">{receipt.driveId}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Unggah Berkas Lain
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className="px-4 py-2 rounded-xl border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
                    >
                      Kembali ke Tabel Tugas
                    </button>
                  </div>
                </div>
              ) : (
                /* Dropzone Unggah */
                <div className="space-y-4">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50/60 ring-4 ring-blue-500/10'
                        : selectedFile
                        ? 'border-emerald-400 bg-emerald-50/30'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,video/*,.pdf"
                    />

                    {selectedFile ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          {getFileIcon(selectedFile.name)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap dikirimkan
                          </p>
                        </div>
                        <span className="inline-block text-xs text-blue-600 font-bold underline">
                          Klik untuk ganti file lain
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
                          <UploadSimple size={28} weight="bold" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Tarik & Lepas Foto Buku / Video Tugas ke Sini
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Atau <span className="text-blue-600 font-bold underline">klik untuk memilih dari komputermu</span>
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Bisa berupa foto lembar buku tulis, rekaman video, atau file PDF (Maks. 50 MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar saat Mengunggah */}
                  {submitPhase !== 'idle' && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>
                          {submitPhase === 'uploading' ? 'Mengunggah Berkas ke Google Drive...' : 'Memverifikasi Tanda Terima...'}
                        </span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-100 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tombol Kirim */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                      Tugas dikumpulkan atas nama: <strong className="text-slate-800">Muhammad Fathan</strong>
                    </p>

                    <button
                      type="button"
                      disabled={!selectedFile || submitPhase !== 'idle'}
                      onClick={handleSubmit}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                        !selectedFile || submitPhase !== 'idle'
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <Check size={16} weight="bold" />
                      <span>{submitPhase === 'idle' ? 'Kumpulkan Tugas Sekarang' : 'Mengirim Berkas...'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL FORM: TAMBAH TUGAS BARU (CREATE)                 */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FileArrowUp size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Buat Tugas PR Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Berikan instruksi tugas dan tenggat waktu pengumpulan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kode Tugas *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="TUGAS-02"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Judul Tugas PR *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Latihan Soal Pembagian Bersusun"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Batas Waktu Pengumpulan
                  </label>
                  <input
                    type="text"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    placeholder="Hari Jumat, 20:00 WIB"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nilai Maksimal
                  </label>
                  <input
                    type="number"
                    value={formMaxScore}
                    onChange={(e) => setFormMaxScore(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Petunjuk & Instruksi Tugas untuk Murid
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Jelaskan apa yang harus dikerjakan anak-anak dan cara mengumpulkannya..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={16} weight="bold" />
                  <span>Simpan Tugas Baru</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL FORM: EDIT TUGAS (UPDATE)                        */}
      {/* ========================================================= */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <PencilSimple size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Ubah Tugas PR
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perbarui judul tugas, batas waktu, atau instruksi.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAssignment(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kode Tugas *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Judul Tugas PR *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Batas Waktu Pengumpulan
                  </label>
                  <input
                    type="text"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nilai Maksimal
                  </label>
                  <input
                    type="number"
                    value={formMaxScore}
                    onChange={(e) => setFormMaxScore(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Petunjuk & Instruksi Tugas untuk Murid
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={16} weight="bold" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL KONFIRMASI HAPUS TUGAS (DELETE)                  */}
      {/* ========================================================= */}
      {deletingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash size={24} weight="bold" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Tugas PR Ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Bu Guru yakin ingin menghapus <strong>{deletingAssignment.title}</strong>? Tugas ini dan catatan pengumpulan terkait akan dihapus.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAssignment(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Ya, Hapus Tugas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
