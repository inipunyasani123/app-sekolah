import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { JUDUL } from '@/lib/judul';
import { usePathname } from 'expo-router';
import Navigasi from '@/components/Navigasi';
import { StatusBar } from 'expo-status-bar';
import { muatToko, useToko, useSiap, ubah } from '@/lib/toko';
import { useMuatFont } from '@/lib/fonts';
import { terapkanTema, buatGaya } from '@/lib/pakai-tema';
import NavBawah from '@/components/NavBawah';
import Pengalih from '@/components/Pengalih';
import Sambut from '@/components/Sambut';
import { namaRute } from '@/lib/rute';

const useGaya = buatGaya((c) => StyleSheet.create({
  akar: { flex: 1, backgroundColor: c.kertas, minHeight: 0 },
  isi: { flex: 1, minHeight: 0 },
}));

// Rute tanpa navigasi bawah (layar detail dengan tombol kembali).
const tanpaNav = (p) => p === '/pesan' || p === '/absensi/izin' || p.startsWith('/tagihan/');

/** Web: judul tab ikut berganti saat pindah halaman di dalam aplikasi (HTML statis sudah benar sejak awal). */
function JudulTab() {
  const path = usePathname();
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const judul = JUDUL[path] ?? JUDUL['/404'];
    if (document.title !== judul) document.title = judul;
  }, [path]);
  return null;
}

export default function Akar() {
  const g = useGaya();
  const font = useMuatFont();
  const siap = useSiap();
  const { tema } = useToko();
  const path = usePathname();
  useEffect(() => {
    muatToko();
  }, []);
  useEffect(() => {
    if (siap) terapkanTema(tema);
  }, [siap, tema]);
  // Catat rute yang baru dibuka untuk "Terakhir dibuka" di Lainnya.
  useEffect(() => {
    if (!siap || !namaRute(path)) return;
    ubah((s) => {
      const lama = (s.terakhir || []).filter((r) => r !== path);
      return { ...s, terakhir: [path, ...lama].slice(0, 5) };
    });
  }, [siap, path]);
  if (!font) return null;
  return (
    <View style={g.akar}>
      <JudulTab />
      <View style={g.isi}>
        <Navigasi />
      </View>
      {tanpaNav(path) ? null : <NavBawah />}
      <Pengalih />
      <Sambut />
      <StatusBar style="light" />
    </View>
  );
}
