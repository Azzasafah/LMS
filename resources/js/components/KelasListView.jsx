import React, { useState } from 'react';
import { 
  Chalkboard, 
  Users, 
  BookOpenText, 
  FileArrowUp, 
  Plus, 
  ArrowRight, 
  Check, 
  X, 
  PencilSimple, 
  Trash, 
  Clock, 
  MagnifyingGlass, 
  ChalkboardTeacher, 
  TrendUp,
  FolderSimple,
  Printer
} from '@phosphor-icons/react';

export default function KelasListView({
  classes = [],
  currentClassId,
  onSelectClass,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  currentRole
}) {
  const isTeacher = currentRole === 'teacher';

  // Filter & Search State
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'kelas4' | 'kelas5'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSection, setFormSection] = useState('Kelas 4 SD • Semester 1');
  const [formSchedule, setFormSchedule] = useState('Senin - Jumat, 07:30 - 12:00 WIB');
  const [formRoom, setFormRoom] = useState('Ruang Kelas 4');
  const [formTotalStudents, setFormTotalStudents] = useState(28);
  const [formDescription, setFormDescription] = useState('');

  // Hitung Statistik Kelas
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((acc, c) => acc + Number(c.totalStudents || 0), 0);
  const totalMaterials = classes.reduce((acc, c) => acc + (c.materials?.length || 0), 0);
  const totalPendingGrading = classes.reduce((acc, c) => {
    const pending = (c.submissions || []).filter((s) => s.gradeStatus !== 'graded' || s.score === null).length;
    return acc + pending;
  }, 0);

  // Filter Kelas Berdasarkan Tab & Pencarian
  const filteredClasses = classes.filter((cls) => {
    if (filterTab === 'kelas4' && !cls.title.toLowerCase().includes('kelas 4') && !cls.section.toLowerCase().includes('kelas 4')) {
      return false;
    }
    if (filterTab === 'kelas5' && !cls.title.toLowerCase().includes('kelas 5') && !cls.section.toLowerCase().includes('kelas 5')) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = cls.title?.toLowerCase().includes(q);
      const matchCode = cls.code?.toLowerCase().includes(q);
      const matchTeacher = cls.teacherName?.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchTeacher) return false;
    }

    return true;
  });

  // 1. Buka Modal Tambah Kelas Baru
  const handleOpenAddModal = () => {
    const nextNum = classes.length + 1;
    setFormTitle(`Kelas 4-${String.fromCharCode(65 + classes.length)}`);
    setFormSection('Kelas 4 SD • Semester 1');
    setFormSchedule('Senin - Jumat, 07:30 - 12:00 WIB');
    setFormRoom(`Ruang Kelas 4.${nextNum}`);
    setFormTotalStudents(28);
    setFormDescription('Ruang belajar kelas yang ceria, aktif, dan menyenangkan.');
    setShowAddModal(true);
  };

  // 2. Submit Tambah Kelas Baru (Create)
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newClass = {
      id: 'cls-' + Date.now(),
      code: 'KELAS-' + (classes.length + 1),
      title: formTitle,
      section: formSection || 'Tingkat SD • Semester 1',
      teacherName: 'Ibu Siti Rahmawati, S.Pd.',
      schedule: formSchedule || 'Senin - Jumat, 07:30 - 12:00 WIB',
      room: formRoom || 'Ruang Kelas',
      totalStudents: Number(formTotalStudents) || 28,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      themeColor: 'emerald',
      description: formDescription || 'Ruang belajar kelas yang ceria dan menyenangkan.',
      materials: [
        {
          id: 'mat-' + Date.now(),
          sessionNumber: 'Pelajaran 1',
          title: 'Pengenalan & Semangat Belajar Bersama',
          readingTime: '5 Menit Membaca',
          date: 'Hari Ini',
          summary: 'Selamat datang anak-anak hebat di kelas kita! Mari belajar dengan gembira dan saling tolong-menolong.',
          video: {
            title: 'Video Pengantar Kelas ' + formTitle,
            duration: '08:00',
            quality: 'Video Kartun Edukasi',
            url: '#'
          },
          pdfDocument: {
            title: 'Jadwal-Pelajaran-dan-Buku.pdf',
            size: '1.2 MB',
            pages: 4
          },
          sections: [
            {
              heading: '1. Semangat Belajar',
              body: 'Mari kita mulai kegiatan belajar dengan membaca doa dan menyiapkan buku tulis dengan rapi.'
            }
          ],
          comments: []
        }
      ],
      assignments: [],
      submissions: []
    };

    if (onAddClass) {
      onAddClass(newClass);
    }
    setShowAddModal(false);
  };

  // 3. Buka Modal Edit Kelas (Update)
  const handleOpenEditModal = (cls) => {
    setEditingClass(cls);
    setFormTitle(cls.title);
    setFormSection(cls.section);
    setFormSchedule(cls.schedule || 'Senin - Jumat, 07:30 - 12:00 WIB');
    setFormRoom(cls.room || 'Ruang Kelas');
    setFormTotalStudents(cls.totalStudents || 28);
    setFormDescription(cls.description || '');
  };

  // 4. Submit Edit Kelas (Update)
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingClass || !formTitle.trim()) return;

    const updated = {
      ...editingClass,
      title: formTitle,
      section: formSection,
      schedule: formSchedule,
      room: formRoom,
      totalStudents: Number(formTotalStudents) || 28,
      description: formDescription
    };

    if (onUpdateClass) {
      onUpdateClass(updated);
    }
    setEditingClass(null);
  };

  // 5. Submit Hapus Kelas (Delete)
  const handleConfirmDelete = () => {
    if (!deletingClass) return;
    if (onDeleteClass) {
      onDeleteClass(deletingClass.id);
    }
    setDeletingClass(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. Header Banner Manajemen Kelas */}
      <div className="academic-card rounded-2xl p-5 sm:p-6 bg-white border border-slate-200 shadow-2xs border-t-4 border-t-blue-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200">
              Tahun Ajaran 2026/2027
            </span>
            <span>•</span>
            <span className="text-slate-500">Tingkat Sekolah Dasar (SD) • Semester 1</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isTeacher ? 'Manajemen Daftar Kelas & Rombongan Belajar' : 'Pilihan Ruang Kelas Belajar'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isTeacher 
              ? 'Kelola rombongan belajar yang Ibu/Bapak ajar, pantau keaktifan siswa, bagikan modul materi, dan periksa kiriman tugas anak-anak.'
              : 'Pilih kelas belajarmu untuk melihat materi pelajaran, video kartun, dan mengumpulkan foto buku pekerjaan rumah.'}
          </p>
        </div>

        {/* Tombol Buat Kelas Baru (Guru) */}
        {isTeacher && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus size={18} weight="bold" />
              <span>Buat Kelas Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Kartu Statistik Kelas (AdminLTE Stats Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Kelas */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Kelas Saya</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ChalkboardTeacher size={18} weight="fill" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            {totalClasses}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Rombongan belajar aktif</p>
        </div>

        {/* Perlu Dinilai */}
        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-2xs bg-linear-to-b from-rose-50/30 to-white">
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
            <span>Tugas Perlu Dinilai</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Clock size={18} weight="bold" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2 font-mono">
            {totalPendingGrading}
          </p>
          <p className="text-[11px] text-rose-500 mt-0.5">Menunggu koreksi guru</p>
        </div>

        {/* Total Murid */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs bg-linear-to-b from-emerald-50/30 to-white">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>Total Siswa Terdaftar</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Users size={18} weight="fill" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
            {totalStudents}
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Anak aktif belajar</p>
        </div>

        {/* Total Bahan Pelajaran */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Bahan Pelajaran</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <BookOpenText size={18} weight="bold" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            {totalMaterials}
          </p>
          <p className="text-[11px] text-amber-600 mt-0.5 flex items-center gap-1 font-medium">
            Modul materi pembelajaran
          </p>
        </div>

      </div>

      {/* 3. Filter & Pencarian Manajemen CRUD */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Tabs Filter Kelas */}
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
              Semua Kelas ({totalClasses})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('kelas4')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterTab === 'kelas4'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Tingkat Kelas 4
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('kelas5')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterTab === 'kelas5'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Tingkat Kelas 5
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama kelas atau wali kelas..."
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

      {/* 4. Tabel Rekap Manajemen Kelas (AdminLTE Light Style) */}
      <div className="academic-card rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Daftar Kelas yang Diampu Guru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredClasses.length} dari {totalClasses} kelas terdaftar
            </p>
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Chalkboard size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700">Tidak ada kelas ditemukan</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba ganti kata kunci pencarian atau buat kelas baru dengan menekan tombol di atas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Kelas & Kode</th>
                  <th className="py-3 px-4">Wali Kelas & Jadwal</th>
                  <th className="py-3 px-4">Siswa & Materi</th>
                  <th className="py-3 px-4">Status Koreksi</th>
                  <th className="py-3 px-4 text-right">Aksi Kelola (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClasses.map((cls) => {
                  const isActive = cls.id === currentClassId;
                  const pendingGradingCount = (cls.submissions || []).filter(
                    (s) => s.gradeStatus !== 'graded' || s.score === null
                  ).length;

                  return (
                    <tr 
                      key={cls.id} 
                      className={`transition-colors ${
                        isActive ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      
                      {/* 1. Kelas & Kode */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs ${
                            isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                          }`}>
                            <Chalkboard size={20} weight="fill" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 leading-tight">
                                {cls.title}
                              </span>
                              {isActive && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.2 rounded-full">
                                  <Check size={11} weight="bold" /> Dibuka
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {cls.code} • {cls.section}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Wali Kelas & Jadwal */}
                      <td className="py-3.5 px-4 align-top">
                        <p className="font-semibold text-slate-800 leading-tight">
                          {cls.teacherName || 'Ibu Siti Rahmawati, S.Pd.'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {cls.schedule} • {cls.room}
                        </p>
                      </td>

                      {/* 3. Siswa & Materi */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                            <Users size={13} /> {cls.totalStudents} Siswa
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-100">
                            <BookOpenText size={13} /> {cls.materials?.length || 0} Materi
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {cls.assignments?.length || 0} Tugas PR diberikan
                        </p>
                      </td>

                      {/* 4. Status Koreksi */}
                      <td className="py-3.5 px-4 align-top">
                        {pendingGradingCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                            <Clock size={13} weight="bold" /> {pendingGradingCount} Perlu Nilai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                            <Check size={13} weight="bold" /> Semua Dinilai
                          </span>
                        )}
                      </td>

                      {/* 5. Aksi Kelola (CRUD) */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="inline-flex items-center gap-1.5">
                          
                          {/* Masuk / Buka Kelas */}
                          <button
                            type="button"
                            onClick={() => onSelectClass(cls.id, 'materi')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                            <span>{isActive ? 'Buka Pelajaran' : 'Pilih Kelas'}</span>
                            <ArrowRight size={14} weight="bold" />
                          </button>

                          {/* Tombol Edit Kelas (Guru) */}
                          {isTeacher && (
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(cls)}
                              title="Ubah Data Kelas"
                              className="p-2 rounded-xl text-blue-700 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                            >
                              <PencilSimple size={15} weight="bold" />
                            </button>
                          )}

                          {/* Tombol Hapus Kelas (Guru) */}
                          {isTeacher && classes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setDeletingClass(cls)}
                              title="Hapus Kelas"
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

      {/* ========================================================= */}
      {/* 5. MODAL FORM: TAMBAH KELAS BARU (CREATE)                 */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Chalkboard size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Buat Ruang Kelas Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi nama dan jadwal kelas untuk mulai mengajar.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Kelas *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Kelas 4-C (Al-Farabi)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tingkat & Semester
                  </label>
                  <input
                    type="text"
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    placeholder="Kelas 4 SD • Semester 1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Jumlah Murid
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formTotalStudents}
                    onChange={(e) => setFormTotalStudents(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Jadwal Belajar
                  </label>
                  <input
                    type="text"
                    value={formSchedule}
                    onChange={(e) => setFormSchedule(e.target.value)}
                    placeholder="Senin - Jumat, 07:30 WIB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ruang Kelas
                  </label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="Ruang 4.2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Keterangan / Sapaan Kelas
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Tuliskan sapaan hangat atau fokus pembelajaran kelas ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={16} weight="bold" />
                  <span>Simpan Kelas Baru</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL FORM: EDIT KELAS (UPDATE)                        */}
      {/* ========================================================= */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <PencilSimple size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Ubah Data Kelas
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perbarui informasi nama, jadwal, dan ruang kelas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Kelas *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tingkat & Semester
                  </label>
                  <input
                    type="text"
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Jumlah Murid
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formTotalStudents}
                    onChange={(e) => setFormTotalStudents(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Jadwal Belajar
                  </label>
                  <input
                    type="text"
                    value={formSchedule}
                    onChange={(e) => setFormSchedule(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ruang Kelas
                  </label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Keterangan / Sapaan Kelas
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
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
      {/* 7. MODAL KONFIRMASI HAPUS KELAS (DELETE)                  */}
      {/* ========================================================= */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash size={24} weight="bold" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Kelas Ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Bu Guru yakin ingin menghapus <strong>{deletingClass.title}</strong>? Seluruh data materi dan tugas di kelas ini akan dihapus dari sistem.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingClass(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Ya, Hapus Kelas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
