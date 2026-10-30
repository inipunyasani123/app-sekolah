import { Svg, Path, Circle, Ellipse, Rect, G, SvgText } from './svg';
import { F } from '@/lib/fonts';

// Ilustrasi tokoh buatan sendiri (bukan foto/wajah orang sungguhan), berwajah polos tanpa mata dan mulut.
const BADAN = (lebar = 0) => `M${10 - lebar} 55.5C13 46 22 42.5 32 42.5S51 46 ${54 + lebar} 55.5A32 32 0 0 1 ${10 - lebar} 55.5Z`;

const TOKOH = {
  nayla: () => (
    <G>
      <Circle cx={32} cy={32} r={32} fill="#f2c14e" />
      <Path d={BADAN()} fill="#fffdf8" />
      <Path d="M27 43l5 6 5-6" fill="none" stroke="#d9d0bc" strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M30.3 47.5h3.4l1.3 7.5h-6z" fill="#b3362c" />
      <Rect x={28.5} y={38} width={7} height={6} rx={2} fill="#b67a4f" />
      <Path d="M17.5 37c-1.8-13 4.5-22.5 14.5-22.5S48.3 24 46.5 37c-.4 3-1.6 5.3-3.4 6.3V30.5c-4-1.2-7.4-3.5-9.6-6.5-3.4 3.6-8.6 5.8-12.6 6.6v12.7c-2-1-3-3.3-3.4-6.3z" fill="#22201e" />
      <Ellipse cx={32} cy={31.5} rx={11} ry={12} fill="#c98c5e" />
      <Path d="M21 30.5c3.5-.6 8.7-2.8 12.2-6.6 2.2 3 5.6 5.4 9.8 6.6-.6-6.8-5-11.2-11-11.2s-10.4 4.4-11 11.2z" fill="#22201e" />
      <Rect x={39} y={20.5} width={7} height={3.2} rx={1.6} fill="#2a5795" transform="rotate(28 42.5 22)" />
    </G>
  ),
  bima: () => (
    <G>
      <Circle cx={32} cy={32} r={32} fill="#9cc3e6" />
      <Path d={BADAN()} fill="#fffdf8" />
      <Path d="M30.4 44.5h3.2l1.8 11h-6.8z" fill="#b3362c" />
      <Path d="M29.5 43l2.5 2.6 2.5-2.6" fill="#b3362c" />
      <Rect x={28.5} y={38} width={7} height={6} rx={2} fill="#ad7046" />
      <Ellipse cx={32} cy={31.5} rx={11.2} ry={12} fill="#bb7c4f" />
      <Ellipse cx={20.6} cy={32.5} rx={2.2} ry={3} fill="#bb7c4f" />
      <Ellipse cx={43.4} cy={32.5} rx={2.2} ry={3} fill="#bb7c4f" />
      <Path d="M20.4 29c-.5-8.4 4.8-14 11.6-14 7.2 0 12.3 5.6 11.6 14-2.8-2.6-6-4-9.4-4.2-3.4 1.6-8.4 1.8-11.2.6-1.2.9-2 2.2-2.6 3.6z" fill="#1d1a18" />
      <Path d="M31 15.4c1-2.4 3-3.4 5-3" fill="none" stroke="#1d1a18" strokeWidth={2} strokeLinecap="round" />
    </G>
  ),
  sekar: () => (
    <G>
      <Circle cx={32} cy={32} r={32} fill="#a9d3b4" />
      <Path d={BADAN(1)} fill="#2a5c4a" />
      <Path d="M15.5 41c-2.4-16 5.4-27.5 16.5-27.5S50.9 25 48.5 41c-1.4 7-6.6 11-16.5 11s-15.1-4-16.5-11z" fill="#3c7a62" />
      <Ellipse cx={32} cy={31.5} rx={10.2} ry={11.4} fill="#cf9566" />
      <Path d="M21.8 27.5c1.6-5.4 5.6-8.3 10.2-8.3s8.6 2.9 10.2 8.3c-3-2.2-6.6-3.3-10.2-3.3s-7.2 1.1-10.2 3.3z" fill="#3c7a62" />
      <Circle cx={43.5} cy={41} r={1.6} fill="#f2b632" />
    </G>
  ),
  danu: () => (
    <G>
      <Circle cx={32} cy={32} r={32} fill="#f0c4a8" />
      <Path d={BADAN(1)} fill="#8a4b2a" />
      <Path d="M27 43.2l5 5 5-5" fill="none" stroke="#5e2f17" strokeWidth={1.6} strokeLinejoin="round" />
      <Circle cx={19} cy={53} r={1.6} fill="#f2b632" />
      <Circle cx={25} cy={58} r={1.6} fill="#f2b632" />
      <Circle cx={39} cy={58} r={1.6} fill="#f2b632" />
      <Circle cx={45} cy={53} r={1.6} fill="#f2b632" />
      <Path d="M16 56l4-3 4 3M40 56l4-3 4 3" fill="none" stroke="#f2b632" strokeWidth={1.2} />
      <Rect x={28.5} y={38} width={7} height={6} rx={2} fill="#9a6440" />
      <Ellipse cx={32} cy={31.5} rx={11} ry={12} fill="#a96f47" />
      <Path d="M20.8 28.5c-.2-8 4.8-13.2 11.4-13.2 6.8 0 11.6 5 11 13-3.2-3.4-8-5.2-13-4.8-3.4.3-6.8 2.2-9.4 5z" fill="#161412" />
    </G>
  ),
};

const WARNA_INISIAL = ['#c9dccf', '#f0d9a8', '#d9d2ea', '#f2cfc4', '#cfe0ef'];

export default function Avatar({ siapa, ukuran = 48, label, inisial }) {
  if (!TOKOH[siapa]) {
    // Guru mapel tanpa ilustrasi: lingkaran berinisial.
    const teks = (inisial || '?').slice(0, 2).toUpperCase();
    const w = WARNA_INISIAL[teks.charCodeAt(0) % WARNA_INISIAL.length];
    return (
      <Svg width={ukuran} height={ukuran} viewBox="0 0 64 64" accessibilityLabel={label}>
        <Circle cx={32} cy={32} r={32} fill={w} />
        <SvgText x={32} y={40} fontSize={22} fontWeight="800" fontFamily={F.sans} fill="#1c2621" textAnchor="middle">{teks}</SvgText>
      </Svg>
    );
  }
  const Tokoh = TOKOH[siapa];
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 64 64" accessibilityLabel={label}>
      <Tokoh />
    </Svg>
  );
}

/** Logo Kapur: papan tulis hijau dengan huruf K dari kapur dan sepotong kapur kuning. */
export function Logo({ ukuran = 36, label }) {
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 48 48" accessibilityLabel={label}>
      <Rect x={2} y={2} width={44} height={44} rx={12} fill="#1f4a3b" />
      <Rect x={2} y={2} width={44} height={44} rx={12} fill="none" stroke="#2f6b55" strokeWidth={2} />
      <Path d="M16 12.5v23M16.4 25.2 29 12.8M20.6 21.4l9.6 13.6" fill="none" stroke="#f5f0e4" strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={30.5} y={33} width={11} height={4.6} rx={1.6} fill="#f2b632" transform="rotate(-24 36 35.3)" />
    </Svg>
  );
}
