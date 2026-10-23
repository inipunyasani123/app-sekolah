import { Svg, Path, Rect, Circle, G, Line } from './svg';

// Ilustrasi kapur di atas papan tulis, digambar sendiri (pengganti foto). Warna tetap di dua mode.
const P = '#1f4a3b';
const K = '#f5f0e4';
const Y = '#f2b632';
const R = '#ee9c8c';
const B = '#a9cdee';
const H = '#a7d9b2';

const garis = (warna = K, tebal = 3) => ({ fill: 'none', stroke: warna, strokeWidth: tebal, strokeLinecap: 'round', strokeLinejoin: 'round' });

function Papan({ children }) {
  return (
    <G>
      <Rect x={0} y={0} width={320} height={180} rx={16} fill={P} />
      <Path d="M18 150c60-18 140-22 200-12s70 4 92-6" {...garis('rgba(245,240,228,0.07)', 26)} />
      <Path d="M40 30c40-8 90-10 130-4" {...garis('rgba(245,240,228,0.05)', 16)} />
      {children}
    </G>
  );
}

function Kilau({ x, y, w = Y, s = 7 }) {
  return <Path d={`M${x} ${y - s}v${s * 2}M${x - s} ${y}h${s * 2}`} {...garis(w, 2.4)} />;
}

const GAMBAR = {
  buku: () => (
    <Papan>
      <Path d="M160 58C135 46 100 44 72 50V132C100 126 135 128 160 140Z" {...garis()} />
      <Path d="M160 58C185 46 220 44 248 50V132C220 126 185 128 160 140Z" {...garis()} />
      <Path d="M160 58V140" {...garis(K, 2.4)} />
      {[70, 84, 98, 112].map((y) => (
        <G key={y}>
          <Path d={`M88 ${y}C108 ${y - 4} 128 ${y - 3} 146 ${y + 2}`} {...garis('rgba(245,240,228,0.65)', 2.2)} />
          <Path d={`M174 ${y + 2}C192 ${y - 3} 212 ${y - 4} 232 ${y}`} {...garis('rgba(245,240,228,0.65)', 2.2)} />
        </G>
      ))}
      <Path d="M212 46V82L220 75L228 82V44" fill={Y} />
      <Path d="M70 148C120 154 200 154 250 148" {...garis('rgba(245,240,228,0.35)', 2.4)} />
      <Kilau x={52} y={42} />
      <Kilau x={274} y={36} w={B} />
      <Kilau x={280} y={118} s={5} />
    </Papan>
  ),
  gigi: () => (
    <Papan>
      <Path d="M96 58C96 44 112 40 122 46C128 50 132 50 138 46C148 40 164 44 164 58C164 74 158 84 156 100C154 116 150 132 144 132C138 132 136 112 130 104C124 112 122 132 116 132C110 132 106 116 104 100C102 84 96 74 96 58Z" {...garis()} />
      <Path d="M108 60C110 54 116 52 121 54" {...garis('rgba(245,240,228,0.75)', 2.4)} />
      <Path d="M192 140L258 58" {...garis(Y, 9)} />
      <Rect x={248} y={36} width={30} height={13} rx={4} fill={K} transform="rotate(-51 263 42)" />
      <Path d="M262 26l-4-7M270 31l-4-7M278 37l-4-7" {...garis(B, 2.4)} />
      <Kilau x={70} y={52} />
      <Kilau x={182} y={60} w={B} s={5} />
      <Kilau x={86} y={126} s={5} />
    </Papan>
  ),
  bibit: () => (
    <Papan>
      <Path d="M70 118H250L238 146H82Z" {...garis()} />
      <Path d="M80 125C100 121 120 127 140 123S180 127 200 123S236 125 242 123" {...garis('rgba(245,240,228,0.6)', 2.2)} />
      {[[110, 96, 1], [160, 82, 1.25], [210, 98, 0.95]].map(([x, y, k]) => (
        <G key={x}>
          <Path d={`M${x} 120V${y}`} {...garis(H, 2.6)} />
          <Path d={`M${x} ${y + 4}C${x - 12 * k} ${y - 4} ${x - 20 * k} ${y - 2} ${x - 24 * k} ${y - 12 * k}C${x - 12 * k} ${y - 14 * k} ${x - 2} ${y - 8} ${x} ${y + 4}Z`} {...garis(H, 2.6)} />
          <Path d={`M${x} ${y + 4}C${x + 12 * k} ${y - 4} ${x + 20 * k} ${y - 2} ${x + 24 * k} ${y - 12 * k}C${x + 12 * k} ${y - 14 * k} ${x + 2} ${y - 8} ${x} ${y + 4}Z`} {...garis(H, 2.6)} />
        </G>
      ))}
      <Circle cx={266} cy={44} r={14} {...garis(Y, 3)} />
      <Path d="M266 20v-6M266 74v-6M242 44h-6M296 44h-6M249 27l-4-4M287 65l-4-4M283 27l4-4M245 65l4-4" {...garis(Y, 2.4)} />
      <Path d="M62 52c4 6 6 9 6 12a6 6 0 0 1-12 0c0-3 2-6 6-12ZM84 72c3 4 4 6 4 8a4 4 0 0 1-8 0c0-2 1-4 4-8Z" {...garis(B, 2.2)} />
    </Papan>
  ),
  pertemuan: () => (
    <Papan>
      <Path d="M92 104H228M108 104V144M212 104V144" {...garis()} />
      <Rect x={124} y={92} width={30} height={12} rx={2} {...garis('rgba(245,240,228,0.7)', 2)} />
      <Rect x={166} y={94} width={26} height={10} rx={2} {...garis('rgba(245,240,228,0.7)', 2)} />
      <Path d="M66 92V144M66 120H86V144" {...garis()} />
      <Path d="M254 92V144M254 120H234V144" {...garis()} />
      <Path d="M96 36h52a10 10 0 0 1 10 10v12a10 10 0 0 1-10 10h-30l-10 10V68h-12a10 10 0 0 1-10-10V46a10 10 0 0 1 10-10Z" {...garis()} />
      <Circle cx={108} cy={52} r={2.6} fill={Y} />
      <Circle cx={122} cy={52} r={2.6} fill={Y} />
      <Circle cx={136} cy={52} r={2.6} fill={Y} />
      <Path d="M186 30h40a9 9 0 0 1 9 9v8a9 9 0 0 1-9 9h-8v9l-9-9h-23a9 9 0 0 1-9-9v-8a9 9 0 0 1 9-9Z" {...garis(B, 2.6)} />
      <Path d="M192 43h28" {...garis(B, 2.4)} />
    </Papan>
  ),
  sas: () => (
    <Papan>
      <Rect x={104} y={30} width={104} height={124} rx={6} {...garis()} />
      {[56, 80, 104, 128].map((y, i) => (
        <G key={y}>
          <Path d={`M120 ${y}h52`} {...garis('rgba(245,240,228,0.7)', 2.4)} />
          {i < 3 ? <Path d={`M182 ${y - 2}l5 5 9-10`} {...garis(Y, 2.6)} /> : <Circle cx={189} cy={y} r={4} {...garis(Y, 2.2)} />}
        </G>
      ))}
      <Path d="M232 148L278 76" {...garis(Y, 10)} />
      <Path d="M228 155l3-9 8 5Z" fill={K} />
      <Kilau x={70} y={60} />
      <Kilau x={258} y={42} w={B} s={5} />
    </Papan>
  ),
  kantin: () => (
    <Papan>
      <Path d="M106 62h22v10c10 6 12 14 12 22v44a6 6 0 0 1-6 6h-34a6 6 0 0 1-6-6V94c0-8 2-16 12-22Z" {...garis(B)} />
      <Rect x={104} y={50} width={26} height={12} rx={3} {...garis(B, 2.6)} />
      <Path d="M100 108h40" {...garis('rgba(169,205,238,0.6)', 2.2)} />
      <Path d="M166 82h42l-6 62h-30Z" {...garis()} />
      <Path d="M170 104h34" {...garis('rgba(245,240,228,0.7)', 2.2)} />
      <Path d="M246 98c-14-8-28 2-26 18 2 18 14 30 26 24 12 6 24-6 26-24 2-16-12-26-26-18Z" {...garis(R)} />
      <Path d="M246 98c0-8 4-14 10-16M248 92c6-6 14-6 18-2-6 4-12 4-18 2Z" {...garis(H, 2.4)} />
      <Kilau x={62} y={46} />
    </Papan>
  ),
  libur: () => (
    <Papan>
      <Rect x={92} y={46} width={96} height={98} rx={8} {...garis()} />
      <Path d="M92 72h96" {...garis()} />
      <Path d="M112 38v16M168 38v16" {...garis(Y, 3)} />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) => (
        <Rect key={`${r}${k}`} x={104 + k * 20} y={84 + r * 18} width={10} height={8} rx={2} fill={r === 1 && k === 2 ? Y : 'rgba(245,240,228,0.55)'} />
      )))}
      <Circle cx={240} cy={78} r={20} {...garis(Y)} />
      <Path d="M240 46v-8M240 118v-8M208 78h-8M280 78h-8M217 55l-6-6M269 107l-6-6M263 55l6-6M211 107l6-6" {...garis(Y, 2.4)} />
      <Path d="M206 140c10-6 20-6 30 0s20 6 30 0 20-6 30 0" {...garis(B, 2.6)} />
    </Papan>
  ),
  kosong: () => (
    <Papan>
      <Path d="M70 112H250M88 112V150M232 112V150M88 132H232" {...garis()} />
      <Path d="M186 98c-8-5-17 1-16 11 1 10 8 17 16 14 8 3 15-4 16-14 1-10-8-16-16-11Z" {...garis(R, 2.6)} />
      <Path d="M186 98c0-5 2-8 6-10" {...garis(H, 2.4)} />
      <Path d="M112 104l46-12" {...garis(Y, 7)} />
      <Path d="M106 106l6-4 1 5Z" fill={K} />
      <Path d="M150 46c6-2 10 2 8 8s4 10 10 8" {...garis('rgba(245,240,228,0.6)', 2.4)} />
      <Kilau x={248} y={50} />
      <Kilau x={70} y={58} w={B} s={5} />
    </Papan>
  ),
};

export default function Ilustrasi({ jenis, tinggi = 180, label, style }) {
  const Gambar = GAMBAR[jenis] || GAMBAR.kosong;
  return (
    <Svg width="100%" height={tinggi} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" accessibilityLabel={label} style={style}>
      <Gambar />
    </Svg>
  );
}

/** Mobil antar-jemput sekolah (ilustrasi sendiri, tanpa merek). */
export function Mobil({ lebar = 120, label }) {
  return (
    <Svg width={lebar} height={lebar * 0.55} viewBox="0 0 200 110" accessibilityLabel={label}>
      <Rect x={0} y={0} width={200} height={110} rx={14} fill={P} />
      <Path d="M8 96h184" {...garis('rgba(245,240,228,0.35)', 2.4)} />
      <Path d="M20 96h18M56 96h18M92 96h18M128 96h18M164 96h18" {...garis('rgba(245,240,228,0.5)', 2)} />
      <Path d="M22 80V48c0-9 6-15 15-15h96c11 0 18 4 25 11l16 17c5 2 8 6 8 11v8c0 4-3 6-6 6H28c-4 0-6-2-6-6Z" fill="#fffdf8" stroke={K} strokeWidth={2} />
      <Path d="M22 66h160" stroke={Y} strokeWidth={7} />
      <Rect x={34} y={41} width={26} height={16} rx={3} fill={B} />
      <Rect x={66} y={41} width={26} height={16} rx={3} fill={B} />
      <Rect x={98} y={41} width={26} height={16} rx={3} fill={B} />
      <Path d="M132 41h12c5 0 9 2 12 5l9 11h-33Z" fill={B} />
      <Circle cx={54} cy={86} r={11} fill="#1c2621" />
      <Circle cx={54} cy={86} r={4.5} fill={K} />
      <Circle cx={148} cy={86} r={11} fill="#1c2621" />
      <Circle cx={148} cy={86} r={4.5} fill={K} />
      <Line x1={182} y1={72} x2={186} y2={72} stroke={Y} strokeWidth={4} strokeLinecap="round" />
    </Svg>
  );
}

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
