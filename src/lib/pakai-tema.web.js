import { TERANG } from './tema';

const C = Object.fromEntries(Object.keys(TERANG).map((k) => [k, `var(--k-${k})`]));

export function useWarna() {
  return C;
}

/** Di web, gelap/terang ditentukan CSS; nilai ini hanya untuk hal kecil seperti StatusBar. */
export function useGelap() {
  return false;
}

export function buatGaya(fn) {
  const hasil = fn(C);
  return () => hasil;
}

export function terapkanTema(pilihan) {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  if (pilihan === 'terang' || pilihan === 'gelap') el.setAttribute('data-tema', pilihan);
  else el.removeAttribute('data-tema');
  const gelap = pilihan === 'gelap' || (pilihan !== 'terang' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', gelap ? '#0e271e' : '#1f4a3b');
}
