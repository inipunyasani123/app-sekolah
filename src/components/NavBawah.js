import { View, Text, StyleSheet, Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import Ikon from './Ikon';
import { Tautan } from './Dasar';

export const TAB = [
  { href: '/', judul: 'Beranda', ikon: 'rumah' },
  { href: '/jadwal', judul: 'Jadwal', ikon: 'jadwal' },
  { href: '/tugas', judul: 'Tugas', ikon: 'tugas' },
  { href: '/nilai', judul: 'Nilai', ikon: 'nilai' },
  { href: '/menu', judul: 'Menu', ikon: 'menu' },
];

const useGaya = buatGaya((c) => StyleSheet.create({
  nav: { backgroundColor: c.kartu, borderTopWidth: 1, borderTopColor: c.garis },
  baris: { flexDirection: 'row', paddingHorizontal: 6, paddingTop: 6, paddingBottom: 6 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 54, borderRadius: 14, gap: 2 },
  pil: { width: 52, height: 30, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  pilAktif: { backgroundColor: c.pensil },
  teks: { ...berat(600), fontSize: 12, lineHeight: 16, color: c.tinta2 },
  teksAktif: { ...berat(800), color: c.tinta },
  ditekan: { opacity: 0.7 },
}));

export function aktifUntuk(path, href) {
  if (href === '/') return path === '/';
  return path === href || path.startsWith(`${href}/`);
}

export default function NavBawah() {
  const g = useGaya();
  const c = useWarna();
  const path = usePathname();
  const inset = useSafeAreaInsets();
  return (
    <View role="navigation" aria-label="Menu utama" style={[g.nav, Platform.OS === 'web' ? null : { paddingBottom: inset.bottom }]}>
      <View style={g.baris}>
        {TAB.map((t) => {
          const aktif = aktifUntuk(path, t.href);
          return (
            <Tautan key={t.href} href={t.href} aria-current={aktif ? 'page' : undefined} style={g.item} styleTekan={g.ditekan}>
              <View style={[g.pil, aktif && g.pilAktif]}>
                <Ikon nama={t.ikon} ukuran={22} warna={aktif ? c.pensilTeks : c.tinta2} tebal={aktif ? 2.1 : 1.8} />
              </View>
              <Text style={[g.teks, aktif && g.teksAktif]}>{t.judul}</Text>
            </Tautan>
          );
        })}
      </View>
    </View>
  );
}
