// Mock Data Khusus Sekolah Dasar (SD / Madrasah Ibtidaiyah / Ma'had)
// Dirancang ramah guru awam, murid, dan orang tua (Bahasa Indonesia sehari-hari, bebas istilah teknis)

export const INITIAL_CLASSES = [
  {
    id: "cls-01",
    code: "KELAS-4A",
    title: "Kelas 4-A (Ibnu Sina)",
    section: "Tingkat SD Kelas 4 • Semester 1",
    teacherName: "Ibu Siti Rahmawati, S.Pd.",
    schedule: "Senin - Jumat, 07:30 - 12:00 WIB",
    room: "Gedung A, Ruang Kelas 4-A",
    totalStudents: 28,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    themeColor: "blue",
    description: "Kelas pembelajaran tematik terpadu, matematika dasar, dan penguatan karakter untuk siswa-siswi kelas 4-A.",
    materials: [
      {
        id: "mat-01-01",
        sessionNumber: "Pelajaran 1",
        title: "Tema 1: Indahnya Keragaman Budaya Negeriku",
        readingTime: "10 Menit Membaca",
        date: "Senin, 15 September 2026",
        summary: "Anak-anak hebat, di pelajaran pertama ini kita akan mengenal keragaman alat musik tradisional, tarian daerah, dan pakaian adat dari Sabang sampai Merauke.",
        video: {
          title: "Video Animasi: Mengenal Alat Musik Tradisional Indonesia (Angklung, Gamelan, Sasando)",
          duration: "12:30",
          quality: "Video Kartun Edukasi",
          url: "https://youtube.com"
        },
        pdfDocument: {
          title: "Buku-Tema-1-Indahnya-Kebersamaan-Kelas-4.pdf",
          size: "3.5 MB",
          pages: 18
        },
        sections: [
          {
            heading: "1. Keunikan Alat Musik Tradisional",
            body: "Indonesia memiliki ribuan pulau dan ratusan suku. Setiap daerah memiliki alat musik khas, contohnya Angklung dari Jawa Barat yang dimainkan dengan cara digoyangkan, dan Sasando dari Nusa Tenggara Timur yang dipetik."
          },
          {
            heading: "2. Sikap Saling Menghargai Perbedaan",
            body: "Meskipun kita berasal dari daerah yang berbeda-beda, kita harus selalu hidup rukun dan tolong-menolong sesuai semboyan Bhinneka Tunggal Ika."
          }
        ],
        comments: [
          {
            id: "c-01",
            author: "Aisyah Humaira (Murid)",
            nim: "Absen 03",
            role: "student",
            time: "Kemarin, 14:20 WIB",
            text: "Assalamualaikum Bu Guru, videonya seru sekali! Aisyah paling suka suara alat musik Sasando, mirip kecapi ya Bu?",
            replies: [
              {
                id: "rep-01",
                author: "Ibu Siti Rahmawati, S.Pd. (Guru Kelas)",
                nim: "Wali Kelas 4-A",
                role: "teacher",
                time: "Kemarin, 15:00 WIB",
                text: "Waalaikumsalam Aisyah pintar! Betul sekali, Sasando memiliki senar yang dipetik seperti kecapi, namun wadahnya terbuat dari daun lontar. Bagus sekali pengamatannya ya nak!"
              }
            ]
          },
          {
            id: "c-02",
            author: "Muhammad Fathan (Murid)",
            nim: "Absen 14",
            role: "student",
            time: "Hari ini, 08:15 WIB",
            text: "Bu Guru, untuk tugas membuat video menyebutkan alat musik nanti boleh dibantu Mama merekamnya?",
            replies: [
              {
                id: "rep-02",
                author: "Ibu Siti Rahmawati, S.Pd. (Guru Kelas)",
                nim: "Wali Kelas 4-A",
                role: "teacher",
                time: "Hari ini, 08:30 WIB",
                text: "Tentu boleh sekali Fathan! Minta bantuan Mama atau Ayah untuk merekam ya, yang penting Fathan yang berbicara dengan percaya diri."
              }
            ]
          }
        ]
      },
      {
        id: "mat-01-02",
        sessionNumber: "Pelajaran 2",
        title: "Matematika: Menghitung Perkalian dengan Cara Menyenangkan",
        readingTime: "12 Menit Membaca",
        date: "Rabu, 17 September 2026",
        summary: "Pelajaran matematika tentang tabel perkalian 6 sampai 9 menggunakan trik jarimatika dan permainan hitung cepat.",
        video: {
          title: "Video Belajar: Trik Mudah Menghafal Perkalian Pakai Jari Tangan",
          duration: "10:15",
          quality: "Video Tutorial Edukasi",
          url: "https://youtube.com"
        },
        pdfDocument: {
          title: "Lembar-Latihan-Perkalian-Ceria-Kelas4.pdf",
          size: "1.8 MB",
          pages: 6
        },
        sections: [
          {
            heading: "1. Perkalian sebagai Penjumlahan Berulang",
            body: "Ingat ya anak-anak, 4 x 3 artinya angka 3 dijumlahkan sebanyak 4 kali: 3 + 3 + 3 + 3 = 12."
          }
        ],
        comments: []
      },
      {
        id: "mat-01-03",
        sessionNumber: "Pelajaran 3",
        title: "IPAS: Bagian-Bagian Tumbuhan & Fungsinya Bagi Kehidupan",
        readingTime: "15 Menit Membaca",
        date: "Senin, 22 September 2026",
        summary: "Mengenal akar, batang, daun, bunga, dan buah pada tanaman di sekitar halaman rumah serta proses tumbuhan membuat makanan sendiri (fotosintesis).",
        video: {
          title: "Video Eksperimen Sains: Menanam Kacang Hijau di Kapas Basah",
          duration: "14:40",
          quality: "Video Sains Anak",
          url: "https://youtube.com"
        },
        pdfDocument: {
          title: "Panduan-Pengamatan-Tanaman-IPAS.pdf",
          size: "2.4 MB",
          pages: 10
        },
        sections: [
          {
            heading: "1. Fungsi Akar dan Daun",
            body: "Akar bertugas menyerap air dan zat hara dari dalam tanah. Daun bertugas sebagai dapur tempat tumbuhan memasak makanannya dengan bantuan sinar matahari."
          }
        ],
        comments: []
      }
    ],
    assignments: [
      {
        id: "asg-01-01",
        code: "TUGAS-01",
        title: "Tugas 1: Menceritakan Alat Musik Tradisional Nusantara",
        status: "urgent",
        deadline: "Hari Ini, Pukul 21:00 WIB",
        timeLeft: "Sisa 4 jam lagi",
        allowedTypes: ["Foto Buku / Gambar", "Video / Rekaman Suara", "PDF"],
        maxScore: 100,
        description: "Pilihlah 1 alat musik tradisional khas daerah asal keluargamu. Ceritakan nama alat musiknya, daerah asalnya, dan cara memainkannya. Boleh dikumpulkan berupa foto tulisan tangan di buku tulis, atau video singkat berdurasi 1 menit.",
        rubric: [
          { item: "Kerapian Tulisan & Cerita", weight: "40%" },
          { item: "Kebenaran Nama Alat & Asal Daerah", weight: "40%" },
          { item: "Ketepatan Waktu Pengumpulan", weight: "20%" }
        ],
        userSubmission: null // Farhan / Fathan belum kumpul
      },
      {
        id: "asg-01-02",
        code: "TUGAS-02",
        title: "Tugas 2: Latihan Soal Perkalian Halaman 25 di Buku Tulis",
        status: "submitted",
        deadline: "Jumat, 19 September 2026",
        timeLeft: "Sudah Dikumpulkan",
        allowedTypes: ["Foto Buku Tulis"],
        maxScore: 100,
        description: "Kerjakan 10 soal perkalian di buku tulis bergaris dengan rapi, lalu foto hasilnya dan kumpulkan ke sini.",
        rubric: [
          { item: "Kebenaran Jawaban Hitungan", weight: "60%" },
          { item: "Kerapian Tulisan Angka", weight: "40%" }
        ],
        userSubmission: {
          fileName: "Foto_Tugas_Perkalian_Fathan_Kelas4A.jpg",
          fileSize: "2.1 MB",
          submittedAt: "19 Sep 2026, 16:30 WIB",
          driveId: "gdrive_foto_fathan_perkalian",
          score: 95,
          feedback: "Pintar sekali Fathan! Semua jawaban perkalian benar dan tulisan angkamu sangat rapi. Pertahankan prestasimu ya nak! ⭐⭐⭐",
          evaluatedAt: "20 Sep 2026, 08:30 WIB"
        }
      }
    ],
    submissions: [
      {
        id: "sub-201",
        studentName: "Muhammad Fathan",
        nim: "Absen 14",
        assignmentTitle: "Tugas 1: Menceritakan Alat Musik Tradisional Nusantara",
        fileName: "Video_Cerita_Angklung_Fathan.mp4",
        fileType: "VIDEO",
        fileSize: "18.4 MB",
        driveFileId: "gdrive_video_fathan",
        previewUrl: "#",
        submittedAt: "Hari ini, 15:42 WIB",
        submissionStatus: "Tepat Waktu",
        gradeStatus: "graded",
        score: 95,
        feedback: "Alhamdulillah Fathan hebat sekali bicaranya sangat lancar dan percaya diri saat menjelaskan angklung. Nilai 95 bintang tiga untuk Fathan! ⭐⭐⭐",
        evaluatedAt: "Hari ini, 16:15 WIB"
      },
      {
        id: "sub-202",
        studentName: "Aisyah Humaira",
        nim: "Absen 03",
        assignmentTitle: "Tugas 1: Menceritakan Alat Musik Tradisional Nusantara",
        fileName: "Foto_Tugas_Sasando_Aisyah.jpg",
        fileType: "FOTO",
        fileSize: "3.2 MB",
        driveFileId: "gdrive_foto_aisyah",
        previewUrl: "#",
        submittedAt: "Hari ini, 16:05 WIB",
        submissionStatus: "Tepat Waktu",
        gradeStatus: "ungraded",
        score: null,
        feedback: "",
        evaluatedAt: null
      },
      {
        id: "sub-203",
        studentName: "Rizky Pratama",
        nim: "Absen 22",
        assignmentTitle: "Tugas 1: Menceritakan Alat Musik Tradisional Nusantara",
        fileName: "Rekaman_Suara_Gamelan_Rizky.mp3",
        fileType: "AUDIO",
        fileSize: "4.5 MB",
        driveFileId: "gdrive_audio_rizky",
        previewUrl: "#",
        submittedAt: "Hari ini, 16:30 WIB",
        submissionStatus: "Tepat Waktu",
        gradeStatus: "ungraded",
        score: null,
        feedback: "",
        evaluatedAt: null
      },
      {
        id: "sub-204",
        studentName: "Bilqis Nabila",
        nim: "Absen 07",
        assignmentTitle: "Tugas 1: Menceritakan Alat Musik Tradisional Nusantara",
        fileName: "Gambar_Kolase_AlatMusik_Bilqis.pdf",
        fileType: "PDF",
        fileSize: "5.1 MB",
        driveFileId: "gdrive_pdf_bilqis",
        previewUrl: "#",
        submittedAt: "Hari ini, 16:50 WIB",
        submissionStatus: "Tepat Waktu",
        gradeStatus: "graded",
        score: 98,
        feedback: "Masya Allah gambar dan tulisan Bilqis rapi sekali! Keterangan alat musik kolintang dari Minahasa sangat lengkap. Hebat nak!",
        evaluatedAt: "Hari ini, 17:10 WIB"
      }
    ]
  },
  {
    id: "cls-02",
    code: "KELAS-4B",
    title: "Kelas 4-B (Al-Farabi)",
    section: "Tingkat SD Kelas 4 • Semester 1",
    teacherName: "Ibu Siti Rahmawati, S.Pd.",
    schedule: "Senin - Jumat, 07:30 - 12:00 WIB",
    room: "Gedung A, Ruang Kelas 4-B",
    totalStudents: 26,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    themeColor: "emerald",
    description: "Kelas 4-B untuk mata pelajaran tematik kebangsaan, matematika ceria, dan keterampilan tangan.",
    materials: [
      {
        id: "mat-02-01",
        sessionNumber: "Pelajaran 1",
        title: "Tema 1: Keragaman Budaya Suku-Suku di Indonesia",
        readingTime: "10 Menit Membaca",
        date: "Selasa, 16 September 2026",
        summary: "Mengenal pakaian adat dan tarian daerah khas Indonesia bersama teman-teman kelas 4-B.",
        video: {
          title: "Video Animasi Tarian Daerah: Tari Saman, Jaipong, dan Piring",
          duration: "11:20",
          quality: "Video Kartun Edukasi",
          url: "https://youtube.com"
        },
        pdfDocument: {
          title: "Buku-Bacaan-Tema-1-Kelas4B.pdf",
          size: "2.8 MB",
          pages: 14
        },
        sections: [
          {
            heading: "1. Kekayaan Tarian Nusantara",
            body: "Setiap tarian memiliki makna dan cerita tersendiri. Tari Saman dari Aceh melambangkan kebersamaan dan kekompakan."
          }
        ],
        comments: []
      }
    ],
    assignments: [
      {
        id: "asg-02-01",
        code: "TUGAS-01",
        title: "Tugas Menempel Gambar Rumah Adat Tradisional",
        status: "urgent",
        deadline: "Besok, Pukul 18:00 WIB",
        timeLeft: "Sisa 1 hari lagi",
        allowedTypes: ["Foto Tugas"],
        maxScore: 100,
        description: "Tempelkan gambar 1 rumah adat di buku gambar, tuliskan nama provinsinya, lalu foto hasilnya dan kumpulkan ke sini.",
        rubric: [
          { item: "Kerapian Menempel", weight: "50%" },
          { item: "Kebenaran Keterangan Provinsi", weight: "50%" }
        ],
        userSubmission: null
      }
    ],
    submissions: [
      {
        id: "sub-301",
        studentName: "Kenzo Al-Ghifari",
        nim: "Absen 11",
        assignmentTitle: "Tugas Menempel Gambar Rumah Adat Tradisional",
        fileName: "Foto_RumahGadang_Kenzo.jpg",
        fileType: "FOTO",
        fileSize: "2.8 MB",
        driveFileId: "gdrive_kenzo",
        previewUrl: "#",
        submittedAt: "Hari ini, 11:20 WIB",
        submissionStatus: "Tepat Waktu",
        gradeStatus: "graded",
        score: 90,
        feedback: "Bagus sekali Kenzo! Gambar Rumah Gadang dari Sumatera Barat ditempel dengan sangat rapi.",
        evaluatedAt: "Hari ini, 13:00 WIB"
      }
    ]
  },
  {
    id: "cls-03",
    code: "KELAS-5A",
    title: "Kelas 5-A (Al-Khawarizmi)",
    section: "Tingkat SD Kelas 5 • Semester 1",
    teacherName: "Ibu Siti Rahmawati, S.Pd.",
    schedule: "Senin - Jumat, 07:30 - 12:30 WIB",
    room: "Gedung B, Ruang Kelas 5-A",
    totalStudents: 30,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    themeColor: "purple",
    description: "Kelas 5-A fokus pada penguatan matematika pecahan, bangun ruang, dan sains IPA.",
    materials: [
      {
        id: "mat-03-01",
        sessionNumber: "Pelajaran 1",
        title: "Matematika: Penjumlahan dan Pengurangan Pecahan Biasa",
        readingTime: "12 Menit Membaca",
        date: "Kamis, 18 September 2026",
        summary: "Cara mudah menyamakan penyebut pecahan menggunakan KPK sebelum melakukan penjumlahan.",
        video: {
          title: "Video Animasi Kue Ulang Tahun & Pecahan",
          duration: "13:00",
          quality: "Video Matematika Anak",
          url: "https://youtube.com"
        },
        pdfDocument: {
          title: "Modul-Latihan-Pecahan-Kelas5.pdf",
          size: "2.1 MB",
          pages: 8
        },
        sections: [
          {
            heading: "1. Menyamakan Penyebut",
            body: "Jika penyebutnya berbeda, carilah KPK dari kedua penyebut tersebut terlebih dahulu."
          }
        ],
        comments: []
      }
    ],
    assignments: [
      {
        id: "asg-03-01",
        code: "TUGAS-01",
        title: "Latihan Pecahan Halaman 15 di Buku Tulis Matematika",
        status: "pending",
        deadline: "Senin Depan, Pukul 20:00 WIB",
        timeLeft: "Sisa 5 hari lagi",
        allowedTypes: ["Foto Buku Tulis"],
        maxScore: 100,
        description: "Kerjakan soal pecahan nomor 1 sampai 5. Foto cara berhitungnya dan kirimkan ke sini.",
        rubric: [
          { item: "Langkah Pengerjaan", weight: "60%" },
          { item: "Kerapian", weight: "40%" }
        ],
        userSubmission: null
      }
    ],
    submissions: []
  }
];

export const INITIAL_USER = {
  teacher: {
    name: "Ibu Siti Rahmawati, S.Pd.",
    title: "Guru Kelas & Wali Kelas 4-A",
    nip: "19880412 201201 2 004",
    avatarText: "SR",
    school: "SD Negeri Cerdas Nusantara / Madrasah",
  },
  student: {
    name: "Muhammad Fathan",
    nim: "Kelas 4-A • No. Absen 14",
    avatarText: "MF",
    school: "SD Negeri Cerdas Nusantara",
  }
};
