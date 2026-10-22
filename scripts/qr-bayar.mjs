// Membuat jalur SVG untuk QR simulasi pembayaran (bukan QRIS sungguhan).
// Jalankan: node scripts/qr-bayar.mjs  →  menulis src/lib/qr-bayar.js
import { writeFileSync } from 'node:fs';
import QRCode from 'qrcode';

const TEKS = 'SIMULASI PEMBAYARAN DEMO KAPUR (PintuWeb). Bukan QRIS sungguhan, tidak ada uang yang berpindah. https://app-sekolah.pintuweb.id';
const qr = QRCode.create(TEKS, { errorCorrectionLevel: 'M' });
const n = qr.modules.size;
let d = '';
for (let y = 0; y < n; y++) {
  let x = 0;
  while (x < n) {
    if (qr.modules.get(x, y)) {
      let w = 1;
      while (x + w < n && qr.modules.get(x + w, y)) w++;
      d += `M${x + 4} ${y + 4}h${w}v1h-${w}z`;
      x += w;
    } else x++;
  }
}
writeFileSync('src/lib/qr-bayar.js', `// Dibuat oleh scripts/qr-bayar.mjs. Isi QR: teks simulasi, bukan kode pembayaran.\nexport const QR_BAYAR = { ukuran: ${n + 8}, d: '${d}' };\n`);
console.log('QR', n, 'modul,', d.length, 'karakter');
