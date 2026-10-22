// Di web, font dimuat lewat @font-face di +html (font-display: swap), bukan expo-font,
// supaya HTML statis langsung tampil tanpa menunggu JavaScript.
export const F = {
  serif: '"Young Serif", Georgia, "Times New Roman", serif',
  sans: '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  tulis: '"Playwrite ID", "Segoe Print", "Bradley Hand", cursive',
};

export function berat(w = 400) {
  return { fontFamily: F.sans, fontWeight: String(w) };
}

export function useMuatFont() {
  return true;
}
