// Kait data turunan: anak aktif, semester, dan data relatif hari ini.
import { useMemo } from 'react';
import { anakById } from './data';
import { hariIni } from './waktu';
import { semester, pesanAwal, dibacaAwal } from './bangkit';
import { useToko, useSekarang } from './toko';

export function useAnak() {
  const t = useToko();
  return anakById(t.anak);
}

/** null sebelum klien siap; setelahnya { ms, hari, sem }. */
export function useHari() {
  const ms = useSekarang();
  const hari = ms ? hariIni(ms) : null;
  return useMemo(() => (hari ? { ms, hari, sem: semester(hari) } : null), [hari, ms]);
}

export function usePesan(anak) {
  const t = useToko();
  const h = useHari();
  return useMemo(() => {
    if (!h) return { daftar: [], baru: 0 };
    const tambahan = t.pesan[anak.id] || [];
    const daftar = [...pesanAwal(anak, h.hari, h.ms), ...tambahan].sort((a, b) => a.ms - b.ms);
    const batas = t.dibaca[anak.id] ?? dibacaAwal(anak, h.hari, h.ms);
    const baru = daftar.filter((m) => m.dari === 'guru' && m.ms > batas && m.ms <= h.ms).length;
    return { daftar: daftar.filter((m) => m.ms <= h.ms + 60000), baru };
  }, [t.pesan, t.dibaca, anak, h]);
}
