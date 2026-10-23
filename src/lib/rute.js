// Nama rute untuk "Terakhir dibuka" di Lainnya.
export const NAMA_RUTE = [
  ['/absensi/izin', 'Ajukan izin', 'absen'],
  ['/absensi', 'Absensi', 'absen'],
  ['/tagihan/', 'Bayar tagihan', 'dompet'],
  ['/tagihan', 'Tagihan SPP', 'dompet'],
  ['/kabar', 'Kabar sekolah', 'kabar'],
  ['/pesan', 'Pesan wali kelas', 'pesan'],
  ['/nilai/rapor', 'Rapor', 'buku'],
  ['/nilai/', 'Nilai per mapel', 'nilai'],
  ['/profil', 'Profil anak', 'profil'],
];

export const namaRute = (p) => NAMA_RUTE.find(([r]) => (r.endsWith('/') ? p.startsWith(r) : p === r));
