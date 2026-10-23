import { View, Text } from 'react-native';
import { Svg, Path, Circle, Line, SvgText, Polyline } from './svg';
import { useWarna } from '@/lib/pakai-tema';
import { F } from '@/lib/fonts';
import { SEKOLAH } from '@/lib/data';

const L = 320;
const T = 176;
const KIRI = 38;
const KANAN = 16;
const ATAS = 22;
const BAWAH = 30;
function skala(nilai) {
  const min = Math.max(50, Math.floor((Math.min(...nilai, SEKOLAH.batasTuntas) - 6) / 5) * 5);
  const maks = Math.min(100, Math.ceil((Math.max(...nilai) + 4) / 5) * 5);
  const y = (v) => ATAS + ((maks - v) / (maks - min || 1)) * (T - ATAS - BAWAH);
  const garis = [];
  for (let v = min; v <= maks; v += 5) garis.push(v);
  return { y, garis };
}

/**
 * Grafik garis perkembangan nilai. titik: [{ label, nilai, sementara }]
 */
export function GrafikGaris({ titik, warna, label }) {
  const c = useWarna();
  const n = titik.length;
  const { y: yDari, garis } = skala(titik.map((t) => t.nilai));
  const xDari = (i) => (n === 1 ? (L + KIRI - KANAN) / 2 : KIRI + (i * (L - KIRI - KANAN)) / (n - 1));
  const tetap = titik.filter((t) => !t.sementara);
  const jalur = tetap.map((t, i) => `${i ? 'L' : 'M'}${xDari(i).toFixed(1)} ${yDari(t.nilai).toFixed(1)}`).join('');
  const akhir = titik[n - 1];
  const putus = akhir && akhir.sementara && n > 1
    ? `M${xDari(n - 2).toFixed(1)} ${yDari(titik[n - 2].nilai).toFixed(1)}L${xDari(n - 1).toFixed(1)} ${yDari(akhir.nilai).toFixed(1)}`
    : null;
  const ringkas = titik.map((t) => `${t.label}${t.sementara ? ' (sementara)' : ''}: ${t.nilai}`).join(', ');
  return (
    <View>
      <Svg width="100%" height={T} viewBox={`0 0 ${L} ${T}`} accessibilityLabel={`${label}. ${ringkas}. Batas tuntas ${SEKOLAH.batasTuntas}.`}>
        {garis.map((v) => (
          <G2 key={v} v={v} c={c} y={yDari(v)} />
        ))}
        <Line x1={KIRI} x2={L - KANAN} y1={yDari(SEKOLAH.batasTuntas)} y2={yDari(SEKOLAH.batasTuntas)} stroke={c.merah} strokeWidth={1.2} strokeDasharray="5 4" />
        {jalur ? <Path d={jalur} fill="none" stroke={warna} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" /> : null}
        {putus ? <Path d={putus} fill="none" stroke={warna} strokeWidth={2.4} strokeDasharray="4 5" strokeLinecap="round" /> : null}
        {titik.map((t, i) => (
          <Circle key={`t${i}`} cx={xDari(i)} cy={yDari(t.nilai)} r={t.sementara ? 5 : 4.2} fill={t.sementara ? c.kartu : warna} stroke={warna} strokeWidth={2.2} />
        ))}
        {titik.map((t, i) => (
          <SvgText key={`n${i}`} x={xDari(i)} y={yDari(t.nilai) - 10} fontSize={11.5} fontFamily={F.sans} fontWeight="800" fill={c.tinta} textAnchor="middle">{t.nilai}</SvgText>
        ))}
        {titik.map((t, i) => (
          <SvgText key={`l${i}`} x={xDari(i)} y={T - 9} fontSize={10.5} fontFamily={F.sans} fontWeight="600" fill={c.tinta2} textAnchor="middle">{t.label}</SvgText>
        ))}
      </Svg>
    </View>
  );
}

function G2({ v, c, y }) {
  return (
    <>
      <Line x1={KIRI} x2={L - KANAN} y1={y} y2={y} stroke={c.garis} strokeWidth={1} />
      <SvgText x={KIRI - 6} y={y + 3.5} fontSize={10} fontFamily={F.sans} fill={c.tinta2} textAnchor="end">{v}</SvgText>
    </>
  );
}

/** Keterangan di bawah grafik. */
export function KeteranganGrafik({ warna }) {
  const c = useWarna();
  return (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginTop: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Svg width={26} height={10} viewBox="0 0 26 10"><Line x1={1} x2={25} y1={5} y2={5} stroke={c.merah} strokeWidth={1.6} strokeDasharray="5 4" /></Svg>
        <Text style={{ fontFamily: F.sans, fontSize: 13, lineHeight: 18, color: c.tinta2 }}>{`Batas tuntas ${SEKOLAH.batasTuntas}`}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Svg width={12} height={12} viewBox="0 0 12 12"><Circle cx={6} cy={6} r={4.2} fill={c.kartu} stroke={warna} strokeWidth={2} /></Svg>
        <Text style={{ fontFamily: F.sans, fontSize: 13, lineHeight: 18, color: c.tinta2 }}>Sementara semester ini</Text>
      </View>
    </View>
  );
}

/** Garis mini untuk daftar mapel. */
export function Garis({ nilai, warna, lebar = 72, tinggi = 26 }) {
  const n = nilai.length;
  if (n < 2) return <View style={{ width: lebar, height: tinggi }} />;
  const min = Math.min(...nilai) - 3;
  const maks = Math.max(...nilai) + 3;
  const pts = nilai.map((v, i) => `${((i * (lebar - 6)) / (n - 1) + 3).toFixed(1)},${(3 + ((maks - v) / (maks - min)) * (tinggi - 6)).toFixed(1)}`).join(' ');
  const [lx, ly] = pts.split(' ').pop().split(',');
  return (
    <Svg width={lebar} height={tinggi} viewBox={`0 0 ${lebar} ${tinggi}`}>
      <Polyline points={pts} fill="none" stroke={warna} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={Number(lx)} cy={Number(ly)} r={3} fill={warna} />
    </Svg>
  );
}
