// Data tetap demo Kapur. Sekolah, orang, dan angka di sini rekaan.

export const APP = {
  nama: 'Kapur',
  tagline: 'Buku penghubung digital: jadwal, nilai, absensi, SPP anak',
  url: 'https://app-sekolah.pintuweb.id',
  slug: 'sekolah',
  kontak: 'https://www.pintuweb.id/kontak?demo=sekolah',
};

export const SEKOLAH = {
  nama: 'SD Rindang Jati',
  kota: 'Kediri, Jawa Timur',
  alamat: 'Jl. Kenari Tengah 8, Kediri',
  kepala: 'Wulan Paramitha, M.Pd.',
  jamLayanan: 'Senin–Jumat, 07.00–15.00 WIB',
  batasTuntas: 75,
};

export const ORTU = { nama: 'Ratna Kusumawati', sapaan: 'Bu Ratna' };

export const GURU = {
  sekar: { id: 'sekar', nama: 'Sekar Ayuningtyas, S.Pd.', panggil: 'Bu Sekar', peran: 'Wali kelas 5B' },
  danu: { id: 'danu', nama: 'Danu Wicaksono, S.Pd.', panggil: 'Pak Danu', peran: 'Wali kelas 2A' },
  fahmi: { id: 'fahmi', nama: 'Fahmi Ardiansyah, S.Pd.', panggil: 'Pak Fahmi', peran: 'Guru Pendidikan Agama' },
  yoga: { id: 'yoga', nama: 'Yoga Pratama, S.Pd.', panggil: 'Pak Yoga', peran: 'Guru PJOK' },
  dewi: { id: 'dewi', nama: 'Dewi Larasati, S.Pd.', panggil: 'Bu Dewi', peran: 'Guru Bahasa Inggris' },
  tari: { id: 'tari', nama: 'Lestari Handayani, S.Pd.', panggil: 'Bu Tari', peran: 'Guru Bahasa Jawa' },
};

export const ANAK = [
  {
    id: 'nayla',
    nama: 'Nayla Prameswari',
    panggil: 'Nayla',
    tingkat: 5,
    rombel: 'B',
    nis: '2022.0347',
    wali: 'sekar',
    mulaiTingkat: 3,
    ekskul: ['Pramuka (wajib)', 'Karawitan'],
    kesehatan: 'Alergi kacang tanah. Bekal dari rumah setiap Jumat.',
    jemput: 'Dijemput ibu, pukul 12.45 di gerbang timur',
    spp: 350000,
    lahir: 'Kediri, 14 Maret',
    gerbang: 'Kartu gerbang 05-0347',
  },
  {
    id: 'bima',
    nama: 'Bima Aditya',
    panggil: 'Bima',
    tingkat: 2,
    rombel: 'A',
    nis: '2025.0112',
    wali: 'danu',
    mulaiTingkat: 1,
    ekskul: ['Futsal mini', 'Menggambar'],
    kesehatan: 'Tidak ada catatan khusus.',
    jemput: 'Ikut antar-jemput sekolah, rute Mojoroto',
    antar: { rute: 'Mojoroto', sopir: 'Pak Harjono', nopol: 'AG 0000 RJ', jemput: '06.15', tiba: '06.45', lama: 35, titik: 'depan gang Kenanga' },
    spp: 325000,
    lahir: 'Kediri, 2 Agustus',
    gerbang: 'Kartu gerbang 02-0112',
  },
];

export const anakById = (id) => ANAK.find((a) => a.id === id) || ANAK[0];
export const kelasAnak = (a) => `${a.tingkat}${a.rombel}`;

// Warna mapel hanya dipakai sebagai penanda (bilah/titik), bukan warna teks.
export const MAPEL = {
  agama: { nama: 'Pendidikan Agama dan Budi Pekerti', pendek: 'Agama', warna: '#7a5aa8', guru: 'fahmi' },
  pancasila: { nama: 'Pendidikan Pancasila', pendek: 'Pancasila', warna: '#a06a00', guru: 'wali' },
  bindo: { nama: 'Bahasa Indonesia', pendek: 'B. Indonesia', warna: '#c0392b', guru: 'wali' },
  mtk: { nama: 'Matematika', pendek: 'Matematika', warna: '#2f63ad', guru: 'wali' },
  ipas: { nama: 'Ilmu Pengetahuan Alam dan Sosial', pendek: 'IPAS', warna: '#1f8a55', guru: 'wali', mulai: 3 },
  seni: { nama: 'Seni Rupa', pendek: 'Seni Rupa', warna: '#d0661c', guru: 'wali' },
  pjok: { nama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', pendek: 'PJOK', warna: '#14839a', guru: 'yoga' },
  bing: { nama: 'Bahasa Inggris', pendek: 'B. Inggris', warna: '#b0306a', guru: 'dewi', mulai: 3 },
  bjawa: { nama: 'Bahasa Jawa (muatan lokal)', pendek: 'B. Jawa', warna: '#6d7f2a', guru: 'tari' },
};

export const URUT_MAPEL = ['agama', 'pancasila', 'bindo', 'mtk', 'ipas', 'seni', 'pjok', 'bing', 'bjawa'];

export const mapelUntuk = (tingkat) => URUT_MAPEL.filter((m) => !MAPEL[m].mulai || tingkat >= MAPEL[m].mulai);

export const guruMapel = (mapel, anak) => {
  const g = MAPEL[mapel].guru;
  return GURU[g === 'wali' ? anak.wali : g];
};

// Topik lingkup materi per mapel. "awal" = kelas 1–2, "lanjut" = kelas 3–6.
export const TOPIK = {
  agama: {
    awal: ['Doa sehari-hari', 'Sikap jujur di rumah dan sekolah', 'Menyayangi teman', 'Kisah teladan'],
    lanjut: ['Akhlak terpuji dalam pergaulan', 'Kisah teladan dan maknanya', 'Ibadah sehari-hari', 'Toleransi antarteman'],
  },
  pancasila: {
    awal: ['Aturan di rumah', 'Simbol sila Pancasila', 'Bekerja sama di kelas', 'Mengenal identitas diri'],
    lanjut: ['Nilai sila Pancasila', 'Hak dan kewajiban warga', 'Gotong royong di lingkungan', 'Keragaman budaya daerah'],
  },
  bindo: {
    awal: ['Membaca nyaring', 'Menulis kalimat sederhana', 'Menyimak dongeng', 'Kosakata benda sekitar'],
    lanjut: ['Menemukan ide pokok paragraf', 'Menulis ringkasan cerita rakyat', 'Menyajikan pendapat', 'Puisi dan rima'],
  },
  mtk: {
    awal: ['Bilangan sampai 500', 'Penjumlahan dan pengurangan', 'Mengenal nilai uang', 'Bangun datar sederhana'],
    lanjut: ['Pecahan senilai', 'Operasi pecahan', 'Pengukuran sudut', 'Menyelesaikan soal cerita perbandingan'],
  },
  ipas: {
    awal: [],
    lanjut: ['Siklus air', 'Cahaya dan sifatnya', 'Ekosistem sekitar sekolah', 'Peta dan letak wilayah'],
  },
  seni: {
    awal: ['Mewarnai gradasi', 'Kolase bahan alam', 'Menggambar ekspresif', 'Bentuk dan garis'],
    lanjut: ['Kolase daun kering', 'Menggambar ilustrasi cerita', 'Batik jumputan sederhana', 'Komposisi warna'],
  },
  pjok: {
    awal: ['Gerak dasar berjalan dan berlari', 'Permainan bola kecil', 'Senam irama', 'Kebersihan diri'],
    lanjut: ['Gerak dasar lompat jauh', 'Permainan bola voli mini', 'Senam lantai', 'Pola makan sehat'],
  },
  bing: {
    awal: [],
    lanjut: ['Daily activities', 'Describing places', 'Telling time', 'Simple instructions'],
  },
  bjawa: {
    awal: ['Angka 1–20 (siji, loro, telu)', 'Tembang dolanan', 'Unggah-ungguh sederhana', 'Nama anggota keluarga'],
    lanjut: ['Tembang macapat sederhana', 'Unggah-ungguh basa krama', 'Aksara Jawa dasar', 'Cerita wayang singkat'],
  },
};

export const topikUntuk = (mapel, tingkat) => TOPIK[mapel][tingkat <= 2 ? 'awal' : 'lanjut'];

// Kekuatan bawaan tiap anak per mapel (rekaan, untuk membangkitkan nilai yang konsisten).
export const BAKAT = {
  nayla: { agama: 88, pancasila: 86, bindo: 90, mtk: 79, ipas: 89, seni: 84, pjok: 81, bing: 85, bjawa: 82 },
  bima: { agama: 87, pancasila: 85, bindo: 80, mtk: 86, seni: 91, pjok: 89, bjawa: 78 },
};

// Jadwal per tingkat. Hari 1 = Senin ... 5 = Jumat. "k" = kegiatan non-mapel.
const J5 = {
  1: [
    { mulai: '07.00', selesai: '07.35', k: 'Upacara bendera' },
    { mulai: '07.35', selesai: '08.45', mapel: 'pancasila' },
    { mulai: '08.45', selesai: '09.55', mapel: 'mtk' },
    { mulai: '09.55', selesai: '10.15', k: 'Istirahat' },
    { mulai: '10.15', selesai: '11.25', mapel: 'bindo' },
    { mulai: '11.25', selesai: '12.35', mapel: 'agama' },
  ],
  2: [
    { mulai: '07.00', selesai: '07.35', k: 'Literasi pagi' },
    { mulai: '07.35', selesai: '08.45', mapel: 'ipas' },
    { mulai: '08.45', selesai: '09.55', mapel: 'mtk' },
    { mulai: '09.55', selesai: '10.15', k: 'Istirahat' },
    { mulai: '10.15', selesai: '11.25', mapel: 'bing' },
    { mulai: '11.25', selesai: '12.35', mapel: 'bjawa' },
  ],
  3: [
    { mulai: '07.00', selesai: '07.35', k: 'Literasi pagi' },
    { mulai: '07.35', selesai: '09.20', mapel: 'pjok' },
    { mulai: '09.20', selesai: '09.40', k: 'Istirahat' },
    { mulai: '09.40', selesai: '10.50', mapel: 'bindo' },
    { mulai: '10.50', selesai: '12.35', mapel: 'seni' },
  ],
  4: [
    { mulai: '07.00', selesai: '07.35', k: 'Literasi pagi' },
    { mulai: '07.35', selesai: '08.45', mapel: 'mtk' },
    { mulai: '08.45', selesai: '09.55', mapel: 'ipas' },
    { mulai: '09.55', selesai: '10.15', k: 'Istirahat' },
    { mulai: '10.15', selesai: '11.25', mapel: 'pancasila' },
    { mulai: '11.25', selesai: '12.35', mapel: 'bindo' },
  ],
  5: [
    { mulai: '07.00', selesai: '07.35', k: 'Senam pagi dan Jumat bersih' },
    { mulai: '07.35', selesai: '08.45', mapel: 'agama' },
    { mulai: '08.45', selesai: '09.05', k: 'Istirahat' },
    { mulai: '09.05', selesai: '10.15', mapel: 'bing' },
    { mulai: '10.15', selesai: '11.00', k: 'Pramuka' },
  ],
};

const J2 = {
  1: [
    { mulai: '07.00', selesai: '07.35', k: 'Upacara bendera' },
    { mulai: '07.35', selesai: '08.45', mapel: 'bindo' },
    { mulai: '08.45', selesai: '09.05', k: 'Istirahat' },
    { mulai: '09.05', selesai: '10.15', mapel: 'mtk' },
    { mulai: '10.15', selesai: '10.50', mapel: 'agama' },
  ],
  2: [
    { mulai: '07.00', selesai: '07.35', k: 'Membaca bersama' },
    { mulai: '07.35', selesai: '08.45', mapel: 'pjok' },
    { mulai: '08.45', selesai: '09.05', k: 'Istirahat' },
    { mulai: '09.05', selesai: '10.15', mapel: 'bindo' },
    { mulai: '10.15', selesai: '10.50', mapel: 'bjawa' },
  ],
  3: [
    { mulai: '07.00', selesai: '07.35', k: 'Membaca bersama' },
    { mulai: '07.35', selesai: '08.45', mapel: 'mtk' },
    { mulai: '08.45', selesai: '09.05', k: 'Istirahat' },
    { mulai: '09.05', selesai: '10.15', mapel: 'seni' },
    { mulai: '10.15', selesai: '10.50', mapel: 'pancasila' },
  ],
  4: [
    { mulai: '07.00', selesai: '07.35', k: 'Membaca bersama' },
    { mulai: '07.35', selesai: '08.45', mapel: 'bindo' },
    { mulai: '08.45', selesai: '09.05', k: 'Istirahat' },
    { mulai: '09.05', selesai: '10.15', mapel: 'mtk' },
    { mulai: '10.15', selesai: '10.50', mapel: 'agama' },
  ],
  5: [
    { mulai: '07.00', selesai: '07.35', k: 'Senam pagi dan Jumat bersih' },
    { mulai: '07.35', selesai: '08.45', mapel: 'pancasila' },
    { mulai: '08.45', selesai: '09.05', k: 'Istirahat' },
    { mulai: '09.05', selesai: '09.55', mapel: 'bjawa' },
  ],
};

export const JADWAL = { 5: J5, 2: J2 };

export const SERAGAM = {
  1: 'Merah putih',
  2: 'Merah putih',
  3: 'Batik sekolah',
  4: 'Batik sekolah',
  5: 'Pramuka',
};

// Peringatan nasional bertanggal tetap. "libur" = sekolah libur.
export const HARI_NASIONAL = [
  { bt: '01-01', nama: 'Tahun Baru Masehi', libur: true },
  { bt: '04-21', nama: 'Hari Kartini' },
  { bt: '05-01', nama: 'Hari Buruh Internasional', libur: true },
  { bt: '05-02', nama: 'Hari Pendidikan Nasional' },
  { bt: '05-20', nama: 'Hari Kebangkitan Nasional' },
  { bt: '06-01', nama: 'Hari Lahir Pancasila', libur: true },
  { bt: '07-23', nama: 'Hari Anak Nasional' },
  { bt: '08-17', nama: 'HUT Kemerdekaan RI', libur: true },
  { bt: '10-01', nama: 'Hari Kesaktian Pancasila' },
  { bt: '10-22', nama: 'Hari Santri' },
  { bt: '10-28', nama: 'Hari Sumpah Pemuda' },
  { bt: '11-10', nama: 'Hari Pahlawan' },
  { bt: '11-25', nama: 'Hari Guru Nasional' },
  { bt: '12-22', nama: 'Hari Ibu' },
  { bt: '12-25', nama: 'Hari Raya Natal', libur: true },
];
