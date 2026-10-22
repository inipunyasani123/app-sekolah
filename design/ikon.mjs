// Membuat ikon aplikasi (web + native) dari logo SVG buatan sendiri.
// Jalankan dari akar proyek: node design/ikon.mjs <path ke node_modules yang berisi sharp>
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(path.join(process.argv[2] || 'node_modules', 'sharp'));

const papan = '#1f4a3b';
const huruf = (s = 1, dx = 0, dy = 0) => `<g transform="translate(${dx} ${dy}) scale(${s})"><path d="M16 12.5v23M16.4 25.2 29 12.8M20.6 21.4l9.6 13.6" fill="none" stroke="#f5f0e4" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="30.5" y="33" width="11" height="4.6" rx="1.6" fill="#f2b632" transform="rotate(-24 36 35.3)"/></g>`;
const ikon = (sudut = 12) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect x="0" y="0" width="48" height="48" rx="${sudut}" fill="${papan}"/>${huruf()}</svg>`;
const penuh = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${papan}"/>${huruf(0.72, 6.2, 6.7)}</svg>`;
const latar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${papan}"/></svg>`;
const depan = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${huruf(0.62, 8.6, 9.2)}</svg>`;
const mono = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g transform="translate(8.6 9.2) scale(0.62)"><path d="M16 12.5v23M16.4 25.2 29 12.8M20.6 21.4l9.6 13.6" fill="none" stroke="#000" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="30.5" y="33" width="11" height="4.6" rx="1.6" fill="#000" transform="rotate(-24 36 35.3)"/></g></svg>`;

const png = (svg, n) => sharp(Buffer.from(svg), { density: 600 }).resize(n, n).png({ compressionLevel: 9 }).toBuffer();

writeFileSync('public/icon.svg', ikon());
writeFileSync('public/icon-192.png', await png(ikon(10), 192));
writeFileSync('public/icon-512.png', await png(ikon(10), 512));
writeFileSync('public/icon-maskable-512.png', await png(penuh, 512));
writeFileSync('public/apple-touch-icon.png', await png(penuh, 180));
writeFileSync('assets/icon.png', await png(penuh, 1024));
writeFileSync('assets/favicon.png', await png(ikon(), 48));
writeFileSync('assets/splash-icon.png', await png(ikon(), 400));
writeFileSync('assets/android-icon-background.png', await png(latar, 512));
writeFileSync('assets/android-icon-foreground.png', await png(depan, 512));
writeFileSync('assets/android-icon-monochrome.png', await png(mono, 512));
// favicon.ico berisi PNG 32×32 (didukung semua peramban modern).
const p32 = await png(ikon(9), 32);
const kepala = Buffer.alloc(22);
kepala.writeUInt16LE(0, 0); kepala.writeUInt16LE(1, 2); kepala.writeUInt16LE(1, 4);
kepala.writeUInt8(32, 6); kepala.writeUInt8(32, 7); kepala.writeUInt8(0, 8); kepala.writeUInt8(0, 9);
kepala.writeUInt16LE(1, 10); kepala.writeUInt16LE(32, 12); kepala.writeUInt32LE(p32.length, 14); kepala.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([kepala, p32]));
console.log('ikon selesai');
