import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { F } from '@/lib/fonts';
import { buatGaya } from '@/lib/pakai-tema';
import { kurangiGerak } from '@/lib/gerak';

const JARAK = 28;

const useGaya = buatGaya((c) => StyleSheet.create({
  kertas: { backgroundColor: c.kartu, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: c.garis, boxShadow: `0 8px 20px -12px ${c.bayang}` },
  garis: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: c.aturan },
  margin: { position: 'absolute', top: 0, bottom: 0, left: 40, width: 1.5, backgroundColor: c.margin },
  margin2: { position: 'absolute', top: 0, bottom: 0, left: 44, width: 1, backgroundColor: c.margin, opacity: 0.6 },
  isi: { paddingLeft: 54, paddingRight: 16, paddingTop: 14, paddingBottom: 14 },
  stempel: { alignSelf: 'flex-start', borderWidth: 2.5, borderColor: c.merah, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 },
  stempelDalam: { borderWidth: 1, borderColor: c.merah, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 1 },
  stempelTeks: { fontFamily: F.serif, fontSize: 18, lineHeight: 24, letterSpacing: 3, color: c.merah },
}));

/** Kartu kertas buku tulis putih: garis biru dan garis margin merah ganda. */
export function KertasGaris({ children, style, isiStyle, baris = 16 }) {
  const g = useGaya();
  return (
    <View style={[g.kertas, style]}>
      <View aria-hidden pointerEvents="none" style={StyleSheet.absoluteFill}>
        {Array.from({ length: baris }, (_, i) => (
          <View key={i} style={[g.garis, { top: 14 + JARAK * (i + 1) - 6 }]} />
        ))}
        <View style={g.margin} />
        <View style={g.margin2} />
      </View>
      <View style={[g.isi, isiStyle]}>{children}</View>
    </View>
  );
}

export const JARAK_GARIS = JARAK;

/** Animasi "dicap": membesar lalu menekan ke kertas. Tanpa gerak bila pengguna memilih kurangi gerakan. */
export function useCap(aktif) {
  const v = useRef(new Animated.Value(aktif && !kurangiGerak() ? 0 : 1)).current;
  useEffect(() => {
    if (!aktif || kurangiGerak()) return;
    Animated.spring(v, { toValue: 1, friction: 6, tension: 160, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [aktif, v]);
  return {
    opacity: v.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }),
    skala: v.interpolate({ inputRange: [0, 1], outputRange: [1.45, 1] }),
  };
}

/** Cap stempel karet, misalnya LUNAS. animasi = baru saja dicap. */
export function Stempel({ teks = 'LUNAS', style, miring = -10, skala = 1, animasi = false }) {
  const g = useGaya();
  const cap = useCap(animasi);
  return (
    <Animated.View style={[g.stempel, style, { opacity: Animated.multiply(cap.opacity, 0.92), transform: [{ rotate: `${miring}deg` }, { scale: Animated.multiply(cap.skala, skala) }] }]}>
      <View style={g.stempelDalam}>
        <Text style={g.stempelTeks}>{teks}</Text>
      </View>
    </Animated.View>
  );
}
