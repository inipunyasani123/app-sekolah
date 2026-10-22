import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Kerangka, Tautan } from '@/components/Dasar';
import Ikon, { Bintang } from '@/components/Ikon';
import { Garis } from '@/components/Grafik';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { MAPEL, SEKOLAH, mapelUntuk, kelasAnak } from '@/lib/data';
import { desimal, fmtTanggal } from '@/lib/waktu';
import { penilaianSemester, riwayatSemester, skorSemester, rataRata, raporTerakhir } from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/nilai',
    'Nilai dan Rapor per Mata Pelajaran | Kapur',
    'Nilai sumatif per mapel, rata-rata sementara, grafik perkembangan antarsemester, dan rapor semester lalu dalam demo aplikasi Kapur.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  ringkas: { borderRadius: 22, backgroundColor: c.papan, padding: 18, gap: 4, overflow: 'hidden' },
  ringkasLabel: { ...berat(700), fontSize: 12.5, lineHeight: 17, letterSpacing: 0.4, color: c.kapur2 },
  ringkasAngka: { fontFamily: F.serif, fontSize: 52, lineHeight: 58, color: c.kapur },
  ringkasTeks: { ...berat(500), fontSize: 13.5, lineHeight: 19, color: c.kapur2 },
  rapor: { borderRadius: 18, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center' },
  raporIkon: { width: 48, height: 58, borderRadius: 8, backgroundColor: c.merah, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-4deg' }] },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: c.kartu, borderRadius: 16, borderWidth: 1, borderColor: c.garis, minHeight: 64 },
  titik: { width: 10, height: 34, borderRadius: 5 },
  nama: { ...berat(700), fontSize: 15, lineHeight: 20, color: c.tinta },
  ket: { ...berat(500), fontSize: 12.5, lineHeight: 17, color: c.tinta2 },
  angka: { fontFamily: F.serif, fontSize: 26, lineHeight: 30, color: c.tinta, minWidth: 40, textAlign: 'right' },
  kurang: { color: c.merah },
  ditekan: { opacity: 0.85 },
}));

export default function Nilai() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  const h = useHari();
  const data = useMemo(() => {
    if (!h) return null;
    const riwayat = riwayatSemester(anak, h.sem);
    const baris = mapelUntuk(anak.tingkat).map((m) => {
      const pen = penilaianSemester(anak, m, h.hari, h.sem);
      const rata = rataRata(pen.map((p) => p.nilai));
      const jejak = riwayat.filter((r) => !MAPEL[m].mulai || r.tingkat >= MAPEL[m].mulai).map((r) => skorSemester(anak, m, r.tingkat, r.nomor));
      return { m, pen, rata, jejak: rata ? [...jejak, Math.round(rata)] : jejak };
    });
    const semua = baris.filter((b) => b.rata !== null).map((b) => b.rata);
    return { baris, rata: rataRata(semua), jumlah: baris.reduce((a, b) => a + b.pen.length, 0), rapor: raporTerakhir(anak, h.sem) };
  }, [anak, h]);
  return (
    <Layar kepala={{ judul: 'Nilai dan rapor', sub: h ? `${anak.panggil} · semester ${h.sem.nama.toLowerCase()} ${h.sem.ta}` : `${anak.panggil} · kelas ${kelasAnak(anak)}` }}>
      {!data ? (
        <>
          <Kerangka tinggi={150} />
          <Kerangka tinggi={90} />
          <Kerangka tinggi={64} />
          <Kerangka tinggi={64} />
        </>
      ) : (
        <>
          <View style={g.ringkas}>
            <Text style={g.ringkasLabel}>RATA-RATA SEMENTARA SEMESTER INI</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={g.ringkasAngka}>{data.rata ? desimal(data.rata) : '–'}</Text>
              {data.rata && data.rata >= 85 ? <Bintang ukuran={40} label="Stiker bintang" /> : null}
            </View>
            <Text style={g.ringkasTeks}>
              {data.jumlah
                ? `Dari ${data.jumlah} penilaian sumatif di ${data.baris.filter((b) => b.rata).length} mapel. Batas tuntas ${SEKOLAH.batasTuntas}.`
                : 'Penilaian semester ini belum diunggah guru.'}
            </Text>
          </View>
          {data.rapor ? (
            <Tautan href="/nilai/rapor" style={g.rapor} styleTekan={g.ditekan}>
              <View style={g.raporIkon}>
                <Ikon nama="buku" ukuran={26} warna="#fffdf8" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={g.nama}>{`Rapor ${data.rapor.label.toLowerCase().replace('kelas', 'kelas')}`}</Text>
                <Text style={g.ket}>{`Rata-rata ${desimal(data.rapor.rata)}${data.rapor.keputusan ? ` · ${data.rapor.keputusan}` : ''} · dibagikan ${fmtTanggal(data.rapor.dibagikan, { hari: false })}`}</Text>
              </View>
              <Ikon nama="kanan" ukuran={18} warna={c.tinta2} />
            </Tautan>
          ) : null}
          <Teks jenis="bagian" level={2}>Per mata pelajaran</Teks>
          {data.baris.map((b) => {
            const m = MAPEL[b.m];
            const akhir = b.pen[b.pen.length - 1];
            return (
              <Tautan key={b.m} href={`/nilai/${b.m}`} style={g.baris} styleTekan={g.ditekan}>
                <View style={[g.titik, { backgroundColor: m.warna }]} />
                <View style={{ flex: 1, gap: 1 }}>
                  <Text style={g.nama}>{m.pendek}</Text>
                  <Text style={g.ket} numberOfLines={1}>{akhir ? `${akhir.kode}: ${akhir.nilai}` : 'Belum ada penilaian'}</Text>
                </View>
                <Garis nilai={b.jejak} warna={m.warna} />
                <Text style={[g.angka, b.rata && b.rata < SEKOLAH.batasTuntas && g.kurang]}>{b.rata ? Math.round(b.rata) : '–'}</Text>
              </Tautan>
            );
          })}
        </>
      )}
    </Layar>
  );
}
