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
import { fmtTanggal, hariKe, menitSekarang, jamKeMenit, tambahHari, awalMinggu, HARI_PENDEK, HARI, pecah } from '@/lib/waktu';
import { jadwalHari, posisiJadwal, hariSekolah, hariSekolahBerikut, hariNasional } from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/jadwal',
    'Jadwal Pelajaran Hari Ini dan Minggu Ini | Kapur',
    'Jadwal pelajaran anak per hari lengkap dengan jam, guru, seragam, dan bawaan. Bagian dari demo aplikasi orang tua Kapur.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  slot: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  jam: { width: 54, paddingTop: 12 },
  jamTeks: { ...berat(700), fontSize: 13, lineHeight: 17, color: c.tinta, fontVariant: ['tabular-nums'] },
  jamKecil: { ...berat(500), fontSize: 12, lineHeight: 16, color: c.tinta2, fontVariant: ['tabular-nums'] },
  kartuSlot: { flex: 1, borderRadius: 16, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, padding: 12, paddingLeft: 16, overflow: 'hidden', gap: 2 },
  kartuJeda: { backgroundColor: 'transparent', borderStyle: 'dashed' },
  kartuKini: { borderColor: c.tombol, borderWidth: 2, backgroundColor: c.hijauTipis },
  pita: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  nama: { ...berat(700), fontSize: 15, lineHeight: 20, color: c.tinta },
  guru: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  kartuLewat: { backgroundColor: 'transparent' },
  namaLewat: { color: c.tinta2 },
  hariBaris: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  info: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  infoTeks: { ...berat(600), fontSize: 14, lineHeight: 20, color: c.tinta, flex: 1 },
  kosong: { gap: 6, alignItems: 'flex-start' },
  hariChipAngka: { fontFamily: F.serif },
}));

function DaftarSlot({ anak, tanggal, menit, hariIni }) {
  const g = useGaya();
  const c = useWarna();
  const slot = jadwalHari(anak, tanggal);
  const pos = hariIni ? posisiJadwal(slot, menit) : { kini: -1 };
  return (
    <View style={{ gap: 10 }}>
      {slot.map((s, i) => {
        const lewat = hariIni && menit >= jamKeMenit(s.selesai);
        const kini = pos.kini === i;
        const m = s.mapel ? MAPEL[s.mapel] : null;
        const guru = m ? guruMapel(s.mapel, anak) : null;
        return (
          <View key={`${s.mulai}-${i}`} style={g.slot}>
            <View style={g.jam}>
              <Text style={g.jamTeks}>{s.mulai}</Text>
              <Text style={g.jamKecil}>{s.selesai}</Text>
            </View>
            <View style={[g.kartuSlot, !m && g.kartuJeda, lewat && g.kartuLewat, kini && g.kartuKini]}>
              {m ? <View style={[g.pita, { backgroundColor: m.warna }]} /> : null}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text style={[g.nama, lewat && g.namaLewat]}>{m ? m.nama : s.k}</Text>
                {kini ? <Lencana teks="Sedang berlangsung" warna={c.hijau} latar={c.kartu} /> : null}
                {lewat ? <Ikon nama="centang" ukuran={16} warna={c.tinta2} label="Selesai" /> : null}
              </View>
              {guru ? <Text style={g.guru}>{guru.panggil}</Text> : null}
            </View>
          </View>
        );
      })}
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
        <Teks jenis="subjudul" level={2}>Tidak ada pelajaran hari ini</Teks>
        <Teks jenis="kecil">
          {sem.libur ? `Libur semester ${sem.nama.toLowerCase()}.` : nas && nas.libur ? `${nas.nama}, sekolah libur.` : `${HARI[hariKe(hari)]}, sekolah libur.`}
          {berikut ? ` Masuk lagi ${fmtTanggal(berikut)}.` : ''}
        </Teks>
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
      {sekolah ? (
        <>
          <InfoHari anak={anak} tanggal={aktif} />
          <DaftarSlot anak={anak} tanggal={aktif} menit={menitSekarang(h.ms)} hariIni={aktif === hari} />
        </>
      ) : (
        <Kartu style={g.kosong}>
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
