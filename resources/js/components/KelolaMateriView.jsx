import React, { useState } from 'react';
import { 
  BookOpenText, 
  Plus, 
  VideoCamera, 
  FilePdf, 
  ChatTeardropDots, 
  Trash, 
  PencilSimple, 
  ArrowRight, 
  CalendarCheck, 
  DownloadSimple, 
  Check, 
  X,
  ShareNetwork,
  Clock,
  Sparkle
} from '@phosphor-icons/react';

export default function KelolaMateriView({
  activeClass,
  materials,
  onAddMaterial,
  onDeleteMaterial,
  onOpenMaterial,
  currentRole
}) {
  const isTeacher = currentRole === 'teacher';
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [sessionNumber, setSessionNumber] = useState(`Pertemuan 0${materials.length + 1}`);
  const [readingTime, setReadingTime] = useState('15 Menit Baca');
  const [summary, setSummary] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfSize, setPdfSize] = useState('2.5 MB');

  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sessionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMaterial = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMat = {
      id: 'mat-' + Date.now(),
      sessionNumber: sessionNumber || `Pertemuan 0${materials.length + 1}`,
      title: title,
      readingTime: readingTime || '15 Menit Baca',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      summary: summary || 'Bahan ajar materi perkuliahan untuk dipelajari mahasiswa secara mandiri.',
      video: {
        title: videoTitle || `Penjelasan Materi ${title}`,
        duration: '20:00',
        quality: '1080p HD',
        url: videoUrl || 'https://youtube.com'
      },
      pdfDocument: {
        title: pdfTitle || `Modul-${sessionNumber.replace(/\s+/g, '')}.pdf`,
        size: pdfSize || '2.4 MB',
        pages: 12
      },
      sections: [
        {
          heading: '1. Pokok Pembahasan Utama',
          body: summary || 'Pastikan mempelajari ringkasan materi dan mengunduh berkas modul terlampir sebelum batas akhir pengerjaan tugas.'
        }
      ],
      comments: []
    };

    onAddMaterial(newMat);
    setShowAddModal(false);

    // Reset Form
    setTitle('');
    setSummary('');
    setVideoTitle('');
    setVideoUrl('');
    setPdfTitle('');
  };

  const totalVideos = materials.filter((m) => m.video?.title).length;
  const totalPdfs = materials.filter((m) => m.pdfDocument?.title).length;
  const totalComments = materials.reduce((acc, m) => acc + (m.comments?.length || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. Header Banner & Stats */}
      <div className="academic-card rounded-xl p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <span className="font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {activeClass.code}
              </span>
              <span>•</span>
              <span className="text-slate-500 font-medium">{activeClass.section}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Kelola Bahan Ajar & Materi Kuliah
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Mata Kuliah: <strong className="text-slate-800">{activeClass.title}</strong>
            </p>
          </div>

          {isTeacher && (
            <button
              type="button"
              onClick={() => {
                setSessionNumber(`Pertemuan 0${materials.length + 1}`);
                setShowAddModal(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <Plus size={18} weight="bold" />
              <span>Tambah Materi Baru</span>
            </button>
          )}
        </div>

        {/* Quick Stats Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <BookOpenText size={18} weight="fill" />
            </div>
            <div>
              <p className="text-slate-500 text-[11px]">Total Materi</p>
              <p className="font-bold text-slate-900 font-mono text-sm">{materials.length} Pertemuan</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <VideoCamera size={18} weight="fill" />
            </div>
            <div>
              <p className="text-slate-500 text-[11px]">Video Embed</p>
              <p className="font-bold text-slate-900 font-mono text-sm">{totalVideos} Rekaman</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <FilePdf size={18} weight="fill" />
            </div>
            <div>
              <p className="text-slate-500 text-[11px]">Modul PDF</p>
              <p className="font-bold text-slate-900 font-mono text-sm">{totalPdfs} Dokumen</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ChatTeardropDots size={18} weight="fill" />
            </div>
            <div>
              <p className="text-slate-500 text-[11px]">Tanya Jawab</p>
              <p className="font-bold text-slate-900 font-mono text-sm">{totalComments} Diskusi</p>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari materi atau pertemuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:border-blue-600"
          />
        </div>
        <p className="text-xs text-slate-500 self-start sm:self-auto">
          Menampilkan {filteredMaterials.length} dari {materials.length} materi
        </p>
      </div>

      {/* 3. List Materi */}
      <div className="space-y-3.5">
        {filteredMaterials.map((mat, idx) => (
          <div
            key={mat.id}
            className="academic-card rounded-xl p-5 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left Content */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {mat.sessionNumber}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock size={14} /> {mat.readingTime}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{mat.date}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {mat.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                {mat.summary}
              </p>

              {/* Attachments Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {mat.video?.title && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                    <VideoCamera size={14} className="text-blue-600" />
                    <span>{mat.video.duration} Video</span>
                  </span>
                )}
                {mat.pdfDocument?.title && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                    <FilePdf size={14} className="text-rose-600" />
                    <span>{mat.pdfDocument.size} PDF</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                  <ChatTeardropDots size={14} className="text-emerald-600" />
                  <span>{mat.comments?.length || 0} Pertanyaan</span>
                </span>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 md:border-l md:border-slate-100 md:pl-5">
              <button
                type="button"
                onClick={() => onOpenMaterial(mat)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Buka Materi</span>
                <ArrowRight size={14} weight="bold" />
              </button>

              {isTeacher && (
                <button
                  type="button"
                  onClick={() => onDeleteMaterial(mat.id)}
                  title="Hapus Materi"
                  className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash size={16} />
                </button>
              )}
            </div>

          </div>
        ))}

        {filteredMaterials.length === 0 && (
          <div className="academic-card rounded-xl p-8 bg-white text-center space-y-2">
            <BookOpenText size={32} className="mx-auto text-slate-400" />
            <p className="text-sm font-bold text-slate-800">Belum Ada Materi</p>
            <p className="text-xs text-slate-500">
              {searchQuery
                ? 'Tidak ada materi yang sesuai dengan kata kunci pencarian.'
                : 'Klik tombol "+ Tambah Materi Baru" untuk membagikan bahan ajar ke mahasiswa.'}
            </p>
          </div>
        )}
      </div>

      {/* 4. Modal Tambah Materi Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <BookOpenText size={18} weight="fill" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Tambah Bahan Ajar Materi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kelas: {activeClass.code} — {activeClass.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sesi / Pertemuan *
                  </label>
                  <input
                    type="text"
                    required
                    value={sessionNumber}
                    onChange={(e) => setSessionNumber(e.target.value)}
                    placeholder="Contoh: Pertemuan 05"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimasi Waktu Baca
                  </label>
                  <input
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="Contoh: 15 Menit Baca"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Materi Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Arsitektur Client-Server & Direct Upload Google Drive"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan / Catatan Penjelasan Dosen *
                </label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tuliskan poin penting dan arahan belajar bagi mahasiswa..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              {/* Video Embed Section */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <VideoCamera size={16} className="text-blue-600" />
                  <span>Sematkan Video Penjelasan (YouTube / Drive URL)</span>
                </div>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Judul Video (misal: Rekaman Kuliah Sesi 5)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                />
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="URL Video (YouTube / Google Drive / Loom)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                />
              </div>

              {/* PDF Document Section */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <FilePdf size={16} className="text-rose-600" />
                  <span>Lampirkan Modul PDF / Bahan Bacaan</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    placeholder="Nama File (Modul-05.pdf)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                  <input
                    type="text"
                    value={pdfSize}
                    onChange={(e) => setPdfSize(e.target.value)}
                    placeholder="Ukuran File (misal: 2.5 MB)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                >
                  Publikasikan Materi
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
