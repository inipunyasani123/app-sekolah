import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Layar from '@/components/Layar';
import { Teks, Kartu, Kerangka, Segmen, Lencana, Tombol } from '@/components/Dasar';
import Ikon from '@/components/Ikon';
import Ilustrasi from '@/components/Ilustrasi';
import GridBulan from '@/components/Kalender';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { useToko, ubah } from '@/lib/toko';
import { kelasAnak } from '@/lib/data';
import { fmtTanggal, relatifHari, pecah, selisihHari, tambahBulan, BULAN, BULAN_PENDEK } from '@/lib/waktu';
import { pengumuman, agenda, ILUS_KABAR } from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/kabar',
    'Pengumuman dan Kalender Akademik Sekolah | Kapur',
    'Pengumuman sekolah, konfirmasi kehadiran pertemuan wali murid, dan kalender akademik semester berjalan dalam demo aplikasi orang tua Kapur.',
  );
}

const KATEGORI = { Akademik: 'biru', Kegiatan: 'hijau', Kesehatan: 'merah' };

const JENIS = {
  kegiatan: { label: 'Kegiatan', warna: '#1b7448', ikon: 'bendera' },
  ujian: { label: 'Ujian', warna: '#2f63ad', ikon: 'tugas' },
  rapor: { label: 'Rapor', warna: '#7a5aa8', ikon: 'buku' },
  akademik: { label: 'Pertemuan', warna: '#855800', ikon: 'kabar' },
  libur: { label: 'Libur', warna: '#c0392b', ikon: 'matahari' },
  nasional: { label: 'Peringatan', warna: '#566622', ikon: 'bendera' },
};

const useGaya = buatGaya((c) => StyleSheet.create({
  kartu: { borderRadius: 18, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, overflow: 'hidden' },
  kepala: { padding: 12, flexDirection: 'row', gap: 12 },
  gambarKecil: { width: 64, height: 64, borderRadius: 14, overflow: 'hidden' },
  atas: { flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  tgl: { ...berat(600), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  judul: { ...berat(700), fontSize: 15.5, lineHeight: 21, color: c.tinta },
  ringkas: { ...berat(500), fontSize: 13.5, lineHeight: 19, color: c.tinta2 },
  gambar: { width: '100%', aspectRatio: 16 / 9 },
  isi: { padding: 14, gap: 10 },
  paragraf: { ...berat(400), fontSize: 14.5, lineHeight: 22, color: c.tinta },
  rsvp: { flexDirection: 'row', gap: 8 },
  rsvpTombol: { flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 1.5, borderColor: c.garisKuat, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  rsvpAktif: { backgroundColor: c.tombol, borderColor: c.tombol },
  rsvpTeks: { ...berat(700), fontSize: 14, color: c.tinta },
  rsvpTeksAktif: { color: c.kapur },
  ditekan: { opacity: 0.85 },
  agenda: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis },
  lewat: { backgroundColor: c.kartu2 },
  tglKotak: { width: 50, borderRadius: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: c.garisKuat, alignItems: 'center', backgroundColor: c.kartu },
  tglBulan: { alignSelf: 'stretch', paddingVertical: 1 },
  tglBulanTeks: { ...berat(800), fontSize: 12, lineHeight: 16, color: '#fffdf8', textAlign: 'center' },
  tglAngka: { fontFamily: F.serif, fontSize: 21, lineHeight: 29, color: c.tinta },
  agJudul: { ...berat(700), fontSize: 14.5, lineHeight: 20, color: c.tinta },
  agKet: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  bulanBaris: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  panah: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: c.garis },
  mati: { opacity: 0.35 },
  legenda: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginTop: 8 },
  legendaItem: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  legendaTitik: { width: 10, height: 10, borderRadius: 5 },
}));

function KartuKabar({ k, hari, anak, terbuka, onBuka, baru }) {
  const g = useGaya();
  const c = useWarna();
  const t = useToko();
  const kunci = `${anak.id}:${k.rsvp}`;
  const jawab = k.rsvp ? t.rsvp[kunci] : null;
  const w = KATEGORI[k.kategori] || 'biru';
  const ilus = ILUS_KABAR[k.id];
  return (
    <View style={g.kartu} nativeID={`kabar-${k.id}`}>
      <Pressable role="button" aria-expanded={terbuka} onPress={onBuka} style={({ pressed }) => [g.kepala, pressed && g.ditekan]}>
        {ilus && !terbuka ? (
          <View style={g.gambarKecil} aria-hidden>
            <Ilustrasi jenis={ilus.jenis} tinggi={64} />
          </View>
        ) : null}
        <View style={{ flex: 1, gap: 4 }}>
          <View style={g.atas}>
            <Lencana teks={k.kategori} warna={c[w]} latar={c[`${w}Tipis`]} />
            {baru ? <Lencana teks="Baru" warna={c.pensilTeks} latar={c.pensil} /> : null}
            <Text style={g.tgl}>{relatifHari(k.tanggal, hari)}</Text>
          </View>
          <Text style={g.judul}>{k.judul}</Text>
          {!terbuka ? <Text style={g.ringkas} numberOfLines={2}>{k.isi[0]}</Text> : null}
        </View>
        <Ikon nama={terbuka ? 'bawah' : 'kanan'} ukuran={18} warna={c.tinta2} />
      </Pressable>
      {terbuka ? (
        <>
          {ilus ? (
            <View style={g.gambar}>
              <Ilustrasi jenis={ilus.jenis} tinggi="100%" label={ilus.alt} />
            </View>
          ) : null}
          <View style={g.isi}>
            <Text style={g.tgl}>{`Diumumkan ${fmtTanggal(k.tanggal, { tahun: false })}`}</Text>
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
          </View>
        </>
      ) : null}
    </View>
  );
}

function BarisAgenda({ e, sudah }) {
  const g = useGaya();
  const c = useWarna();
  const { m, d } = pecah(e.mulai);
  const j = JENIS[e.jenis] || JENIS.kegiatan;
  return (
    <View style={[g.agenda, sudah && g.lewat]}>
      <View style={g.tglKotak}>
        <View style={[g.tglBulan, { backgroundColor: j.warna }]}>
          <Text style={g.tglBulanTeks}>{BULAN_PENDEK[m - 1].toUpperCase()}</Text>
        </View>
        <Text style={g.tglAngka}>{d}</Text>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={g.agJudul}>{e.judul}</Text>
        <Text style={g.agKet}>
          {`${e.selesai && e.selesai !== e.mulai ? `${fmtTanggal(e.mulai, { tahun: false, pendek: true })} – ${fmtTanggal(e.selesai, { tahun: false, pendek: true })}` : fmtTanggal(e.mulai, { tahun: false })}${e.jam ? ` · ${e.jam}` : ''}`}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2, alignItems: 'center' }}>
          <Lencana teks={j.label} warna={c.tinta} latar={c.kartu2} />
          <Text style={g.agKet}>{sudah ? 'sudah lewat' : e.untuk}</Text>
        </View>
      </View>
    </View>
  );
}

function Kalender({ anak, h }) {
  const g = useGaya();
  const c = useWarna();
  const daftar = useMemo(() => agenda(h.hari, h.sem, anak), [anak, h]);
  const kini = pecah(h.hari);
  const [bulan, setBulan] = useState({ tahun: kini.y, bulan: kini.m });
  const awal = pecah(h.sem.mulai);
  const akhir = pecah(h.sem.selesai);
  const idx = (b) => b.tahun * 12 + b.bulan;
  const bisaMundur = idx(bulan) > awal.y * 12 + awal.m;
  const bisaMaju = idx(bulan) < akhir.y * 12 + akhir.m + 1;
  const pada = (iso) => daftar.filter((e) => e.mulai <= iso && (e.selesai || e.mulai) >= iso);
  const awalanBulan = `${bulan.tahun}-${String(bulan.bulan).padStart(2, '0')}`;
  const bulanIni = daftar.filter((e) => e.mulai.startsWith(awalanBulan) || ((e.selesai || '') >= `${awalanBulan}-01` && e.mulai < `${awalanBulan}-01`));
  const mendatang = bulanIni.filter((e) => (e.selesai || e.mulai) >= h.hari);
  const lewat = bulanIni.filter((e) => (e.selesai || e.mulai) < h.hari);
  return (
    <>
      <Teks jenis="kecil">{`Tahun ajaran ${h.sem.ta}, semester ${h.sem.nama.toLowerCase()}: ${fmtTanggal(h.sem.mulai, { hari: false, tahun: false })} sampai ${fmtTanggal(h.sem.selesai, { hari: false })}.`}</Teks>
      <Kartu>
        <View style={g.bulanBaris}>
          <Pressable role="button" aria-label="Bulan sebelumnya" disabled={!bisaMundur} onPress={() => setBulan(tambahBulan(bulan.tahun, bulan.bulan, -1))} style={[g.panah, !bisaMundur && g.mati]}>
            <Ikon nama="kembali" ukuran={20} warna={c.tinta} />
          </Pressable>
          <Teks jenis="bagian" level={2} aria-live="polite">{`${BULAN[bulan.bulan - 1]} ${bulan.tahun}`}</Teks>
          <Pressable role="button" aria-label="Bulan berikutnya" disabled={!bisaMaju} onPress={() => setBulan(tambahBulan(bulan.tahun, bulan.bulan, 1))} style={[g.panah, !bisaMaju && g.mati]}>
            <Ikon nama="kanan" ukuran={20} warna={c.tinta} />
          </Pressable>
        </View>
        <GridBulan
          tahun={bulan.tahun}
          bulan={bulan.bulan}
          hariIni={h.hari}
          label={`Kalender akademik ${BULAN[bulan.bulan - 1]} ${bulan.tahun}`}
          sel={(iso) => {
            const ev = pada(iso);
            const libur = ev.some((e) => e.jenis === 'libur');
            const akhirPekan = ['6', '0'].includes(String(new Date(`${iso}T00:00:00Z`).getUTCDay()));
            return {
              label: `${fmtTanggal(iso, { tahun: false })}: ${ev.length ? ev.map((e) => e.judul).join(', ') : 'tidak ada agenda'}`,
              latar: libur ? c.merahTipis : null,
              redup: akhirPekan && !ev.length,
              titik: [...new Set(ev.map((e) => (JENIS[e.jenis] || JENIS.kegiatan).warna))],
            };
          }}
        />
        <View style={g.legenda}>
          {['kegiatan', 'ujian', 'rapor', 'akademik', 'libur', 'nasional'].map((k) => (
            <View key={k} style={g.legendaItem}>
              <View style={[g.legendaTitik, { backgroundColor: JENIS[k].warna }]} />
              <Teks jenis="kecil">{JENIS[k].label}</Teks>
            </View>
          ))}
        </View>
      </Kartu>
      {mendatang.length ? <Teks jenis="bagian" level={2}>{`Agenda ${BULAN[bulan.bulan - 1]}`}</Teks> : null}
      {mendatang.map((e) => <BarisAgenda key={e.id} e={e} />)}
      {lewat.length ? <Teks jenis="bagian" level={2}>Sudah lewat</Teks> : null}
      {lewat.map((e) => <BarisAgenda key={e.id} e={e} sudah />)}
      {!bulanIni.length ? <Teks jenis="kecil">Belum ada agenda di bulan ini.</Teks> : null}
    </>
  );
}

export default function Kabar() {
  const anak = useAnak();
  const h = useHari();
  const t = useToko();
  const { tab, buka } = useLocalSearchParams();
  const [mode, setMode] = useState('kabar');
  const [terbuka, setTerbuka] = useState(null);
  useEffect(() => {
    if (tab === 'kalender') setMode('kalender');
    if (buka) setTerbuka(String(buka));
  }, [tab, buka]);
  const daftar = useMemo(() => (h ? pengumuman(h.hari, h.sem, anak) : []), [anak, h ? h.hari : null]); // eslint-disable-line react-hooks/exhaustive-deps
  const dibaca = t.kabarDibaca[anak.id] || [];
  useEffect(() => {
    if (terbuka && !dibaca.includes(terbuka) && daftar.some((k) => k.id === terbuka)) {
      ubah((s) => ({ ...s, kabarDibaca: { ...s.kabarDibaca, [anak.id]: [...(s.kabarDibaca[anak.id] || []), terbuka] } }));
    }
  }, [terbuka, anak.id, daftar.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Layar kepala={{ judul: 'Kabar sekolah', sub: `SD Rindang Jati · kelas ${kelasAnak(anak)}`, kembali: '/menu' }}>
      <Segmen label="Tampilan kabar" nilai={mode} onUbah={setMode} pilihan={[{ nilai: 'kabar', judul: 'Pengumuman' }, { nilai: 'kalender', judul: 'Kalender akademik' }]} />
      {!h ? (
        <>
          <Kerangka tinggi={96} />
          <Kerangka tinggi={96} />
          <Kerangka tinggi={96} />
        </>
      ) : mode === 'kabar' ? (
        daftar.map((k) => (
          <KartuKabar
            key={k.id}
            k={k}
            hari={h.hari}
            anak={anak}
            terbuka={terbuka === k.id}
            baru={!dibaca.includes(k.id) && selisihHari(k.tanggal, h.hari) <= 7}
            onBuka={() => setTerbuka(terbuka === k.id ? null : k.id)}
          />
        ))
      ) : (
        <Kalender anak={anak} h={h} />
      )}
    </Layar>
  );
}
