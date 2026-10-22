import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { ANAK, GURU, kelasAnak } from '@/lib/data';
import { useToko, ubah } from '@/lib/toko';
import { aturPengalih, usePengalih } from '@/lib/ui';
import Lembar from './Lembar';
import Avatar from './Avatar';
import Ikon from './Ikon';
import { Teks } from './Dasar';

const useGaya = buatGaya((c) => StyleSheet.create({
  baris: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: 18, borderWidth: 1.5, borderColor: c.garis, backgroundColor: c.kartu, minHeight: 72 },
  aktif: { borderColor: c.tombol, backgroundColor: c.hijauTipis },
  nama: { ...berat(700), fontSize: 16, lineHeight: 21, color: c.tinta },
  ket: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  ditekan: { opacity: 0.8 },
  bawah: { flexDirection: 'row', gap: 10, marginTop: 4 },
  tautan: { flex: 1, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: c.garisKuat },
  tautanTeks: { ...berat(700), fontSize: 14, color: c.tinta },
}));

export default function Pengalih() {
  const g = useGaya();
  const c = useWarna();
  const terbuka = usePengalih();
  const { anak } = useToko();
  const router = useRouter();
  const tutup = useCallback(() => aturPengalih(false), []);
  return (
    <Lembar terbuka={terbuka} onTutup={tutup} labelId="judul-pengalih">
      <Teks jenis="subjudul" nativeID="judul-pengalih">Pilih anak</Teks>
      <Teks jenis="kecil">Semua layar mengikuti anak yang dipilih.</Teks>
      <View role="radiogroup" aria-labelledby="judul-pengalih" style={{ gap: 10 }}>
      {ANAK.map((a) => {
        const aktif = a.id === anak;
        return (
          <Pressable
            key={a.id}
            role="radio"
            aria-checked={aktif}
            onPress={() => {
              ubah((s) => ({ ...s, anak: a.id }));
              tutup();
            }}
            style={({ pressed }) => [g.baris, aktif && g.aktif, pressed && g.ditekan]}
          >
            <Avatar siapa={a.id} ukuran={48} />
            <View style={{ flex: 1 }}>
              <Text style={g.nama}>{a.nama}</Text>
              <Text style={g.ket}>Kelas {kelasAnak(a)} · wali kelas {GURU[a.wali].panggil}</Text>
            </View>
            {aktif ? <Ikon nama="centang" ukuran={22} warna={c.hijau} tebal={2.4} /> : null}
          </Pressable>
        );
      })}
      </View>
      <View style={g.bawah}>
        <Pressable
          role="button"
          onPress={() => {
            tutup();
            router.push('/profil');
          }}
          style={({ pressed }) => [g.tautan, pressed && g.ditekan]}
        >
          <Text style={g.tautanTeks}>Lihat profil anak</Text>
        </Pressable>
        <Pressable role="button" onPress={tutup} style={({ pressed }) => [g.tautan, pressed && g.ditekan]}>
          <Text style={g.tautanTeks}>Tutup</Text>
        </Pressable>
      </View>
    </Lembar>
  );
}
