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
