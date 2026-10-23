# Kapur: demo aplikasi orang tua sekolah

Demo aplikasi mobile buatan [PintuWeb](https://www.pintuweb.id) untuk sekolah rekaan **SD Rindang Jati** (Kediri).
Orang tua memantau jadwal, absensi, nilai dan rapor, tugas, pengumuman, kalender akademik, tagihan SPP
(simulasi QRIS/transfer dan bukti bayar), serta berkirim pesan dengan wali kelas (balasan simulasi).
Semua nama, angka, dan data contoh rekaan; data contoh selalu relatif terhadap tanggal hari ini (WIB)
dan hanya disimpan di perangkat (AsyncStorage, di web = localStorage).

Live: https://app-sekolah.pintuweb.id

## Teknologi

- React Native 0.88 + Expo SDK 58, expo-router (web `output: "static"`, satu HTML per rute).
- Satu kode untuk Android, iOS, dan web. Di web, layar ≥768px menampilkan aplikasi di dalam bingkai ponsel
  dengan panel samping (dirender statis di `src/app/+html.js`, termasuk QR yang dibuat saat build).
- Font: Young Serif, Plus Jakarta Sans, Playwrite ID (OFL), disubset sendiri. Ilustrasi kapur dan tokoh digambar sendiri (SVG). Mode gelap lewat token CSS di web.

## Perintah

```bash
npm install
npx expo start          # pengembangan (tekan w untuk web, atau buka Expo Go)
npx expo export -p web  # build web ke dist/
node scripts/qr-bayar.mjs   # buat ulang QR simulasi pembayaran
```

Sumber gambar dan font: `assets/foto/SUMBER.md`.
