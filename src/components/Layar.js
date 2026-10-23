import { useRef, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { buatGaya } from '@/lib/pakai-tema';
import Kepala, { KepalaRingkas } from './Kepala';

const useGaya = buatGaya((c) => StyleSheet.create({
  akar: { flex: 1, backgroundColor: c.kertas, minHeight: 0 },
  gulir: { flex: 1 },
  isi: { padding: 16, paddingBottom: 28, gap: 14 },
}));

/**
 * Kerangka layar: kepala papan tulis besar ikut tergulir, lalu bilah ringkas (56 px + lis)
 * muncul di atas isi. Pola judul besar seperti ini tidak menggeser isi saat berganti.
 */
export default function Layar({ kepala, children, kaki, gulir = true, isiStyle }) {
  const g = useGaya();
  const [ringkas, setRingkas] = useState(false);
  const tinggi = useRef(150);
  const onScroll = useCallback((e) => {
    const y = e.nativeEvent.contentOffset.y;
    const batas = Math.max(40, tinggi.current - 72);
    setRingkas((r) => (r ? y > batas - 16 : y > batas));
  }, []);
  if (!gulir) {
    return (
      <View style={g.akar}>
        <Kepala {...kepala} />
        <View role="main" style={{ flex: 1, minHeight: 0 }}>{children}</View>
        {kaki}
      </View>
    );
  }
  return (
    <View style={g.akar}>
      <ScrollView style={g.gulir} onScroll={onScroll} scrollEventThrottle={32} keyboardShouldPersistTaps="handled" tabIndex={0}>
        <View onLayout={(e) => { tinggi.current = e.nativeEvent.layout.height; }}>
          <Kepala {...kepala} />
        </View>
        <View role="main" style={[g.isi, isiStyle]}>{children}</View>
      </ScrollView>
      {ringkas ? <KepalaRingkas judul={kepala.judulRingkas || kepala.judul} kembali={kepala.kembali} anakTampil={kepala.anakTampil} pesanTampil={kepala.pesanTampil} /> : null}
      {kaki}
    </View>
  );
}
