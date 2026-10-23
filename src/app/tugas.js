import { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Kerangka, Chip, Lencana, Tombol } from '@/components/Dasar';
import Ilustrasi from '@/components/Ilustrasi';
import Ikon, { Bintang } from '@/components/Ikon';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { useToko, ubah } from '@/lib/toko';
import { MAPEL, kelasAnak } from '@/lib/data';
import { fmtTanggal, relatifHari } from '@/lib/waktu';
import { tugas } from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/tugas',
    'Tugas dan Tenggat Anak | Kapur',
    'Daftar tugas anak dengan tenggat, cara pengumpulan, dan tanda pendampingan orang tua. Bagian dari demo aplikasi orang tua Kapur.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  kartu: { borderRadius: 18, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, overflow: 'hidden' },
  kepala: { padding: 14, paddingLeft: 18, gap: 4, minHeight: 64 },
  pita: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  atas: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  mapel: { ...berat(700), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  judul: { ...berat(700), fontSize: 16, lineHeight: 22, color: c.tinta },
  nilaiAngka: { fontVariant: ['tabular-nums'] },
  tenggat: { ...berat(600), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  mendesak: { color: c.merah },
  detail: { paddingHorizontal: 18, paddingBottom: 14, gap: 10, borderTopWidth: 1, borderTopColor: c.garis, paddingTop: 12 },
  isi: { ...berat(400), fontSize: 14.5, lineHeight: 21, color: c.tinta },
  meta: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  metaTeks: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2, flex: 1 },
  cek: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44, paddingVertical: 4 },
  kotak: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: c.garisKuat, alignItems: 'center', justifyContent: 'center' },
  kotakAktif: { backgroundColor: c.tombol, borderColor: c.tombol },
  cekTeks: { ...berat(600), fontSize: 14.5, color: c.tinta },
  nilai: { fontFamily: F.serif, fontSize: 26, lineHeight: 30, color: c.tinta },
  ditekan: { opacity: 0.85 },
  filter: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  catatan: { fontFamily: F.tulis, fontSize: 14, lineHeight: 26, color: c.biru },
  kosong: { borderRadius: 18, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, overflow: 'hidden' },
}));

function KartuTugas({ t, hari, cek, onCek }) {
  const g = useGaya();
  const c = useWarna();
  const [buka, setBuka] = useState(false);
  const m = MAPEL[t.mapel];
  const selisih = t.tenggat === hari || relatifHari(t.tenggat, hari) === 'Besok';
  const status = t.status === 'belum'
    ? { teks: 'Belum dikumpulkan', warna: c.kuning, latar: c.kuningTipis }
    : t.status === 'dikumpulkan'
      ? { teks: 'Dikumpulkan', warna: c.biru, latar: c.biruTipis }
      : { teks: `Dinilai: ${t.nilai}`, warna: c.hijau, latar: c.hijauTipis };
  return (
    <View style={g.kartu}>
      <View style={[g.pita, { backgroundColor: m.warna }]} />
      <Pressable role="button" aria-expanded={buka} onPress={() => setBuka(!buka)} style={({ pressed }) => [g.kepala, pressed && g.ditekan]}>
        <View style={g.atas}>
          <Text style={g.mapel}>{m.pendek}</Text>
          <Lencana teks={status.teks} warna={status.warna} latar={status.latar} />
          {cek ? <Lencana teks="Didampingi" ikon="centang" warna={c.hijau} latar={c.hijauTipis} /> : null}
        </View>
        <Text style={g.judul}>{t.judul}</Text>
        <View style={g.atas}>
          <Text style={[g.tenggat, t.status === 'belum' && selisih && g.mendesak]}>
            {`${t.status === 'belum' ? 'Tenggat' : 'Tenggat lalu'}: ${relatifHari(t.tenggat, hari)}, ${fmtTanggal(t.tenggat, { tahun: false })} · ${t.jam}`}
          </Text>
          <View style={{ flex: 1 }} />
          <Ikon nama={buka ? 'bawah' : 'kanan'} ukuran={18} warna={c.tinta2} />
        </View>
      </Pressable>
      {buka ? (
        <View style={g.detail}>
          <Text style={g.isi}>{t.rincian}</Text>
          <View style={g.meta}>
            <Ikon nama="tas" ukuran={18} warna={c.tinta2} />
            <Text style={g.metaTeks}>{t.cara}</Text>
          </View>
          <View style={g.meta}>
            <Ikon nama="profil" ukuran={18} warna={c.tinta2} />
            <Text style={g.metaTeks}>{`${t.guru.panggil} · diberikan ${fmtTanggal(t.diberi, { tahun: false })}`}</Text>
          </View>
          {t.status === 'dinilai' ? (
            <View style={g.meta}>
              <Text style={g.nilai}>{t.nilai}</Text>
              {t.nilai >= 88 ? <Bintang ukuran={26} /> : null}
              <Text style={g.catatan}>{t.nilai >= 88 ? 'Rapi dan lengkap!' : 'Bagus, tingkatkan lagi.'}</Text>
            </View>
          ) : null}
          <Pressable role="checkbox" aria-checked={!!cek} onPress={onCek} style={({ pressed }) => [g.cek, pressed && g.ditekan]}>
            <View style={[g.kotak, cek && g.kotakAktif]}>{cek ? <Ikon nama="centang" ukuran={16} warna={c.kapur} tebal={2.6} /> : null}</View>
            <Text style={g.cekTeks}>Sudah saya dampingi</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export default function Tugas() {
  const g = useGaya();
  const anak = useAnak();
  const h = useHari();
  const t = useToko();
  const [filter, setFilter] = useState('belum');
  const daftar = useMemo(() => (h ? tugas(anak, h.hari, h.sem) : []), [anak, h]);
  const belum = daftar.filter((x) => x.status === 'belum').sort((a, b) => a.tenggat.localeCompare(b.tenggat));
  const sudah = daftar.filter((x) => x.status !== 'belum').sort((a, b) => b.tenggat.localeCompare(a.tenggat));
  const tampil = filter === 'belum' ? belum : filter === 'sudah' ? sudah : [...belum, ...sudah];
  const cek = t.tugasCek[anak.id] || {};
  const tandai = (id) => ubah((s) => {
    const lama = s.tugasCek[anak.id] || {};
    return { ...s, tugasCek: { ...s.tugasCek, [anak.id]: { ...lama, [id]: !lama[id] } } };
  });
  return (
    <Layar kepala={{ judul: 'Tugas dan tenggat', sub: `${anak.panggil} · kelas ${kelasAnak(anak)}` }}>
      <View style={g.filter} role="tablist" aria-label="Saring tugas">
        <Chip peran="tab" aktif={filter === 'belum'} judul={`Belum (${h ? belum.length : '…'})`} onPress={() => setFilter('belum')} />
        <Chip peran="tab" aktif={filter === 'sudah'} judul={`Sudah (${h ? sudah.length : '…'})`} onPress={() => setFilter('sudah')} />
        <Chip peran="tab" aktif={filter === 'semua'} judul="Semua" onPress={() => setFilter('semua')} />
      </View>
      <Teks jenis="kecil">Ketuk tugas untuk melihat rincian. Centang “Sudah saya dampingi” supaya wali kelas tahu tugas itu dikerjakan bersama di rumah.</Teks>
      {!h ? (
        <>
          <Kerangka tinggi={92} />
          <Kerangka tinggi={92} />
          <Kerangka tinggi={92} />
        </>
      ) : tampil.length ? (
        tampil.map((x) => <KartuTugas key={x.id} t={x} hari={h.hari} cek={cek[x.id]} onCek={() => tandai(x.id)} />)
      ) : (
        <View style={g.kosong}>
          <Ilustrasi jenis="kosong" tinggi={120} />
          <View style={{ padding: 16, gap: 10 }}>
            <Teks jenis="tebal">{h.sem.libur ? 'Tidak ada tugas selama libur semester.' : filter === 'belum' ? 'Semua tugas sudah dikumpulkan.' : 'Tidak ada tugas di daftar ini.'}</Teks>
            <Teks jenis="kecil">Tugas baru dari guru muncul di sini lengkap dengan tenggat dan cara mengumpulkan.</Teks>
            <Tombol href="/jadwal" jenis="garis" ikon="jadwal" judul="Lihat jadwal" />
          </View>
        </View>
      )}
    </Layar>
  );
}
