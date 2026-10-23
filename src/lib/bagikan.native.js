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

// Di ponsel, "unduh" membuka lembar bagikan berisi ringkasan teks.
export const unduhBerkas = (nama, isi) => bagikanTeks(isi.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), nama);
