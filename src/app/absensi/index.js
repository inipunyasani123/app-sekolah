import { useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Kartu, Kerangka, Tombol, Lencana, STATUS_ABSEN, warnaStatus } from '@/components/Dasar';
import Ikon from '@/components/Ikon';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { useToko } from '@/lib/toko';
import { GURU, kelasAnak } from '@/lib/data';
import { fmtTanggal, pecah, isoDari, jumlahHari, hariKe, tambahBulan, BULAN, desimal } from '@/lib/waktu';
import { absensi, rekapAbsensi, hariSekolah, statusIzin, tanggalIzin, hariNasional } from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/absensi',
    'Absensi Anak: Hadir, Izin, dan Sakit | Kapur',
    'Rekap kehadiran anak dari kartu gerbang sekolah, kalender absensi per bulan, dan pengajuan izin atau sakit ke wali kelas di demo Kapur.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  rekap: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  persen: { fontFamily: F.serif, fontSize: 46, lineHeight: 52, color: c.tinta },
  hitung: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 8 },
  kotakHitung: { flex: 1, minWidth: 70, borderRadius: 14, paddingVertical: 8, alignItems: 'center' },
  kotakAngka: { fontFamily: F.serif, fontSize: 22, lineHeight: 28 },
  kotakLabel: { ...berat(700), fontSize: 12, lineHeight: 16 },
  bulanBaris: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  panah: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: c.garis },
  mati: { opacity: 0.35 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  sel: { width: `${100 / 7}%`, aspectRatio: 1, padding: 2 },
  selIsi: { flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  selAngka: { ...berat(700), fontSize: 13.5, lineHeight: 18, color: c.tinta },
  selLibur: { color: c.tinta2, ...berat(500) },
  selHariIni: { borderWidth: 2, borderColor: c.tinta },
  namaHari: { width: `${100 / 7}%`, ...berat(700), fontSize: 11.5, lineHeight: 16, color: c.tinta2, textAlign: 'center', paddingBottom: 4 },
  legenda: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginTop: 8 },
  legendaItem: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  legendaKotak: { width: 14, height: 14, borderRadius: 4 },
  catatan: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 8, borderTopWidth: 1, borderTopColor: c.garis },
  izin: { gap: 4, paddingVertical: 10, borderTopWidth: 1, borderTopColor: c.garis },
}));

function KalenderBulan({ daftar, hari, sem, anak }) {
  const g = useGaya();
  const c = useWarna();
  const sekarang = pecah(hari);
  const mulai = pecah(sem.mulai);
  const akhir = hari > sem.selesai ? pecah(sem.selesai) : sekarang;
  const [bulan, setBulan] = useState({ tahun: akhir.y, bulan: akhir.m });
  useEffect(() => setBulan({ tahun: akhir.y, bulan: akhir.m }), [anak.id, akhir.y, akhir.m]);
  const idx = (b) => b.tahun * 12 + b.bulan;
  const bisaMundur = idx(bulan) > mulai.y * 12 + mulai.m;
  const bisaMaju = idx(bulan) < akhir.y * 12 + akhir.m;
  const peta = useMemo(() => Object.fromEntries(daftar.map((e) => [e.tanggal, e])), [daftar]);
  const n = jumlahHari(bulan.tahun, bulan.bulan);
  const pertama = isoDari(bulan.tahun, bulan.bulan, 1);
  const kosong = (hariKe(pertama) + 6) % 7;
  const sel = [...Array(kosong).fill(null), ...Array.from({ length: n }, (_, i) => isoDari(bulan.tahun, bulan.bulan, i + 1))];
  const catatan = daftar.filter((e) => e.tanggal.startsWith(`${bulan.tahun}-${String(bulan.bulan).padStart(2, '0')}`) && (e.status !== 'H' || e.telat) && e.status !== 'belum');
  const warnaSel = (e) => {
    if (!e) return null;
    if (e.status === 'H') return e.telat ? c.kuningTipis : c.hijauTipis;
    if (e.status === 'S') return c.merahTipis;
    if (e.status === 'I') return c.kuningTipis;
    return c.kartu2;
  };
  return (
    <Kartu style={{ gap: 8 }}>
      <View style={g.bulanBaris}>
        <Pressable role="button" aria-label="Bulan sebelumnya" disabled={!bisaMundur} onPress={() => setBulan(tambahBulan(bulan.tahun, bulan.bulan, -1))} style={[g.panah, !bisaMundur && g.mati]}>
          <Ikon nama="kembali" ukuran={20} warna={c.tinta} />
        </Pressable>
        <Teks jenis="bagian" level={2} aria-live="polite">{`${BULAN[bulan.bulan - 1]} ${bulan.tahun}`}</Teks>
        <Pressable role="button" aria-label="Bulan berikutnya" disabled={!bisaMaju} onPress={() => setBulan(tambahBulan(bulan.tahun, bulan.bulan, 1))} style={[g.panah, !bisaMaju && g.mati]}>
          <Ikon nama="kanan" ukuran={20} warna={c.tinta} />
        </Pressable>
      </View>
      <View aria-hidden>
        <View style={g.grid}>
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
            <Text key={d} style={g.namaHari}>{d}</Text>
          ))}
        </View>
        <View style={g.grid}>
          {sel.map((d, i) => {
            if (!d) return <View key={`k${i}`} style={g.sel} />;
            const e = peta[d];
            const sekolah = hariSekolah(d, sem);
            return (
              <View key={d} style={g.sel}>
                <View style={[g.selIsi, { backgroundColor: warnaSel(e) || 'transparent' }, d === hari && g.selHariIni]}>
                  <Text style={[g.selAngka, !sekolah && g.selLibur]}>{pecah(d).d}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View style={g.legenda}>
        {[['Hadir', c.hijauTipis], ['Terlambat / izin', c.kuningTipis], ['Sakit', c.merahTipis]].map(([t, w]) => (
          <View key={t} style={g.legendaItem}>
            <View style={[g.legendaKotak, { backgroundColor: w, borderWidth: 1, borderColor: c.garisKuat }]} />
            <Teks jenis="kecil">{t}</Teks>
          </View>
        ))}
      </View>
      <Teks jenis="tebal" style={{ marginTop: 6 }}>{`Catatan ${BULAN[bulan.bulan - 1]}`}</Teks>
      {catatan.length ? catatan.map((e) => {
        const st = STATUS_ABSEN[e.status];
        const ws = warnaStatus(c, e.telat ? 'kuning' : st.kunci);
        return (
          <View key={e.tanggal} style={g.catatan}>
            <Lencana teks={e.telat ? 'Terlambat' : st.teks} warna={ws.warna} latar={ws.latar} />
            <View style={{ flex: 1 }}>
              <Teks jenis="tebal">{fmtTanggal(e.tanggal, { tahun: false })}</Teks>
              <Teks jenis="kecil">{e.telat ? `Masuk ${e.masuk}, terlambat ${e.telat} menit` : e.ket}{e.mendatang ? ' (mendatang)' : ''}</Teks>
            </View>
          </View>
        );
      }) : (
        <Teks jenis="kecil">{`Hadir tepat waktu di semua hari sekolah${hariNasional(hari) ? '' : ''}.`}</Teks>
      )}
    </Kartu>
  );
}

export default function Absensi() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  const h = useHari();
  const t = useToko();
  const daftar = useMemo(() => (h ? absensi(anak, h.hari, h.sem, h.ms, t.izin) : []), [anak, h, t.izin]);
  const rekap = rekapAbsensi(daftar);
  const hariIni = h ? daftar.find((e) => e.tanggal === h.hari) : null;
  const izinSaya = t.izin.filter((z) => z.anak === anak.id).sort((a, b) => b.dibuat - a.dibuat);
  return (
    <Layar kepala={{ judul: 'Absensi', sub: `${anak.panggil} · kelas ${kelasAnak(anak)} · ${anak.gerbang}` }}>
      {!h ? (
        <>
          <Kerangka tinggi={150} />
          <Kerangka tinggi={46} />
          <Kerangka tinggi={380} />
        </>
      ) : (
        <>
          <Kartu>
            <View style={g.rekap}>
              <View style={{ flex: 1 }}>
                <Teks jenis="label">KEHADIRAN SEMESTER INI</Teks>
                <Text style={g.persen}>{`${desimal(rekap.persen)}%`}</Text>
                <Teks jenis="kecil">{`${rekap.total} hari sekolah sejak ${fmtTanggal(h.sem.mulai, { hari: false, tahun: false })}`}</Teks>
              </View>
              {hariIni ? (
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Teks jenis="label">HARI INI</Teks>
                  <Lencana teks={STATUS_ABSEN[hariIni.status].teks} {...warnaStatus(c, STATUS_ABSEN[hariIni.status].kunci)} />
                  {hariIni.masuk ? <Teks jenis="kecil">{`Masuk ${hariIni.masuk}`}</Teks> : null}
                  {hariIni.pulang ? <Teks jenis="kecil">{`Pulang ${hariIni.pulang}`}</Teks> : null}
                </View>
              ) : null}
            </View>
            <View style={g.hitung}>
              {[['H', 'Hadir', 'hijau'], ['S', 'Sakit', 'merah'], ['I', 'Izin', 'kuning'], ['A', 'Alpa', 'tinta2']].map(([k, l, w]) => (
                <View key={k} style={[g.kotakHitung, { backgroundColor: c[`${w}Tipis`] || c.kartu2 }]}>
                  <Text style={[g.kotakAngka, { color: c[w] }]}>{rekap[k]}</Text>
                  <Text style={[g.kotakLabel, { color: c[w] }]}>{l}</Text>
                </View>
              ))}
            </View>
            {rekap.telat ? <Teks jenis="kecil" style={{ marginTop: 8 }}>{`Terlambat ${rekap.telat} kali (masuk lewat pukul 07.00).`}</Teks> : null}
          </Kartu>
          <Tombol href="/absensi/izin" jenis="pensil" ikon="tambah" judul="Ajukan izin atau sakit" />
          {izinSaya.length ? (
            <Kartu>
              <Teks jenis="bagian" level={2}>Pengajuan saya</Teks>
              {izinSaya.map((z) => {
                const st = statusIzin(z, h.ms);
                const tgl = tanggalIzin(z, h.sem);
                return (
                  <View key={z.id} style={g.izin}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Teks jenis="tebal">{z.jenis === 'sakit' ? 'Sakit' : 'Izin'}</Teks>
                      <Lencana teks={st === 'disetujui' ? `Disetujui ${GURU[anak.wali].panggil}` : 'Menunggu wali kelas'} ikon={st === 'disetujui' ? 'centang' : 'jam'} warna={st === 'disetujui' ? c.hijau : c.biru} latar={st === 'disetujui' ? c.hijauTipis : c.biruTipis} />
                    </View>
                    <Teks jenis="kecil">{tgl.length ? tgl.map((d) => fmtTanggal(d, { tahun: false, pendek: true })).join(', ') : fmtTanggal(z.mulai, { tahun: false })}</Teks>
                    <Teks>{z.alasan}</Teks>
                    {z.lampiran ? <Teks jenis="kecil">Lampiran: foto surat dokter (simulasi)</Teks> : null}
                  </View>
                );
              })}
            </Kartu>
          ) : null}
          <KalenderBulan daftar={daftar} hari={h.hari} sem={h.sem} anak={anak} />
          <Teks jenis="kecil">Absensi tercatat otomatis saat kartu siswa ditempel di gerbang sekolah. Gerbang dibuka pukul 06.15 WIB, pelajaran dimulai 07.00 WIB.</Teks>
        </>
      )}
    </Layar>
  );
}
