import { View, StyleSheet } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Tombol } from '@/components/Dasar';
import { Svg, Rect, Path, SvgText } from '@/components/svg';
import { F } from '@/lib/fonts';
import { meta } from '@/lib/seo';

export function generateMetadata() {
  return meta('/404', 'Halaman Tidak Ada di Jadwal | Kapur', 'Halaman yang kamu cari tidak ada di aplikasi Kapur. Kembali ke beranda buku penghubung.', { noindex: true });
}

const g = StyleSheet.create({ papan: { alignItems: 'center', marginTop: 8 } });

export default function TidakAda() {
  return (
    <Layar kepala={{ judul: 'Halaman tidak ada di jadwal', sub: 'Galat 404', anakTampil: false, pesanTampil: false }}>
      <View style={g.papan}>
        <Svg width="100%" height={190} viewBox="0 0 320 190" accessibilityLabel="Papan tulis bertuliskan 404 dengan kapur">
          <Rect x={10} y={8} width={300} height={160} rx={10} fill="#7b5134" />
          <Rect x={20} y={18} width={280} height={140} rx={6} fill="#1f4a3b" />
          <SvgText x={160} y={118} fontSize={58} fontFamily={F.tulis} fill="#f5f0e4" textAnchor="middle">404</SvgText>
          <Path d="M60 132c40 6 160 6 200-2" fill="none" stroke="rgba(245,240,228,0.5)" strokeWidth={3} strokeLinecap="round" />
          <Rect x={10} y={166} width={300} height={10} rx={3} fill="#5e3c25" />
          <Rect x={210} y={160} width={22} height={7} rx={2} fill="#f5f0e4" />
          <Rect x={240} y={160} width={16} height={7} rx={2} fill="#f2b632" />
        </Svg>
      </View>
      <Teks>Tautan ini mungkin salah ketik atau halamannya sudah dipindah. Coba mulai lagi dari beranda.</Teks>
      <Tombol href="/" judul="Ke beranda" ikon="rumah" />
      <Tombol href="/menu" jenis="garis" judul="Lihat semua fitur" ikon="menu" />
    </Layar>
  );
}
