import React, { useState, useRef } from 'react';
import { 
  Play, 
  FilePdf, 
  CheckCircle, 
  Circle, 
  ChatTeardropDots, 
  PaperPlaneTilt, 
  DownloadSimple, 
  VideoCamera,
  ChalkboardTeacher,
  Student,
  BookOpen,
  ShareNetwork,
  Clock,
  Plus,
  ArrowLeft,
  ArrowRight,
  PencilSimple,
  Trash,
  X,
  Sparkle,
  Eye,
  MagnifyingGlass,
  Check,
  TrendUp,
  FileText,
  UploadSimple
} from '@phosphor-icons/react';

export default function MateriView({ 
  activeClass, 
  currentMaterial, 
  onSelectMaterial,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  onAddComment, 
  onAddReply,
  currentRole 
}) {
  const isTeacher = currentRole === 'teacher';
  
  // 'list' (Tabel Manajemen CRUD) | 'detail' (Baca Materi & Diskusi)
  const [viewMode, setViewMode] = useState('list'); 
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'video' | 'pdf'
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // File Upload Refs & States
  const createVideoRef = useRef(null);
  const createPdfRef = useRef(null);
  const editVideoRef = useRef(null);
  const editPdfRef = useRef(null);

  const [createVideoFile, setCreateVideoFile] = useState(null); // { name, size, url }
  const [createPdfFile, setCreatePdfFile] = useState(null); // { name, size }
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [editPdfFile, setEditPdfFile] = useState(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deletingMaterial, setDeletingMaterial] = useState(null);

  // Form State (Tambah & Edit)
  const [formTitle, setFormTitle] = useState('');
  const [formSession, setFormSession] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formVideoTitle, setFormVideoTitle] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formPdfTitle, setFormPdfTitle] = useState('');

  // Comment State
  const [commentInput, setCommentInput] = useState('');
  const [replyInputId, setReplyInputId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const materials = activeClass?.materials || [];
  const mat = currentMaterial || materials[0];
  const comments = mat?.comments || [];

  // Hitung Statistik Materi
  const totalMaterials = materials.length;
  const totalVideos = materials.filter((m) => m.video?.title).length;
  const totalPdfs = materials.filter((m) => m.pdfDocument?.title).length;
  const totalComments = materials.reduce((acc, m) => acc + (m.comments?.length || 0), 0);

  // Filter Materials
  const filteredMaterials = materials.filter((m) => {
    if (filterTab === 'video' && !m.video?.title) return false;
    if (filterTab === 'pdf' && !m.pdfDocument?.title) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title?.toLowerCase().includes(q);
      const matchSession = m.sessionNumber?.toLowerCase().includes(q);
      const matchSummary = m.summary?.toLowerCase().includes(q);
      if (!matchTitle && !matchSession && !matchSummary) return false;
    }

    return true;
  });

  // File change handlers
  const handleCreateVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setCreateVideoFile({
        name: file.name,
        size: sizeMb,
        url: URL.createObjectURL(file)
      });
      if (!formVideoTitle) {
        setFormVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleCreatePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setCreatePdfFile({
        name: file.name,
        size: sizeMb
      });
      if (!formPdfTitle) {
        setFormPdfTitle(file.name);
      }
    }
  };

  const handleEditVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setEditVideoFile({
        name: file.name,
        size: sizeMb,
        url: URL.createObjectURL(file)
      });
      if (!formVideoTitle) {
        setFormVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleEditPdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setEditPdfFile({
        name: file.name,
        size: sizeMb
      });
      if (!formPdfTitle) {
        setFormPdfTitle(file.name);
      }
    }
  };

  // 1. Buka Modal Tambah Baru
  const handleOpenCreateModal = () => {
    setFormSession(`Pelajaran ${materials.length + 1}`);
    setFormTitle('');
    setFormSummary('');
    setFormVideoTitle('');
    setFormVideoUrl('');
    setFormPdfTitle('');
    setCreateVideoFile(null);
    setCreatePdfFile(null);
    setShowCreateModal(true);
  };

  // 2. Submit Tambah Materi (Create)
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newMat = {
      id: 'mat-' + Date.now(),
      sessionNumber: formSession || `Pelajaran ${materials.length + 1}`,
      title: formTitle,
      readingTime: '10 Menit Membaca',
      date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      summary: formSummary || 'Catatan bimbingan dari Bu Guru untuk dipelajari anak-anak di rumah.',
      video: createVideoFile || formVideoTitle ? {
        title: formVideoTitle || createVideoFile?.name || `Video Belajar: ${formTitle}`,
        duration: '12:00',
        quality: 'Video Kartun Edukasi',
        fileName: createVideoFile?.name || `${formTitle.replace(/\s+/g, '_')}.mp4`,
        fileSize: createVideoFile?.size || '15.2 MB',
        url: createVideoFile?.url || formVideoUrl || '#'
      } : {
        title: `Video Belajar: ${formTitle}`,
        duration: '10:00',
        quality: 'Video Kartun Edukasi',
        fileName: 'video_pelajaran.mp4',
        fileSize: '12.0 MB',
        url: '#'
      },
      pdfDocument: createPdfFile || formPdfTitle ? {
        title: formPdfTitle || createPdfFile?.name || `Buku-Modul-${(formSession || 'Pelajaran').replace(/\s+/g, '')}.pdf`,
        fileName: createPdfFile?.name || formPdfTitle,
        size: createPdfFile?.size || '2.5 MB',
        pages: 8
      } : {
        title: `Buku-Modul-${(formSession || 'Pelajaran').replace(/\s+/g, '')}.pdf`,
        fileName: 'modul_pelajaran.pdf',
        size: '1.8 MB',
        pages: 6
      },
      sections: [
        {
          heading: '1. Rangkuman Pelajaran',
          body: formSummary || 'Simak video pelajaran dan pelajari materi dengan penuh semangat ya!'
        }
      ],
      comments: []
    };

    if (onAddMaterial) {
      onAddMaterial(newMat);
    }
    setShowCreateModal(false);
  };

  // 3. Buka Modal Edit Materi (Update)
  const handleOpenEditModal = (item) => {
    setEditingMaterial(item);
    setFormSession(item.sessionNumber);
    setFormTitle(item.title);
    setFormSummary(item.summary || '');
    setFormVideoTitle(item.video?.title || '');
    setFormVideoUrl(item.video?.url || '');
    setFormPdfTitle(item.pdfDocument?.title || '');
    setEditVideoFile(item.video ? {
      name: item.video.fileName || item.video.title,
      size: item.video.fileSize || '15.0 MB',
      url: item.video.url
    } : null);
    setEditPdfFile(item.pdfDocument ? {
      name: item.pdfDocument.fileName || item.pdfDocument.title,
      size: item.pdfDocument.size || '2.5 MB'
    } : null);
  };

  // 4. Submit Edit Materi (Update)
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMaterial || !formTitle.trim()) return;

    const updated = {
      ...editingMaterial,
      sessionNumber: formSession,
      title: formTitle,
      summary: formSummary,
      video: editVideoFile || formVideoTitle ? {
        ...editingMaterial.video,
        title: formVideoTitle || editVideoFile?.name || editingMaterial.video?.title,
        fileName: editVideoFile?.name || editingMaterial.video?.fileName,
        fileSize: editVideoFile?.size || editingMaterial.video?.fileSize,
        url: editVideoFile?.url || formVideoUrl || editingMaterial.video?.url
      } : null,
      pdfDocument: editPdfFile || formPdfTitle ? {
        ...editingMaterial.pdfDocument,
        title: formPdfTitle || editPdfFile?.name || editingMaterial.pdfDocument?.title,
        fileName: editPdfFile?.name || editingMaterial.pdfDocument?.fileName,
        size: editPdfFile?.size || editingMaterial.pdfDocument?.size
      } : null
    };

    if (onUpdateMaterial) {
      onUpdateMaterial(updated);
    }
    setEditingMaterial(null);
  };

  // 5. Submit Hapus Materi (Delete)
  const handleConfirmDelete = () => {
    if (!deletingMaterial) return;
    if (onDeleteMaterial) {
      onDeleteMaterial(deletingMaterial.id);
    }
    setDeletingMaterial(null);
  };

  // 6. Submit Komentar Baru
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !mat) return;

    const newComment = {
      id: 'c-' + Date.now(),
      author: isTeacher ? 'Ibu Siti Rahmawati, S.Pd.' : 'Muhammad Fathan',
      role: isTeacher ? 'Guru Kelas SD' : 'Siswa Kelas 4-A',
      avatar: isTeacher ? 'SR' : 'MF',
      isTeacher: isTeacher,
      time: 'Baru saja',
      text: commentInput,
      replies: []
    };

    if (onAddComment) {
      onAddComment(mat.id, newComment);
    }
    setCommentInput('');
  };

  // 7. Submit Balasan Komentar
  const handleReplySubmit = (commentId) => {
    if (!replyText.trim() || !mat) return;

    const newReply = {
      id: 'r-' + Date.now(),
      author: isTeacher ? 'Ibu Siti Rahmawati, S.Pd.' : 'Muhammad Fathan',
      role: isTeacher ? 'Guru Kelas SD' : 'Siswa',
      avatar: isTeacher ? 'SR' : 'MF',
      isTeacher: isTeacher,
      time: 'Baru saja',
      text: replyText
    };

    if (onAddReply) {
      onAddReply(mat.id, commentId, newReply);
    }
    setReplyText('');
    setReplyInputId(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. Header Banner Manajemen Materi */}
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
            {isTeacher ? 'Manajemen Bahan Pelajaran & Materi Belajar' : 'Bahan Pelajaran & Video Edukasi'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isTeacher 
              ? 'Kelola modul materi pembelajaran, bagikan video animasi kartun, lampirkan buku bacaan PDF, dan jawab pertanyaan murid.'
              : 'Pelajari materi pelajaran, tonton video kartun seru dari Bu Guru, dan ajukan pertanyaan jika ada yang belum dipahami.'}
          </p>
        </div>

        {/* Action Toggle & Add Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'list' ? 'detail' : 'list')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            {viewMode === 'list' ? (
              <>
                <Eye size={16} />
                <span>Buka Pelajaran Terpilih</span>
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
              <span>Buat Pelajaran Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. VIEW MODE: TABEL & MANAJEMEN CRUD MATERI (LIST VIEW)   */}
      {/* ========================================================= */}
      {viewMode === 'list' ? (
        <div className="space-y-6">

          {/* A. 4 Kartu Statistik Materi (AdminLTE Stats Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Materi */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Bahan Pelajaran</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <BookOpen size={18} weight="fill" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                {totalMaterials}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Modul aktif di kelas ini</p>
            </div>

            {/* Video Edukasi */}
            <div className="p-4 rounded-2xl bg-white border border-indigo-200/80 shadow-2xs bg-linear-to-b from-indigo-50/30 to-white">
              <div className="flex items-center justify-between text-indigo-700 text-xs font-bold">
                <span>Video Kartun/Animasi</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <VideoCamera size={18} weight="bold" />
                </div>
              </div>
              <p className="text-2xl font-bold text-indigo-700 mt-2 font-mono">
                {totalVideos}
              </p>
              <p className="text-[11px] text-indigo-500 mt-0.5">Media video pembelajaran</p>
            </div>

            {/* Buku PDF */}
            <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-2xs bg-linear-to-b from-rose-50/30 to-white">
              <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
                <span>Buku Modul PDF</span>
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <FilePdf size={18} weight="bold" />
                </div>
              </div>
              <p className="text-2xl font-bold text-rose-700 mt-2 font-mono">
                {totalPdfs}
              </p>
              <p className="text-[11px] text-rose-500 mt-0.5">Lembar bacaan materi</p>
            </div>

            {/* Diskusi Tanya Jawab */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs bg-linear-to-b from-emerald-50/30 to-white">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
                <span>Tanya Jawab Murid</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ChatTeardropDots size={18} weight="fill" />
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
                {totalComments}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1 font-medium">
                Pertanyaan & diskusi aktif
              </p>
            </div>

          </div>

          {/* B. Filter & Pencarian Manajemen CRUD */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Tabs Filter Materi */}
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
                  Semua Pelajaran ({totalMaterials})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('video')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === 'video'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Ada Video ({totalVideos})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('pdf')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterTab === 'pdf'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Ada Buku PDF ({totalPdfs})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari judul pelajaran atau materi..."
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

          {/* C. Tabel Rekap Manajemen Materi (AdminLTE Light Style) */}
          <div className="academic-card rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Daftar Bahan Pelajaran & Modul Belajar
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menampilkan {filteredMaterials.length} dari {totalMaterials} materi di kelas ini
                </p>
              </div>
            </div>

            {filteredMaterials.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <BookOpen size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700">Tidak ada materi ditemukan</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Coba ganti filter atau buat bahan pelajaran baru dengan menekan tombol di atas.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Sesi & Judul Pelajaran</th>
                      <th className="py-3 px-4">Lampiran Media Belajar</th>
                      <th className="py-3 px-4">Diskusi Murid</th>
                      <th className="py-3 px-4">Status Modul</th>
                      <th className="py-3 px-4 text-right">Aksi Kelola (CRUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMaterials.map((item) => {
                      const isSelected = item.id === mat?.id;

                      return (
                        <tr 
                          key={item.id} 
                          className={`transition-colors ${
                            isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          
                          {/* 1. Sesi & Judul */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                                <BookOpen size={20} weight="fill" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 leading-tight">
                                    {item.title}
                                  </span>
                                  {isSelected && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.2 rounded-full">
                                      Terpilih
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {item.sessionNumber} • {item.date} • {item.readingTime}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* 2. Lampiran Media */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {item.video?.title && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200">
                                  <VideoCamera size={13} weight="fill" /> Video Kartun ({item.video.duration})
                                </span>
                              )}
                              {item.pdfDocument?.title && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200">
                                  <FilePdf size={13} weight="fill" /> Buku PDF ({item.pdfDocument.size})
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-xs">
                              {item.summary}
                            </p>
                          </td>

                          {/* 3. Diskusi Murid */}
                          <td className="py-3.5 px-4 align-top">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                              <ChatTeardropDots size={14} weight="fill" className="text-emerald-600" />
                              <span>{item.comments?.length || 0} Pertanyaan</span>
                            </span>
                          </td>

                          {/* 4. Status Modul */}
                          <td className="py-3.5 px-4 align-top">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                              <CheckCircle size={14} weight="fill" /> Tersedia
                            </span>
                          </td>

                          {/* 5. Aksi Kelola (CRUD) */}
                          <td className="py-3.5 px-4 align-top text-right">
                            <div className="inline-flex items-center gap-1.5">
                              
                              {/* Tombol Buka Materi Pelajaran */}
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectMaterial(item);
                                  setViewMode('detail');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                              >
                                <span>Buka Pelajaran</span>
                                <ArrowRight size={14} weight="bold" />
                              </button>

                              {/* Tombol Edit Materi (Guru) */}
                              {isTeacher && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(item)}
                                  title="Ubah Bahan Pelajaran"
                                  className="p-2 rounded-xl text-blue-700 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                                >
                                  <PencilSimple size={15} weight="bold" />
                                </button>
                              )}

                              {/* Tombol Hapus Materi (Guru) */}
                              {isTeacher && (
                                <button
                                  type="button"
                                  onClick={() => setDeletingMaterial(item)}
                                  title="Hapus Bahan Pelajaran"
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
        /* 3. VIEW MODE: DETAIL BACA PELAJARAN, VIDEO & DISKUSI     */
        /* ========================================================= */
        <div className="space-y-6">
          
          {/* Bar Sesi & Penyelesaian */}
          <div className="academic-card rounded-2xl p-5 bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {mat?.sessionNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {mat?.date} • {mat?.readingTime}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCompleted(!isCompleted)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <CheckCircle size={16} weight={isCompleted ? 'fill' : 'regular'} />
              <span>{isCompleted ? 'Pelajaran Selesai Dipelajari ✓' : 'Tandai Sudah Selesai Membaca'}</span>
            </button>
          </div>

          {/* Area Video Edukasi & Dokumen Modul */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pemutar Video Edukasi */}
            <div className="lg:col-span-2 academic-card rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs flex flex-col">
              <div className="aspect-video bg-slate-900 relative flex items-center justify-center text-white overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent z-10" />
                
                {/* Visual Video Pelajaran SD */}
                <div className="text-center z-20 space-y-3 px-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                    <Play size={28} weight="fill" className="ml-1" />
                  </div>
                  <div>
                    <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full text-white backdrop-blur-xs">
                      {mat?.video?.quality || 'Video Kartun Edukasi'}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold mt-1 text-white">
                      {mat?.video?.title || mat?.title}
                    </h4>
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-xs text-slate-300">
                  <span>Durasi: {mat?.video?.duration || '10:00 Menit'}</span>
                  <span>Tersimpan di Cloud Sekolah</span>
                </div>
              </div>

              <div className="p-5 flex-1 space-y-3">
                <h3 className="font-bold text-slate-900 text-base">
                  {mat?.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {mat?.summary}
                </p>
              </div>
            </div>

            {/* Berkas Modul PDF Belajar */}
            <div className="academic-card rounded-2xl p-5 bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <FilePdf size={16} className="text-rose-600" />
                  <span>Modul Bahan Bacaan PDF</span>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-slate-800 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
                      <FilePdf size={22} weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {mat?.pdfDocument?.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {mat?.pdfDocument?.size} • {mat?.pdfDocument?.pages} Halaman
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Unduh atau baca modul ini bersama orang tua di rumah sebagai panduan belajar ceria.
                </p>
              </div>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Mengunduh berkas: ${mat?.pdfDocument?.title}`);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Unduh Modul PDF</span>
              </a>
            </div>

          </div>

          {/* Area Diskusi & Tanya Jawab Murid */}
          <div className="academic-card rounded-2xl p-6 bg-white border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <ChatTeardropDots size={22} className="text-blue-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Ruang Diskusi & Tanya Bu Guru
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ada materi yang belum dipahami? Tanyakan di sini ya nak!
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {comments.length} Pertanyaan
              </span>
            </div>

            {/* Input Komentar Baru */}
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {isTeacher ? 'SR' : 'MF'}
                </div>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={isTeacher ? "Tuliskan arahan atau pengumuman pelajaran untuk murid..." : "Ketik pertanyaanmu untuk Bu Guru di sini..."}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <PaperPlaneTilt size={14} weight="fill" />
                      <span>Kirim Pertanyaan</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* List Pertanyaan & Balasan */}
            <div className="space-y-3.5 pt-2">
              {comments.map((comm) => (
                <div key={comm.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        comm.isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {comm.avatar}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900">{comm.author}</span>
                        <span className="text-[10px] text-slate-500 ml-1.5 font-medium">({comm.role})</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{comm.time}</span>
                  </div>

                  <p className="text-xs text-slate-700 pl-9 leading-relaxed">
                    {comm.text}
                  </p>

                  {/* Tombol Balas */}
                  <div className="pl-9 pt-1">
                    <button
                      type="button"
                      onClick={() => setReplyInputId(replyInputId === comm.id ? null : comm.id)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {replyInputId === comm.id ? 'Batal Balas' : 'Balas Pertanyaan Ini'}
                    </button>
                  </div>

                  {/* Form Balas */}
                  {replyInputId === comm.id && (
                    <div className="pl-9 pt-2 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Tulis jawaban atau tanggapan..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleReplySubmit(comm.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                      >
                        Kirim
                      </button>
                    </div>
                  )}

                  {/* Thread Balasan */}
                  {comm.replies && comm.replies.length > 0 && (
                    <div className="pl-9 pt-2 space-y-2 border-t border-slate-200/60 mt-2">
                      {comm.replies.map((rep) => (
                        <div key={rep.id} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            rep.isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {rep.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">{rep.author}</span>
                              <span className="text-[10px] text-slate-400">({rep.time})</span>
                            </div>
                            <p className="text-xs text-slate-700 mt-0.5">{rep.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL FORM: TAMBAH PELAJARAN BARU (CREATE)             */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <BookOpen size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Tambah Bahan Pelajaran Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi judul modul ajar dan media pembelajaran.
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
                    Sesi / Urutan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSession}
                    onChange={(e) => setFormSession(e.target.value)}
                    placeholder="Pelajaran 4"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Judul Bahan Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Operasi Hitung Pembagian Ceria"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ringkasan & Catatan Bu Guru
                </label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Tuliskan petunjuk singkat atau rangkuman materi..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              {/* Area Upload Video & Dokumen PDF */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                
                {/* Upload Video */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <VideoCamera size={16} className="text-blue-600" />
                    <span>Upload Video Pelajaran</span>
                  </label>

                  <input
                    ref={createVideoRef}
                    type="file"
                    accept="video/*"
                    onChange={handleCreateVideoChange}
                    className="hidden"
                  />

                  {createVideoFile ? (
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <VideoCamera size={16} weight="fill" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {createVideoFile.name}
                            </p>
                            <p className="text-[10px] text-blue-700 font-semibold">
                              {createVideoFile.size} • Siap diunggah
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCreateVideoFile(null);
                            if (createVideoRef.current) createVideoRef.current.value = '';
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Hapus Video"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => createVideoRef.current?.click()}
                        className="w-full py-1 px-2 text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-100/60 rounded-lg border border-blue-200 transition-colors cursor-pointer text-center"
                      >
                        Ganti Berkas Video
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => createVideoRef.current?.click()}
                      className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-center transition-all cursor-pointer space-y-1"
                    >
                      <UploadSimple size={20} className="mx-auto text-blue-600" />
                      <p className="text-xs font-bold text-slate-700">Pilih Berkas Video</p>
                      <p className="text-[10px] text-slate-400">MP4, MOV, MKV (Maks. 200MB)</p>
                    </button>
                  )}

                  <input
                    type="text"
                    value={formVideoTitle}
                    onChange={(e) => setFormVideoTitle(e.target.value)}
                    placeholder="Judul Video Pelajaran (Opsional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Upload Dokumen PDF */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FilePdf size={16} className="text-rose-600" />
                    <span>Upload Buku Modul PDF</span>
                  </label>

                  <input
                    ref={createPdfRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCreatePdfChange}
                    className="hidden"
                  />

                  {createPdfFile ? (
                    <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                            <FilePdf size={16} weight="fill" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {createPdfFile.name}
                            </p>
                            <p className="text-[10px] text-rose-700 font-semibold">
                              {createPdfFile.size} • Siap diunggah
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCreatePdfFile(null);
                            if (createPdfRef.current) createPdfRef.current.value = '';
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Hapus PDF"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => createPdfRef.current?.click()}
                        className="w-full py-1 px-2 text-[11px] font-bold text-rose-700 bg-white hover:bg-rose-100/60 rounded-lg border border-rose-200 transition-colors cursor-pointer text-center"
                      >
                        Ganti Berkas PDF
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => createPdfRef.current?.click()}
                      className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-rose-400 hover:bg-rose-50/40 text-center transition-all cursor-pointer space-y-1"
                    >
                      <UploadSimple size={20} className="mx-auto text-rose-600" />
                      <p className="text-xs font-bold text-slate-700">Pilih Berkas PDF</p>
                      <p className="text-[10px] text-slate-400">PDF Modul/Buku Ajar</p>
                    </button>
                  )}

                  <input
                    type="text"
                    value={formPdfTitle}
                    onChange={(e) => setFormPdfTitle(e.target.value)}
                    placeholder="Nama Dokumen PDF (Opsional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-600"
                  />
                </div>

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
                  <span>Simpan Pelajaran</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL FORM: EDIT PELAJARAN (UPDATE)                    */}
      {/* ========================================================= */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <PencilSimple size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Ubah Bahan Pelajaran
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perbarui judul, ringkasan, atau berkas materi.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMaterial(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sesi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSession}
                    onChange={(e) => setFormSession(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Judul Bahan Pelajaran *
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

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ringkasan & Catatan Bu Guru
                </label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              {/* Area Upload Video & Dokumen PDF di Modal Edit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                
                {/* Upload Video (Edit) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <VideoCamera size={16} className="text-blue-600" />
                    <span>Upload Video Pelajaran</span>
                  </label>

                  <input
                    ref={editVideoRef}
                    type="file"
                    accept="video/*"
                    onChange={handleEditVideoChange}
                    className="hidden"
                  />

                  {editVideoFile ? (
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <VideoCamera size={16} weight="fill" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {editVideoFile.name}
                            </p>
                            <p className="text-[10px] text-blue-700 font-semibold">
                              {editVideoFile.size} • Berkas Terpasang
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditVideoFile(null);
                            if (editVideoRef.current) editVideoRef.current.value = '';
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Hapus Video"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => editVideoRef.current?.click()}
                        className="w-full py-1 px-2 text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-100/60 rounded-lg border border-blue-200 transition-colors cursor-pointer text-center"
                      >
                        Ganti Berkas Video
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => editVideoRef.current?.click()}
                      className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-center transition-all cursor-pointer space-y-1"
                    >
                      <UploadSimple size={20} className="mx-auto text-blue-600" />
                      <p className="text-xs font-bold text-slate-700">Pilih Berkas Video</p>
                      <p className="text-[10px] text-slate-400">MP4, MOV, MKV (Maks. 200MB)</p>
                    </button>
                  )}

                  <input
                    type="text"
                    value={formVideoTitle}
                    onChange={(e) => setFormVideoTitle(e.target.value)}
                    placeholder="Judul Video Pelajaran (Opsional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Upload Dokumen PDF (Edit) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FilePdf size={16} className="text-rose-600" />
                    <span>Upload Buku Modul PDF</span>
                  </label>

                  <input
                    ref={editPdfRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleEditPdfChange}
                    className="hidden"
                  />

                  {editPdfFile ? (
                    <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                            <FilePdf size={16} weight="fill" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {editPdfFile.name}
                            </p>
                            <p className="text-[10px] text-rose-700 font-semibold">
                              {editPdfFile.size} • Berkas Terpasang
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditPdfFile(null);
                            if (editPdfRef.current) editPdfRef.current.value = '';
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Hapus PDF"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => editPdfRef.current?.click()}
                        className="w-full py-1 px-2 text-[11px] font-bold text-rose-700 bg-white hover:bg-rose-100/60 rounded-lg border border-rose-200 transition-colors cursor-pointer text-center"
                      >
                        Ganti Berkas PDF
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => editPdfRef.current?.click()}
                      className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-rose-400 hover:bg-rose-50/40 text-center transition-all cursor-pointer space-y-1"
                    >
                      <UploadSimple size={20} className="mx-auto text-rose-600" />
                      <p className="text-xs font-bold text-slate-700">Pilih Berkas PDF</p>
                      <p className="text-[10px] text-slate-400">PDF Modul/Buku Ajar</p>
                    </button>
                  )}

                  <input
                    type="text"
                    value={formPdfTitle}
                    onChange={(e) => setFormPdfTitle(e.target.value)}
                    placeholder="Nama Dokumen PDF (Opsional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-600"
                  />
                </div>

              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
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
      {/* 6. MODAL KONFIRMASI HAPUS PELAJARAN (DELETE)              */}
      {/* ========================================================= */}
      {deletingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash size={24} weight="bold" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Bahan Pelajaran Ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Bu Guru yakin ingin menghapus materi <strong>{deletingMaterial.title}</strong>? Berkas dan forum diskusi di materi ini akan dihapus.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMaterial(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Ya, Hapus Materi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
