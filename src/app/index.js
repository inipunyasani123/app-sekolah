import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Layar from '@/components/Layar';
import { Teks, Kerangka, Lencana, Tautan, STATUS_ABSEN, warnaStatus } from '@/components/Dasar';
import { KertasGaris } from '@/components/Kertas';
import Ikon, { Bintang } from '@/components/Ikon';
import Avatar from '@/components/Avatar';
import { F, berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari, usePesan } from '@/lib/pakai';
import { useToko, ubah } from '@/lib/toko';
import { ORTU, GURU, MAPEL, SERAGAM, kelasAnak } from '@/lib/data';
import { fmtTanggal, relatifHari, menitSekarang, sapaan, rupiah, hariKe, pecah, BULAN_PENDEK, HARI, fmtJamDariMs, tambahHari, fmtWaktuPesan } from '@/lib/waktu';
import {
  absensi, rekapAbsensi, jadwalHari, posisiJadwal, jamPulang, tugas, tagihan, penilaianSemester, agenda, pengumuman, hariSekolah, hariSekolahBerikut,
} from '@/lib/bangkit';
import { mapelUntuk } from '@/lib/data';

export function generateMetadata() {
  return meta(
    '/',
    'Kapur: Demo Aplikasi Orang Tua Sekolah | PintuWeb',
    'Coba Kapur, demo aplikasi orang tua untuk SD rekaan: jadwal, absensi, nilai, tugas, tagihan SPP, dan pesan wali kelas dalam satu aplikasi.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  tanggal: { ...berat(600), fontSize: 13, lineHeight: 18, color: c.kapur2, marginTop: 6 },
  tulisJudul: { fontFamily: F.tulis, fontSize: 17, lineHeight: 28, color: c.biru },
  barisKertas: { minHeight: 28, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  ikonKertas: { marginTop: 5 },
  teksKertas: { ...berat(500), fontSize: 14.5, lineHeight: 28, color: c.tinta, flex: 1 },
  tebalKertas: { ...berat(700) },
  paraf: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  tombolParaf: { minHeight: 40, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, borderColor: c.biru, flexDirection: 'row', alignItems: 'center', gap: 6 },
  tombolParafTeks: { ...berat(700), fontSize: 14, color: c.biru },
  tandaParaf: { fontFamily: F.tulis, fontSize: 20, lineHeight: 30, color: c.biru },
  kolom: { flexDirection: 'row', gap: 12 },
  kol: { flex: 1, gap: 12 },
  ubin: { borderRadius: 20, padding: 14, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, gap: 6 },
  ubinKuning: { backgroundColor: c.pensil, borderColor: c.pensil },
  ubinHijau: { backgroundColor: c.papan, borderColor: c.papan },
  ditekan: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  ubinLabel: { ...berat(700), fontSize: 12, lineHeight: 16, letterSpacing: 0.4, color: c.tinta2 },
  ubinAngka: { fontFamily: F.serif, fontSize: 34, lineHeight: 40, color: c.tinta },
  ubinTeks: { ...berat(600), fontSize: 14, lineHeight: 19, color: c.tinta },
  ubinKecil: { ...berat(500), fontSize: 12.5, lineHeight: 17, color: c.tinta2 },
  tugasBaris: { borderTopWidth: 1, borderTopColor: c.garis, paddingTop: 8, marginTop: 2, gap: 2 },
  batang: { flexDirection: 'row', gap: 3, alignItems: 'flex-end', height: 22, marginTop: 2 },
  tglKotak: { width: 46, borderRadius: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: c.garisKuat, alignItems: 'center' },
  tglBulan: { alignSelf: 'stretch', backgroundColor: c.merah, paddingVertical: 1 },
  tglBulanTeks: { ...berat(800), fontSize: 11, lineHeight: 15, color: '#fffdf8', textAlign: 'center' },
  tglAngka: { fontFamily: F.serif, fontSize: 20, lineHeight: 28, color: c.tinta },
  pesanBaris: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  judulBagian: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 },
  tautan: { ...berat(700), fontSize: 14, color: c.biru, textDecorationLine: 'underline', paddingVertical: 6 },
  kabar: { borderRadius: 18, padding: 14, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, gap: 4 },
}));

function Ubin({ href, gaya, children }) {
  const g = useGaya();
  return (
    <Tautan href={href} style={[g.ubin, gaya]} styleTekan={g.ditekan}>
      {children}
    </Tautan>
  );
}

function BarisKertas({ ikon, children }) {
  const g = useGaya();
  const c = useWarna();
  return (
    <View style={g.barisKertas}>
      {ikon ? <View style={g.ikonKertas}><Ikon nama={ikon} ukuran={17} warna={c.tinta2} /></View> : null}
      <Text style={g.teksKertas}>{children}</Text>
    </View>
  );
}

function HariIni({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const t = useToko();
  const { hari, sem, ms } = h;
  const sekolah = hariSekolah(hari, sem);
  const absen = useMemo(() => absensi(anak, hari, sem, ms, t.izin), [anak, hari, sem, ms, t.izin]);
  const hariIniAbsen = absen.find((e) => e.tanggal === hari);
  const slot = jadwalHari(anak, hari);
  const menit = menitSekarang(ms);
  const { kini, berikut } = posisiJadwal(slot, menit);
  const daftarTugas = useMemo(() => tugas(anak, hari, sem), [anak, hari, sem]);
  const besok = hariSekolahBerikut(tambahHari(hari, 1), sem);
  // Bawaan untuk hari sekolah berikutnya (bawaan hari ini dianggap sudah disiapkan).
  const bawaan = daftarTugas.filter((x) => x.bawa && x.status === 'belum' && x.tenggat === besok);
  const paraf = (t.paraf[anak.id] || {})[hari];
  const st = hariIniAbsen ? STATUS_ABSEN[hariIniAbsen.status] : null;
  const ws = st ? warnaStatus(c, st.kunci) : null;
  let kegiatan;
  if (!sekolah) {
    kegiatan = sem.libur
      ? `Libur semester. Masuk lagi ${fmtTanggal(sem.mulaiBerikut, { tahun: false })}.`
      : `Tidak ada pelajaran hari ini. Masuk lagi ${besok ? fmtTanggal(besok, { tahun: false }) : 'sesuai kalender'}.`;
  } else if (kini >= 0) {
    const s = slot[kini];
    kegiatan = `Sekarang: ${s.mapel ? MAPEL[s.mapel].pendek : s.k}, ${s.mulai}–${s.selesai}`;
  } else if (berikut >= 0) {
    const s = slot[berikut];
    kegiatan = `Berikutnya: ${s.mapel ? MAPEL[s.mapel].pendek : s.k}, pukul ${s.mulai}`;
  } else {
    kegiatan = "Pelajaran hari ini sudah selesai.";
  }

  return (
    <KertasGaris baris={9}>
      <Text style={g.tulisJudul}>{fmtTanggal(hari, { tahun: false })}</Text>
      {sekolah && hariIniAbsen ? (
        <View style={g.barisKertas}>
          <View style={g.ikonKertas}><Ikon nama="absen" ukuran={17} warna={ws.warna} /></View>
          <Text style={g.teksKertas} numberOfLines={1}>
            <Text style={[g.tebalKertas, { color: ws.warna }]}>{st.teks}</Text>
            {hariIniAbsen.status === 'H' ? ` · masuk ${hariIniAbsen.masuk}${hariIniAbsen.pulang ? `, pulang ${hariIniAbsen.pulang}` : ''}` : hariIniAbsen.status === 'belum' ? ' · gerbang dibuka 06.15' : ` · ${hariIniAbsen.ket}`}
          </Text>
        </View>
      ) : null}
      <BarisKertas ikon="jam">{kegiatan}</BarisKertas>
      {sekolah ? <BarisKertas ikon="kaos">{`Seragam: ${SERAGAM[hariKe(hari)]}`}</BarisKertas> : null}
      {bawaan.length ? (
        <BarisKertas ikon="tas">{`Bawa ${relatifHari(besok, hari) === 'Besok' ? 'besok' : HARI[hariKe(besok)]}: ${bawaan.map((b) => b.judul.toLowerCase()).join(', ')}`}</BarisKertas>
      ) : sekolah ? (
        <BarisKertas ikon="rumah">{`Pulang pukul ${jamPulang(anak, hari)} · ${anak.jemput.split(',')[0].toLowerCase()}`}</BarisKertas>
      ) : null}
      <View style={g.paraf}>
        {paraf ? (
          <>
            <Text style={g.tandaParaf}>Ratna ✓</Text>
            <Text style={[g.teksKertas, { color: c.tinta2 }]}>diparaf {fmtJamDariMs(paraf)} WIB</Text>
          </>
        ) : (
          <Pressable
            role="button"
            onPress={() => ubah((s) => ({ ...s, paraf: { ...s.paraf, [anak.id]: { ...(s.paraf[anak.id] || {}), [hari]: Date.now() } } }))}
            style={({ pressed }) => [g.tombolParaf, pressed && g.ditekan]}
          >
            <Ikon nama="tugas" ukuran={17} warna={c.biru} />
            <Text style={g.tombolParafTeks}>Paraf sudah dibaca</Text>
          </Pressable>
        )}
      </View>
    </KertasGaris>
  );
}

function Bento({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const t = useToko();
  const { hari, sem, ms } = h;
  const daftarTugas = useMemo(() => tugas(anak, hari, sem), [anak, hari, sem]);
  const belum = daftarTugas.filter((x) => x.status === 'belum').sort((a, b) => a.tenggat.localeCompare(b.tenggat));
  const tagih = useMemo(() => tagihan(anak, hari, sem, t.bayar), [anak, hari, sem, t.bayar]);
  const utang = tagih.filter((x) => x.status === 'belum');
  const absen = useMemo(() => absensi(anak, hari, sem, ms, t.izin), [anak, hari, sem, ms, t.izin]);
  const rekap = rekapAbsensi(absen);
  const sepuluh = absen.filter((e) => !e.mendatang && e.status !== 'belum').slice(-10);
  const nilaiBaru = useMemo(() => {
    const semua = mapelUntuk(anak.tingkat).flatMap((m) => penilaianSemester(anak, m, hari, sem).map((p) => ({ ...p, mapel: m })));
    return semua.sort((a, b) => (a.unggah < b.unggah ? 1 : a.unggah > b.unggah ? -1 : b.nilai - a.nilai))[0];
  }, [anak, hari, sem]);
  const agendaBerikut = useMemo(() => agenda(hari, sem, anak).filter((e) => (e.selesai || e.mulai) >= hari)[0], [anak, hari, sem]);
  const { daftar: pesan, baru } = usePesan(anak);
  const terakhirGuru = [...pesan].reverse().find((p) => p.dari === 'guru');

  return (
    <>
      <View style={g.kolom}>
        <View style={g.kol}>
          <Ubin href="/tugas">
            <Text style={g.ubinLabel}>TUGAS</Text>
            <Text style={g.ubinAngka}>{belum.length}</Text>
            <Text style={g.ubinTeks}>belum dikerjakan</Text>
            {belum.slice(0, 2).map((x) => (
              <View key={x.id} style={g.tugasBaris}>
                <Text style={g.ubinKecil}>{`${MAPEL[x.mapel].pendek} · ${relatifHari(x.tenggat, hari)}`}</Text>
                <Text style={g.ubinTeks} numberOfLines={2}>{x.judul}</Text>
              </View>
            ))}
          </Ubin>
          <Ubin href="/absensi">
            <Text style={g.ubinLabel}>KEHADIRAN</Text>
            <Text style={g.ubinAngka}>{`${String(rekap.persen).replace('.', ',')}%`}</Text>
            <View style={g.batang} aria-hidden>
              {sepuluh.map((e) => (
                <View key={e.tanggal} style={{ flex: 1, height: e.status === 'H' ? 22 : 10, borderRadius: 3, backgroundColor: e.status === 'H' ? c.hijau : e.status === 'S' ? c.merah : c.kuning }} />
              ))}
            </View>
            <Text style={g.ubinKecil}>{`10 hari sekolah terakhir · ${rekap.S} sakit, ${rekap.I} izin`}</Text>
          </Ubin>
        </View>
        <View style={g.kol}>
          {utang.length ? (
            <Ubin href={`/tagihan/${utang[0].id}`} gaya={g.ubinKuning}>
              <Text style={[g.ubinLabel, { color: c.pensilTeks }]}>TAGIHAN</Text>
              <Text style={[g.ubinTeks, { color: c.pensilTeks }]} numberOfLines={2}>{utang[0].judul}</Text>
              <Text style={[g.ubinAngka, { fontSize: 24, lineHeight: 30, color: c.pensilTeks }]}>{rupiah(utang[0].nominal)}</Text>
              <Text style={[g.ubinKecil, { color: c.pensilTeks }]}>{`Jatuh tempo ${fmtTanggal(utang[0].jatuhTempo, { hari: false, tahun: false })}${utang.length > 1 ? ` · +${utang.length - 1} lainnya` : ''}`}</Text>
            </Ubin>
          ) : (
            <Ubin href="/tagihan">
              <Text style={g.ubinLabel}>TAGIHAN</Text>
              <Text style={g.ubinTeks}>Semua tagihan lunas</Text>
              <Text style={g.ubinKecil}>Lihat riwayat dan bukti bayar</Text>
            </Ubin>
          )}
          {nilaiBaru ? (
            <Ubin href={`/nilai/${nilaiBaru.mapel}`}>
              <Text style={g.ubinLabel}>NILAI TERBARU</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={g.ubinAngka}>{nilaiBaru.nilai}</Text>
                {nilaiBaru.nilai >= 88 ? <Bintang ukuran={30} /> : null}
              </View>
              <Text style={g.ubinTeks}>{MAPEL[nilaiBaru.mapel].pendek}</Text>
              <Text style={g.ubinKecil} numberOfLines={2}>{`${nilaiBaru.kode} · ${nilaiBaru.nama}`}</Text>
            </Ubin>
          ) : (
            <Ubin href="/nilai">
              <Text style={g.ubinLabel}>NILAI</Text>
              <Text style={g.ubinTeks}>Belum ada penilaian semester ini</Text>
              <Text style={g.ubinKecil}>Lihat rapor semester lalu</Text>
            </Ubin>
          )}
          {agendaBerikut ? (
            <Ubin href="/kabar?tab=kalender">
              <Text style={g.ubinLabel}>AGENDA</Text>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <View style={g.tglKotak}>
                  <View style={g.tglBulan}><Text style={g.tglBulanTeks}>{BULAN_PENDEK[pecah(agendaBerikut.mulai).m - 1].toUpperCase()}</Text></View>
                  <Text style={g.tglAngka}>{pecah(agendaBerikut.mulai).d}</Text>
                </View>
                <Text style={[g.ubinTeks, { flex: 1 }]} numberOfLines={3}>{agendaBerikut.judul}</Text>
              </View>
              <Text style={g.ubinKecil}>{relatifHari(agendaBerikut.mulai, hari)}</Text>
            </Ubin>
          ) : null}
        </View>
      </View>
      {terakhirGuru ? (
        <Ubin href="/pesan">
          <View style={g.pesanBaris}>
            <Avatar siapa={anak.wali} ukuran={44} />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <Text style={g.ubinTeks}>{GURU[anak.wali].panggil}</Text>
                <Text style={g.ubinKecil}>{fmtWaktuPesan(terakhirGuru.ms, ms)}</Text>
              </View>
              <Text style={[g.ubinKecil, { color: c.tinta }]} numberOfLines={2}>{terakhirGuru.teks}</Text>
              {baru ? <Lencana teks={`${baru} pesan baru`} warna={c.biru} latar={c.biruTipis} /> : null}
            </View>
          </View>
        </Ubin>
      ) : null}
    </>
  );
}

function KabarTerbaru({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const daftar = useMemo(() => pengumuman(h.hari, h.sem, anak).slice(0, 2), [anak, h.hari, h.sem]);
  return daftar.map((k) => (
    <Tautan key={k.id} href={`/kabar?buka=${k.id}`} style={g.kabar} styleTekan={g.ditekan}>
      <Text style={g.ubinKecil}>{`${k.kategori} · ${relatifHari(k.tanggal, h.hari)}`}</Text>
      <Text style={g.ubinTeks}>{k.judul}</Text>
    </Tautan>
  ));
}

export default function Beranda() {
  const g = useGaya();
  const anak = useAnak();
  const h = useHari();
  const sub = h ? `${sapaan(h.ms)}, ${ORTU.sapaan}` : `Halo, ${ORTU.sapaan}`;
  return (
    <Layar
      kepala={{
        sub,
        judul: `Buku penghubung ${anak.panggil}`,
        besar: true,
        children: <Text style={g.tanggal}>{h ? `${fmtTanggal(h.hari)} · ${h.sem.libur ? 'Libur semester' : `Semester ${h.sem.nama.toLowerCase()} ${h.sem.ta}`}` : `Kelas ${kelasAnak(anak)} · SD Rindang Jati`}</Text>,
      }}
    >
      {h ? <HariIni anak={anak} h={h} /> : <Kerangka tinggi={268} />}
      {h ? <Bento anak={anak} h={h} /> : (
        <View style={g.kolom}>
          <View style={g.kol}><Kerangka tinggi={230} /><Kerangka tinggi={140} /></View>
          <View style={g.kol}><Kerangka tinggi={130} /><Kerangka tinggi={130} /><Kerangka tinggi={110} /></View>
        </View>
      )}
      <View style={g.judulBagian}>
        <Teks jenis="bagian" level={2}>Kabar sekolah</Teks>
        <Link href="/kabar" style={g.tautan}>Semua kabar</Link>
      </View>
      {h ? <KabarTerbaru anak={anak} h={h} /> : <><Kerangka tinggi={72} /><Kerangka tinggi={72} /></>}
    </Layar>
  );
}
