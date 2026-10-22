import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { F, berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { useAnak, usePesan } from '@/lib/pakai';
import { kelasAnak } from '@/lib/data';
import { aturPengalih } from '@/lib/ui';
import Ikon from './Ikon';
import { Tautan } from './Dasar';
import Avatar from './Avatar';
import { Svg, Path, Rect } from './svg';

// Teks khusus pembaca layar (tidak terlihat).
const SR = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 };

const useGaya = buatGaya((c) => StyleSheet.create({
  papan: { backgroundColor: c.papan, overflow: 'hidden' },
  isi: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  atas: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  tombolIkon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(245,240,228,0.10)' },
  ditekan: { opacity: 0.75 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 4, paddingRight: 10, minHeight: 44, borderRadius: 999, backgroundColor: 'rgba(245,240,228,0.12)', borderWidth: 1, borderColor: 'rgba(245,240,228,0.22)' },
  chipNama: { ...berat(700), fontSize: 14, lineHeight: 18, color: c.kapur },
  chipKelas: { ...berat(500), fontSize: 12, lineHeight: 15, color: c.kapur2 },
  lencana: { position: 'absolute', top: 5, right: 5, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: c.pensil, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  lencanaTeks: { ...berat(800), fontSize: 11, lineHeight: 14, color: c.pensilTeks },
  sub: { ...berat(600), fontSize: 13, lineHeight: 18, color: c.kapur2, marginTop: 10 },
  judul: { fontFamily: F.serif, fontSize: 26, lineHeight: 32, color: c.kapur, marginTop: 2 },
  judulBesar: { fontSize: 30, lineHeight: 36 },
  merek: { fontFamily: F.tulis, fontSize: 19, lineHeight: 28, color: c.kapur, marginLeft: 2 },
  lis: { height: 9, backgroundColor: '#7b5134', borderTopWidth: 2, borderTopColor: '#5e3c25' },
  coretan: { position: 'absolute', top: 0, right: 0, opacity: 0.5 },
}));

function Coretan() {
  // Bekas hapusan kapur samar di pojok papan.
  return (
    <View style={{ position: 'absolute', right: -10, top: 30 }} pointerEvents="none">
      <Svg width={190} height={120} viewBox="0 0 190 120">
        <Path d="M12 70c30-14 62-20 96-16s52 2 72-8" fill="none" stroke="rgba(245,240,228,0.07)" strokeWidth={22} strokeLinecap="round" />
        <Path d="M40 98c26-8 58-10 90-4" fill="none" stroke="rgba(245,240,228,0.05)" strokeWidth={16} strokeLinecap="round" />
        <Path d="M118 22c8 6 18 8 30 6M126 34c6 3 12 4 20 3" fill="none" stroke="rgba(245,240,228,0.16)" strokeWidth={1.6} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** Lis kayu papan tulis dengan sepotong kapur dan penghapus. */
export function Lis() {
  const g = useGaya();
  return (
    <View style={g.lis} aria-hidden>
      <View style={{ position: 'absolute', right: 26, top: -6 }}>
        <Svg width={64} height={10} viewBox="0 0 64 10">
          <Rect x={0} y={2} width={16} height={5} rx={2} fill="#f5f0e4" />
          <Rect x={22} y={2} width={11} height={5} rx={2} fill="#f2b632" />
          <Rect x={40} y={0} width={24} height={8} rx={2} fill="#3b2f2a" />
          <Rect x={40} y={0} width={24} height={3} rx={1.5} fill="#8c7b6e" />
        </Svg>
      </View>
    </View>
  );
}

function PengalihAnak() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  return (
    <Pressable
      role="button"
      aria-haspopup="dialog"
      onPress={() => aturPengalih(true)}
      style={({ pressed }) => [g.chip, pressed && g.ditekan]}
    >
      <Avatar siapa={anak.id} ukuran={34} />
      <View>
        <Text style={g.chipNama}>{anak.panggil}</Text>
        <Text style={g.chipKelas}>Kelas {kelasAnak(anak)}</Text>
        <Text style={SR}>, ganti anak</Text>
      </View>
      <Ikon nama="bawah" ukuran={16} warna={c.kapur2} tebal={2.2} />
    </Pressable>
  );
}

function TombolPesan() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  const { baru } = usePesan(anak);
  return (
    <Tautan href="/pesan" aria-label={baru ? `Pesan wali kelas, ${baru} belum dibaca` : 'Pesan wali kelas'} style={g.tombolIkon} styleTekan={g.ditekan}>
      <Ikon nama="pesan" ukuran={22} warna={c.kapur} />
      {baru ? (
        <View style={g.lencana}>
          <Text style={g.lencanaTeks}>{baru}</Text>
        </View>
      ) : null}
    </Tautan>
  );
}

export default function Kepala({ judul, sub, kembali, besar, anakTampil = true, pesanTampil = true, children }) {
  const g = useGaya();
  const c = useWarna();
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const balik = () => {
    if (router.canGoBack()) router.back();
    else router.replace(kembali);
  };
  return (
    <View role="banner" style={g.papan}>
      <Coretan />
      <View dataSet={{ amanAtas: '' }} style={Platform.OS === 'web' ? null : { paddingTop: inset.top }}>
        <View style={g.isi}>
          <View style={g.atas}>
            {kembali ? (
              <Pressable role="button" aria-label="Kembali" onPress={balik} style={({ pressed }) => [g.tombolIkon, pressed && g.ditekan]}>
                <Ikon nama="kembali" ukuran={22} warna={c.kapur} tebal={2.2} />
              </Pressable>
            ) : (
              <Link href="/" aria-label="Kapur, ke beranda" style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44 }}>
                <Text style={g.merek}>Kapur</Text>
              </Link>
            )}
            <View style={{ flex: 1 }} />
            {pesanTampil ? <TombolPesan /> : null}
            {anakTampil ? <PengalihAnak /> : null}
          </View>
          {sub ? <Text style={g.sub}>{sub}</Text> : null}
          <Text role="heading" aria-level={1} style={[g.judul, besar && g.judulBesar]}>
            {judul}
          </Text>
          {children}
        </View>
      </View>
      <Lis />
    </View>
  );
}
