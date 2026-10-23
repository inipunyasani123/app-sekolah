import { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Kartu, Kerangka, Segmen, Chip, Lencana } from '@/components/Dasar';
import Ikon from '@/components/Ikon';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { GURU, MAPEL, SERAGAM, kelasAnak, guruMapel } from '@/lib/data';
import { fmtTanggal, hariKe, menitSekarang, jamKeMenit, menitKeJam, tambahHari, awalMinggu, HARI_PENDEK, HARI, pecah } from '@/lib/waktu';
import { jadwalHari, posisiJadwal, hariSekolah, hariSekolahBerikut, hariNasional, tugas } from '@/lib/bangkit';
import Ilustrasi from '@/components/Ilustrasi';

export function generateMetadata() {
  return meta(
    '/jadwal',
    'Jadwal Pelajaran Hari Ini dan Minggu Ini | Kapur',
    'Jadwal pelajaran anak per hari lengkap dengan jam, guru, seragam, dan bawaan. Bagian dari demo aplikasi orang tua Kapur.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  slot: { flexDirection: 'row', gap: 8, alignItems: 'stretch', minHeight: 58 },
  jam: { width: 46, paddingTop: 10 },
  jamTeks: { ...berat(700), fontSize: 13, lineHeight: 17, color: c.tinta, fontVariant: ['tabular-nums'] },
  jamKecil: { ...berat(500), fontSize: 13, lineHeight: 17, color: c.tinta2, fontVariant: ['tabular-nums'] },
  rel: { width: 32, alignItems: 'center' },
  relGaris: { position: 'absolute', top: 0, bottom: -10, width: 2, backgroundColor: c.garisKuat, opacity: 0.45 },
  bulat: { marginTop: 8, width: 30, height: 30, borderRadius: 15, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center', backgroundColor: c.kartu },
  bulatTeks: { fontFamily: F.serif, fontSize: 15, lineHeight: 19, color: c.tinta },
  kartuSlot: { flex: 1, borderRadius: 16, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, padding: 12, overflow: 'hidden', gap: 2 },
  kartuJeda: { backgroundColor: 'transparent', borderStyle: 'dashed', paddingVertical: 9 },
  kartuKini: { borderColor: c.tombol, borderWidth: 2, backgroundColor: c.hijauTipis },
  nama: { ...berat(700), fontSize: 15, lineHeight: 20, color: c.tinta },
  guru: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  kartuLewat: { backgroundColor: 'transparent' },
  namaLewat: { color: c.tinta2 },
  kini: { position: 'absolute', left: 46, right: 0, height: 0, borderTopWidth: 2, borderColor: c.pensil, borderStyle: 'dashed', zIndex: 3 },
  kiniPil: { position: 'absolute', right: 6, top: -13, backgroundColor: c.pensil, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  kiniTeks: { ...berat(800), fontSize: 13, lineHeight: 17, color: c.pensilTeks, fontVariant: ['tabular-nums'] },
  kiniBaris: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  kiniGaris: { flex: 1, height: 0, borderTopWidth: 2, borderColor: c.pensil, borderStyle: 'dashed' },
  hariBaris: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  info: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  infoTeks: { ...berat(600), fontSize: 14, lineHeight: 20, color: c.tinta, flex: 1 },
  kosong: { gap: 8, alignItems: 'flex-start', overflow: 'hidden', padding: 0 },
  ringkasBaris: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: c.garis, alignItems: 'flex-start' },
  ringkasHari: { width: 58, ...berat(800), fontSize: 13, lineHeight: 19, color: c.tinta, fontVariant: ['tabular-nums'] },
  ringkasIsi: { ...berat(500), fontSize: 13.5, lineHeight: 19, color: c.tinta, flex: 1 },
}));

const IKON_KEGIATAN = (k) => (/istirahat/i.test(k) ? 'cangkir' : /upacara|pramuka/i.test(k) ? 'bendera' : /senam/i.test(k) ? 'kaos' : 'buku');

function GarisKini({ menit }) {
  const g = useGaya();
  return (
    <View style={g.kiniBaris}>
      <View style={g.kiniGaris} />
      <View style={[g.kiniPil, { position: 'relative', right: 0, top: 0 }]}><Text style={g.kiniTeks}>{`Sekarang ${menitKeJam(menit)}`}</Text></View>
    </View>
  );
}

function DaftarSlot({ anak, tanggal, menit, hariIni }) {
  const g = useGaya();
  const c = useWarna();
  const slot = jadwalHari(anak, tanggal);
  const pos = hariIni ? posisiJadwal(slot, menit) : { kini: -1 };
  const awal = slot.length ? jamKeMenit(slot[0].mulai) : 0;
  const akhir = slot.length ? jamKeMenit(slot[slot.length - 1].selesai) : 0;
  let nomor = 0;
  return (
    <View style={{ gap: 10 }}>
      {hariIni && menit < awal ? <GarisKini menit={menit} /> : null}
      {slot.map((s, i) => {
        const lewat = hariIni && menit >= jamKeMenit(s.selesai);
        const kini = pos.kini === i;
        const m = s.mapel ? MAPEL[s.mapel] : null;
        const guru = m ? guruMapel(s.mapel, anak) : null;
        if (m) nomor += 1;
        const frac = kini ? (menit - jamKeMenit(s.mulai)) / (jamKeMenit(s.selesai) - jamKeMenit(s.mulai)) : 0;
        return (
          <View key={`${s.mulai}-${i}`} style={g.slot}>
            <View style={g.jam}>
              <Text style={g.jamTeks}>{s.mulai}</Text>
              <Text style={g.jamKecil}>{s.selesai}</Text>
            </View>
            <View style={g.rel} aria-hidden>
              <View style={g.relGaris} />
              <View style={[g.bulat, { borderColor: m ? m.warna : c.garisKuat }]}>
                {m ? <Text style={g.bulatTeks}>{nomor}</Text> : <Ikon nama={IKON_KEGIATAN(s.k)} ukuran={15} warna={c.tinta2} tebal={2} />}
              </View>
            </View>
            <View style={[g.kartuSlot, !m && g.kartuJeda, lewat && g.kartuLewat, kini && g.kartuKini]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text style={[g.nama, lewat && g.namaLewat]}>{m ? `${m.nama}` : s.k}</Text>
                {kini ? <Lencana teks="Sedang berlangsung" warna={c.hijau} latar={c.kartu} /> : null}
                {lewat ? <Ikon nama="centang" ukuran={16} warna={c.tinta2} label="Selesai" /> : null}
              </View>
              {guru ? <Text style={g.guru}>{`Jam ke-${nomor} · ${guru.panggil}`}</Text> : null}
            </View>
            {kini ? (
              <View style={[g.kini, { top: `${Math.round(Math.min(0.92, Math.max(0.08, frac)) * 100)}%` }]}>
                <View style={g.kiniPil}><Text style={g.kiniTeks}>{`Sekarang ${menitKeJam(menit)}`}</Text></View>
              </View>
            ) : null}
          </View>
        );
      })}
      {slot.length ? (
        <View style={g.slot}>
          <View style={g.jam}><Text style={g.jamTeks}>{slot[slot.length - 1].selesai}</Text></View>
          <View style={g.rel} aria-hidden>
            <View style={[g.relGaris, { bottom: undefined, height: 8 }]} />
            <View style={[g.bulat, { borderColor: c.tombol }]}><Ikon nama="rumah" ukuran={15} warna={c.tinta} tebal={2} /></View>
          </View>
          <View style={[g.kartuSlot, g.kartuJeda]}>
            <Text style={g.nama}>Pulang</Text>
            <Text style={g.guru}>{anak.antar ? `Naik antar-jemput rute ${anak.antar.rute}` : anak.jemput}</Text>
          </View>
        </View>
      ) : null}
      {hariIni && menit >= akhir && slot.length ? <GarisKini menit={menit} /> : null}
    </View>
  );
}

function InfoHari({ anak, tanggal }) {
  const g = useGaya();
  const c = useWarna();
  const h = hariKe(tanggal);
  const ada = (mp) => jadwalHari(anak, tanggal).some((s) => s.mapel === mp);
  const catatan = [];
  if (ada('pjok')) catatan.push('Bawa kaus olahraga dan botol minum');
  if (h === 5) catatan.push('Kegiatan Pramuka sampai selesai');
  if (h === 1) catatan.push('Topi dan dasi untuk upacara');
  return (
    <Kartu style={{ gap: 10 }}>
      <View style={g.info}>
        <Ikon nama="kaos" ukuran={20} warna={c.papan2} />
        <Text style={g.infoTeks}>{`Seragam: ${SERAGAM[h]}`}</Text>
      </View>
      {catatan.map((t) => (
        <View key={t} style={g.info}>
          <Ikon nama="tas" ukuran={20} warna={c.papan2} />
          <Text style={g.infoTeks}>{t}</Text>
        </View>
      ))}
    </Kartu>
  );
}

function HariIni({ anak, h }) {
  const g = useGaya();
  const { hari, sem, ms } = h;
  if (hariSekolah(hari, sem)) {
    return (
      <>
        <Teks jenis="bagian" level={2}>{fmtTanggal(hari)}</Teks>
        <InfoHari anak={anak} tanggal={hari} />
        <DaftarSlot anak={anak} tanggal={hari} menit={menitSekarang(ms)} hariIni />
      </>
    );
  }
  const berikut = sem.libur ? sem.mulaiBerikut : hariSekolahBerikut(hari, sem);
  const nas = hariNasional(hari);
  return (
    <>
      <Kartu style={g.kosong}>
        <Ilustrasi jenis="libur" tinggi={120} />
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 6 }}>
        <Teks jenis="subjudul" level={2}>Tidak ada pelajaran hari ini</Teks>
        <Teks jenis="kecil">
          {sem.libur ? `Libur semester ${sem.nama.toLowerCase()}.` : nas && nas.libur ? `${nas.nama}, sekolah libur.` : `${HARI[hariKe(hari)]}, sekolah libur.`}
          {berikut ? ` Masuk lagi ${fmtTanggal(berikut)}.` : ''}
        </Teks>
        </View>
      </Kartu>
      {berikut && !sem.libur ? (
        <>
          <Teks jenis="bagian" level={2}>{`Jadwal ${fmtTanggal(berikut, { tahun: false })}`}</Teks>
          <InfoHari anak={anak} tanggal={berikut} />
          <DaftarSlot anak={anak} tanggal={berikut} menit={0} />
        </>
      ) : null}
    </>
  );
}

function RingkasMinggu({ anak, h, hariMinggu }) {
  const g = useGaya();
  const daftarTugas = useMemo(() => tugas(anak, h.hari, h.sem), [anak, h.hari, h.sem]);
  return (
    <Kartu style={{ paddingBottom: 6 }}>
      <Teks jenis="bagian" level={2} style={{ marginBottom: 6 }}>Seragam dan bawaan minggu ini</Teks>
      {hariMinggu.map((d) => {
        const sekolah = hariSekolah(d, h.sem);
        const nas = hariNasional(d);
        const slot = jadwalHari(anak, d);
        const bawa = [];
        if (slot.some((x) => x.mapel === 'pjok')) bawa.push('kaus olahraga');
        if (hariKe(d) === 1) bawa.push('topi dan dasi upacara');
        daftarTugas.filter((x) => x.bawa && x.status === 'belum' && x.tenggat === d).forEach((x) => bawa.push(x.judul.toLowerCase()));
        return (
          <View key={d} style={g.ringkasBaris}>
            <Text style={g.ringkasHari}>{`${HARI_PENDEK[hariKe(d)]} ${pecah(d).d}`}</Text>
            <Text style={g.ringkasIsi}>
              {!sekolah ? (nas ? `${nas.nama}, libur` : 'Libur') : `${SERAGAM[hariKe(d)]}${bawa.length ? ` · bawa ${bawa.join(', ')}` : ''}`}
            </Text>
          </View>
        );
      })}
    </Kartu>
  );
}

function MingguIni({ anak, h }) {
  const g = useGaya();
  const { hari, sem } = h;
  const senin = useMemo(() => {
    const s = awalMinggu(hari);
    return hariKe(hari) === 6 || hariKe(hari) === 0 ? tambahHari(s, 7) : s;
  }, [hari]);
  const hariMinggu = [0, 1, 2, 3, 4].map((i) => tambahHari(senin, i));
  const awal = hariMinggu.includes(hari) ? hari : hariMinggu[0];
  const [pilih, setPilih] = useState(awal);
  const aktif = hariMinggu.includes(pilih) ? pilih : awal;
  const sekolah = hariSekolah(aktif, sem);
  const nas = hariNasional(aktif);
  return (
    <>
      <Teks jenis="kecil">{`Minggu ${fmtTanggal(senin, { hari: false, tahun: false })} sampai ${fmtTanggal(hariMinggu[4], { hari: false })}`}</Teks>
      <View style={g.hariBaris} role="tablist" aria-label="Pilih hari">
        {hariMinggu.map((d) => (
          <Chip
            key={d}
            peran="tab"
            aktif={d === aktif}
            judul={`${HARI_PENDEK[hariKe(d)]} ${pecah(d).d}${d === hari ? ' · hari ini' : ''}`}
            label={`${HARI_PENDEK[hariKe(d)]} ${pecah(d).d}${d === hari ? ' · hari ini' : ''}, ${fmtTanggal(d, { tahun: false })}`}
            onPress={() => setPilih(d)}
          />
        ))}
      </View>
      <RingkasMinggu anak={anak} h={h} hariMinggu={hariMinggu} />
      {sekolah ? (
        <>
          <Teks jenis="bagian" level={2}>{fmtTanggal(aktif, { tahun: false })}</Teks>
          <DaftarSlot anak={anak} tanggal={aktif} menit={menitSekarang(h.ms)} hariIni={aktif === hari} />
        </>
      ) : (
        <Kartu style={{ gap: 6 }}>
          <Teks jenis="tebal">{nas ? nas.nama : 'Tidak ada pelajaran'}</Teks>
          <Teks jenis="kecil">{sem.libur || aktif > sem.selesai ? 'Masa libur semester.' : 'Sekolah libur pada tanggal ini.'}</Teks>
        </Kartu>
      )}
    </>
  );
}

export default function Jadwal() {
  const anak = useAnak();
  const h = useHari();
  const [mode, setMode] = useState('hari');
  return (
    <Layar kepala={{ judul: 'Jadwal pelajaran', sub: `Kelas ${kelasAnak(anak)} · wali kelas ${GURU[anak.wali].panggil}` }}>
      <Segmen
        label="Tampilan jadwal"
        nilai={mode}
        onUbah={setMode}
        pilihan={[{ nilai: 'hari', judul: 'Hari ini' }, { nilai: 'minggu', judul: 'Minggu ini' }]}
      />
      {!h ? (
        <>
          <Kerangka tinggi={90} />
          <Kerangka tinggi={64} />
          <Kerangka tinggi={64} />
          <Kerangka tinggi={64} />
        </>
      ) : mode === 'hari' ? (
        <HariIni anak={anak} h={h} />
      ) : (
        <MingguIni anak={anak} h={h} />
      )}
    </Layar>
  );
}
