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
  Printer,
  UserPlus,
  Student,
  GenderMale,
  GenderFemale,
  Phone,
  IdentificationCard,
  Sparkle,
  Info
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

  // Modal State Kelas
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);

  // Student Management State
  const [managingStudentsClass, setManagingStudentsClass] = useState(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [studentAlert, setStudentAlert] = useState(null);

  // Form State Siswa Baru
  const [formStudentName, setFormStudentName] = useState('');
  const [formStudentNisn, setFormStudentNisn] = useState('');
  const [formStudentAbsen, setFormStudentAbsen] = useState('01');
  const [formStudentGender, setFormStudentGender] = useState('Laki-laki');
  const [formStudentGuardian, setFormStudentGuardian] = useState('');
  const [formStudentPhone, setFormStudentPhone] = useState('');

  // Form State Kelas Baru / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formSection, setFormSection] = useState('Kelas 4 SD • Semester 1');
  const [formSchedule, setFormSchedule] = useState('Senin - Jumat, 07:30 - 12:00 WIB');
  const [formRoom, setFormRoom] = useState('Ruang Kelas 4');
  const [formTotalStudents, setFormTotalStudents] = useState(28);
  const [formDescription, setFormDescription] = useState('');

  // Hitung Statistik Kelas
  const totalClasses = classes.length;
  const totalStudents = classes.reduce(
    (acc, c) => acc + (c.students ? c.students.length : Number(c.totalStudents || 0)), 
    0
  );
  const totalMaterials = classes.reduce((acc, c) => acc + (c.materials?.length || 0), 0);
  const totalPendingGrading = classes.reduce((acc, c) => {
    const pending = (c.submissions || []).filter((s) => s.gradeStatus !== 'graded' || s.score === null).length;
    return acc + pending;
  }, 0);

  // Sinkronkan data kelas yang sedang dikelola muridnya dengan props classes terbaru
  const activeManagingClass = managingStudentsClass 
    ? classes.find((c) => c.id === managingStudentsClass.id) || managingStudentsClass 
    : null;

  // Data murid kelas yang sedang dikelola
  const classStudents = activeManagingClass ? (activeManagingClass.students || []) : [];
  const maleCount = classStudents.filter((s) => s.gender === 'Laki-laki').length;
  const femaleCount = classStudents.filter((s) => s.gender === 'Perempuan').length;
  const filteredStudents = classStudents.filter((std) => {
    if (!studentSearchQuery.trim()) return true;
    const q = studentSearchQuery.toLowerCase();
    return (
      std.name?.toLowerCase().includes(q) ||
      std.nisn?.toLowerCase().includes(q) ||
      std.absen?.toString().includes(q) ||
      std.guardian?.toLowerCase().includes(q)
    );
  });

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

    const initialTotal = Number(formTotalStudents) || 0;
    const newClass = {
      id: 'cls-' + Date.now(),
      code: 'KELAS-' + (classes.length + 1),
      title: formTitle,
      section: formSection || 'Tingkat SD • Semester 1',
      teacherName: 'Ibu Siti Rahmawati, S.Pd.',
      schedule: formSchedule || 'Senin - Jumat, 07:30 - 12:00 WIB',
      room: formRoom || 'Ruang Kelas',
      totalStudents: initialTotal,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      themeColor: 'emerald',
      description: formDescription || 'Ruang belajar kelas yang ceria dan menyenangkan.',
      students: [],
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
    setFormTotalStudents(cls.students ? cls.students.length : (cls.totalStudents || 28));
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
      totalStudents: editingClass.students ? editingClass.students.length : (Number(formTotalStudents) || 28),
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

  // 6. Kelola Murid Kelas Handlers
  const handleOpenStudentsModal = (cls) => {
    setManagingStudentsClass(cls);
    setStudentSearchQuery('');
    setShowAddStudentModal(false);
    setDeletingStudent(null);
    setStudentAlert(null);
  };

  const handleOpenAddStudentModal = () => {
    if (!activeManagingClass) return;
    const currentList = activeManagingClass.students || [];
    const nextAbsen = String(currentList.length + 1).padStart(2, '0');
    setFormStudentName('');
    setFormStudentNisn(`0014${Math.floor(100000 + Math.random() * 900000)}`);
    setFormStudentAbsen(nextAbsen);
    setFormStudentGender('Laki-laki');
    setFormStudentGuardian('');
    setFormStudentPhone('08');
    setShowAddStudentModal(true);
  };

  const handleCreateStudentSubmit = (e) => {
    e.preventDefault();
    if (!activeManagingClass || !formStudentName.trim()) return;

    const newStudent = {
      id: 'std-' + Date.now(),
      name: formStudentName.trim(),
      nisn: formStudentNisn.trim() || `0014${Math.floor(100000 + Math.random() * 900000)}`,
      absen: formStudentAbsen.trim() || String((activeManagingClass.students?.length || 0) + 1).padStart(2, '0'),
      gender: formStudentGender,
      guardian: formStudentGuardian.trim() || 'Orang Tua / Wali',
      phone: formStudentPhone.trim() || '-',
      joinedDate: 'Hari Ini',
      status: 'Aktif'
    };

    const currentList = activeManagingClass.students || [];
    const updatedStudents = [...currentList, newStudent];
    const updatedClass = {
      ...activeManagingClass,
      students: updatedStudents,
      totalStudents: updatedStudents.length
    };

    if (onUpdateClass) {
      onUpdateClass(updatedClass);
    }
    setManagingStudentsClass(updatedClass);
    setShowAddStudentModal(false);
    setStudentAlert({
      type: 'success',
      message: `Alhamdulillah! Murid "${newStudent.name}" berhasil didaftarkan ke ${activeManagingClass.title}.`
    });
    setTimeout(() => setStudentAlert(null), 4000);
  };

  const handleConfirmDeleteStudent = () => {
    if (!activeManagingClass || !deletingStudent) return;

    const updatedStudents = (activeManagingClass.students || []).filter(
      (s) => s.id !== deletingStudent.id
    );
    const updatedClass = {
      ...activeManagingClass,
      students: updatedStudents,
      totalStudents: updatedStudents.length
    };

    if (onUpdateClass) {
      onUpdateClass(updatedClass);
    }
    setManagingStudentsClass(updatedClass);
    setDeletingStudent(null);
    setStudentAlert({
      type: 'info',
      message: `Murid "${deletingStudent.name}" telah dikeluarkan dari daftar kelas.`
    });
    setTimeout(() => setStudentAlert(null), 4000);
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
                          <button
                            type="button"
                            onClick={() => handleOpenStudentsModal(cls)}
                            title="Klik untuk melihat & mengelola daftar murid kelas ini"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group"
                          >
                            <Users size={13} weight="bold" className="text-emerald-700 group-hover:scale-110 transition-transform" />
                            <span>{cls.students ? cls.students.length : (cls.totalStudents || 0)} Siswa</span>
                            <span className="text-[10px] bg-white text-emerald-700 px-1 py-0.2 rounded border border-emerald-200 font-semibold">
                              Kelola
                            </span>
                          </button>
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

                          {/* Tombol Kelola & Tambah Murid (Guru) */}
                          {isTeacher && (
                            <button
                              type="button"
                              onClick={() => handleOpenStudentsModal(cls)}
                              title="Lihat & Tambah Murid Kelas Ini"
                              className="px-2.5 py-1.5 rounded-xl text-emerald-800 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                              <UserPlus size={15} weight="bold" />
                              <span className="hidden xl:inline">Kelola Murid</span>
                            </button>
                          )}

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

      {/* ========================================================= */}
      {/* 8. MODAL KELOLA & DAFTAR MURID KELAS                      */}
      {/* ========================================================= */}
      {activeManagingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-scale-in">
            
            {/* Header Modal */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Users size={24} weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      {activeManagingClass.code}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Daftar Murid: {activeManagingClass.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Wali Kelas: {activeManagingClass.teacherName || 'Ibu Siti Rahmawati, S.Pd.'} • {activeManagingClass.room}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setManagingStudentsClass(null);
                  setShowAddStudentModal(false);
                  setDeletingStudent(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Tutup Jendela"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sub-Header: Ringkasan & Aksi Tambah Murid */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-white space-y-3 shrink-0">
              
              {/* Alert Notification */}
              {studentAlert && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 animate-fade-in ${
                  studentAlert.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Sparkle size={16} weight="fill" className="text-emerald-600 shrink-0" />
                    <span>{studentAlert.message}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setStudentAlert(null)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Badge Stats */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                    <Student size={16} className="text-slate-500" />
                    Total: <strong className="text-slate-900">{classStudents.length} Siswa</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5">
                    <GenderMale size={16} className="text-blue-600" />
                    Laki-laki: <strong>{maleCount}</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-800 border border-pink-200 flex items-center gap-1.5">
                    <GenderFemale size={16} className="text-pink-600" />
                    Perempuan: <strong>{femaleCount}</strong>
                  </span>
                </div>

                {/* Tombol Tambah Murid Baru */}
                {isTeacher && (
                  <button
                    type="button"
                    onClick={handleOpenAddStudentModal}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <UserPlus size={16} weight="bold" />
                    <span>+ Tambah Murid Baru</span>
                  </button>
                )}
              </div>

              {/* Bar Pencarian Murid */}
              <div className="relative">
                <MagnifyingGlass size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari murid berdasarkan nama lengkap, NISN, atau no absen..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                />
                {studentSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setStudentSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

            </div>

            {/* Isi Tabel Daftar Murid (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
              {filteredStudents.length === 0 ? (
                <div className="p-10 text-center space-y-3 bg-white rounded-2xl border border-dashed border-slate-300">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Users size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {studentSearchQuery ? 'Tidak ada murid yang cocok dengan kata kunci' : 'Belum ada murid di kelas ini'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {studentSearchQuery 
                      ? `Hasil pencarian "${studentSearchQuery}" tidak ditemukan. Coba gunakan nama lain.` 
                      : 'Yuk klik tombol "+ Tambah Murid Baru" di atas untuk mulai mendaftarkan siswa ke kelas ini.'}
                  </p>
                  {isTeacher && !studentSearchQuery && (
                    <button
                      type="button"
                      onClick={handleOpenAddStudentModal}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                    >
                      <UserPlus size={16} weight="bold" />
                      <span>Tambah Murid Sekarang</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-3.5 w-16 text-center">Absen</th>
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4 hidden sm:table-cell">NISN / No. Induk</th>
                        <th className="py-3 px-4 text-center">Jenis Kelamin</th>
                        <th className="py-3 px-4 hidden md:table-cell">Orang Tua / Kontak</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        {isTeacher && <th className="py-3 px-4 text-right">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((std, idx) => {
                        const isBoy = std.gender === 'Laki-laki';
                        const initial = std.name?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'SD';

                        return (
                          <tr key={std.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            
                            {/* No Absen */}
                            <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-600">
                              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                                #{std.absen || String(idx + 1).padStart(2, '0')}
                              </span>
                            </td>

                            {/* Nama Siswa & Avatar */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 border ${
                                  isBoy 
                                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                    : 'bg-pink-100 text-pink-700 border-pink-200'
                                }`}>
                                  {initial}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 leading-tight">
                                    {std.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400 sm:hidden">
                                    NISN: {std.nisn || '-'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* NISN */}
                            <td className="py-3 px-4 hidden sm:table-cell font-mono text-slate-700">
                              <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px]">
                                {std.nisn || '-'}
                              </span>
                            </td>

                            {/* Jenis Kelamin */}
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                isBoy
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-pink-50 text-pink-700 border border-pink-200'
                              }`}>
                                {isBoy ? <GenderMale size={13} weight="bold" /> : <GenderFemale size={13} weight="bold" />}
                                <span>{isBoy ? 'Laki-laki' : 'Perempuan'}</span>
                              </span>
                            </td>

                            {/* Orang Tua & Kontak */}
                            <td className="py-3 px-4 hidden md:table-cell text-slate-600">
                              <p className="font-medium text-slate-800 text-[11px]">
                                {std.guardian || 'Orang Tua Murid'}
                              </p>
                              {std.phone && std.phone !== '-' && (
                                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Phone size={11} /> {std.phone}
                                </p>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>Aktif</span>
                              </span>
                            </td>

                            {/* Aksi Hapus */}
                            {isTeacher && (
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setDeletingStudent(std)}
                                  title="Keluarkan murid dari kelas ini"
                                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                  <Trash size={15} />
                                </button>
                              </td>
                            )}

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Menampilkan <strong>{filteredStudents.length}</strong> murid terdaftar
              </span>
              <button
                type="button"
                onClick={() => {
                  setManagingStudentsClass(null);
                  setShowAddStudentModal(false);
                  setDeletingStudent(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. MODAL FORM: TAMBAH MURID BARU KE KELAS                 */}
      {/* ========================================================= */}
      {showAddStudentModal && activeManagingClass && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UserPlus size={22} weight="bold" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Tambah Murid Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftarkan siswa baru ke {activeManagingClass.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="space-y-3.5">
              
              {/* Nama Lengkap Siswa */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={formStudentName}
                  onChange={(e) => setFormStudentName(e.target.value)}
                  placeholder="Contoh: Muhammad Zaidan Al-Farisi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* No. Absen & NISN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nomor Absen *
                  </label>
                  <input
                    type="text"
                    required
                    value={formStudentAbsen}
                    onChange={(e) => setFormStudentAbsen(e.target.value)}
                    placeholder="Contoh: 11"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    NISN / No. Induk
                  </label>
                  <input
                    type="text"
                    value={formStudentNisn}
                    onChange={(e) => setFormStudentNisn(e.target.value)}
                    placeholder="0014298115"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Jenis Kelamin *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormStudentGender('Laki-laki')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formStudentGender === 'Laki-laki'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <GenderMale size={16} weight="bold" />
                    <span>Laki-laki (Ikhwan)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormStudentGender('Perempuan')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formStudentGender === 'Perempuan'
                        ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <GenderFemale size={16} weight="bold" />
                    <span>Perempuan (Akhwat)</span>
                  </button>
                </div>
              </div>

              {/* Data Wali / Orang Tua */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={formStudentGuardian}
                    onChange={(e) => setFormStudentGuardian(e.target.value)}
                    placeholder="Bpk. Hendra"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    No. WhatsApp Wali
                  </label>
                  <input
                    type="text"
                    value={formStudentPhone}
                    onChange={(e) => setFormStudentPhone(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={16} weight="bold" />
                  <span>Daftarkan Siswa</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. MODAL KONFIRMASI HAPUS MURID DARI KELAS              */}
      {/* ========================================================= */}
      {deletingStudent && activeManagingClass && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash size={24} weight="bold" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Keluarkan Murid dari Kelas?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Bu Guru yakin ingin mengeluarkan <strong>{deletingStudent.name}</strong> dari <strong>{activeManagingClass.title}</strong>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStudent}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Ya, Keluarkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
