import { Share } from 'react-native';

export async function bagikanTeks(teks, judul) {
  try {
    const r = await Share.share({ message: teks, title: judul });
    return r.action === Share.dismissedAction ? 'batal' : 'dibagikan';
  } catch {
    return 'gagal';
  }
}

// Tanpa modul papan klip tambahan: di ponsel, salin = buka lembar bagikan.
export const salinTeks = (teks) => bagikanTeks(teks);
