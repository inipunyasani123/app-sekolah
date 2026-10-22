import { View, Text, StyleSheet } from 'react-native';
import { F } from '@/lib/fonts';
import { buatGaya } from '@/lib/pakai-tema';

const JARAK = 28;

const useGaya = buatGaya((c) => StyleSheet.create({
  kertas: { backgroundColor: c.kartu, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: c.garis, boxShadow: `0 6px 18px -10px ${c.bayang}` },
  garis: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: c.aturan },
  margin: { position: 'absolute', top: 0, bottom: 0, left: 40, width: 1.5, backgroundColor: c.margin },
  isi: { paddingLeft: 54, paddingRight: 16, paddingTop: 14, paddingBottom: 14 },
  stempel: { alignSelf: 'flex-start', borderWidth: 2.5, borderColor: c.merah, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2, transform: [{ rotate: '-10deg' }], opacity: 0.9 },
  stempelDalam: { borderWidth: 1, borderColor: c.merah, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 1 },
  stempelTeks: { fontFamily: F.serif, fontSize: 18, lineHeight: 24, letterSpacing: 3, color: c.merah },
}));

/** Kartu kertas buku tulis: garis biru dan garis margin merah. */
export function KertasGaris({ children, style, isiStyle, baris = 14 }) {
  const g = useGaya();
  return (
    <View style={[g.kertas, style]}>
      <View aria-hidden pointerEvents="none" style={StyleSheet.absoluteFill}>
        {Array.from({ length: baris }, (_, i) => (
          <View key={i} style={[g.garis, { top: 14 + JARAK * (i + 1) - 6 }]} />
        ))}
        <View style={g.margin} />
      </View>
      <View style={[g.isi, isiStyle]}>{children}</View>
    </View>
  );
}

export const JARAK_GARIS = JARAK;

/** Cap stempel karet, misalnya LUNAS. */
export function Stempel({ teks = 'LUNAS', style }) {
  const g = useGaya();
  return (
    <View style={[g.stempel, style]}>
      <View style={g.stempelDalam}>
        <Text style={g.stempelTeks}>{teks}</Text>
      </View>
    </View>
  );
}
