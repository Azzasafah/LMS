import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { INITIAL_CLASSES, INITIAL_USER } from './data/mockData';
import Sidebar from './components/Sidebar';
import KelasListView from './components/KelasListView';
import MateriView from './components/MateriView';
import TugasUploadView from './components/TugasUploadView';
import NilaiEvaluasiView from './components/NilaiEvaluasiView';
import LoginPage from './components/LoginPage';
import { 
  List, 
  Chalkboard, 
  GraduationCap, 
  Student, 
  ChalkboardTeacher,
  BookOpenText,
  FileArrowUp,
  CheckSquareOffset,
  SquaresFour,
  CaretDown,
  Star,
  Plus
} from '@phosphor-icons/react';

export function App() {
  // Auth State (null jika belum login -> tampilkan LoginPage)
  const [currentUser, setCurrentUser] = useState({
    role: 'teacher',
    name: 'Ibu Siti Rahmawati, S.Pd.',
    avatar: 'SR',
    title: 'Guru Kelas SD & Wali Kelas 4-A',
  });

  const [currentRole, setCurrentRole] = useState('teacher'); // 'teacher' | 'student'
  const [activeTab, setActiveTab] = useState('kelas'); // 'kelas' | 'materi' | 'tugas' | 'evaluasi'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTopClassDropdownOpen, setIsTopClassDropdownOpen] = useState(false);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setCurrentRole(userData.role);
    if (userData.role === 'teacher') {
      setActiveTab('kelas');
    } else {
      setActiveTab('materi');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Multi-Class State
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [currentClassId, setCurrentClassId] = useState(INITIAL_CLASSES[0]?.id || 'cls-01');

  // Kelas yang sedang dibuka
  const activeClass = classes.find((c) => c.id === currentClassId) || classes[0];

  // Materi yang sedang dibuka di kelas aktif
  const [selectedMaterialId, setSelectedMaterialId] = useState(activeClass?.materials[0]?.id || null);
  const currentMaterial = activeClass?.materials.find((m) => m.id === selectedMaterialId) || activeClass?.materials[0];

  // 1. Ganti Kelas Aktif
  const handleSelectClass = (classId, targetTab = null) => {
    setCurrentClassId(classId);
    const targetClass = classes.find((c) => c.id === classId);
    if (targetClass && targetClass.materials.length > 0) {
      setSelectedMaterialId(targetClass.materials[0].id);
    } else {
      setSelectedMaterialId(null);
    }
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  // 2. Buat Kelas Baru (Guru SD)
  const handleAddClass = (newClass) => {
    setClasses((prev) => [newClass, ...prev]);
    setCurrentClassId(newClass.id);
    if (newClass.materials.length > 0) {
      setSelectedMaterialId(newClass.materials[0].id);
    }
  };

  // 2b. Ubah Kelas (CRUD)
  const handleUpdateClass = (updatedClass) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? { ...c, ...updatedClass } : c))
    );
  };

  // 2c. Hapus Kelas (CRUD)
  const handleDeleteClass = (classId) => {
    setClasses((prev) => {
      const remaining = prev.filter((c) => c.id !== classId);
      if (remaining.length > 0 && currentClassId === classId) {
        setCurrentClassId(remaining[0].id);
        if (remaining[0].materials.length > 0) {
          setSelectedMaterialId(remaining[0].materials[0].id);
        }
      }
      return remaining;
    });
  };

  // 3. Tambah Pelajaran Baru ke Kelas Aktif
  const handleAddMaterial = (newMaterial) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          return {
            ...c,
            materials: [newMaterial, ...c.materials]
          };
        }
        return c;
      })
    );
    setSelectedMaterialId(newMaterial.id);
  };

  // 4. Update / Edit Materi (CRUD)
  const handleUpdateMaterial = (updatedMaterial) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          const updatedMaterials = c.materials.map((m) =>
            m.id === updatedMaterial.id ? { ...m, ...updatedMaterial } : m
          );
          return { ...c, materials: updatedMaterials };
        }
        return c;
      })
    );
  };

  // 5. Hapus Materi (CRUD)
  const handleDeleteMaterial = (materialId) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          const updated = c.materials.filter((m) => m.id !== materialId);
          return { ...c, materials: updated };
        }
        return c;
      })
    );
    if (selectedMaterialId === materialId) {
      const remaining = activeClass.materials.filter((m) => m.id !== materialId);
      setSelectedMaterialId(remaining[0]?.id || null);
    }
  };

  // 5. Komentar di Materi Aktif
  const handleAddComment = (matId, newComment) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          return {
            ...c,
            materials: c.materials.map((m) => {
              if (m.id === matId) {
                return {
                  ...m,
                  comments: [newComment, ...(m.comments || [])]
                };
              }
              return m;
            })
          };
        }
        return c;
      })
    );
  };

  const handleAddReply = (matId, commentId, newReply) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          return {
            ...c,
            materials: c.materials.map((m) => {
              if (m.id === matId) {
                return {
                  ...m,
                  comments: m.comments.map((cm) => {
                    if (cm.id === commentId) {
                      return {
                        ...cm,
                        replies: [...(cm.replies || []), newReply]
                      };
                    }
                    return cm;
                  })
                };
              }
              return m;
            })
          };
        }
        return c;
      })
    );
  };

  // 6. Buat Tugas PR Baru (CRUD Assignment)
  const handleAddAssignment = (newAssignment) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          return {
            ...c,
            assignments: [newAssignment, ...c.assignments]
          };
        }
        return c;
      })
    );
  };

  // 7. Ubah / Edit Tugas PR (CRUD Assignment)
  const handleUpdateAssignment = (updatedAssignment) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          return {
            ...c,
            assignments: c.assignments.map((a) =>
              a.id === updatedAssignment.id ? { ...a, ...updatedAssignment } : a
            )
          };
        }
        return c;
      })
    );
  };

  // 8. Hapus Tugas PR (CRUD Assignment)
  const handleDeleteAssignment = (assignmentId) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          return {
            ...c,
            assignments: c.assignments.filter((a) => a.id !== assignmentId)
          };
        }
        return c;
      })
    );
  };

  // 9. Murid Mengumpulkan Tugas ke Kelas Aktif
  const handleSubmissionSuccess = (taskId, receipt) => {
    const newSub = {
      id: 'sub-' + Date.now(),
      studentName: 'Muhammad Fathan',
      nim: 'Absen 14',
      assignmentTitle: receipt.assignmentTitle,
      fileName: receipt.fileName,
      fileType: receipt.fileName.split('.').pop()?.toUpperCase() || 'FOTO',
      fileSize: receipt.fileSize,
      driveFileId: receipt.driveId,
      previewUrl: '#',
      submittedAt: 'Baru saja (' + receipt.submittedAt + ')',
      submissionStatus: 'Tepat Waktu',
      gradeStatus: 'ungraded',
      score: null,
      feedback: '',
      evaluatedAt: null,
    };

    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          const updatedAssignments = c.assignments.map((a) => {
            if (a.id === taskId) {
              return {
                ...a,
                status: 'submitted',
                timeLeft: 'Sudah Dikumpulkan',
                userSubmission: {
                  fileName: receipt.fileName,
                  fileSize: receipt.fileSize,
                  submittedAt: receipt.submittedAt,
                  driveId: receipt.driveId,
                  score: null,
                  feedback: 'Sedang diperiksa oleh Bu Guru.',
                  evaluatedAt: null,
                }
              };
            }
            return a;
          });

          return {
            ...c,
            assignments: updatedAssignments,
            submissions: [newSub, ...c.submissions]
          };
        }
        return c;
      })
    );
  };

  // 10. Guru Memberikan & Mengubah Nilai (CRUD Grade)
  const handleUpdateGrade = (submissionId, gradeData) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          const updatedSubs = c.submissions.map((s) => {
            if (s.id === submissionId) {
              return { ...s, ...gradeData };
            }
            return s;
          });

          // Sinkronkan ke tampilan murid (Muhammad Fathan)
          const target = c.submissions.find((s) => s.id === submissionId);
          let updatedAsgs = c.assignments;
          if (target && target.studentName === 'Muhammad Fathan') {
            updatedAsgs = c.assignments.map((a) => {
              if (a.userSubmission) {
                return {
                  ...a,
                  userSubmission: {
                    ...a.userSubmission,
                    score: gradeData.score,
                    feedback: gradeData.feedback,
                    evaluatedAt: gradeData.evaluatedAt
                  }
                };
              }
              return a;
            });
          }

          return {
            ...c,
            assignments: updatedAsgs,
            submissions: updatedSubs
          };
        }
        return c;
      })
    );
  };

  // 11. Guru Mereset / Menghapus Nilai (CRUD Grade)
  const handleResetGrade = (submissionId) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          const updatedSubs = c.submissions.map((s) => {
            if (s.id === submissionId) {
              return {
                ...s,
                score: null,
                feedback: '',
                gradeStatus: 'ungraded',
                evaluatedAt: null
              };
            }
            return s;
          });

          const target = c.submissions.find((s) => s.id === submissionId);
          let updatedAsgs = c.assignments;
          if (target && target.studentName === 'Muhammad Fathan') {
            updatedAsgs = c.assignments.map((a) => {
              if (a.userSubmission) {
                return {
                  ...a,
                  userSubmission: {
                    ...a.userSubmission,
                    score: null,
                    feedback: 'Nilai direset untuk perbaikan.',
                    evaluatedAt: null
                  }
                };
              }
              return a;
            });
          }

          return {
            ...c,
            assignments: updatedAsgs,
            submissions: updatedSubs
          };
        }
        return c;
      })
    );
  };

  // 12. Guru Menghapus Kiriman Tugas Murid (CRUD Grade)
  const handleDeleteSubmission = (submissionId) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          return {
            ...c,
            submissions: c.submissions.filter((s) => s.id !== submissionId)
          };
        }
        return c;
      })
    );
  };

  // Jika pengguna belum login, tampilkan halaman Login
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-[100dvh] flex bg-[#f8fafc] text-slate-800 font-sans">
      
      {/* 1. Sidebar Navigasi Sederhana */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        classes={classes}
        activeClass={activeClass}
        onSelectClass={handleSelectClass}
        onLogout={handleLogout}
      />

      {/* Backdrop Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* 2. Area Konten Utama */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Header Bar Ramah SD */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs h-16 px-4 sm:px-6 flex items-center justify-between">
          
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <List size={22} weight="bold" />
            </button>

            {/* Pemilih Kelas Aktif (Guru: Dropdown Ganti Kelas | Siswa: Badge Kelas Tetap) */}
            {currentRole === 'teacher' ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTopClassDropdownOpen(!isTopClassDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white text-left transition-all cursor-pointer"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {activeClass.code}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[260px]">
                        {activeClass.title}
                      </span>
                      <CaretDown size={14} className="text-slate-400 shrink-0" />
                    </div>
                  </div>
                </button>

                {/* Menu Pilihan Kelas */}
                {isTopClassDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 w-72 sm:w-80">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Pilih Kelas Belajar ({classes.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('kelas');
                          setIsTopClassDropdownOpen(false);
                        }}
                        className="text-blue-600 hover:underline capitalize"
                      >
                        Lihat Semua
                      </button>
                    </div>
                    {classes.map((cls) => (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => {
                          handleSelectClass(cls.id);
                          setIsTopClassDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          cls.id === activeClass.id
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-bold">{cls.title}</p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {cls.section} • {cls.totalStudents} Murid
                          </p>
                        </div>
                        {cls.id === activeClass.id && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 ml-2"></span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-slate-50 text-left">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      {activeClass.code}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[260px]">
                      {activeClass.title}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>


        </header>

        {/* Isi Halaman Utama */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          
          {/* 1. Menu Kelas */}
          {activeTab === 'kelas' && (
            <KelasListView
              classes={classes}
              currentClassId={currentClassId}
              onSelectClass={handleSelectClass}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              currentRole={currentRole}
            />
          )}

          {/* 2. Menu Pelajaran & Materi */}
          {activeTab === 'materi' && (
            <MateriView
              activeClass={activeClass}
              currentMaterial={currentMaterial}
              onSelectMaterial={(mat) => setSelectedMaterialId(mat.id)}
              onAddMaterial={handleAddMaterial}
              onUpdateMaterial={handleUpdateMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
              currentRole={currentRole}
            />
          )}

          {/* 3. Menu Tugas & PR Murid (CRUD) */}
          {activeTab === 'tugas' && (
            <TugasUploadView
              activeClass={activeClass}
              assignments={activeClass.assignments}
              onSubmissionSuccess={handleSubmissionSuccess}
              onAddAssignment={handleAddAssignment}
              onUpdateAssignment={handleUpdateAssignment}
              onDeleteAssignment={handleDeleteAssignment}
              currentRole={currentRole}
            />
          )}

          {/* 4. Menu Periksa & Beri Nilai (CRUD) */}
          {activeTab === 'evaluasi' && (
            <NilaiEvaluasiView
              activeClass={activeClass}
              currentRole={currentRole}
              assignments={activeClass.assignments}
              submissions={activeClass.submissions}
              onUpdateGrade={handleUpdateGrade}
              onResetGrade={handleResetGrade}
              onDeleteSubmission={handleDeleteSubmission}
            />
          )}

        </main>

        {/* Footer Ramah */}
        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-xs text-slate-500 text-center">
          Ruang Kelas SD &copy; 2026 — Aplikasi Belajar Ceria, Mudah & Ramah Guru-Murid (Materi • Tugas • Pengumpulan Foto/Video • Nilai)
        </footer>

      </div>

    </div>
  );
}

// Mount to DOM
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
