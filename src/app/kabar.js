import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Layar from '@/components/Layar';
import { Teks, Kerangka, Segmen, Lencana, Tombol } from '@/components/Dasar';
import Ikon from '@/components/Ikon';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { useToko, ubah } from '@/lib/toko';
import { kelasAnak } from '@/lib/data';
import { fmtTanggal, relatifHari, pecah, BULAN, BULAN_PENDEK } from '@/lib/waktu';
import { pengumuman, agenda, FOTO_KABAR } from '@/lib/bangkit';
import { FOTO } from '@/lib/foto';

export function generateMetadata() {
  return meta(
    '/kabar',
    'Pengumuman dan Kalender Akademik Sekolah | Kapur',
    'Pengumuman sekolah, konfirmasi kehadiran pertemuan wali murid, dan kalender akademik semester berjalan dalam demo aplikasi orang tua Kapur.',
  );
}

const KATEGORI = { Akademik: 'biru', Kegiatan: 'hijau', Kesehatan: 'merah' };

const useGaya = buatGaya((c) => StyleSheet.create({
  kartu: { borderRadius: 18, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, overflow: 'hidden' },
  kepala: { padding: 14, gap: 6 },
  atas: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  tgl: { ...berat(600), fontSize: 12.5, lineHeight: 17, color: c.tinta2 },
  judul: { ...berat(700), fontSize: 16, lineHeight: 22, color: c.tinta },
  isi: { paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  paragraf: { ...berat(400), fontSize: 14.5, lineHeight: 22, color: c.tinta },
  foto: { width: '100%', aspectRatio: 16 / 9, backgroundColor: c.kartu2, overflow: 'hidden' },
  rsvp: { flexDirection: 'row', gap: 8 },
  rsvpTombol: { flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 1.5, borderColor: c.garisKuat, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  rsvpAktif: { backgroundColor: c.tombol, borderColor: c.tombol },
  rsvpTeks: { ...berat(700), fontSize: 14, color: c.tinta },
  rsvpTeksAktif: { color: c.kapur },
  ditekan: { opacity: 0.85 },
  bulan: { ...berat(800), fontSize: 13, letterSpacing: 0.6, color: c.tinta2, marginTop: 6 },
  agenda: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis },
  lewat: { opacity: 0.6 },
  tglKotak: { width: 50, borderRadius: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: c.garisKuat, alignItems: 'center', backgroundColor: c.kartu },
  tglBulan: { alignSelf: 'stretch', paddingVertical: 1 },
  tglBulanTeks: { ...berat(800), fontSize: 11, lineHeight: 15, color: '#fffdf8', textAlign: 'center' },
  tglAngka: { fontFamily: F.serif, fontSize: 21, lineHeight: 29, color: c.tinta },
  agJudul: { ...berat(700), fontSize: 14.5, lineHeight: 20, color: c.tinta },
  agKet: { ...berat(500), fontSize: 12.5, lineHeight: 17, color: c.tinta2 },
}));

function KartuKabar({ k, hari, anak, terbuka, onBuka }) {
  const g = useGaya();
  const c = useWarna();
  const t = useToko();
  const kunci = `${anak.id}:${k.rsvp}`;
  const jawab = k.rsvp ? t.rsvp[kunci] : null;
  const w = KATEGORI[k.kategori] || 'biru';
  const foto = k.foto ? FOTO[FOTO_KABAR[k.foto].kunci] : null;
  return (
    <View style={g.kartu} nativeID={`kabar-${k.id}`}>
      <Pressable role="button" aria-expanded={terbuka} onPress={onBuka} style={({ pressed }) => [g.kepala, pressed && g.ditekan]}>
        <View style={g.atas}>
          <Lencana teks={k.kategori} warna={c[w]} latar={c[`${w}Tipis`]} />
          <Text style={g.tgl}>{`${relatifHari(k.tanggal, hari)} · ${fmtTanggal(k.tanggal, { hari: false, tahun: false })}`}</Text>
          <View style={{ flex: 1 }} />
          <Ikon nama={terbuka ? 'bawah' : 'kanan'} ukuran={18} warna={c.tinta2} />
        </View>
        <Text style={g.judul}>{k.judul}</Text>
        {!terbuka ? <Text style={g.agKet} numberOfLines={2}>{k.isi[0]}</Text> : null}
      </Pressable>
      {terbuka ? (
        <>
          {foto ? (
            <View style={g.foto}>
              <Image source={foto.src} accessibilityLabel={FOTO_KABAR[k.foto].alt} alt={FOTO_KABAR[k.foto].alt} style={StyleSheet.absoluteFill} resizeMode="cover" />
            </View>
          ) : null}
          <View style={[g.isi, foto && { paddingTop: 12 }]}>
            {k.isi.map((p) => <Text key={p.slice(0, 24)} style={g.paragraf}>{p}</Text>)}
            {k.rsvp ? (
              <View style={{ gap: 8 }}>
                <Teks jenis="tebal" nativeID={`rsvp-${k.id}`}>Konfirmasi kehadiran</Teks>
                <View style={g.rsvp} role="radiogroup" aria-labelledby={`rsvp-${k.id}`}>
                  {[['hadir', 'Saya hadir'], ['tidak', 'Tidak bisa']].map(([v, l]) => (
                    <Pressable key={v} role="radio" aria-checked={jawab === v} onPress={() => ubah((s) => ({ ...s, rsvp: { ...s.rsvp, [kunci]: v } }))} style={({ pressed }) => [g.rsvpTombol, jawab === v && g.rsvpAktif, pressed && g.ditekan]}>
                      {jawab === v ? <Ikon nama="centang" ukuran={16} warna={c.kapur} tebal={2.4} /> : null}
                      <Text style={[g.rsvpTeks, jawab === v && g.rsvpTeksAktif]}>{l}</Text>
                    </Pressable>
                  ))}
                </View>
                {jawab ? <Text style={g.agKet} aria-live="polite">{jawab === 'hadir' ? 'Terima kasih, kehadiran tercatat.' : 'Terima kasih. Ringkasan pertemuan akan dikirim lewat Kapur.'}</Text> : null}
              </View>
            ) : null}
            {k.terkait ? <Tombol href={k.terkait.href} jenis="garis" judul={k.terkait.label} /> : null}
            {foto ? <Text style={g.agKet}>{`Foto: ${foto.kredit}`}</Text> : null}
          </View>
        </>
      ) : null}
    </View>
  );
}

function Kalender({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const daftar = useMemo(() => agenda(h.hari, h.sem, anak), [anak, h]);
  const mendatang = daftar.filter((e) => (e.selesai || e.mulai) >= h.hari);
  const lewat = daftar.filter((e) => (e.selesai || e.mulai) < h.hari).slice(-4).reverse();
  const warnaJenis = (j) => (j === 'libur' ? c.merah : j === 'akademik' ? c.biru : j === 'nasional' ? c.tinta2 : c.hijau);
  const label = { libur: 'Libur', akademik: 'Akademik', kegiatan: 'Kegiatan', nasional: 'Peringatan' };
  const kelompok = [];
  mendatang.forEach((e) => {
    const { y, m } = pecah(e.mulai);
    const k = `${BULAN[m - 1]} ${y}`;
    if (!kelompok.length || kelompok[kelompok.length - 1].k !== k) kelompok.push({ k, isi: [] });
    kelompok[kelompok.length - 1].isi.push(e);
  });
  const Baris = ({ e, sudah }) => {
    const { m, d } = pecah(e.mulai);
    return (
      <View style={[g.agenda, sudah && g.lewat]}>
        <View style={g.tglKotak}>
          <View style={[g.tglBulan, { backgroundColor: e.jenis === 'libur' ? '#a8322a' : e.jenis === 'akademik' ? '#2a5795' : e.jenis === 'nasional' ? '#4b5850' : '#1b6a43' }]}>
            <Text style={g.tglBulanTeks}>{BULAN_PENDEK[m - 1].toUpperCase()}</Text>
          </View>
          <Text style={g.tglAngka}>{d}</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={g.agJudul}>{e.judul}</Text>
          <Text style={g.agKet}>
            {`${e.selesai && e.selesai !== e.mulai ? `${fmtTanggal(e.mulai, { tahun: false, pendek: true })} – ${fmtTanggal(e.selesai, { tahun: false, pendek: true })}` : fmtTanggal(e.mulai, { tahun: false })}${e.jam ? ` · ${e.jam}` : ''}`}
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
            <Lencana teks={label[e.jenis]} warna={warnaJenis(e.jenis)} latar={c.kartu2} />
            <Text style={g.agKet}>{e.untuk}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <Teks jenis="kecil">{`Tahun ajaran ${h.sem.ta}, semester ${h.sem.nama.toLowerCase()}: ${fmtTanggal(h.sem.mulai, { hari: false, tahun: false })} sampai ${fmtTanggal(h.sem.selesai, { hari: false })}.`}</Teks>
      {kelompok.map((kel) => (
        <View key={kel.k} style={{ gap: 10 }}>
          <Teks jenis="bagian" level={2}>{kel.k}</Teks>
          {kel.isi.map((e) => <Baris key={e.id} e={e} />)}
        </View>
      ))}
      {lewat.length ? (
        <View style={{ gap: 10 }}>
          <Teks jenis="bagian" level={2}>Baru lewat</Teks>
          {lewat.map((e) => <Baris key={e.id} e={e} sudah />)}
        </View>
      ) : null}
    </>
  );
}

export default function Kabar() {
  const anak = useAnak();
  const h = useHari();
  const { tab, buka } = useLocalSearchParams();
  const [mode, setMode] = useState('kabar');
  const [terbuka, setTerbuka] = useState(null);
  useEffect(() => {
    if (tab === 'kalender') setMode('kalender');
    if (buka) setTerbuka(String(buka));
  }, [tab, buka]);
  const daftar = useMemo(() => (h ? pengumuman(h.hari, h.sem, anak) : []), [anak, h]);
  const aktif = terbuka || (daftar[0] && daftar[0].id);
  return (
    <Layar kepala={{ judul: 'Kabar sekolah', sub: `SD Rindang Jati · kelas ${kelasAnak(anak)}`, kembali: '/menu' }}>
      <Segmen label="Tampilan kabar" nilai={mode} onUbah={setMode} pilihan={[{ nilai: 'kabar', judul: 'Pengumuman' }, { nilai: 'kalender', judul: 'Kalender akademik' }]} />
      {!h ? (
        <>
          <Kerangka tinggi={120} />
          <Kerangka tinggi={90} />
          <Kerangka tinggi={90} />
        </>
      ) : mode === 'kabar' ? (
        daftar.map((k) => <KartuKabar key={k.id} k={k} hari={h.hari} anak={anak} terbuka={aktif === k.id} onBuka={() => setTerbuka(aktif === k.id ? '__' : k.id)} />)
      ) : (
        <Kalender anak={anak} h={h} />
      )}
    </Layar>
  );
}
