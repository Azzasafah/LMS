import React, { useState } from 'react';
import { 
  Play, 
  FilePdf, 
  CheckCircle, 
  Circle, 
  ChatTeardropDots, 
  PaperPlaneTilt, 
  Clock, 
  BookOpen, 
  DownloadSimple, 
  ShieldCheck, 
  ChalkboardTeacher,
  Student,
  Info,
  ThumbsUp,
  VideoCamera
} from '@phosphor-icons/react';

export default function Pilar1Materi({ data, onAddComment, onAddReply }) {
  const [activeMediaTab, setActiveMediaTab] = useState('video'); // 'video' | 'pdf'
  const [isCompleted, setIsCompleted] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    onAddComment({
      id: 'c-' + Date.now(),
      author: 'Farhan Maulana',
      nim: '2209106012',
      role: 'student',
      time: 'Baru saja',
      text: newCommentText,
      replies: []
    });
    setNewCommentText('');
  };

  const handleSubmitReply = (commentId) => {
    if (!replyText.trim()) return;

    onAddReply(commentId, {
      id: 'rep-' + Date.now(),
      author: 'Farhan Maulana',
      nim: '2209106012',
      role: 'student',
      time: 'Baru saja',
      text: replyText
    });
    setReplyText('');
    setReplyOpenId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Card: Course Overview & Completion Button */}
      <div className="academic-card rounded-xl p-5 border-t-4 border-t-blue-600 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {data.course.code}
            </span>
            <span>{data.course.semester}</span>
            <span>•</span>
            <span className="text-slate-500 font-normal">{data.material.readingTime}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {data.material.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Dosen Pengampu: <strong className="text-slate-800">{data.course.lecturer.name}</strong> ({data.course.lecturer.title})
          </p>
        </div>

        {/* Mark Completed Button */}
        <button
          type="button"
          onClick={() => setIsCompleted(!isCompleted)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-98 ${
            isCompleted
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle size={18} weight="fill" />
              <span>Sudah Selesai Dipelajari</span>
            </>
          ) : (
            <>
              <Circle size={18} />
              <span>Tandai Selesai Dipelajari</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Media Viewer (Left) & Thread Diskusi (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 Cols): Player Video / PDF & Rangkuman Materi */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Media Player Card */}
          <div className="academic-card rounded-xl overflow-hidden">
            
            {/* Header Tabs: Video vs PDF */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMediaTab === 'video'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <VideoCamera size={16} weight="fill" />
                  <span>Video Penjelasan Dosen</span>
                  <span className="font-mono text-[11px] opacity-80">(32 Menit)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaTab('pdf')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMediaTab === 'pdf'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <FilePdf size={16} weight="fill" />
                  <span>Baca Dokumen PDF</span>
                  <span className="font-mono text-[11px] opacity-80">(14 Halaman)</span>
                </button>
              </div>

              {activeMediaTab === 'video' && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-[11px] font-medium">Kecepatan:</span>
                  {['1.0x', '1.25x', '1.5x'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        playbackSpeed === s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Viewer Screen */}
            <div className="p-4 bg-slate-900 text-slate-100 aspect-video relative flex flex-col justify-between">
              {activeMediaTab === 'video' ? (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="px-2 py-0.5 rounded bg-blue-900/80 text-blue-300 font-semibold border border-blue-700">
                      STREAM VIDEO FULL HD (1080P)
                    </span>
                    <span>Durasi: 32:15</span>
                  </div>

                  {/* Play Button Simulation */}
                  <div className="flex flex-col items-center justify-center my-auto cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition-transform">
                      <Play size={28} weight="fill" className="ml-1" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-200 text-center max-w-md">
                      {data.material.video.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Klik untuk memulai pemutaran video kuliah
                    </p>
                  </div>

                  {/* Scrubber Timeline */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-blue-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>10:45 / 32:15</span>
                      <span className="text-emerald-400">Hemat Kuota: Video Langsung Google Drive</span>
                    </div>
                  </div>
                </>
              ) : (
                /* PDF Reader Simulation */
                <div className="w-full h-full bg-white text-slate-800 p-6 overflow-y-auto rounded-lg">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <FilePdf size={24} className="text-rose-600" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{data.material.pdfDocument.title}</h4>
                        <p className="text-xs text-slate-500">{data.material.pdfDocument.size} • 14 Halaman Lengkap</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs">
                      <DownloadSimple size={15} weight="bold" />
                      <span>Unduh PDF</span>
                    </button>
                  </div>

                  <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    <p className="font-bold text-slate-900">Bab 1: Pengenalan Protokol Direct Resumable Upload</p>
                    <p>
                      Sistem pembelajaran ini mengadopsi teknik unggah berkas langsung ke Google Drive API. Ketika mahasiswa menekan tombol pengumpulan berkas, browser akan membuat koneksi langsung dengan Google Cloud Storage.
                    </p>
                    <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs text-slate-800">
                      <strong>Manfaat Utama untuk Kampus:</strong> Server kampus dengan ruang 5 GB (seperti pada hosting DomCloud) tetap aman dan tidak akan kehabisan memori atau ruang disk walau ratusan mahasiswa mengunggah video tugas serentak.
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Rangkuman Materi Tertulis */}
          <div className="academic-card rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Rangkuman & Poin Penting Materi
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {data.material.summary}
              </p>
            </div>

            <div className="space-y-3">
              {data.material.sections.map((sec, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs sm:text-sm font-bold text-blue-900">
                    {sec.heading}
                  </h4>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Arsitektur Info Box */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
              <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Proteksi Anti-Macet & Anti-Klik Ganda:</strong>
                <p className="mt-0.5 text-blue-800 leading-relaxed">
                  Pada controller Laravel backend, sistem menggunakan penguncian <code>Cache::lock()</code> sehingga bila mahasiswa menekan tombol berkali-kali saat mendekati batas waktu, hanya 1 transaksi yang diproses secara aman.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right (4 Cols): Forum Diskusi & Tanya Jawab */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="academic-card rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChatTeardropDots size={20} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Forum Tanya Jawab Materi
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {data.comments.length} Pertanyaan
              </span>
            </div>

            {/* Input Pertanyaan Baru */}
            <form onSubmit={handleSubmitComment} className="space-y-2">
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Ajukan pertanyaan materi kepada dosen atau teman sekelas..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <PaperPlaneTilt size={14} weight="bold" />
                  <span>Kirim Pertanyaan</span>
                </button>
              </div>
            </form>

            {/* Daftar Utas Diskusi */}
            <div className="space-y-4 pt-2 border-t border-slate-100 divide-y divide-slate-100">
              {data.comments.map((comment) => (
                <div key={comment.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                      {comment.author.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {comment.author}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>

                  <div className="pl-10 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setReplyOpenId(replyOpenId === comment.id ? null : comment.id)}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      {replyOpenId === comment.id ? 'Batal Balas' : 'Balas Pertanyaan'}
                    </button>
                  </div>

                  {/* Input Balasan */}
                  {replyOpenId === comment.id && (
                    <div className="pl-10 pt-2 space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Tulis balasan untuk ${comment.author}...`}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleSubmitReply(comment.id)}
                          className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                        >
                          Kirim Balasan
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Balasan dari Dosen / Teman */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-10 pt-2 space-y-2">
                      {comment.replies.map((rep) => (
                        <div key={rep.id} className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                              {rep.author}
                              {rep.role === 'teacher' && (
                                <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                                  Dosen Pengampu
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {rep.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {rep.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
