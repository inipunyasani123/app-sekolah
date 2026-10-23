import { View, Text, StyleSheet } from 'react-native';
import { berat } from '@/lib/fonts';
import { buatGaya } from '@/lib/pakai-tema';
import { isoDari, jumlahHari, hariKe } from '@/lib/waktu';

const NAMA = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const useGaya = buatGaya((c) => StyleSheet.create({
  baris: { flexDirection: 'row' },
  kepala: { width: `${100 / 7}%`, ...berat(700), fontSize: 13, lineHeight: 17, color: c.tinta2, textAlign: 'center', paddingBottom: 4 },
  sel: { width: `${100 / 7}%`, aspectRatio: 0.92, padding: 2 },
  isi: { flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 1 },
  hariIni: { borderWidth: 2, borderColor: c.tinta },
  angka: { ...berat(700), fontSize: 14, lineHeight: 18, color: c.tinta, fontVariant: ['tabular-nums'] },
  redup: { ...berat(500), color: c.tinta2 },
  huruf: { ...berat(800), fontSize: 12, lineHeight: 14 },
  titikBaris: { flexDirection: 'row', gap: 2, height: 6 },
  titik: { width: 6, height: 6, borderRadius: 3 },
}));

/**
 * Kisi satu bulan sebagai tabel aksesibel. sel(iso) → { label, latar, huruf, warnaHuruf, titik: [warna], redup }.
 */
export default function GridBulan({ tahun, bulan, hariIni, sel, label }) {
  const g = useGaya();
  const n = jumlahHari(tahun, bulan);
  const geser = (hariKe(isoDari(tahun, bulan, 1)) + 6) % 7;
  const semua = [...Array(geser).fill(null), ...Array.from({ length: n }, (_, i) => isoDari(tahun, bulan, i + 1))];
  while (semua.length % 7) semua.push(null);
  const minggu = [];
  for (let i = 0; i < semua.length; i += 7) minggu.push(semua.slice(i, i + 7));
  return (
    <View role="table" aria-label={label}>
      <View role="row" style={g.baris}>
        {NAMA.map((d) => <Text key={d} role="columnheader" style={g.kepala}>{d}</Text>)}
      </View>
      {minggu.map((w, wi) => (
        <View key={wi} role="row" style={g.baris}>
          {w.map((iso, i) => {
            if (!iso) return <View key={`k${wi}${i}`} role="cell" style={g.sel} />;
            const s = sel(iso) || {};
            return (
              <View key={iso} role="cell" aria-label={s.label} style={g.sel}>
                <View style={[g.isi, s.latar ? { backgroundColor: s.latar } : null, iso === hariIni && g.hariIni]}>
                  <Text style={[g.angka, s.redup && g.redup]}>{Number(iso.slice(8))}</Text>
                  {s.huruf ? <Text style={[g.huruf, { color: s.warnaHuruf }]}>{s.huruf}</Text> : null}
                  {s.titik && s.titik.length ? (
                    <View style={g.titikBaris}>
                      {s.titik.slice(0, 3).map((w2, k) => <View key={k} style={[g.titik, { backgroundColor: w2 }]} />)}
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
