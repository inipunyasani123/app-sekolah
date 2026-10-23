// Kait data turunan: anak aktif, semester, dan data relatif hari ini.
import { useMemo } from 'react';
import { anakById } from './data';
import { hariIni } from './waktu';
import { semester, pesanAwal, dibacaAwal, tagihan, pengumuman } from './bangkit';
import { selisihHari } from './waktu';
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

/** Jumlah hal yang butuh perhatian untuk lencana tab "Lainnya" dan ubin di dalamnya. */
export function usePerhatian(anak) {
  const t = useToko();
  const h = useHari();
  const { baru: pesan } = usePesan(anak);
  return useMemo(() => {
    if (!h) return { tagihan: 0, pesan: 0, kabar: 0, total: 0, siap: false };
    const belum = tagihan(anak, h.hari, h.sem, t.bayar).filter((x) => x.status === 'belum').length;
    const dibaca = t.kabarDibaca[anak.id] || [];
    const kabar = pengumuman(h.hari, h.sem, anak).filter((k) => !dibaca.includes(k.id) && selisihHari(k.tanggal, h.hari) <= 7).length;
    return { tagihan: belum, pesan, kabar, total: belum + pesan + kabar, siap: true };
  }, [anak, h ? h.hari : null, t.bayar, t.kabarDibaca, pesan]); // eslint-disable-line react-hooks/exhaustive-deps
}
