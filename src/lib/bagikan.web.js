// Bagikan teks: Web Share API bila ada, kalau tidak salin ke papan klip.
export async function bagikanTeks(teks, judul) {
  try {
    if (navigator.share) {
      await navigator.share({ title: judul, text: teks });
      return 'dibagikan';
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'batal';
  }
  return salinTeks(teks);
}

export async function salinTeks(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return 'disalin';
  } catch {
    return 'gagal';
  }
}

/** Unduh berkas buatan klien (mis. rapor HTML simulasi). */
export function unduhBerkas(nama, isi, jenis = 'text/html') {
  try {
    const url = URL.createObjectURL(new Blob([isi], { type: `${jenis};charset=utf-8` }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nama;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return Promise.resolve('diunduh');
  } catch {
    return Promise.resolve('gagal');
  }
}
