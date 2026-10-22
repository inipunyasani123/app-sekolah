import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Kepala from '@/components/Kepala';
import { Teks, Kerangka, Chip } from '@/components/Dasar';
import Avatar from '@/components/Avatar';
import Ikon from '@/components/Ikon';
import { berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari, usePesan } from '@/lib/pakai';
import { ubah } from '@/lib/toko';
import { GURU, SEKOLAH } from '@/lib/data';
import { fmtJamDariMs, hariIni, relatifHari, fmtTanggal } from '@/lib/waktu';
import { balasanOtomatis, jamLayananGuru } from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/pesan',
    'Pesan dengan Wali Kelas | Kapur',
    'Kirim pesan ke wali kelas anak dengan jam layanan yang jelas dan balasan simulasi. Bagian dari demo aplikasi orang tua Kapur buatan PintuWeb.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  akar: { flex: 1, backgroundColor: c.kertas, minHeight: 0 },
  gulir: { flex: 1 },
  isi: { padding: 16, gap: 8 },
  info: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, marginBottom: 6 },
  tanggal: { alignSelf: 'center', ...berat(700), fontSize: 12, lineHeight: 16, color: c.tinta2, backgroundColor: c.kartu2, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginVertical: 6 },
  baris: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  barisSaya: { justifyContent: 'flex-end' },
  gelembung: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  guru: { backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, borderBottomLeftRadius: 6 },
  saya: { backgroundColor: c.tombol, borderBottomRightRadius: 6 },
  teksGuru: { ...berat(500), fontSize: 15, lineHeight: 21, color: c.tinta },
  teksSaya: { ...berat(500), fontSize: 15, lineHeight: 21, color: c.kapur },
  jamGuru: { ...berat(500), fontSize: 11.5, lineHeight: 15, color: c.tinta2 },
  jamSaya: { ...berat(500), fontSize: 11.5, lineHeight: 15, color: c.kapur2, textAlign: 'right' },
  otomatis: { ...berat(700), fontSize: 11.5, lineHeight: 15, color: c.biru },
  kaki: { borderTopWidth: 1, borderTopColor: c.garis, backgroundColor: c.kartu, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12, gap: 10 },
  cepat: { gap: 8, paddingRight: 12 },
  tulis: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  input: { flex: 1, minHeight: 46, maxHeight: 120, borderRadius: 16, borderWidth: 1.5, borderColor: c.garisKuat, paddingHorizontal: 14, paddingVertical: 11, ...berat(500), fontSize: 15, lineHeight: 21, color: c.tinta, backgroundColor: c.kertas },
  kirim: { width: 48, height: 48, borderRadius: 16, backgroundColor: c.pensil, alignItems: 'center', justifyContent: 'center' },
  kirimMati: { opacity: 0.45 },
  ditekan: { opacity: 0.8 },
}));

function cepatUntuk(anak) {
  return anak.tingkat >= 4
    ? [`Bu, besok ${anak.panggil} izin sakit.`, 'Tugas IPAS dikumpulkan kapan?', 'Terima kasih, Bu.']
    : [`Pak, ${anak.panggil} pulang dijemput neneknya.`, 'Nilai menulisnya bagaimana, Pak?', 'Terima kasih, Pak.'];
}

export default function Pesan() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  const h = useHari();
  const guru = GURU[anak.wali];
  const { daftar } = usePesan(anak);
  const [teks, setTeks] = useState('');
  const gulir = useRef(null);
  const inset = useSafeAreaInsets();

  useEffect(() => {
    if (!h) return;
    ubah((s) => ({ ...s, dibaca: { ...s.dibaca, [anak.id]: Date.now() } }));
  }, [anak.id, h ? daftar.length : 0]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => gulir.current && gulir.current.scrollToEnd({ animated: false }), 60);
    return () => clearTimeout(t);
  }, [daftar.length, anak.id]);

  const kirim = (isi) => {
    const bersih = (isi ?? teks).trim();
    if (!bersih) return;
    const ms = Date.now();
    const saya = { id: `u${ms}`, dari: 'ortu', ms, teks: bersih };
    const id = anak.id;
    ubah((s) => ({ ...s, pesan: { ...s.pesan, [id]: [...(s.pesan[id] || []), saya] } }));
    setTeks('');
    setTimeout(() => {
      const bms = Date.now();
      const balas = { id: `g${bms}`, dari: 'guru', ms: bms, teks: balasanOtomatis(bersih, anak, ms), otomatis: true };
      ubah((s) => ({ ...s, pesan: { ...s.pesan, [id]: [...(s.pesan[id] || []), balas] }, dibaca: { ...s.dibaca, [id]: bms } }));
    }, 1500);
  };

  const buka = h ? jamLayananGuru(h.ms) : true;
  let tanggalLalu = null;
  return (
    <KeyboardAvoidingView style={g.akar} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Kepala judul={guru.panggil} sub={guru.peran} kembali="/" pesanTampil={false} />
      <View role="main" style={g.gulir}>
      <ScrollView ref={gulir} style={g.gulir} contentContainerStyle={g.isi} keyboardShouldPersistTaps="handled" tabIndex={0} aria-label="Riwayat pesan">
        <View style={{ gap: 8 }}>
          <View style={g.info}>
            <Avatar siapa={anak.wali} ukuran={44} />
            <View style={{ flex: 1 }}>
              <Teks jenis="tebal">{guru.nama}</Teks>
              <Teks jenis="kecil">{h ? `${buka ? 'Sedang jam layanan' : 'Di luar jam layanan'} · ${SEKOLAH.jamLayanan}` : `Jam layanan ${SEKOLAH.jamLayanan}`}</Teks>
            </View>
          </View>
          {!h ? (
            <>
              <Kerangka tinggi={70} style={{ width: '75%' }} />
              <Kerangka tinggi={50} style={{ width: '60%', alignSelf: 'flex-end' }} />
              <Kerangka tinggi={70} style={{ width: '75%' }} />
            </>
          ) : (
            <View role="log" aria-label={`Percakapan dengan ${guru.panggil}`} aria-live="polite" style={{ gap: 8 }}>
              {daftar.map((m) => {
                const tgl = hariIni(m.ms);
                const pemisah = tgl !== tanggalLalu;
                tanggalLalu = tgl;
                const saya = m.dari === 'ortu';
                return (
                  <View key={m.id} style={{ gap: 8 }}>
                    {pemisah ? <Text style={g.tanggal}>{['Hari ini', 'Kemarin'].includes(relatifHari(tgl, h.hari)) ? relatifHari(tgl, h.hari) : fmtTanggal(tgl, { tahun: false })}</Text> : null}
                    <View style={[g.baris, saya && g.barisSaya]}>
                      {!saya ? <Avatar siapa={anak.wali} ukuran={28} /> : null}
                      <View style={[g.gelembung, saya ? g.saya : g.guru]}>
                        {m.otomatis ? <Text style={g.otomatis}>Balasan simulasi</Text> : null}
                        <Text style={saya ? g.teksSaya : g.teksGuru}>{m.teks}</Text>
                        <Text style={saya ? g.jamSaya : g.jamGuru}>{`${saya ? 'Kamu' : guru.panggil} · ${fmtJamDariMs(m.ms)}`}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      <View style={[g.kaki, Platform.OS === 'web' ? null : { paddingBottom: 12 + inset.bottom }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={g.cepat}>
          {cepatUntuk(anak).map((q) => <Chip key={q} judul={q} label={`Kirim: ${q}`} onPress={() => kirim(q)} />)}
        </ScrollView>
        <View style={g.tulis}>
          <TextInput
            value={teks}
            onChangeText={setTeks}
            placeholder={`Tulis pesan untuk ${guru.panggil}`}
            placeholderTextColor={c.tinta2}
            accessibilityLabel={`Tulis pesan untuk ${guru.panggil}`}
            multiline
            maxLength={500}
            style={g.input}
            onKeyPress={(e) => {
              if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                e.preventDefault();
                kirim();
              }
            }}
          />
          <Pressable role="button" aria-label="Kirim pesan" disabled={!teks.trim()} onPress={() => kirim()} style={({ pressed }) => [g.kirim, !teks.trim() && g.kirimMati, pressed && g.ditekan]}>
            <Ikon nama="kirim" ukuran={22} warna={c.pensilTeks} tebal={2} />
          </Pressable>
        </View>
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}
