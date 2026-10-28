import { useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Link } from 'expo-router';
import Layar from '@/components/Layar';
import { Teks, Kerangka, Lencana, Tautan, STATUS_ABSEN, warnaStatus } from '@/components/Dasar';
import { KertasGaris, useCap } from '@/components/Kertas';
import Ikon, { Bintang } from '@/components/Ikon';
import Avatar from '@/components/Avatar';
import { Cincin } from '@/components/Ilustrasi';
import { Bus } from '@/components/Foto';
import { F, berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari, usePesan } from '@/lib/pakai';
import { useToko, ubah } from '@/lib/toko';
import { getar } from '@/lib/getar';
import { ORTU, GURU, MAPEL, SERAGAM, kelasAnak, mapelUntuk } from '@/lib/data';
import {
  fmtTanggal, relatifHari, menitSekarang, sapaan, rupiah, hariKe, pecah, BULAN_PENDEK, HARI, fmtJamDariMs, tambahHari, fmtWaktuPesan, selisihHari, desimal,
} from '@/lib/waktu';
import {
  absensi, rekapAbsensi, jadwalHari, posisiJadwal, jamPulang, tugas, tagihan, penilaianSemester, agenda, pengumuman, hariSekolah, hariSekolahBerikut,
  catatanGuru, antarJemput, statusIzin,
} from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/',
    'Kapur: Demo Aplikasi Orang Tua Sekolah | PintuWeb',
    'Coba Kapur, demo aplikasi orang tua untuk SD rekaan: jadwal, absensi, nilai, tugas, tagihan SPP, dan pesan wali kelas dalam satu aplikasi.',
  );
}

const TABULAR = { fontVariant: ['tabular-nums'] };

const useGaya = buatGaya((c) => StyleSheet.create({
  tanggal: { ...berat(600), fontSize: 13, lineHeight: 18, color: c.kapur2, marginTop: 6 },
  pita: { flexDirection: 'row', gap: 8 },
  pitaSel: { flex: 1, minHeight: 72, borderRadius: 16, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, padding: 10, gap: 2, justifyContent: 'center' },
  pitaBaris: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pitaAngka: { fontFamily: F.serif, fontSize: 22, lineHeight: 28, color: c.tinta, ...TABULAR },
  pitaLabel: { ...berat(600), fontSize: 13, lineHeight: 17, color: c.tinta2 },
  tulisJudul: { fontFamily: F.tulis, fontSize: 17, lineHeight: 28, color: c.biru },
  barisKertas: { minHeight: 28, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  ikonKertas: { marginTop: 5 },
  teksKertas: { ...berat(500), fontSize: 14.5, lineHeight: 28, color: c.tinta, flex: 1 },
  tebalKertas: { ...berat(700) },
  catatan: { fontFamily: F.tulis, fontSize: 14, lineHeight: 28, color: c.biru, flex: 1 },
  catatanOleh: { ...berat(600), fontSize: 13, lineHeight: 28, color: c.tinta2 },
  balas: { ...berat(700), fontSize: 13.5, lineHeight: 28, color: c.biru, textDecorationLine: 'underline' },
  paraf: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56 },
  tombolParaf: { minHeight: 44, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, borderColor: c.biru, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: c.kartu },
  tombolParafTeks: { ...berat(700), fontSize: 14, color: c.biru },
  capParaf: { borderWidth: 2, borderColor: c.biru, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.kartu },
  capLabel: { ...berat(800), fontSize: 13, lineHeight: 17, letterSpacing: 0.6, color: c.biru },
  tandaParaf: { fontFamily: F.tulis, fontSize: 20, lineHeight: 34, color: c.biru },
  tindakan: { borderRadius: 20, backgroundColor: c.pensil, padding: 14, gap: 4 },
  tindakanJudul: { ...berat(800), fontSize: 13, lineHeight: 17, letterSpacing: 0.4, color: c.pensilTeks, marginBottom: 4 },
  tindakanBaris: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(43,34,9,0.16)', minHeight: 52 },
  tindakanIkon: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,253,248,0.55)', alignItems: 'center', justifyContent: 'center' },
  tindakanTeks: { ...berat(700), fontSize: 14.5, lineHeight: 19, color: c.pensilTeks },
  tindakanKet: { ...berat(500), fontSize: 13, lineHeight: 17, color: c.pensilTeks },
  kerja: { minHeight: 34, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#2b2209', alignItems: 'center', justifyContent: 'center' },
  kerjaTeks: { ...berat(800), fontSize: 13, color: '#fbe8b4' },
  tenang: { borderRadius: 20, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center' },
  kolom: { flexDirection: 'row', gap: 12 },
  kol: { flex: 1, gap: 12 },
  ubin: { flex: 1, borderRadius: 20, padding: 14, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, gap: 6 },
  ditekan: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  ubinLabel: { ...berat(700), fontSize: 13, lineHeight: 17, letterSpacing: 0.4, color: c.tinta2 },
  ubinAngka: { fontFamily: F.serif, fontSize: 34, lineHeight: 40, color: c.tinta, ...TABULAR },
  ubinTeks: { ...berat(600), fontSize: 14, lineHeight: 19, color: c.tinta },
  ubinKecil: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  tglKotak: { width: 46, borderRadius: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: c.garisKuat, alignItems: 'center', backgroundColor: c.kartu },
  tglBulan: { alignSelf: 'stretch', backgroundColor: c.merah, paddingVertical: 1 },
  tglBulanTeks: { ...berat(800), fontSize: 12, lineHeight: 16, color: '#fffdf8', textAlign: 'center' },
  tglAngka: { fontFamily: F.serif, fontSize: 20, lineHeight: 28, color: c.tinta },
  hitung: { borderTopWidth: 1, borderTopColor: c.garis, paddingTop: 8, marginTop: 2 },
  antar: { borderRadius: 20, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, padding: 14, gap: 10 },
  tahap: { flexDirection: 'row', gap: 4 },
  tahapBatang: { flex: 1, height: 6, borderRadius: 3 },
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

function BarisKertas({ ikon, warnaIkon, children }) {
  const g = useGaya();
  const c = useWarna();
  return (
    <View style={g.barisKertas}>
      {ikon ? <View style={g.ikonKertas}><Ikon nama={ikon} ukuran={17} warna={warnaIkon || c.tinta2} /></View> : null}
      <Text style={g.teksKertas}>{children}</Text>
    </View>
  );
}

/** Pita tiga angka: kehadiran, tugas, tagihan. Selalu terlihat tanpa menggulir. */
function Pita({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const t = useToko();
  const { hari, sem, ms } = h;
  const rekap = useMemo(() => rekapAbsensi(absensi(anak, hari, sem, ms, t.izin)), [anak, hari, sem, ms, t.izin]);
  const belum = useMemo(() => tugas(anak, hari, sem).filter((x) => x.status === 'belum').length, [anak, hari, sem]);
  const utang = useMemo(() => tagihan(anak, hari, sem, t.bayar).filter((x) => x.status === 'belum'), [anak, hari, sem, t.bayar]);
  const total = utang.reduce((a, b) => a + b.nominal, 0);
  return (
    <View style={g.pita}>
      <Tautan href="/absensi" style={g.pitaSel} styleTekan={g.ditekan}>
        <View style={g.pitaBaris}>
          <Cincin persen={rekap.persen} ukuran={30} tebal={4} warna={c.hijau} latar={c.kartu2} />
          <Text style={[g.pitaAngka, { fontSize: 19 }]}>{`${Math.round(rekap.persen)}%`}</Text>
        </View>
        <Text style={g.pitaLabel}>Kehadiran</Text>
      </Tautan>
      <Tautan href="/tugas" style={g.pitaSel} styleTekan={g.ditekan}>
        <Text style={g.pitaAngka}>{belum}</Text>
        <Text style={g.pitaLabel}>Tugas belum</Text>
      </Tautan>
      <Tautan href="/tagihan" style={[g.pitaSel, utang.length && { borderColor: c.pensil, borderWidth: 2 }]} styleTekan={g.ditekan}>
        <Text style={[g.pitaAngka, { fontSize: 18 }]} numberOfLines={1}>{utang.length ? `Rp${Math.round(total / 1000)} rb` : 'Lunas'}</Text>
        <Text style={g.pitaLabel}>{utang.length ? `${utang.length} tagihan` : 'Tagihan'}</Text>
      </Tautan>
    </View>
  );
}

function CapParaf({ ms, baru }) {
  const g = useGaya();
  const cap = useCap(baru);
  return (
    <Animated.View style={[g.capParaf, { opacity: cap.opacity, transform: [{ rotate: '-3deg' }, { scale: cap.skala }] }]}>
      <Text style={g.capLabel}>DIPARAF</Text>
      <Text style={g.tandaParaf}>Ratna</Text>
      <Text style={[g.capLabel, TABULAR]}>{`${fmtJamDariMs(ms)} WIB`}</Text>
    </Animated.View>
  );
}

function HariIni({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const t = useToko();
  const baruDiparaf = useRef(false);
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
  const catatan = useMemo(() => catatanGuru(anak, hari, sem, ms), [anak, hari, sem, ms]);
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
    kegiatan = 'Pelajaran hari ini sudah selesai.';
  }
  let gerbang = null;
  if (sekolah && hariIniAbsen) {
    if (hariIniAbsen.status === 'H') gerbang = `masuk ${hariIniAbsen.masuk}${hariIniAbsen.telat ? ` (terlambat ${hariIniAbsen.telat} menit)` : ''}${hariIniAbsen.pulang ? `, pulang ${hariIniAbsen.pulang}` : ''}`;
    else if (hariIniAbsen.status === 'belum') gerbang = 'gerbang dibuka 06.15, masuk paling lambat 07.00';
    else gerbang = `${hariIniAbsen.ket}${hariIniAbsen.persetujuan === 'menunggu' ? ' (menunggu wali kelas)' : ''}`;
  }

  return (
    <KertasGaris baris={18}>
      <Text style={g.tulisJudul}>{fmtTanggal(hari, { tahun: false })}</Text>
      {gerbang ? (
        <View style={g.barisKertas}>
          <View style={g.ikonKertas}><Ikon nama="absen" ukuran={17} warna={ws.warna} /></View>
          <Text style={g.teksKertas}>
            <Text style={[g.tebalKertas, { color: ws.warna }]}>{st.teks}</Text>
            {` · ${gerbang}`}
          </Text>
        </View>
      ) : null}
      <BarisKertas ikon="jam">{kegiatan}</BarisKertas>
      {sekolah ? <BarisKertas ikon="kaos">{`Seragam: ${SERAGAM[hariKe(hari)]}`}</BarisKertas> : null}
      {bawaan.length ? (
        <BarisKertas ikon="tas">{`Bawa ${relatifHari(besok, hari) === 'Besok' ? 'besok' : HARI[hariKe(besok)]}: ${bawaan.map((b) => b.judul.toLowerCase()).join(', ')}`}</BarisKertas>
      ) : sekolah ? (
        <BarisKertas ikon="rumah">{anak.antar ? `Pulang pukul ${jamPulang(anak, hari)} naik antar-jemput` : `Pulang pukul ${jamPulang(anak, hari)} · ${anak.jemput.split(',')[0].toLowerCase()}`}</BarisKertas>
      ) : null}
      {catatan ? (
        <View style={[g.barisKertas, { marginTop: 4 }]}>
          <View style={g.ikonKertas}><Ikon nama="catatan" ukuran={17} warna={c.biru} /></View>
          <View style={{ flex: 1 }}>
            <Text style={g.catatanOleh}>{`Catatan ${catatan.guru.panggil}, ${relatifHari(catatan.tanggal, hari).toLowerCase()}`}</Text>
            <Text style={g.catatan}>{catatan.teks}</Text>
            <Link href="/pesan?balas=catatan" style={g.balas}>{`Balas ${catatan.guru.panggil}`}</Link>
          </View>
        </View>
      ) : null}
      <View style={g.paraf} aria-live="polite">
        {paraf ? (
          <CapParaf ms={paraf} baru={baruDiparaf.current} />
        ) : (
          <Pressable
            role="button"
            onPress={() => {
              baruDiparaf.current = true;
              getar('sukses');
              ubah((s) => ({ ...s, paraf: { ...s.paraf, [anak.id]: { ...(s.paraf[anak.id] || {}), [hari]: Date.now() } } }));
            }}
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

function PerluTindakan({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const t = useToko();
  const { hari, sem, ms } = h;
  const item = useMemo(() => {
    const daftar = [];
    tagihan(anak, hari, sem, t.bayar)
      .filter((x) => x.status === 'belum' && selisihHari(hari, x.jatuhTempo) <= 7)
      .forEach((x) => daftar.push({ k: x.id, ikon: 'dompet', judul: `Bayar ${x.judul.charAt(0).toLowerCase()}${x.judul.slice(1)}`, ket: `${rupiah(x.nominal)} · jatuh tempo ${relatifHari(x.jatuhTempo, hari).toLowerCase()}`, aksi: 'Bayar', href: `/tagihan/${x.id}` }));
    const besok = hariSekolahBerikut(tambahHari(hari, 1), sem);
    tugas(anak, hari, sem)
      .filter((x) => x.status === 'belum' && x.tenggat === besok)
      .slice(0, 2)
      .forEach((x) => daftar.push({ k: x.id, ikon: x.bawa ? 'tas' : 'tugas', judul: x.bawa ? `Siapkan: ${x.judul.toLowerCase()}` : `Dampingi: ${x.judul.charAt(0).toLowerCase()}${x.judul.slice(1)}`, ket: `${MAPEL[x.mapel].pendek} · tenggat ${relatifHari(x.tenggat, hari).toLowerCase()}`, aksi: 'Lihat', href: '/tugas' }));
    const rapat = pengumuman(hari, sem, anak).find((k) => k.rsvp);
    if (rapat && !t.rsvp[`${anak.id}:${rapat.rsvp}`]) {
      const ag = agenda(hari, sem, anak).find((e) => e.id === rapat.rsvp);
      daftar.push({ k: 'rsvp', ikon: 'kabar', judul: 'Konfirmasi pertemuan wali murid', ket: ag ? `${fmtTanggal(ag.mulai, { tahun: false })} · ${ag.jam}` : 'Pertemuan kelas', aksi: 'Jawab', href: `/kabar?buka=${rapat.id}` });
    }
    t.izin.filter((z) => z.anak === anak.id && statusIzin(z, ms) === 'menunggu').forEach((z) => daftar.push({ k: z.id, ikon: 'absen', judul: `Izin ${z.jenis} menunggu wali kelas`, ket: `Mulai ${fmtTanggal(z.mulai, { tahun: false })}`, aksi: 'Lihat', href: '/absensi' }));
    return daftar;
  }, [anak, hari, sem, ms, t.bayar, t.rsvp, t.izin]);

  if (!item.length) {
    return (
      <View style={g.tenang}>
        <Ikon nama="centang" ukuran={22} warna={c.hijau} tebal={2.4} />
        <View style={{ flex: 1 }}>
          <Teks jenis="tebal">Tidak ada yang mendesak</Teks>
          <Teks jenis="kecil">Tagihan, tugas besok, dan undangan sudah beres.</Teks>
        </View>
      </View>
    );
  }
  return (
    <View style={g.tindakan}>
      <Text role="heading" aria-level={2} style={g.tindakanJudul}>{`PERLU TINDAKAN · ${item.length}`}</Text>
      {item.map((x) => (
        <Tautan key={x.k} href={x.href} style={g.tindakanBaris} styleTekan={g.ditekan}>
          <View style={g.tindakanIkon}><Ikon nama={x.ikon} ukuran={20} warna={c.pensilTeks} /></View>
          <View style={{ flex: 1 }}>
            <Text style={g.tindakanTeks}>{x.judul}</Text>
            <Text style={g.tindakanKet}>{x.ket}</Text>
          </View>
          <View style={g.kerja}><Text style={g.kerjaTeks}>{x.aksi}</Text></View>
        </Tautan>
      ))}
    </View>
  );
}

function Bento({ anak, h }) {
  const g = useGaya();
  const { hari, sem } = h;
  const nilaiBaru = useMemo(() => {
    const semua = mapelUntuk(anak.tingkat).flatMap((m) => penilaianSemester(anak, m, hari, sem).map((p) => ({ ...p, mapel: m })));
    return semua.sort((a, b) => (a.unggah < b.unggah ? 1 : a.unggah > b.unggah ? -1 : b.nilai - a.nilai))[0];
  }, [anak, hari, sem]);
  const agendaBerikut = useMemo(() => agenda(hari, sem, anak).filter((e) => (e.selesai || e.mulai) >= hari && e.jenis !== 'nasional')[0], [anak, hari, sem]);
  const keLibur = sem.libur ? null : selisihHari(hari, tambahHari(sem.selesai, 1));
  return (
    <View style={g.kolom}>
      {nilaiBaru ? (
        <Ubin href={`/nilai/${nilaiBaru.mapel}`}>
          <Text style={g.ubinLabel}>NILAI TERBARU</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={g.ubinAngka}>{nilaiBaru.nilai}</Text>
            {nilaiBaru.nilai >= 88 ? <Bintang ukuran={30} /> : null}
          </View>
          <Text style={g.ubinTeks}>{MAPEL[nilaiBaru.mapel].pendek}</Text>
          <Text style={g.ubinKecil}>{`${nilaiBaru.kode} · ${nilaiBaru.nama}`}</Text>
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
            <Text style={g.ubinKecil}>{relatifHari(agendaBerikut.mulai, hari)}</Text>
          </View>
          <Text style={g.ubinTeks}>{agendaBerikut.judul}</Text>
          {keLibur ? (
            <View style={g.hitung}>
              <Text style={g.ubinKecil}>{`Libur semester ${keLibur} hari lagi`}</Text>
            </View>
          ) : null}
        </Ubin>
      ) : null}
    </View>
  );
}

function AntarJemput({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const a = antarJemput(anak, h.hari, h.sem, h.ms);
  if (!a) return null;
  return (
    <View style={g.antar}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Bus lebar={96} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={g.ubinLabel}>{`ANTAR-JEMPUT · RUTE ${a.rute.toUpperCase()}`}</Text>
          <Text style={g.ubinTeks}>{a.judul}</Text>
          <Text style={g.ubinKecil}>{a.ket}</Text>
        </View>
      </View>
      {a.tahap !== 'libur' ? (
        <View style={g.tahap} role="img" aria-label={`Tahap ${a.langkah + 1} dari 5: ${a.judul}`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={[g.tahapBatang, { backgroundColor: i <= a.langkah ? c.hijau : c.kartu2 }]} />
          ))}
        </View>
      ) : null}
      <Text style={g.ubinKecil}>{`${a.sopir} · ${a.nopol} · status mengikuti jam simulasi WIB`}</Text>
    </View>
  );
}

function PesanTerbaru({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const { daftar: pesan, baru } = usePesan(anak);
  const terakhirGuru = [...pesan].reverse().find((p) => p.dari === 'guru');
  if (!terakhirGuru) return null;
  return (
    <Tautan href="/pesan" style={g.kabar} styleTekan={g.ditekan}>
      <View style={g.pesanBaris}>
        <Avatar siapa={anak.wali} ukuran={44} />
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <Text style={g.ubinTeks}>{GURU[anak.wali].panggil}</Text>
            <Text style={[g.ubinKecil, TABULAR]}>{fmtWaktuPesan(terakhirGuru.ms, h.ms)}</Text>
          </View>
          <Text style={[g.ubinKecil, { color: c.tinta }]} numberOfLines={2}>{terakhirGuru.teks}</Text>
          {baru ? <Lencana teks={`${baru} pesan baru`} warna={c.biru} latar={c.biruTipis} /> : null}
        </View>
      </View>
    </Tautan>
  );
}

function KabarTerbaru({ anak, h }) {
  const g = useGaya();
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
        judul: `Buku penghubung\n${anak.panggil}`,
        besar: true,
        judulRingkas: 'Buku penghubung',
        children: <Text style={g.tanggal}>{h ? `${fmtTanggal(h.hari)} · ${h.sem.libur ? 'Libur semester' : `Semester ${h.sem.nama.toLowerCase()} ${h.sem.ta}`}` : `Kelas ${kelasAnak(anak)} · SD Rindang Jati`}</Text>,
      }}
    >
      {h ? <Pita anak={anak} h={h} /> : <View style={g.pita}><Kerangka tinggi={72} style={{ flex: 1 }} /><Kerangka tinggi={72} style={{ flex: 1 }} /><Kerangka tinggi={72} style={{ flex: 1 }} /></View>}
      {h ? <HariIni anak={anak} h={h} /> : <Kerangka tinggi={330} />}
      {h ? <PerluTindakan anak={anak} h={h} /> : <Kerangka tinggi={150} />}
      {h ? <Bento anak={anak} h={h} /> : (
        <View style={g.kolom}><Kerangka tinggi={170} style={{ flex: 1 }} /><Kerangka tinggi={170} style={{ flex: 1 }} /></View>
      )}
      {h ? <AntarJemput anak={anak} h={h} /> : null}
      {h ? <PesanTerbaru anak={anak} h={h} /> : <Kerangka tinggi={90} />}
      <View style={g.judulBagian}>
        <Teks jenis="bagian" level={2}>Kabar sekolah</Teks>
        <Link href="/kabar" style={g.tautan}>Semua kabar</Link>
      </View>
      {h ? <KabarTerbaru anak={anak} h={h} /> : <><Kerangka tinggi={72} /><Kerangka tinggi={72} /></>}
    </Layar>
  );
}
