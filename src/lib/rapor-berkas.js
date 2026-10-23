// Rapor simulasi sebagai berkas HTML sederhana yang bisa dicetak atau disimpan sebagai PDF.
import { SEKOLAH } from './data';
import { desimal, fmtTanggal } from './waktu';

const esc = (t) => String(t).replace(/[&<>"]/g, (k) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[k]));

export function namaBerkasRapor(anak, r) {
  return `rapor-${anak.panggil.toLowerCase()}-${r.label.toLowerCase().replace(/\s+/g, '-')}-simulasi.html`;
}

export function htmlRapor(anak, r) {
  const baris = r.mapel.map((m) => `<tr><td>${esc(m.nama)}</td><td class="n">${m.nilai}</td><td>${esc(m.deskripsi)}</td></tr>`).join('');
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Rapor ${esc(anak.nama)} (simulasi)</title>
<style>body{font:14px/1.5 Georgia,serif;max-width:760px;margin:32px auto;padding:0 16px;color:#1c2621}h1{font-size:20px;text-align:center;margin:0}p.s{text-align:center;margin:4px 0 20px;color:#46544c}table{width:100%;border-collapse:collapse;margin:12px 0}td,th{border:1px solid #b8cfea;padding:6px 8px;vertical-align:top;text-align:left}td.n{text-align:center;font-weight:bold}.cat{font-style:italic;color:#2a5795}.dem{margin-top:24px;font:12px/1.4 system-ui,sans-serif;color:#7d3b35;border-top:1px dashed #e39a93;padding-top:8px}</style></head><body>
<h1>Laporan Hasil Belajar · ${esc(SEKOLAH.nama)}</h1><p class="s">${esc(SEKOLAH.kota)}</p>
<table><tr><th>Nama</th><td>${esc(anak.nama)}</td><th>NIS</th><td>${esc(anak.nis)}</td></tr><tr><th>Kelas</th><td>${esc(r.kelas)}</td><th>Semester</th><td>${r.nomor === 1 ? 'Ganjil' : 'Genap'} · ${esc(r.ta)}</td></tr></table>
<table><tr><th>Mata pelajaran</th><th>Nilai</th><th>Capaian kompetensi</th></tr>${baris}<tr><th>Rata-rata</th><td class="n">${desimal(r.rata)}</td><td></td></tr></table>
<p><b>Ketidakhadiran:</b> sakit ${r.hadir.S}, izin ${r.hadir.I}, tanpa keterangan ${r.hadir.A} hari.</p>
<p><b>Ekstrakurikuler:</b> ${r.ekskul.map((e) => `${esc(e.nama)} (${esc(e.predikat)})`).join(', ')}</p>
<p class="cat"><b>Catatan wali kelas:</b> ${esc(r.catatan)}</p>
${r.keputusan ? `<p><b>Keputusan:</b> ${esc(r.keputusan)}</p>` : ''}
<p>Dibagikan ${esc(fmtTanggal(r.dibagikan, { hari: false }))} · Wali kelas: ${esc(r.wali)} · Kepala sekolah: ${esc(SEKOLAH.kepala)}</p>
<p class="dem">Berkas simulasi dari demo aplikasi Kapur buatan PintuWeb. Sekolah, siswa, guru, dan nilai di sini rekaan.</p>
</body></html>`;
}
