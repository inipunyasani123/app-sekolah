// Pembangkit data contoh yang selalu relatif terhadap tanggal hari ini (WIB).
// Hasilnya deterministik: tanggal dan anak yang sama selalu memberi data yang sama.

import {
  hariKe, isoDari, pecah, tambahHari, selisihHari, seninPada, awalMinggu, jamKeMenit, menitKeJam,
  msPada, fmtTanggal, tambahBulan, BULAN,
} from './waktu';
import {
  ANAK, GURU, MAPEL, JADWAL, HARI_NASIONAL, BAKAT, SEKOLAH, mapelUntuk, topikUntuk, kelasAnak, guruMapel,
} from './data';

export function acak(teks) {
  let h = 2166136261;
  for (let i = 0; i < teks.length; i++) {
    h ^= teks.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

const batas = (n, a, b) => Math.max(a, Math.min(b, n));
const kecilAwal = (t) => t.charAt(0).toLowerCase() + t.slice(1);

/* ---------- Semester & kalender ---------- */

function jumatSebelum(iso) {
  let d = iso;
  while (hariKe(d) !== 5) d = tambahHari(d, -1);
  return d;
}

const awalGanjil = (y) => seninPada(isoDari(y, 7, 10));
const akhirGanjil = (y) => jumatSebelum(isoDari(y, 12, 19));
const awalGenap = (y) => seninPada(isoDari(y, 1, 5));
const akhirGenap = (y) => jumatSebelum(isoDari(y, 6, 20));

function bentukSemester(awalTA, nomor) {
  return {
    ta: `${awalTA}/${awalTA + 1}`,
    awalTA,
    nomor,
    nama: nomor === 1 ? 'Ganjil' : 'Genap',
    mulai: nomor === 1 ? awalGanjil(awalTA) : awalGenap(awalTA + 1),
    selesai: nomor === 1 ? akhirGanjil(awalTA) : akhirGenap(awalTA + 1),
    libur: false,
    mulaiBerikut: null,
  };
}

export function semester(hari) {
  const { y, m } = pecah(hari);
  let s;
  if (m >= 7) {
    const mulai = awalGanjil(y);
    if (hari < mulai) {
      s = bentukSemester(y - 1, 2);
      s.libur = true;
      s.mulaiBerikut = mulai;
    } else {
      s = bentukSemester(y, 1);
      if (hari > s.selesai) {
        s.libur = true;
        s.mulaiBerikut = awalGenap(y + 1);
      }
    }
  } else {
    const mulai = awalGenap(y);
    if (hari < mulai) {
      s = bentukSemester(y - 1, 1);
      s.libur = true;
      s.mulaiBerikut = mulai;
    } else {
      s = bentukSemester(y - 1, 2);
      if (hari > s.selesai) {
        s.libur = true;
        s.mulaiBerikut = awalGanjil(y);
      }
    }
  }
  return s;
}

export function hariNasional(iso) {
  const bt = iso.slice(5);
  return HARI_NASIONAL.find((h) => h.bt === bt) || null;
}

export function hariSekolah(iso, sem) {
  const h = hariKe(iso);
  if (h === 0 || h === 6) return false;
  if (iso < sem.mulai || iso > sem.selesai) return false;
  const n = hariNasional(iso);
  return !(n && n.libur);
}

export function hariSekolahBerikut(iso, sem) {
  let d = iso;
  for (let i = 0; i < 40; i++) {
    if (hariSekolah(d, sem)) return d;
    d = tambahHari(d, 1);
  }
  return null;
}

export function hariSekolahSebelum(iso, sem) {
  let d = iso;
  for (let i = 0; i < 40; i++) {
    if (d < sem.mulai) return null;
    if (hariSekolah(d, sem)) return d;
    d = tambahHari(d, -1);
  }
  return null;
}

/* ---------- Jadwal ---------- */

export function jadwalHari(anak, iso) {
  return JADWAL[anak.tingkat][hariKe(iso)] || [];
}

export function jamPulang(anak, iso) {
  const j = jadwalHari(anak, iso);
  return j.length ? j[j.length - 1].selesai : null;
}

/** Status pelajaran pada menit tertentu: indeks yang sedang berjalan & berikutnya. */
export function posisiJadwal(slot, menit) {
  let kini = -1;
  let berikut = -1;
  slot.forEach((s, i) => {
    const a = jamKeMenit(s.mulai);
    const b = jamKeMenit(s.selesai);
    if (menit >= a && menit < b) kini = i;
    if (berikut === -1 && a > menit) berikut = i;
  });
  return { kini, berikut };
}

/* ---------- Agenda & pengumuman ---------- */

export function agenda(hari, sem, anak) {
  const daftar = [];
  const tambah = (e) => {
    if (e.mulai >= sem.mulai && e.mulai <= tambahHari(sem.selesai, 30)) daftar.push(e);
  };
  const sts = tambahHari(sem.mulai, 77);
  tambah({ id: 'sts', mulai: sts, selesai: tambahHari(sts, 4), judul: 'Sumatif Tengah Semester (STS)', jenis: 'ujian', untuk: 'Semua kelas' });
  tambah({ id: 'rapor-sts', mulai: tambahHari(sts, 12), judul: 'Pembagian rapor tengah semester', jenis: 'rapor', untuk: 'Semua kelas', jam: '08.00–10.00 WIB', lokasi: 'Ruang kelas masing-masing' });
  const sas = tambahHari(sem.selesai, -11);
  tambah({ id: 'sas', mulai: sas, selesai: tambahHari(sas, 4), judul: 'Sumatif Akhir Semester (SAS)', jenis: 'ujian', untuk: 'Semua kelas' });
  tambah({ id: 'classmeeting', mulai: tambahHari(sem.selesai, -4), selesai: tambahHari(sem.selesai, -1), judul: 'Class meeting dan pentas kelas', jenis: 'kegiatan', untuk: 'Semua kelas' });
  tambah({ id: 'rapor', mulai: sem.selesai, judul: sem.nomor === 2 ? 'Pembagian rapor kenaikan kelas' : 'Pembagian rapor semester ganjil', jenis: 'rapor', untuk: 'Semua kelas', jam: '08.00–11.00 WIB' });
  const mulaiLibur = tambahHari(sem.selesai, 1);
  const akhirLibur = tambahHari(sem.mulaiBerikut || (sem.nomor === 1 ? awalGenap(sem.awalTA + 1) : awalGanjil(sem.awalTA + 1)), -1);
  tambah({ id: 'libur', mulai: mulaiLibur, selesai: akhirLibur, judul: 'Libur semester', jenis: 'libur', untuk: 'Semua kelas' });

  if (!sem.libur) {
    const seninDepan = tambahHari(awalMinggu(hari), 7);
    if (seninDepan < sas) {
      tambah({ id: 'literasi', mulai: seninDepan, selesai: tambahHari(seninDepan, 4), judul: 'Pekan Literasi Rindang Jati', jenis: 'kegiatan', untuk: 'Semua kelas', jam: '07.00–07.30 WIB', lokasi: 'Halaman dan pojok baca kelas' });
      tambah({ id: 'dongeng', mulai: tambahHari(seninDepan, 4), judul: 'Lomba mendongeng kelas 4–6', jenis: 'kegiatan', untuk: 'Kelas 4–6', jam: '08.00–10.30 WIB', lokasi: 'Aula sekolah' });
      tambah({ id: 'pertemuan', mulai: tambahHari(seninDepan, 5), judul: `Pertemuan wali murid kelas ${kelasAnak(anak)}`, jenis: 'akademik', untuk: `Orang tua kelas ${kelasAnak(anak)}`, jam: '08.30–10.00 WIB', lokasi: `Ruang kelas ${kelasAnak(anak)}` });
    }
    const gigi = hariSekolahBerikut(tambahHari(hari, 3), sem);
    if (gigi) tambah({ id: 'gigi', mulai: gigi, judul: 'Pemeriksaan gigi bersama puskesmas', jenis: 'kegiatan', untuk: 'Semua kelas', jam: '08.00–11.00 WIB', lokasi: 'UKS sekolah' });
    const kebun = hariSekolahBerikut(tambahHari(hari, 13), sem);
    if (kebun && kebun < sas) tambah({ id: 'kebun', mulai: kebun, judul: 'Kunjungan kebun edukasi', jenis: 'kegiatan', untuk: 'Kelas 1–3', jam: '07.30–11.00 WIB', lokasi: 'Kebun edukasi desa, berangkat dari sekolah' });
  }

  // Peringatan nasional di sekitar hari ini.
  for (let i = -20; i <= 75; i++) {
    const d = tambahHari(hari, i);
    const n = hariNasional(d);
    if (n) daftar.push({ id: `nas-${d}`, mulai: d, judul: n.nama, jenis: n.libur ? 'libur' : 'nasional', untuk: n.libur ? 'Sekolah libur' : 'Peringatan nasional' });
  }
  const unik = new Map();
  daftar.forEach((e) => unik.set(e.id, e));
  return [...unik.values()].sort((a, b) => (a.mulai < b.mulai ? -1 : a.mulai > b.mulai ? 1 : 0));
}

// Ilustrasi kapur untuk tiap pengumuman (components/Ilustrasi.js).
export const ILUS_KABAR = {
  literasi: { jenis: 'buku', alt: 'Ilustrasi kapur: buku terbuka dengan pembatas kuning' },
  pertemuan: { jenis: 'pertemuan', alt: 'Ilustrasi kapur: meja dan kursi pertemuan dengan balon percakapan' },
  gigi: { jenis: 'gigi', alt: 'Ilustrasi kapur: gigi dan sikat gigi' },
  kebun: { jenis: 'bibit', alt: 'Ilustrasi kapur: baki bibit tanaman di bawah matahari' },
  sas: { jenis: 'sas', alt: 'Ilustrasi kapur: lembar soal bercentang dan pensil' },
  kantin: { jenis: 'kantin', alt: 'Ilustrasi kapur: botol air, segelas susu, dan apel' },
  libur: { jenis: 'libur', alt: 'Ilustrasi kapur: kalender dan matahari' },
};

export function pengumuman(hari, sem, anak) {
  const ag = agenda(hari, sem, anak);
  const cari = (id) => ag.find((e) => e.id === id);
  const tg = (iso) => fmtTanggal(iso, { tahun: false });
  const daftar = [];
  const mundur = (n) => {
    const d = tambahHari(hari, -n);
    return d < sem.mulai ? sem.mulai : d;
  };

  if (sem.libur) {
    daftar.push({
      id: 'libur', tanggal: tambahHari(hari, -2), kategori: 'Akademik', judul: 'Selamat berlibur, sampai jumpa di semester baru',
      isi: [
        `Kegiatan belajar dimulai lagi ${fmtTanggal(sem.mulaiBerikut)}. Jadwal pelajaran semester baru akan tampil di Kapur seminggu sebelumnya.`,
        'Selama libur, perpustakaan tetap buka Senin–Kamis 08.00–11.00 WIB untuk peminjaman buku.',
      ],
    });
  }
  const literasi = cari('literasi');
  if (literasi) {
    daftar.push({
      id: 'literasi', tanggal: mundur(1), kategori: 'Kegiatan', judul: 'Pekan Literasi dimulai Senin depan',
      isi: [
        `Pekan Literasi berlangsung ${tg(literasi.mulai)} sampai ${tg(literasi.selesai)}. Setiap pagi pukul 07.00–07.30 ada membaca bersama di halaman sekolah.`,
        'Anak boleh membawa satu buku dari rumah, diberi nama di sampulnya. Buku akan dikembalikan pada hari terakhir.',
        anak.tingkat >= 4
          ? `Lomba mendongeng kelas 4–6 diadakan ${tg(cari('dongeng').mulai)}. Iuran pojok baca Rp75.000 sudah tercantum di menu Tagihan.`
          : 'Untuk kelas 1–3 ada kegiatan dongeng bersama guru setiap hari selama pekan ini.',
      ],
      terkait: anak.tingkat >= 4 ? { href: '/tagihan/literasi', label: 'Lihat tagihan iuran' } : null,
    });
  }
  const pertemuan = cari('pertemuan');
  if (pertemuan) {
    daftar.push({
      id: 'pertemuan', tanggal: mundur(3), kategori: 'Akademik', judul: pertemuan.judul,
      isi: [
        `${GURU[anak.wali].panggil} mengundang orang tua kelas ${kelasAnak(anak)} pada ${fmtTanggal(pertemuan.mulai, { tahun: false })}, pukul ${pertemuan.jam}, di ${pertemuan.lokasi.toLowerCase()}.`,
        'Agenda: perkembangan belajar setengah semester, persiapan Sumatif Akhir Semester, dan rencana kegiatan kelas.',
        'Mohon konfirmasi kehadiran di bawah supaya kursi dan materi bisa disiapkan.',
      ],
      rsvp: 'pertemuan',
    });
  }
  const gigi = cari('gigi');
  if (gigi) {
    daftar.push({
      id: 'gigi', tanggal: mundur(5), kategori: 'Kesehatan', judul: 'Pemeriksaan gigi gratis di UKS',
      isi: [
        `Petugas puskesmas akan memeriksa gigi siswa kelas 1–6 pada ${fmtTanggal(gigi.mulai, { tahun: false })}, pukul 08.00–11.00 WIB. Tidak ada biaya.`,
        'Anak cukup sikat gigi seperti biasa di rumah. Hasil pemeriksaan dikirim lewat wali kelas.',
      ],
    });
  }
  const kebun = cari('kebun');
  if (kebun && anak.tingkat <= 3) {
    daftar.push({
      id: 'kebun', tanggal: mundur(6), kategori: 'Kegiatan', judul: 'Kunjungan kebun edukasi kelas 1–3',
      isi: [
        `Kelas 1–3 berkunjung ke kebun edukasi desa pada ${fmtTanggal(kebun.mulai, { tahun: false })}. Berangkat 07.30 dari sekolah dan kembali sekitar 11.00 WIB.`,
        'Anak memakai kaus olahraga, topi, dan membawa botol minum. Iuran Rp60.000 untuk transport dan bibit tanaman yang dibawa pulang.',
      ],
      terkait: { href: '/tagihan/kebun', label: 'Lihat tagihan iuran' },
    });
  }
  const sas = cari('sas');
  if (sas && !sem.libur && hari < sas.mulai) {
    daftar.push({
      id: 'sas', tanggal: mundur(9), kategori: 'Akademik', judul: `Jadwal Sumatif Akhir Semester ${sem.nama.toLowerCase()}`,
      isi: [
        `Sumatif Akhir Semester dilaksanakan ${tg(sas.mulai)} sampai ${tg(sas.selesai)}. Kisi-kisi tiap mapel dibagikan lewat Kapur dua minggu sebelumnya.`,
        `Pembagian rapor dijadwalkan ${fmtTanggal(sem.selesai, { tahun: false })}.`,
      ],
    });
  }
  daftar.push({
    id: 'kantin', tanggal: mundur(12), kategori: 'Kesehatan', judul: 'Kantin sehat: tanpa minuman berpemanis kemasan',
    isi: [
      'Mulai semester ini kantin sekolah hanya menjual air putih, susu tanpa tambahan gula, dan jajanan dari daftar menu sehat koperasi.',
      'Orang tua tetap boleh membawakan bekal dari rumah. Catatan alergi anak bisa dicek di menu Profil.',
    ],
  });
  return daftar.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
}

/* ---------- Absensi ---------- */

function hariKhusus(anak, hari, sem) {
  const pada = (mundur) => hariSekolahSebelum(tambahHari(hari, -mundur), sem);
  const daftar = {};
  if (anak.id === 'nayla') {
    const s1 = pada(17);
    if (s1) {
      daftar[s1] = { status: 'S', ket: 'Demam, surat dokter dilampirkan' };
      const s2 = hariSekolahBerikut(tambahHari(s1, 1), sem);
      if (s2 && s2 < hari) daftar[s2] = { status: 'S', ket: 'Masih masa pemulihan' };
    }
    const i1 = pada(38);
    if (i1) daftar[i1] = { status: 'I', ket: 'Acara keluarga di Blitar' };
    const t1 = pada(8);
    if (t1 && !daftar[t1]) daftar[t1] = { status: 'H', telat: 9 };
  } else {
    const s1 = pada(9);
    if (s1) daftar[s1] = { status: 'S', ket: 'Batuk pilek' };
    const t1 = pada(4);
    if (t1 && !daftar[t1]) daftar[t1] = { status: 'H', telat: 6 };
    const i1 = pada(29);
    if (i1) daftar[i1] = { status: 'I', ket: 'Mengantar nenek kontrol ke rumah sakit' };
  }
  return daftar;
}

/** Rentang tanggal yang tercakup oleh pengajuan izin. */
export function tanggalIzin(izin, sem) {
  const hasil = [];
  let d = izin.mulai;
  for (let i = 0; i < 20 && hasil.length < izin.lama; i++) {
    if (hariSekolah(d, sem)) hasil.push(d);
    d = tambahHari(d, 1);
  }
  return hasil;
}

export function statusIzin(izin, sekarangMs) {
  return sekarangMs - izin.dibuat > 6000 ? 'disetujui' : 'menunggu';
}

export function absensi(anak, hari, sem, sekarangMs, izinPengguna = []) {
  const khusus = hariKhusus(anak, hari, sem);
  const tumpang = {};
  izinPengguna
    .filter((z) => z.anak === anak.id)
    .forEach((z) => tanggalIzin(z, sem).forEach((d) => {
      tumpang[d] = { status: z.jenis === 'sakit' ? 'S' : 'I', ket: z.alasan, dariPengguna: true, izinId: z.id, persetujuan: statusIzin(z, sekarangMs) };
    }));
  const hasil = [];
  const akhir = hari > sem.selesai ? sem.selesai : hari;
  let d = sem.mulai;
  const menitKini = Math.floor(((sekarangMs + 7 * 3600000) % 86400000) / 60000);
  while (d <= akhir) {
    if (hariSekolah(d, sem)) {
      const r = acak(`${anak.id}-${d}`);
      const pulang = jamPulang(anak, d);
      let e = { tanggal: d, status: 'H', masuk: menitKeJam(jamKeMenit('06.30') + Math.floor(r * 26)), pulang: menitKeJam(jamKeMenit(pulang) + 3 + Math.floor(r * 11)) };
      if (khusus[d]) {
        const k = khusus[d];
        if (k.status === 'H') e = { ...e, masuk: menitKeJam(jamKeMenit('07.00') + k.telat), telat: k.telat };
        else e = { tanggal: d, status: k.status, ket: k.ket };
      }
      if (tumpang[d]) e = { tanggal: d, ...tumpang[d] };
      if (d === hari && e.status === 'H') {
        if (menitKini < jamKeMenit(e.masuk)) e = { tanggal: d, status: 'belum' };
        else if (menitKini < jamKeMenit(e.pulang)) e = { ...e, pulang: null };
      }
      hasil.push(e);
    }
    d = tambahHari(d, 1);
  }
  // Izin untuk hari-hari mendatang.
  Object.keys(tumpang).filter((t) => t > akhir).sort().forEach((t) => hasil.push({ tanggal: t, ...tumpang[t], mendatang: true }));
  return hasil;
}

export function rekapAbsensi(daftar) {
  const r = { H: 0, S: 0, I: 0, A: 0, telat: 0, total: 0 };
  daftar.forEach((e) => {
    if (e.mendatang || e.status === 'belum') return;
    r.total += 1;
    r[e.status] += 1;
    if (e.telat) r.telat += 1;
  });
  r.persen = r.total ? Math.round((r.H / r.total) * 1000) / 10 : 0;
  return r;
}

/* ---------- Tugas ---------- */

const TUGAS_TEMPLAT = {
  5: [
    { id: 't5a', mapel: 'seni', judul: 'Kolase daun kering', rincian: 'Bawa 10 lembar daun kering berbagai bentuk dan lem kertas. Kolase dikerjakan di kelas.', cara: 'Bahan dibawa ke sekolah', bawa: true },
    { id: 't5b', mapel: 'ipas', judul: 'Laporan pengamatan siklus air', rincian: 'Amati embun di luar gelas berisi es selama 15 menit. Tulis apa yang terjadi, lalu gambar siklus air sederhana di buku tugas.', cara: 'Buku tugas dibawa ke sekolah' },
    { id: 't5c', mapel: 'mtk', judul: 'Latihan pecahan senilai, hal. 42–43', rincian: 'Kerjakan nomor 1–10 di buku latihan. Tulis cara pengerjaannya, bukan hanya jawaban akhir.', cara: 'Buku latihan dibawa ke sekolah' },
    { id: 't5d', mapel: 'bjawa', judul: 'Hafalan tembang Gundul-gundul Pacul', rincian: 'Hafalkan bait pertama dan artinya. Setoran dilakukan bergiliran di depan kelas.', cara: 'Setoran lisan di kelas' },
    { id: 't5e', mapel: 'bindo', judul: 'Ringkasan cerita rakyat Jawa Timur', rincian: 'Pilih satu cerita rakyat dari pojok baca. Tulis ringkasan dua paragraf dan sebutkan tokoh yang paling kamu sukai beserta alasannya.', cara: 'Ditulis tangan di buku tugas' },
    { id: 't5f', mapel: 'pancasila', judul: 'Tabel gotong royong di rumah', rincian: 'Catat tiga kegiatan gotong royong di rumah selama seminggu. Minta paraf orang tua di setiap baris.', cara: 'Lembar tabel dibawa ke sekolah' },
  ],
  2: [
    { id: 't2a', mapel: 'bindo', judul: 'Membaca nyaring 10 menit setiap malam', rincian: 'Dampingi anak membaca nyaring. Tulis judul buku dan paraf di kartu baca setiap malam.', cara: 'Kartu baca dibawa setiap Senin' },
    { id: 't2b', mapel: 'mtk', judul: 'Menghitung uang mainan sampai Rp10.000', rincian: 'Gunakan uang mainan dari lembar kerja. Susun lima cara membayar belanjaan senilai Rp7.500.', cara: 'Lembar kerja dibawa ke sekolah' },
    { id: 't2c', mapel: 'seni', judul: 'Mewarnai rumah adat Joglo', rincian: 'Warnai gambar rumah Joglo di lembar kerja dengan teknik gradasi pensil warna.', cara: 'Lembar kerja dibawa ke sekolah' },
    { id: 't2d', mapel: 'pjok', judul: 'Bawa kaus olahraga dan botol minum', rincian: 'Pelajaran PJOK di lapangan. Kaus olahraga dipakai dari rumah, seragam dibawa di tas.', cara: 'Dipakai dari rumah', bawa: true },
    { id: 't2e', mapel: 'bjawa', judul: 'Angka 1–10 dalam bahasa Jawa', rincian: 'Latih anak menyebut siji sampai sepuluh sambil menghitung benda di rumah.', cara: 'Setoran lisan di kelas' },
    { id: 't2f', mapel: 'pancasila', judul: 'Gambar aturan di rumahku', rincian: 'Gambar satu aturan di rumah (misalnya merapikan mainan) dan ceritakan alasannya kepada orang tua.', cara: 'Gambar dibawa ke sekolah' },
  ],
};

const JARAK_TUGAS = [1, 2, 4, 6, -3, -7];

export function tugas(anak, hari, sem) {
  if (sem.libur) return [];
  return TUGAS_TEMPLAT[anak.tingkat].map((t, i) => {
    const jarak = JARAK_TUGAS[i];
    let tenggat = jarak > 0 ? hariSekolahBerikut(tambahHari(hari, jarak), sem) : hariSekolahSebelum(tambahHari(hari, jarak), sem);
    if (!tenggat) tenggat = jarak > 0 ? sem.selesai : sem.mulai;
    const diberi = hariSekolahSebelum(tambahHari(tenggat, -5), sem) || sem.mulai;
    let status = 'belum';
    let nilai = null;
    if (jarak <= -6) {
      status = 'dinilai';
      nilai = 80 + Math.floor(acak(`${anak.id}-${t.id}`) * 17);
    } else if (jarak < 0) status = 'dikumpulkan';
    return { ...t, tenggat, jam: '07.00', diberi, status, nilai, guru: guruMapel(t.mapel, anak) };
  });
}

/* ---------- Nilai & rapor ---------- */

const WALI_LAMA = {
  nayla: { 3: 'Retno Wulandari, S.Pd.', 4: 'Anjani Puspitasari, S.Pd.' },
  bima: { 1: 'Siti Maesaroh, S.Pd.' },
};

export function riwayatSemester(anak, sem) {
  const hasil = [];
  for (let t = anak.mulaiTingkat; t <= anak.tingkat; t++) {
    for (let n = 1; n <= 2; n++) {
      if (t === anak.tingkat && n >= sem.nomor) {
        // Semester berjalan: hanya masuk riwayat bila sudah selesai (masa libur).
        if (!(n === sem.nomor && sem.libur)) continue;
      }
      hasil.push({ kunci: `${t}-${n}`, tingkat: t, nomor: n, label: `Kelas ${t} ${n === 1 ? 'Ganjil' : 'Genap'}`, pendek: `${t}.${n}`, ta: `${sem.awalTA - (anak.tingkat - t)}/${sem.awalTA - (anak.tingkat - t) + 1}` });
    }
  }
  return hasil;
}

export function skorSemester(anak, mapel, tingkat, nomor) {
  const dasar = BAKAT[anak.id][mapel];
  const urut = (tingkat - anak.tingkat) * 2 + (nomor - 2);
  const naik = urut * 1.3;
  const bising = (acak(`${anak.id}-${mapel}-${tingkat}-${nomor}`) - 0.5) * 7;
  return Math.round(batas(dasar + naik + bising, 68, 98));
}

const PENILAIAN = [
  { minggu: 4, kode: 'SLM 1', jenis: 'Sumatif lingkup materi', topik: 0 },
  { minggu: 8, kode: 'SLM 2', jenis: 'Sumatif lingkup materi', topik: 1 },
  { minggu: 12, kode: 'STS', jenis: 'Sumatif tengah semester' },
  { minggu: 15, kode: 'SLM 3', jenis: 'Sumatif lingkup materi', topik: 2 },
  { minggu: 18, kode: 'SLM 4', jenis: 'Sumatif lingkup materi', topik: 3 },
  { minggu: 21, kode: 'SAS', jenis: 'Sumatif akhir semester' },
];

export function penilaianSemester(anak, mapel, hari, sem) {
  const daftar = mapelUntuk(anak.tingkat);
  const idx = daftar.indexOf(mapel);
  const target = skorSemester(anak, mapel, anak.tingkat, sem.nomor);
  const topik = topikUntuk(mapel, anak.tingkat);
  return PENILAIAN.map((p) => {
    let tanggal = tambahHari(sem.mulai, (p.minggu - 1) * 7 + (idx % 5));
    if (p.kode === 'SAS') tanggal = tambahHari(sem.selesai, -11 + (idx % 5));
    const nilai = Math.round(batas(target + (acak(`${anak.id}-${mapel}-${p.kode}-${sem.ta}`) - 0.5) * 10, 65, 100));
    return { ...p, tanggal, unggah: tambahHari(tanggal, 2), nilai, nama: p.topik !== undefined ? topik[p.topik] : p.jenis };
  }).filter((p) => p.unggah <= hari);
}

export function rataRata(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function predikat(n) {
  if (n >= 90) return 'Sangat baik';
  if (n >= 82) return 'Baik';
  if (n >= SEKOLAH.batasTuntas) return 'Cukup';
  return 'Perlu bimbingan';
}

export function deskripsiCapaian(anak, mapel, tingkat, nilai, kunci) {
  const topik = topikUntuk(mapel, tingkat);
  const i = Math.floor(acak(`${anak.id}-${mapel}-${kunci}-d`) * topik.length);
  const kuat = kecilAwal(topik[i]);
  const perlu = kecilAwal(topik[(i + 2) % topik.length]);
  const nama = anak.panggil;
  if (nilai >= 90) return `${nama} sangat baik dalam ${kuat} dan mampu menjelaskannya kembali dengan kata-kata sendiri.`;
  if (nilai >= 82) return `${nama} baik dalam ${kuat}. Perlu latihan lanjutan pada ${perlu}.`;
  if (nilai >= SEKOLAH.batasTuntas) return `${nama} cukup dalam ${kuat}. Perlu pendampingan pada ${perlu}.`;
  return `${nama} perlu bimbingan pada ${perlu}. Disarankan latihan singkat secara rutin di rumah.`;
}

const CATATAN_WALI = {
  nayla: 'Nayla rajin bertanya dan senang membantu teman. Semester depan, ayo latih ketelitian saat berhitung pecahan. Pertahankan kebiasaan membacamu!',
  bima: 'Bima ceria dan cepat akrab dengan teman. Membacanya makin lancar. Terus berlatih menulis rapi, ya, Bima.',
};

export function raporTerakhir(anak, sem) {
  const riwayat = riwayatSemester(anak, sem);
  const r = riwayat[riwayat.length - 1];
  if (!r) return null;
  const mapel = mapelUntuk(r.tingkat).map((m) => {
    const nilai = skorSemester(anak, m, r.tingkat, r.nomor);
    return { id: m, nama: MAPEL[m].nama, nilai, predikat: predikat(nilai), deskripsi: deskripsiCapaian(anak, m, r.tingkat, nilai, r.kunci) };
  });
  const a = acak(`${anak.id}-${r.kunci}-hadir`);
  const wali = r.tingkat === anak.tingkat ? GURU[anak.wali].nama : WALI_LAMA[anak.id][r.tingkat];
  return {
    ...r,
    kelas: `${r.tingkat}${anak.rombel}`,
    mapel,
    rata: rataRata(mapel.map((m) => m.nilai)),
    hadir: { S: 1 + Math.floor(a * 3), I: Math.floor(a * 2), A: 0 },
    ekskul: anak.ekskul.map((e, i) => ({ nama: e.replace(' (wajib)', ''), predikat: acak(`${anak.id}-${e}-${r.kunci}`) > 0.4 || i === 0 ? 'Baik' : 'Sangat baik' })),
    catatan: CATATAN_WALI[anak.id],
    wali,
    keputusan: r.nomor === 2 ? `Naik ke kelas ${r.tingkat + 1}` : null,
    dibagikan: r.nomor === 1 ? akhirGanjil(Number(r.ta.slice(0, 4))) : akhirGenap(Number(r.ta.slice(0, 4)) + 1),
  };
}

/* ---------- Tagihan ---------- */

export function bulanTA(awalTA, urut) {
  // urut 1 = Juli ... 12 = Juni
  return tambahBulan(awalTA, 7, urut - 1);
}

export function idSpp(urut) {
  return `spp-${String(urut).padStart(2, '0')}`;
}

export const SEMUA_ID_TAGIHAN = [...Array.from({ length: 12 }, (_, i) => idSpp(i + 1)), 'buku', 'literasi', 'kebun'];

function riwayatBayar(anak, t) {
  const r = acak(`${anak.id}-${t.id}-bayar`);
  const tgl = tambahHari(t.jatuhTempo, -(3 + Math.floor(r * 8)));
  const pada = tgl < t.terbit ? t.terbit : tgl;
  const metode = r > 0.45 ? 'QRIS' : 'Transfer virtual account';
  const ms = msPada(pada, menitKeJam(jamKeMenit('07.10') + Math.floor(r * 760)));
  return { ms, metode, nomor: nomorBukti(anak, t.id, pada) };
}

export function nomorBukti(anak, id, tanggal) {
  return `KPR-${tanggal.replace(/-/g, '')}-${anak.nis.slice(-4)}-${id.toUpperCase()}`;
}

export function tagihan(anak, hari, sem, dibayar = {}) {
  const daftar = [];
  for (let u = 1; u <= 12; u++) {
    const { tahun, bulan } = bulanTA(sem.awalTA, u);
    const sebelum = tambahBulan(tahun, bulan, -1);
    const terbit = u === 1 ? isoDari(tahun, bulan, 1) : isoDari(sebelum.tahun, sebelum.bulan, 16);
    if (terbit > hari) break;
    daftar.push({ id: idSpp(u), jenis: 'spp', judul: `SPP ${BULAN[bulan - 1]} ${tahun}`, rincian: `Sumbangan pembinaan pendidikan bulan ${BULAN[bulan - 1]}, kelas ${kelasAnak(anak)}.`, nominal: anak.spp, terbit, jatuhTempo: isoDari(tahun, bulan, 15) });
  }
  const buku = { id: 'buku', jenis: 'lain', judul: `Buku pendamping semester ${sem.nama.toLowerCase()}`, rincian: 'Paket buku latihan dan lembar kerja untuk satu semester.', nominal: anak.tingkat >= 4 ? 185000 : 150000, terbit: tambahHari(sem.mulai, -10), jatuhTempo: tambahHari(sem.mulai, 4) };
  if (buku.terbit <= hari) daftar.push(buku);
  if (!sem.libur && anak.tingkat >= 4) {
    daftar.push({ id: 'literasi', jenis: 'lain', judul: 'Iuran pojok baca Pekan Literasi', rincian: 'Untuk buku bacaan baru pojok baca kelas dan hadiah lomba mendongeng.', nominal: 75000, terbit: tambahHari(hari, -1), jatuhTempo: tambahHari(hari, 6) });
  }
  if (!sem.libur && anak.tingkat <= 3) {
    daftar.push({ id: 'kebun', jenis: 'lain', judul: 'Iuran kunjungan kebun edukasi', rincian: 'Transport pulang-pergi dan bibit tanaman yang dibawa pulang anak.', nominal: 60000, terbit: tambahHari(hari, -6), jatuhTempo: tambahHari(hari, 5) });
  }
  const semua = daftar.map((t) => {
    const demo = dibayar[`${anak.id}:${t.id}`];
    if (demo) return { ...t, status: 'lunas', bayar: demo, demo: true };
    if (t.jatuhTempo < hari) return { ...t, status: 'lunas', bayar: riwayatBayar(anak, t) };
    return { ...t, status: 'belum' };
  });
  const belum = semua.filter((t) => t.status === 'belum').sort((a, b) => a.jatuhTempo.localeCompare(b.jatuhTempo));
  const lunas = semua.filter((t) => t.status === 'lunas').sort((a, b) => (b.bayar.ms || 0) - (a.bayar.ms || 0));
  return [...belum, ...lunas];
}

export function nomorVA(anak, id) {
  const r = Math.floor(acak(`${anak.id}-${id}-va`) * 9000) + 1000;
  return `8817 ${anak.nis.replace('.', ' ')} ${r}`;
}

/* ---------- Pesan ---------- */

export function pesanAwal(anak, hari, sekarangMs) {
  const p = (hariMundur, jam, dari, teks, id) => ({ id, dari, ms: msPada(tambahHari(hari, -hariMundur), jam), teks });
  let daftar;
  if (anak.id === 'nayla') {
    daftar = [
      p(2, '13.10', 'guru', 'Selamat siang, Bu Ratna. Hari ini Nayla memimpin diskusi kelompok IPAS tentang siklus air. Penjelasannya runtut dan teman-temannya ikut aktif.', 'n1'),
      p(2, '19.42', 'ortu', 'Terima kasih kabarnya, Bu Sekar. Di rumah dia juga semangat cerita soal embun di gelas.', 'n2'),
      p(1, '07.05', 'ortu', 'Bu, laporan pengamatan boleh ditulis di kertas folio atau harus di buku tugas?', 'n3'),
      p(1, '09.48', 'guru', 'Di buku tugas saja, Bu. Gambarnya boleh diwarnai pensil warna.', 'n4'),
    ];
    const pengingat = msPada(hari, '06.55') <= sekarangMs ? p(0, '06.55', 'guru', 'Pengingat: untuk kolase Seni Rupa, mohon dibawakan 10 lembar daun kering dan lem kertas. Terima kasih.', 'n5') : p(1, '15.20', 'guru', 'Pengingat: untuk kolase Seni Rupa, mohon dibawakan 10 lembar daun kering dan lem kertas. Terima kasih.', 'n5');
    daftar.push(pengingat);
  } else {
    daftar = [
      p(3, '12.30', 'guru', 'Bu Ratna, Bima sudah lancar membaca kalimat pendek. Mohon tetap didampingi membaca 10 menit setiap malam, ya.', 'b1'),
      p(3, '20.05', 'ortu', 'Siap, Pak Danu. Semalam dia membaca cerita Si Kancil dua halaman.', 'b2'),
      p(1, '10.15', 'guru', 'Kartu baca Bima minggu ini sudah saya paraf. Konsistensinya bagus sekali.', 'b3'),
    ];
  }
  return daftar.sort((a, b) => a.ms - b.ms);
}

/** Batas "sudah dibaca" bawaan: setelah pesan terakhir orang tua di data awal. */
export function dibacaAwal(anak, hari, sekarangMs) {
  const d = pesanAwal(anak, hari, sekarangMs).filter((m) => m.dari === 'ortu');
  return d.length ? d[d.length - 1].ms + 1 : 0;
}

export function jamLayananGuru(ms) {
  const w = new Date(ms + 7 * 3600000);
  const h = w.getUTCDay();
  const menit = w.getUTCHours() * 60 + w.getUTCMinutes();
  return h >= 1 && h <= 5 && menit >= 7 * 60 && menit < 15 * 60;
}

export function balasanOtomatis(teks, anak, ms) {
  const g = GURU[anak.wali];
  const t = teks.toLowerCase();
  if (!jamLayananGuru(ms)) {
    return `Pesan diterima. ${g.panggil} membalas pada jam sekolah, ${SEKOLAH.jamLayanan}.`;
  }
  if (/izin|sakit|demam|tidak masuk/.test(t)) return `Baik, Bu Ratna. Supaya tercatat resmi, silakan ajukan lewat menu Absensi. Semoga ${anak.panggil} lekas sehat dan urusannya lancar.`;
  if (/tugas|\bpr\b|pekerjaan rumah|dikumpul/.test(t)) return 'Rincian tugas dan tenggatnya ada di menu Tugas, Bu. Kalau masih ada yang kurang jelas, besok saya jelaskan lagi di kelas.';
  if (/nilai|rapor|ulangan|sumatif/.test(t)) return 'Nilai sumatif terbaru sudah saya unggah di menu Nilai. Kalau ingin membahasnya, kita bisa bertemu setelah jam pulang.';
  if (/jemput|pulang|antar/.test(t)) return `Siap, Bu. Saya sampaikan ke petugas gerbang. ${anak.panggil} menunggu di pos satpam sampai dijemput.`;
  if (/terima kasih|makasih|matur nuwun/.test(t)) return 'Sama-sama, Bu Ratna.';
  return `Terima kasih, Bu Ratna. Pesannya sudah saya terima dan akan saya tindak lanjuti.`;
}

/* ---------- Catatan wali kelas ---------- */

const CATATAN = {
  nayla: [
    'Bu, Nayla hari ini membantu menata pojok baca. Terima kasih sudah dibiasakan dari rumah.',
    'Nayla berani bertanya saat pecahan terasa sulit. Pertanyaannya membantu teman sekelas juga.',
    'Presentasi kelompok IPAS hari ini runtut. Nayla membagi giliran bicara dengan adil.',
    'Hari ini Nayla lupa membawa buku tugas. Mohon dibantu cek tas tiap malam, ya, Bu.',
    'Nayla menulis ringkasan cerita rakyat dengan rapi dan kata-kata sendiri.',
    'Latihan tembang Gundul-gundul Pacul sudah lancar. Tinggal penghayatan di bait kedua.',
    'Nayla tadi menemani teman yang sakit ke UKS sampai dijemput. Sikap yang bagus sekali.',
    'Bekal hari ini habis dan Nayla ikut mengingatkan teman membuang sampah di tempatnya.',
  ],
  bima: [
    'Bima hari ini membaca nyaring di depan kelas dengan suara jelas. Hebat!',
    'Bima sempat menangis saat kalah lomba lari, lalu bangkit dan memberi selamat temannya.',
    'Hari ini Bima menghitung uang mainan sampai Rp10.000 tanpa bantuan.',
    'Mohon Bima dibiasakan minum air putih di sekolah. Botolnya masih penuh saat pulang.',
    'Gambar rumah Joglo Bima rapi, gradasi warnanya bagus. Sudah dipajang di kelas.',
    'Bima membantu membagikan buku ke teman-teman tanpa disuruh. Terima kasih, Bu.',
    'Bima sudah bisa menyebut angka 1–10 dalam bahasa Jawa. Ayo lanjut sampai 20.',
    'Tadi Bima sedikit mengantuk di jam kedua. Semoga tidurnya cukup malam ini.',
  ],
};

/** Catatan wali kelas terbaru: catatan hari ini terbit 30 menit setelah jam pulang. */
export function catatanGuru(anak, hari, sem, sekarangMs) {
  let d = hariSekolahSebelum(hari, sem);
  if (d === hari) {
    const pulang = jamPulang(anak, hari);
    if (!pulang || sekarangMs < msPada(hari, menitKeJam(jamKeMenit(pulang) + 30))) d = hariSekolahSebelum(tambahHari(hari, -1), sem);
  }
  if (!d) return null;
  const daftar = CATATAN[anak.id];
  const i = Math.floor(acak(`${anak.id}-${d}-catatan`) * daftar.length);
  const pulang = jamPulang(anak, d);
  return { tanggal: d, teks: daftar[i], guru: GURU[anak.wali], ms: msPada(d, menitKeJam(jamKeMenit(pulang) + 30)) };
}

/* ---------- Antar-jemput ---------- */

export function antarJemput(anak, hari, sem, sekarangMs) {
  const a = anak.antar;
  if (!a) return null;
  if (!hariSekolah(hari, sem)) {
    const besok = hariSekolahBerikut(tambahHari(hari, 1), sem);
    return { ...a, tahap: 'libur', judul: 'Tidak ada antar-jemput hari ini', ket: besok ? `Jemput berikutnya ${fmtTanggal(besok, { tahun: false })}, pukul ${a.jemput} di ${a.titik}.` : 'Antar-jemput mulai lagi saat sekolah masuk.' };
  }
  const m = Math.floor(((sekarangMs + 7 * 3600000) % 86400000) / 60000);
  const pulang = jamPulang(anak, hari);
  const berangkatPulang = jamKeMenit(pulang) + 10;
  const sampai = berangkatPulang + a.lama;
  const tahapan = [
    { batas: jamKeMenit(a.jemput) - 10, tahap: 'siap', judul: `Jemput pukul ${a.jemput}`, ket: `${a.sopir} menjemput di ${a.titik}. Siapkan ${anak.panggil} 10 menit lebih awal.` },
    { batas: jamKeMenit(a.tiba), tahap: 'berangkat', judul: 'Di perjalanan ke sekolah', ket: `Perkiraan tiba di sekolah ${a.tiba}.` },
    { batas: berangkatPulang, tahap: 'sekolah', judul: `${anak.panggil} di sekolah`, ket: `Pulang naik antar-jemput, berangkat dari sekolah ${menitKeJam(berangkatPulang)}.` },
    { batas: sampai, tahap: 'pulang', judul: 'Di perjalanan pulang', ket: `Perkiraan sampai di ${a.titik} ${menitKeJam(sampai)}.` },
    { batas: 24 * 60, tahap: 'sampai', judul: 'Sudah sampai rumah', ket: `Diantar sampai ${a.titik} sekitar ${menitKeJam(sampai)}.` },
  ];
  const t = tahapan.find((x) => m < x.batas) || tahapan[tahapan.length - 1];
  const urut = ['siap', 'berangkat', 'sekolah', 'pulang', 'sampai'];
  return { ...a, ...t, langkah: urut.indexOf(t.tahap), jamPulang: menitKeJam(berangkatPulang) };
}

export { ANAK };
