import React, { useState } from 'react';
import { 
  CheckSquareOffset, 
  Eye, 
  FilePdf, 
  VideoCamera, 
  FileZip, 
  CheckCircle, 
  Check, 
  NotePencil, 
  ArrowClockwise,
  User,
  GraduationCap
} from '@phosphor-icons/react';

export default function Pilar4Evaluasi({ submissions, onUpdateGrade }) {
  const [selectedSubId, setSelectedSubId] = useState(submissions[0]?.id || 'sub-201');
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'ungraded' | 'graded'

  const currentSubmission = submissions.find((s) => s.id === selectedSubId) || submissions[0];

  const [inputScore, setInputScore] = useState(currentSubmission?.score ?? '');
  const [inputFeedback, setInputFeedback] = useState(currentSubmission?.feedback ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleSelectStudent = (sub) => {
    setSelectedSubId(sub.id);
    setInputScore(sub.score ?? '');
    setInputFeedback(sub.feedback ?? '');
    setSaveSuccessNotice(false);
  };

  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (inputScore === '' || inputScore < 0 || inputScore > 100) return;

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    onUpdateGrade(currentSubmission.id, {
      score: Number(inputScore),
      feedback: inputFeedback,
      evaluatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      gradeStatus: 'graded',
    });

    setIsSaving(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const filtered = submissions.filter((s) => {
    if (activeTabFilter === 'ungraded') return s.gradeStatus === 'ungraded';
    if (activeTabFilter === 'graded') return s.gradeStatus === 'graded';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Panel Guru */}
      <div className="academic-card rounded-xl p-5 border-t-4 border-t-purple-600 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1">
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              PANEL EVALUASI GURU & DOSEN
            </span>
            <span>•</span>
            <span className="text-slate-500">Pilar 4: Evaluasi Tanpa Unduh Berkas</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Penilaian Siswa & Pratinjau Berkas Tugas
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Guru dapat memutar video atau membaca berkas tugas langsung di peramban tanpa perlu mengunduh berkas ke memori komputer pribadi.
          </p>
        </div>

        {/* Filter Tab Submissions */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200">
          {[
            { id: 'all', label: `Semua (${submissions.length})` },
            { id: 'ungraded', label: `Perlu Dinilai (${submissions.filter(s => s.gradeStatus === 'ungraded').length})` },
            { id: 'graded', label: `Sudah Dinilai (${submissions.filter(s => s.gradeStatus === 'graded').length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveTabFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTabFilter === f.id
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Student Picker */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-3 min-w-max">
          {filtered.map((sub) => {
            const isSelected = sub.id === currentSubmission?.id;
            const isGraded = sub.gradeStatus === 'graded';

            return (
              <button
                key={sub.id}
                onClick={() => handleSelectStudent(sub)}
                className={`p-3 rounded-xl border text-left transition-all active:scale-98 flex items-center gap-3 ${
                  isSelected
                    ? 'bg-purple-50/80 border-purple-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {sub.studentName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {sub.studentName}
                    </span>
                    {isGraded ? (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {sub.score}/100
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                        Perlu Nilai
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    {sub.fileName} ({sub.fileSize})
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split-Screen Workspace */}
      {currentSubmission ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel (7 Cols): Embedded File Viewer */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">
                Pratinjau Berkas: {currentSubmission.fileName}
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Google Drive Embed Player
              </span>
            </div>

            {/* Embedded Screen */}
            <div className="academic-card rounded-xl overflow-hidden shadow-md">
              <div className="px-4 py-2.5 bg-slate-900 text-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-2">
                  {currentSubmission.fileType === 'MP4' ? (
                    <VideoCamera size={16} className="text-teal-400" />
                  ) : (
                    <FilePdf size={16} className="text-rose-400" />
                  )}
                  {currentSubmission.studentName} ({currentSubmission.nim})
                </span>
                <span className="font-mono text-[11px] text-emerald-400">
                  {currentSubmission.submissionStatus}
                </span>
              </div>

              <div className="p-6 bg-slate-950 text-slate-100 aspect-video flex flex-col items-center justify-center text-center space-y-3">
                {currentSubmission.fileType === 'MP4' ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-teal-600/80 text-white flex items-center justify-center shadow-lg">
                      <VideoCamera size={32} weight="fill" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">
                        {currentSubmission.fileName}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Ukuran: {currentSubmission.fileSize} • Diputar langsung dari Google Drive
                      </p>
                    </div>
                    <p className="text-xs text-teal-300 max-w-sm bg-teal-950/60 p-2 rounded-lg border border-teal-800">
                      Guru dapat memeriksa video penjelasan siswa tanpa harus mengunduh file 142 MB ke laptop/komputer.
                    </p>
                  </>
                ) : (
                  <div className="w-full h-full bg-white text-slate-800 p-5 rounded-lg text-left font-sans text-xs space-y-2">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <strong className="text-slate-900">{currentSubmission.fileName}</strong>
                      <span className="font-mono text-slate-500">Pratinjau PDF Online</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      "Laporan Praktikum Arsitektur Terdistribusi: Sistem berhasil menerapkan pengunggahan multi-format langsung ke Google Drive API. Mekanisme penguncian transaksi Cache::lock() berjalan efektif mencegah duplikasi data saat deadline."
                    </p>
                    <div className="p-2.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[11px]">
                      Drive File ID: <code>{currentSubmission.driveFileId}</code>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex justify-between text-[11px] text-slate-600">
                <span>Waktu Pengumpulan: <strong>{currentSubmission.submittedAt}</strong></span>
                <span className="text-emerald-700 font-semibold">Tersimpan di Google Drive Kampus</span>
              </div>
            </div>
          </div>

          {/* Right Panel (5 Cols): Form Penilaian Skor & Catatan Guru */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="academic-card rounded-xl p-5 border-t-4 border-t-purple-600 space-y-4">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <NotePencil size={18} className="text-purple-600" />
                    Form Evaluasi Nilai
                  </h3>
                  <p className="text-xs text-slate-500">
                    Siswa: <strong>{currentSubmission.studentName}</strong>
                  </p>
                </div>
                {currentSubmission.gradeStatus === 'graded' && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Dinilai: {currentSubmission.score}/100
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-4">
                
                {/* Score Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Masukkan Skor Angka (0 – 100):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputScore}
                      onChange={(e) => setInputScore(e.target.value)}
                      placeholder="Contoh: 90"
                      required
                      className="w-24 px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-lg text-purple-700 focus:outline-none focus:border-purple-600"
                    />

                    {/* Quick Score Chips */}
                    <div className="flex items-center gap-1 font-mono text-xs">
                      {[75, 85, 90, 95, 100].map((quick) => (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => setInputScore(quick)}
                          className={`px-2 py-1.5 rounded border font-bold transition-all ${
                            Number(inputScore) === quick
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {quick}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rubrik Checklist */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Checklist Penilaian Guru:
                  </span>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-0" />
                    <span>Kesesuaian dengan instruksi tugas (40%)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-0" />
                    <span>Ketepatan format dan kelengkapan (35%)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-0" />
                    <span>Kerapian dan usaha siswa (25%)</span>
                  </label>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Catatan & Ulasan Guru untuk Siswa:
                  </label>
                  <textarea
                    value={inputFeedback}
                    onChange={(e) => setInputFeedback(e.target.value)}
                    placeholder="Tuliskan catatan apresiasi atau saran perbaikan untuk siswa..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600 resize-none leading-relaxed"
                  />

                  {/* Template Quick Chips */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {[
                      "Pengerjaan sangat rapi dan lengkap.",
                      "Perhatikan format penamaan file tugas.",
                      "Bagus sekali, pertahankan!"
                    ].map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInputFeedback((prev) => prev ? prev + " " + tpl : tpl)}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        + {tpl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Grading Button */}
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    {saveSuccessNotice && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check size={14} weight="bold" /> Nilai Berhasil Disimpan & Diterbitkan!
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving || inputScore === ''}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs active:scale-98"
                  >
                    {isSaving ? (
                      <>
                        <ArrowClockwise size={16} className="animate-spin" />
                        <span>Menyimpan Nilai...</span>
                      </>
                    ) : (
                      <>
                        <CheckSquareOffset size={16} weight="bold" />
                        <span>Simpan & Terbitkan Nilai</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 academic-card rounded-xl">
          Belum ada data pengumpulan tugas mahasiswa.
        </div>
      )}

    </div>
  );
}
