import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Layar from '@/components/Layar';
import { Teks, Kartu, Kerangka, Tombol, Lencana } from '@/components/Dasar';
import { GrafikGaris, KeteranganGrafik } from '@/components/Grafik';
import Avatar from '@/components/Avatar';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { MAPEL, URUT_MAPEL, SEKOLAH, guruMapel, topikUntuk } from '@/lib/data';
import { fmtTanggal, desimal } from '@/lib/waktu';
import { penilaianSemester, riwayatSemester, skorSemester, rataRata, predikat, deskripsiCapaian } from '@/lib/bangkit';

export function generateStaticParams() {
  return URUT_MAPEL.map((mapel) => ({ mapel }));
}

export function generateMetadata(_req, params) {
  const m = MAPEL[params?.mapel];
  const nama = m ? m.pendek : 'Mata pelajaran';
  return meta(
    `/nilai/${params?.mapel}`,
    `Nilai ${nama}: Grafik Perkembangan | Kapur`,
    `Grafik perkembangan nilai ${m ? m.nama : 'mata pelajaran'} antarsemester, daftar penilaian sumatif, dan capaian kompetensi dalam demo aplikasi Kapur.`,
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  pen: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: c.garis },
  kode: { width: 54, ...berat(800), fontSize: 12.5, lineHeight: 17, color: c.tinta2 },
  penNama: { ...berat(600), fontSize: 14.5, lineHeight: 20, color: c.tinta },
  penTgl: { ...berat(500), fontSize: 12.5, lineHeight: 17, color: c.tinta2 },
  angka: { fontFamily: F.serif, fontSize: 24, lineHeight: 28, color: c.tinta, minWidth: 36, textAlign: 'right' },
  kurang: { color: c.merah },
  guru: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  capaian: { fontFamily: F.tulis, fontSize: 14.5, lineHeight: 28, color: c.biru },
  topik: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
}));

export default function NilaiMapel() {
  const g = useGaya();
  const c = useWarna();
  const { mapel } = useLocalSearchParams();
  const anak = useAnak();
  const h = useHari();
  const m = MAPEL[mapel];
  const ada = m && (!m.mulai || anak.tingkat >= m.mulai);
  const data = useMemo(() => {
    if (!h || !ada) return null;
    const riwayat = riwayatSemester(anak, h.sem).filter((r) => !m.mulai || r.tingkat >= m.mulai);
    const pen = penilaianSemester(anak, mapel, h.hari, h.sem);
    const rata = rataRata(pen.map((p) => p.nilai));
    const titik = riwayat.map((r) => ({ label: `${r.tingkat}.${r.nomor}`, nilai: skorSemester(anak, mapel, r.tingkat, r.nomor) }));
    if (rata) titik.push({ label: `${anak.tingkat}.${h.sem.nomor}`, nilai: Math.round(rata), sementara: true });
    return { pen, rata, titik };
  }, [anak, h, mapel, ada, m]);

  if (!m) {
    return (
      <Layar kepala={{ judul: 'Mapel tidak ditemukan', kembali: '/nilai' }}>
        <Tombol href="/nilai" judul="Kembali ke daftar nilai" />
      </Layar>
    );
  }
  const guru = guruMapel(mapel, anak);
  return (
    <Layar kepala={{ judul: m.pendek, sub: m.nama !== m.pendek ? m.nama : `Nilai ${anak.panggil}`, kembali: '/nilai' }}>
      {!ada ? (
        <Kartu style={{ gap: 10 }}>
          <Teks jenis="tebal">{`${m.nama} mulai diajarkan di kelas ${m.mulai}.`}</Teks>
          <Teks jenis="kecil">{`${anak.panggil} sekarang kelas ${anak.tingkat}, jadi belum ada nilai untuk mapel ini. Ganti anak lewat tombol di pojok kanan atas.`}</Teks>
          <Tombol href="/nilai" jenis="garis" judul="Lihat mapel lain" />
        </Kartu>
      ) : !data ? (
        <>
          <Kerangka tinggi={230} />
          <Kerangka tinggi={180} />
        </>
      ) : (
        <>
          <Kartu style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Teks jenis="bagian" level={2}>Perkembangan antarsemester</Teks>
                <Teks jenis="kecil">Sumbu bawah: kelas.semester (5.1 = kelas 5 ganjil).</Teks>
              </View>
              {data.rata ? <Lencana teks={predikat(data.rata)} warna={data.rata >= SEKOLAH.batasTuntas ? c.hijau : c.merah} latar={data.rata >= SEKOLAH.batasTuntas ? c.hijauTipis : c.merahTipis} /> : null}
            </View>
            <GrafikGaris titik={data.titik} warna={m.warna} label={`Grafik nilai ${m.nama} ${anak.panggil}`} />
            <KeteranganGrafik warna={m.warna} />
          </Kartu>
          <Kartu>
            <Teks jenis="bagian" level={2}>Penilaian semester ini</Teks>
            {data.pen.length ? (
              data.pen.map((p) => (
                <View key={p.kode} style={g.pen}>
                  <Text style={g.kode}>{p.kode}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={g.penNama}>{p.nama}</Text>
                    <Text style={g.penTgl}>{fmtTanggal(p.tanggal, { tahun: false })}</Text>
                  </View>
                  <Text style={[g.angka, p.nilai < SEKOLAH.batasTuntas && g.kurang]}>{p.nilai}</Text>
                </View>
              ))
            ) : (
              <Teks jenis="kecil" style={{ marginTop: 6 }}>Belum ada penilaian yang diunggah semester ini.</Teks>
            )}
            {data.rata ? <Teks jenis="tebal" style={{ marginTop: 10 }}>{`Rata-rata sementara ${desimal(data.rata)}`}</Teks> : null}
          </Kartu>
          {data.rata ? (
            <Kartu style={{ gap: 4 }}>
              <Teks jenis="bagian" level={2}>Catatan capaian</Teks>
              <Text style={g.capaian}>{deskripsiCapaian(anak, mapel, anak.tingkat, Math.round(data.rata), `${h.sem.ta}-${h.sem.nomor}`)}</Text>
            </Kartu>
          ) : null}
          <Kartu style={{ gap: 10 }}>
            <Teks jenis="bagian" level={2}>Lingkup materi semester ini</Teks>
            <View style={g.topik}>
              {topikUntuk(mapel, anak.tingkat).map((t, i) => (
                <Lencana key={t} teks={`${i + 1}. ${t}`} warna={c.tinta} latar={c.kartu2} />
              ))}
            </View>
          </Kartu>
          <Kartu style={g.guru}>
            <Avatar siapa={guru.id} inisial={guru.panggil.split(' ')[1]?.[0]} ukuran={44} />
            <View style={{ flex: 1 }}>
              <Teks jenis="tebal">{guru.nama}</Teks>
              <Teks jenis="kecil">{guru.peran}</Teks>
            </View>
          </Kartu>
          {['sekar', 'danu'].includes(guru.id) ? <Tombol href="/pesan" jenis="garis" ikon="pesan" judul={`Tanya ${guru.panggil}`} /> : null}
        </>
      )}
    </Layar>
  );
}
