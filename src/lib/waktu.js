// Semua logika waktu memakai WIB (UTC+7, tanpa musim panas).
// "Tanggal" ditulis sebagai string ISO 'YYYY-MM-DD' menurut kalender WIB.

const JAM = 3600000;
const HARI_MS = 86400000;

export const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const HARI_PENDEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
export const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
export const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const dua = (n) => String(n).padStart(2, '0');

export function wib(ms = Date.now()) {
  const d = new Date(ms + 7 * JAM);
  return {
    tahun: d.getUTCFullYear(),
    bulan: d.getUTCMonth() + 1,
    tanggal: d.getUTCDate(),
    hari: d.getUTCDay(),
    jam: d.getUTCHours(),
    menit: d.getUTCMinutes(),
    ms,
  };
}

export function isoDari(tahun, bulan, tanggal) {
  return `${tahun}-${dua(bulan)}-${dua(tanggal)}`;
}

export function hariIni(ms = Date.now()) {
  const w = wib(ms);
  return isoDari(w.tahun, w.bulan, w.tanggal);
}

export function pecah(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

function angkaHari(iso) {
  const { y, m, d } = pecah(iso);
  return Math.round(Date.UTC(y, m - 1, d) / HARI_MS);
}

function dariAngkaHari(n) {
  const d = new Date(n * HARI_MS);
  return isoDari(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

export function tambahHari(iso, n) {
  return dariAngkaHari(angkaHari(iso) + n);
}

/** b dikurangi a, dalam hari. */
export function selisihHari(a, b) {
  return angkaHari(b) - angkaHari(a);
}

export function hariKe(iso) {
  return ((angkaHari(iso) % 7) + 7 + 4) % 7; // 1970-01-01 = Kamis
}

export function tambahBulan(tahun, bulan, n) {
  const t = tahun * 12 + (bulan - 1) + n;
  return { tahun: Math.floor(t / 12), bulan: (t % 12) + 1 };
}

export function jumlahHari(tahun, bulan) {
  return new Date(Date.UTC(tahun, bulan, 0)).getUTCDate();
}

/** Senin pertama pada atau setelah tanggal tertentu. */
export function seninPada(iso) {
  const h = hariKe(iso);
  return tambahHari(iso, h === 1 ? 0 : (8 - h) % 7);
}

/** Senin dari minggu tanggal itu (minggu dimulai Senin). */
export function awalMinggu(iso) {
  const h = hariKe(iso);
  return tambahHari(iso, -((h + 6) % 7));
}

export function fmtTanggal(iso, { hari = true, tahun = true, pendek = false } = {}) {
  const { y, m, d } = pecah(iso);
  const bln = pendek ? BULAN_PENDEK[m - 1] : BULAN[m - 1];
  const awal = hari ? `${(pendek ? HARI_PENDEK : HARI)[hariKe(iso)]}, ` : '';
  return `${awal}${d} ${bln}${tahun ? ` ${y}` : ''}`;
}

export function jamKeMenit(teks) {
  const [h, m] = teks.split('.').map(Number);
  return h * 60 + m;
}

export function menitKeJam(menit) {
  return `${dua(Math.floor(menit / 60))}.${dua(menit % 60)}`;
}

export function menitSekarang(ms = Date.now()) {
  const w = wib(ms);
  return w.jam * 60 + w.menit;
}

/** Waktu (ms epoch) untuk tanggal WIB + jam 'HH.MM'. */
export function msPada(iso, jam = '00.00') {
  const { y, m, d } = pecah(iso);
  return Date.UTC(y, m - 1, d) - 7 * JAM + jamKeMenit(jam) * 60000;
}

export function fmtJamDariMs(ms) {
  const w = wib(ms);
  return `${dua(w.jam)}.${dua(w.menit)}`;
}

export function relatifHari(iso, hariIniIso) {
  const n = selisihHari(hariIniIso, iso);
  if (n === 0) return 'Hari ini';
  if (n === 1) return 'Besok';
  if (n === 2) return 'Lusa';
  if (n === -1) return 'Kemarin';
  if (n > 0) return `${n} hari lagi`;
  return `${-n} hari lalu`;
}

/** Label singkat untuk waktu pesan: "09.14", "Kemarin 19.42", "Sel, 20 Okt 19.42". */
export function fmtWaktuPesan(ms, sekarangMs) {
  const tgl = hariIni(ms);
  const kini = hariIni(sekarangMs);
  const jam = fmtJamDariMs(ms);
  const n = selisihHari(tgl, kini);
  if (n === 0) return jam;
  if (n === 1) return `Kemarin ${jam}`;
  return `${fmtTanggal(tgl, { tahun: false, pendek: true })} ${jam}`;
}

export function sapaan(ms = Date.now()) {
  const j = wib(ms).jam;
  if (j >= 4 && j < 11) return 'Selamat pagi';
  if (j >= 11 && j < 15) return 'Selamat siang';
  if (j >= 15 && j < 18) return 'Selamat sore';
  return 'Selamat malam';
}

export function rupiah(n) {
  return `Rp${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/** Angka desimal gaya Indonesia: 86,4 */
export function desimal(n, digit = 1) {
  return n.toFixed(digit).replace('.', ',');
}
