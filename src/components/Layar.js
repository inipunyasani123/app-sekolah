import { View, ScrollView, StyleSheet } from 'react-native';
import { buatGaya } from '@/lib/pakai-tema';
import Kepala from './Kepala';

const useGaya = buatGaya((c) => StyleSheet.create({
  akar: { flex: 1, backgroundColor: c.kertas, minHeight: 0 },
  gulir: { flex: 1 },
  isi: { padding: 16, paddingBottom: 28, gap: 14 },
}));

/** Kerangka layar: kepala papan tulis + isi yang bisa digulir. */
export default function Layar({ kepala, children, kaki, gulir = true, isiStyle }) {
  const g = useGaya();
  return (
    <View style={g.akar}>
      <Kepala {...kepala} />
      {gulir ? (
        <ScrollView style={g.gulir} contentContainerStyle={[g.isi, isiStyle]} keyboardShouldPersistTaps="handled" tabIndex={0}>
          <View role="main" style={{ gap: 14 }}>{children}</View>
        </ScrollView>
      ) : (
        <View role="main" style={{ flex: 1, minHeight: 0 }}>{children}</View>
      )}
      {kaki}
    </View>
  );
}
