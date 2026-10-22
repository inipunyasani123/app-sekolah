import { Svg, Path, Circle } from './svg';

// Ikon garis buatan sendiri, kanvas 24×24.
const JALUR = {
  rumah: 'M3.5 10.5 12 3.5l8.5 7M5.75 9v11h12.5V9M10 20v-5.5h4V20',
  jadwal: 'M4 6.5h16V20H4zM4 10.5h16M8.5 3.5v5M15.5 3.5v5M7.5 14h3M7.5 17h6',
  tugas: 'M5 20.5l1-4.2L16.6 5.7a2.1 2.1 0 0 1 3 3L9 19.3l-4 1.2zM14.6 7.7l3 3',
  nilai: 'M4 20h16M6.5 20v-6M11 20V9M15.5 20v-4M19.5 4.5l-4 4-3-2.5L7 11',
  menu: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  pesan: 'M4.5 5.5h15v10.5H10l-5.5 4V5.5zM8.5 9.5h7M8.5 12.5h4.5',
  kembali: 'M14.5 5.5 8 12l6.5 6.5',
  kanan: 'M9.5 5.5 16 12l-6.5 6.5',
  bawah: 'M5.5 9.5 12 16l6.5-6.5',
  centang: 'M5 12.5l4.5 4.5L19 7.5',
  silang: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
  tambah: 'M12 5v14M5 12h14',
  dompet: 'M4 7.5h16v12H4zM4 7.5 6.5 4h11L20 7.5M15 13.5h2.5',
  absen: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c.4-3.4 2.8-5.8 6-5.8s5.6 2.4 6 5.8M15.5 11.5l2 2 4-4',
  kabar: 'M4 10v4h3l8 4.5V5.5L7 10zM18 9.5a3.2 3.2 0 0 1 0 5M7 14l1.2 5h2.5L10 15.2',
  profil: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c.6-3.9 3.6-6.3 7.5-6.3s6.9 2.4 7.5 6.3',
  bulan: 'M19.5 14.5A7.8 7.8 0 1 1 9.5 4.5a6.2 6.2 0 0 0 10 10z',
  layar: 'M4 5h16v11H4zM9 20h6M12 16v4',
  salin: 'M8.5 8.5h11v11h-11zM5.5 15.5h-1v-11h11v1',
  bagikan: 'M12 15V3.5M7.5 8 12 3.5 16.5 8M5 12.5V20h14v-7.5',
  kirim: 'M4.5 11.5 19.5 4.5l-5 15-3.2-6.3z',
  lampiran: 'M19.5 11.2l-7.9 7.9a4.9 4.9 0 0 1-6.9-6.9l8-8a3.3 3.3 0 0 1 4.6 4.6l-7.9 8a1.6 1.6 0 0 1-2.3-2.3l7.2-7.2',
  jam: 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 7.5V12l3 2',
  info: 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 11v5.5M12 7.8v.4',
  tas: 'M6 9h12v11H6zM9 9V7a3 3 0 0 1 6 0v2M6 13.5h12M10.5 13.5v2h3v-2',
  kaos: 'M8.5 4 4 6.8l2 3.4 2-1V20h8V9.2l2 1 2-3.4L15.5 4c-.6 1.6-1.9 2.5-3.5 2.5S9.1 5.6 8.5 4z',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM17.5 14H20M14 20h1.5M6.5 6.5h1M16.5 6.5h1M6.5 16.5h1',
  bank: 'M3.5 9.5 12 4.5l8.5 5M5.5 10.5v7M9.8 10.5v7M14.2 10.5v7M18.5 10.5v7M3.5 20h17',
  buku: 'M5 5.5A2.5 2.5 0 0 1 7.5 3H19v14.5H7.5A2.5 2.5 0 0 0 5 20zM5 20a2.5 2.5 0 0 1 2.5-2.5H19V21H7.5M9 7.5h6',
  ganti: 'M7 7.5h12.5l-3.5-3.5M17 16.5H4.5L8 20',
  lonceng: 'M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2H5zM10 20.5a2 2 0 0 0 4 0',
  kunci: 'M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9.5h-13zM12 14.5v2.5',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  unduh: 'M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14',
  luar: 'M14 4.5h5.5V10M19.5 4.5l-8 8M17 14v5.5H4.5V7H10',
  hapus: 'M5 7h14M10 7V4.5h4V7M7 7l.8 13h8.4L17 7',
  hati: 'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z',
  matahari: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4',
};

export const NAMA_IKON = Object.keys(JALUR);

export default function Ikon({ nama, ukuran = 22, warna = 'currentColor', tebal = 1.8, label }) {
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 24 24" accessibilityLabel={label}>
      <Path d={JALUR[nama] || JALUR.info} fill="none" stroke={warna} strokeWidth={tebal} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Bintang({ ukuran = 28, label }) {
  // Stiker bintang emas ala buku tulis: isi kuning, tepi putih tebal.
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 32 32" accessibilityLabel={label}>
      <Path d="M16 2.8l3.9 8.3 9 1.1-6.6 6.2 1.7 8.9L16 23l-8 4.3 1.7-8.9-6.6-6.2 9-1.1z" fill="#f2b632" stroke="#fffdf8" strokeWidth={2.4} strokeLinejoin="round" />
      <Path d="M16 7.5l2.2 4.6" fill="none" stroke="#fff3c9" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function Titik({ ukuran = 10, warna }) {
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 10 10">
      <Circle cx={5} cy={5} r={5} fill={warna} />
    </Svg>
  );
}
