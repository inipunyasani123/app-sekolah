import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { ANAK, GURU, kelasAnak } from '@/lib/data';
import { useToko, useSiap, ubah } from '@/lib/toko';
import { useHari } from '@/lib/pakai';
import { fmtTanggal } from '@/lib/waktu';
import Lembar from './Lembar';
import Avatar from './Avatar';
import Ikon from './Ikon';
import { Teks, Tombol } from './Dasar';
import { KertasGaris, Stempel } from './Kertas';

const useGaya = buatGaya((c) => StyleSheet.create({
  langkah: { ...berat(700), fontSize: 13, lineHeight: 17, color: c.tinta2, letterSpacing: 0.4 },
  titikBaris: { flexDirection: 'row', gap: 6, marginBottom: 2 },
  titik: { width: 22, height: 6, borderRadius: 3, backgroundColor: c.garis },
  titikAktif: { backgroundColor: c.tombol },
  anakBaris: { flexDirection: 'row', gap: 10 },
  anak: { flex: 1, alignItems: 'center', gap: 6, padding: 12, borderRadius: 18, borderWidth: 2, borderColor: c.garis, backgroundColor: c.kartu },
  anakAktif: { borderColor: c.tombol, backgroundColor: c.hijauTipis },
  anakNama: { ...berat(800), fontSize: 15, lineHeight: 20, color: c.tinta },
  anakKet: { ...berat(500), fontSize: 13, lineHeight: 17, color: c.tinta2, textAlign: 'center' },
  tulis: { fontFamily: F.tulis, fontSize: 15, lineHeight: 28, color: c.biru },
  baris: { ...berat(500), fontSize: 14, lineHeight: 28, color: c.tinta },
  tombolBaris: { flexDirection: 'row', gap: 10, marginTop: 4 },
  simulasi: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis },
  ditekan: { opacity: 0.85 },
}));

/** Pengenalan tiga langkah, tampil sekali; bisa diputar ulang dari Lainnya. */
export default function Sambut() {
  const g = useGaya();
  const c = useWarna();
  const siap = useSiap();
  const t = useToko();
  const h = useHari();
  const [langkah, setLangkah] = useState(0);
  const tutup = useCallback(() => {
    ubah((s) => ({ ...s, sambut: true }));
    setLangkah(0);
  }, []);
  const terbuka = siap && !t.sambut;
  const isi = [
    {
      judul: 'Pilih anak dulu',
      teks: 'Kapur menampilkan data per anak. Ganti kapan saja lewat nama anak di pojok kanan atas.',
      badan: (
        <View role="radiogroup" aria-label="Pilih anak" style={g.anakBaris}>
          {ANAK.map((a) => {
            const aktif = t.anak === a.id;
            return (
              <Pressable key={a.id} role="radio" aria-checked={aktif} onPress={() => ubah((s) => ({ ...s, anak: a.id }))} style={({ pressed }) => [g.anak, aktif && g.anakAktif, pressed && g.ditekan]}>
                <Avatar siapa={a.id} ukuran={72} />
                <Text style={g.anakNama}>{a.panggil}</Text>
                <Text style={g.anakKet}>{`Kelas ${kelasAnak(a)} · ${GURU[a.wali].panggil}`}</Text>
              </Pressable>
            );
          })}
        </View>
      ),
    },
    {
      judul: 'Paraf buku penghubung tiap pagi',
      teks: 'Seperti buku penghubung kertas: baca catatan hari ini, lalu ketuk paraf supaya wali kelas tahu sudah dibaca.',
      badan: (
        <KertasGaris baris={6}>
          <Text style={g.tulis}>{h ? fmtTanggal(h.hari, { tahun: false }) : 'Hari ini'}</Text>
          <Text style={g.baris}>Hadir · masuk 06.48</Text>
          <Text style={g.baris}>Seragam: Pramuka</Text>
          <Text style={g.tulis}>Catatan: hafalan tembang sudah lancar.</Text>
          <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
            <Stempel teks="DIPARAF" miring={-6} skala={0.8} />
          </View>
        </KertasGaris>
      ),
    },
    {
      judul: 'Bayar dan bukti hanya simulasi',
      teks: 'QRIS dan transfer di demo ini tidak memindahkan uang. Data contoh mengikuti tanggal dan jam WIB hari ini, dan hanya tersimpan di perangkatmu.',
      badan: (
        <View style={g.simulasi}>
          <Ikon nama="qr" ukuran={40} warna={c.tinta} />
          <View style={{ flex: 1 }}>
            <Teks jenis="tebal">Contoh: SPP bulanan</Teks>
            <Teks jenis="kecil">Simulasi QRIS, lalu bukti bayar bercap LUNAS.</Teks>
          </View>
          <Stempel teks="LUNAS" miring={-10} skala={0.72} />
        </View>
      ),
    },
  ][langkah];
  return (
    <Lembar terbuka={terbuka} onTutup={tutup} labelId="judul-sambut">
      <View style={g.titikBaris} aria-hidden>
        {[0, 1, 2].map((i) => <View key={i} style={[g.titik, i <= langkah && g.titikAktif]} />)}
      </View>
      <Text style={g.langkah}>{`LANGKAH ${langkah + 1} DARI 3`}</Text>
      <Teks jenis="subjudul" nativeID="judul-sambut">{isi.judul}</Teks>
      <Teks jenis="kecil" style={{ color: c.tinta }}>{isi.teks}</Teks>
      {isi.badan}
      <View style={g.tombolBaris}>
        <Tombol jenis="garis" judul="Lewati" onPress={tutup} style={{ flex: 1 }} />
        <Tombol
          jenis="utama"
          judul={langkah < 2 ? 'Lanjut' : 'Mulai'}
          onPress={() => (langkah < 2 ? setLangkah(langkah + 1) : tutup())}
          style={{ flex: 1.4 }}
        />
      </View>
    </Lembar>
  );
}
