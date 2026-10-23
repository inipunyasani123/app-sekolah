import { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { bagikanTeks, unduhBerkas } from '@/lib/bagikan';
import { htmlRapor, namaBerkasRapor } from '@/lib/rapor-berkas';
import Layar from '@/components/Layar';
import { Teks, Kerangka, Tombol } from '@/components/Dasar';
import { Stempel } from '@/components/Kertas';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { SEKOLAH } from '@/lib/data';
import { fmtTanggal, desimal } from '@/lib/waktu';
import { raporTerakhir } from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/nilai/rapor',
    'Rapor Semester Lalu: Nilai dan Capaian | Kapur',
    'Rapor digital semester lalu: nilai akhir, deskripsi capaian per mapel, ekstrakurikuler, ketidakhadiran, dan catatan wali kelas di demo Kapur.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  kertas: { backgroundColor: c.kartu, borderRadius: 6, borderWidth: 1, borderColor: c.garis, padding: 16, gap: 12, boxShadow: `0 10px 24px -14px ${c.bayang}` },
  kop: { alignItems: 'center', gap: 2, paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: c.tinta },
  kopSekolah: { fontFamily: F.serif, fontSize: 19, lineHeight: 24, color: c.tinta, textAlign: 'center' },
  kopKecil: { ...berat(600), fontSize: 13, lineHeight: 17, color: c.tinta2, textAlign: 'center', letterSpacing: 0.6 },
  identitas: { gap: 3 },
  idBaris: { flexDirection: 'row', gap: 8 },
  idKunci: { width: 104, ...berat(500), fontSize: 13, lineHeight: 19, color: c.tinta2 },
  idNilai: { flex: 1, ...berat(700), fontSize: 13, lineHeight: 19, color: c.tinta },
  tabelKepala: { flexDirection: 'row', backgroundColor: c.kartu2, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  th: { ...berat(800), fontSize: 13, lineHeight: 17, color: c.tinta2, letterSpacing: 0.4 },
  tr: { paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: c.garis, gap: 4 },
  trAtas: { flexDirection: 'row', gap: 8, alignItems: 'baseline' },
  mapel: { flex: 1, ...berat(700), fontSize: 14, lineHeight: 19, color: c.tinta },
  angka: { fontFamily: F.serif, fontSize: 20, lineHeight: 24, color: c.tinta, minWidth: 34, textAlign: 'right' },
  desk: { ...berat(400), fontSize: 13, lineHeight: 19, color: c.tinta2 },
  catatan: { fontFamily: F.tulis, fontSize: 15, lineHeight: 30, color: c.biru },
  ttdBaris: { flexDirection: 'row', gap: 12, marginTop: 8 },
  ttd: { flex: 1, alignItems: 'center', gap: 2 },
  ttdTulis: { fontFamily: F.tulis, fontSize: 18, lineHeight: 36, color: c.biru },
  ttdNama: { ...berat(700), fontSize: 13, lineHeight: 17, color: c.tinta, textAlign: 'center', borderTopWidth: 1, borderTopColor: c.tinta, paddingTop: 3, alignSelf: 'stretch' },
  ttdPeran: { ...berat(500), fontSize: 13, lineHeight: 17, color: c.tinta2, textAlign: 'center' },
}));

export default function Rapor() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  const h = useHari();
  const [dibagi, setDibagi] = useState('');
  const r = useMemo(() => (h ? raporTerakhir(anak, h.sem) : null), [anak, h]);
  const bagikan = async () => {
    if (!r) return;
    const teks = `Rapor ${anak.nama}, ${r.label} (${r.ta}), ${SEKOLAH.nama}. Rata-rata ${desimal(r.rata)}.${r.keputusan ? ` ${r.keputusan}.` : ''} (Data contoh demo Kapur)`;
    const hasil = await bagikanTeks(teks, 'Rapor Kapur');
    setDibagi({ dibagikan: 'Ringkasan rapor sudah dibagikan.', disalin: 'Ringkasan rapor disalin ke papan klip.', batal: 'Berbagi dibatalkan.', gagal: 'Perangkat ini tidak mendukung berbagi.' }[hasil]);
  };
  return (
    <Layar kepala={{ judul: 'Rapor semester lalu', sub: anak.nama, kembali: '/nilai' }}>
      {!r ? (
        h ? <Teks>Belum ada rapor. Rapor pertama dibagikan di akhir semester.</Teks> : <Kerangka tinggi={520} />
      ) : (
        <>
          <View style={g.kertas}>
            <View style={g.kop}>
              <Text style={g.kopKecil}>LAPORAN HASIL BELAJAR</Text>
              <Text style={g.kopSekolah}>{SEKOLAH.nama}</Text>
              <Text style={g.kopKecil}>{SEKOLAH.kota.toUpperCase()}</Text>
            </View>
            <View style={g.identitas}>
              {[
                ['Nama', anak.nama],
                ['NIS', anak.nis],
                ['Kelas', r.kelas],
                ['Semester', `${r.nomor === 1 ? 'Ganjil' : 'Genap'} (${r.nomor})`],
                ['Tahun ajaran', r.ta],
              ].map(([k, v]) => (
                <View key={k} style={g.idBaris}>
                  <Text style={g.idKunci}>{k}</Text>
                  <Text style={g.idNilai}>{v}</Text>
                </View>
              ))}
            </View>
            <View>
              <View style={g.tabelKepala}>
                <Text style={[g.th, { flex: 1 }]}>MATA PELAJARAN DAN CAPAIAN</Text>
                <Text style={g.th}>NILAI</Text>
              </View>
              {r.mapel.map((m) => (
                <View key={m.id} style={g.tr}>
                  <View style={g.trAtas}>
                    <Text style={g.mapel}>{m.nama}</Text>
                    <Text style={[g.angka, m.nilai < SEKOLAH.batasTuntas && { color: c.merah }]}>{m.nilai}</Text>
                  </View>
                  <Text style={g.desk}>{m.deskripsi}</Text>
                </View>
              ))}
              <View style={[g.tr, { borderBottomWidth: 0 }]}>
                <View style={g.trAtas}>
                  <Text style={g.mapel}>Rata-rata</Text>
                  <Text style={g.angka}>{desimal(r.rata)}</Text>
                </View>
              </View>
            </View>
            <View style={{ gap: 4 }}>
              <Teks jenis="tebal" level={2}>Ekstrakurikuler</Teks>
              {r.ekskul.map((e) => (
                <View key={e.nama} style={g.idBaris}>
                  <Text style={g.idKunci}>{e.nama}</Text>
                  <Text style={g.idNilai}>{e.predikat}</Text>
                </View>
              ))}
            </View>
            <View style={{ gap: 4 }}>
              <Teks jenis="tebal" level={2}>Ketidakhadiran</Teks>
              <View style={g.idBaris}>
                <Text style={g.idKunci}>Sakit / izin / tanpa keterangan</Text>
                <Text style={g.idNilai}>{`${r.hadir.S} / ${r.hadir.I} / ${r.hadir.A} hari`}</Text>
              </View>
            </View>
            <View style={{ gap: 2 }}>
              <Teks jenis="tebal" level={2}>Catatan wali kelas</Teks>
              <Text style={g.catatan}>{r.catatan}</Text>
            </View>
            {r.keputusan ? <Stempel teks={r.keputusan.toUpperCase()} style={{ alignSelf: 'center', marginVertical: 6 }} /> : null}
            <Text style={[g.ttdPeran, { textAlign: 'right' }]}>{`Kediri, ${fmtTanggal(r.dibagikan, { hari: false })}`}</Text>
            <View style={g.ttdBaris}>
              <View style={g.ttd}>
                <Text style={g.ttdTulis}>{r.wali.split(' ')[0]}</Text>
                <Text style={g.ttdNama}>{r.wali}</Text>
                <Text style={g.ttdPeran}>Wali kelas</Text>
              </View>
              <View style={g.ttd}>
                <Text style={g.ttdTulis}>Wulan</Text>
                <Text style={g.ttdNama}>{SEKOLAH.kepala}</Text>
                <Text style={g.ttdPeran}>Kepala sekolah</Text>
              </View>
            </View>
          </View>
          <Tombol jenis="utama" ikon="unduh" judul="Unduh rapor (simulasi)" onPress={async () => {
            const hasil = await unduhBerkas(namaBerkasRapor(anak, r), htmlRapor(anak, r));
            setDibagi(hasil === 'diunduh' ? 'Berkas rapor simulasi diunduh. Buka di peramban untuk mencetak atau menyimpan sebagai PDF.' : hasil === 'dibagikan' ? 'Ringkasan rapor sudah dibagikan.' : 'Perangkat ini tidak mendukung unduhan.');
          }} />
          <Tombol jenis="garis" ikon="bagikan" judul="Bagikan ringkasan rapor" onPress={bagikan} />
          {dibagi ? <Teks jenis="kecil" aria-live="polite">{dibagi}</Teks> : null}
          <Teks jenis="kecil">Rapor ini contoh. Sekolah, siswa, dan guru dalam demo Kapur adalah rekaan.</Teks>
        </>
      )}
    </Layar>
  );
}
