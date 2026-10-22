import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buatGaya } from '@/lib/pakai-tema';

const useGaya = buatGaya((c) => StyleSheet.create({
  tirai: { flex: 1, backgroundColor: c.tirai, justifyContent: 'flex-end' },
  panel: { backgroundColor: c.kertas, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 18, gap: 12, maxHeight: '86%' },
  pegangan: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: c.garisKuat, marginBottom: 4 },
}));

export default function Lembar({ terbuka, onTutup, children }) {
  const g = useGaya();
  const inset = useSafeAreaInsets();
  return (
    <Modal visible={terbuka} transparent animationType="slide" onRequestClose={onTutup}>
      <View style={g.tirai}>
        <Pressable accessibilityLabel="Tutup" onPress={onTutup} style={StyleSheet.absoluteFill} />
        <View style={[g.panel, { paddingBottom: 18 + inset.bottom }]}>
          <View style={g.pegangan} />
          {children}
        </View>
      </View>
    </Modal>
  );
}
