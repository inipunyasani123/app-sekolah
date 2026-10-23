import { View, Text, StyleSheet, Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { useAnak, usePerhatian } from '@/lib/pakai';
import Ikon from './Ikon';
import { Tautan } from './Dasar';

export const TAB = [
  { href: '/', judul: 'Beranda', ikon: 'rumah' },
  { href: '/jadwal', judul: 'Jadwal', ikon: 'jadwal' },
  { href: '/tugas', judul: 'Tugas', ikon: 'tugas' },
  { href: '/nilai', judul: 'Nilai', ikon: 'nilai' },
  { href: '/menu', judul: 'Lainnya', ikon: 'lainnya' },
];

// Rute yang berada di bawah tab "Lainnya".
const DI_LAINNYA = ['/menu', '/absensi', '/tagihan', '/kabar', '/profil'];

const SR = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 };

const useGaya = buatGaya((c) => StyleSheet.create({
  nav: { backgroundColor: c.nav, borderTopWidth: 2, borderTopColor: '#5e3c25' },
  baris: { flexDirection: 'row', paddingHorizontal: 6, paddingTop: 4, paddingBottom: 4 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 50, borderRadius: 14, gap: 1 },
  pil: { width: 50, height: 28, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  pilAktif: { backgroundColor: c.pensil },
  teks: { ...berat(600), fontSize: 13, lineHeight: 17, color: c.kapur2 },
  teksAktif: { ...berat(800), color: c.kapur },
  ditekan: { opacity: 0.7 },
  lencana: { position: 'absolute', top: -5, right: 2, minWidth: 19, height: 19, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#ee9c8c', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: c.nav },
  lencanaTeks: { ...berat(800), fontSize: 12, lineHeight: 14, color: '#2b1410' },
}));

export function aktifUntuk(path, href) {
  if (href === '/') return path === '/';
  if (href === '/menu') return DI_LAINNYA.some((p) => path === p || path.startsWith(`${p}/`));
  return path === href || path.startsWith(`${href}/`);
}

export default function NavBawah() {
  const g = useGaya();
  const c = useWarna();
  const path = usePathname();
  const inset = useSafeAreaInsets();
  const anak = useAnak();
  const perhatian = usePerhatian(anak);
  return (
    <View role="navigation" aria-label="Menu utama" style={[g.nav, Platform.OS === 'web' ? null : { paddingBottom: inset.bottom }]}>
      <View style={g.baris}>
        {TAB.map((t) => {
          const aktif = aktifUntuk(path, t.href);
          const jumlah = t.href === '/menu' ? perhatian.total : 0;
          return (
            <Tautan
              key={t.href}
              href={t.href}
              aria-current={aktif ? 'page' : undefined}
              style={g.item}
              styleTekan={g.ditekan}
            >
              <View style={[g.pil, aktif && g.pilAktif]}>
                <Ikon nama={t.ikon} ukuran={22} warna={aktif ? c.pensilTeks : c.kapur2} tebal={aktif ? 2.1 : 1.8} />
                {jumlah ? (
                  <View style={g.lencana} aria-hidden>
                    <Text style={g.lencanaTeks}>{jumlah > 9 ? '9+' : jumlah}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[g.teks, aktif && g.teksAktif]}>{t.judul}</Text>
              {jumlah ? <Text style={SR}>{`, ${jumlah} perlu perhatian`}</Text> : null}
            </Tautan>
          );
        })}
      </View>
    </View>
  );
}
