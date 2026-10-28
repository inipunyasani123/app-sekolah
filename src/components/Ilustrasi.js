import { Svg, Circle } from './svg';

// Cincin persentase (ikon data, bukan gambar objek). Gambar objek memakai foto asli: components/Foto.js.
/** Cincin persentase kecil (kehadiran). */
export function Cincin({ persen, ukuran = 44, warna, latar, tebal = 5 }) {
  const r = (ukuran - tebal) / 2;
  const kel = 2 * Math.PI * r;
  const isi = Math.max(0, Math.min(100, persen)) / 100;
  return (
    <Svg width={ukuran} height={ukuran} viewBox={`0 0 ${ukuran} ${ukuran}`}>
      <Circle cx={ukuran / 2} cy={ukuran / 2} r={r} fill="none" stroke={latar} strokeWidth={tebal} />
      <Circle
        cx={ukuran / 2}
        cy={ukuran / 2}
        r={r}
        fill="none"
        stroke={warna}
        strokeWidth={tebal}
        strokeLinecap="round"
        strokeDasharray={`${(kel * isi).toFixed(2)} ${kel.toFixed(2)}`}
        transform={`rotate(-90 ${ukuran / 2} ${ukuran / 2})`}
      />
    </Svg>
  );
}
