import { useEffect, useRef } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { buatGaya } from '@/lib/pakai-tema';

const useGaya = buatGaya((c) => StyleSheet.create({
  tirai: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, backgroundColor: c.tirai, justifyContent: 'flex-end' },
  tutupLatar: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  panel: { backgroundColor: c.kertas, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 18, paddingBottom: 26, gap: 12, maxHeight: '86%' },
  pegangan: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: c.garisKuat, marginBottom: 4 },
}));

// Lembar bawah di dalam bingkai aplikasi (bukan menutupi seluruh halaman web).
export default function Lembar({ terbuka, onTutup, labelId, children }) {
  const g = useGaya();
  const panel = useRef(null);
  useEffect(() => {
    if (!terbuka) return undefined;
    const sebelum = document.activeElement;
    const el = panel.current;
    const fokusPertama = () => {
      const t = el && el.querySelector('[role="button"],button,a[href],input,textarea,[tabindex="0"]');
      if (t) t.focus();
    };
    const id = setTimeout(fokusPertama, 30);
    const tombol = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onTutup();
      }
      if (e.key === 'Tab' && el) {
        const semua = [...el.querySelectorAll('[role="button"],button,a[href],input,textarea,[tabindex="0"]')];
        if (!semua.length) return;
        const awal = semua[0];
        const akhir = semua[semua.length - 1];
        if (e.shiftKey && document.activeElement === awal) {
          e.preventDefault();
          akhir.focus();
        } else if (!e.shiftKey && document.activeElement === akhir) {
          e.preventDefault();
          awal.focus();
        }
      }
    };
    document.addEventListener('keydown', tombol);
    return () => {
      clearTimeout(id);
      document.removeEventListener('keydown', tombol);
      if (sebelum && sebelum.focus) sebelum.focus();
    };
  }, [terbuka, onTutup]);
  if (!terbuka) return null;
  return (
    <View style={g.tirai}>
      <Pressable aria-hidden tabIndex={-1} focusable={false} onPress={onTutup} style={g.tutupLatar} />
      <View ref={panel} role="dialog" aria-modal="true" aria-labelledby={labelId} style={g.panel}>
        <View style={g.pegangan} />
        {children}
      </View>
    </View>
  );
}
