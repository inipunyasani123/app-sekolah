// Token warna Kapur: papan tulis hijau sebagai bingkai (kepala & navigasi), kertas buku tulis putih bergaris biru.
// Token warna Kapur. Di web, komponen memakai var(--k-*) sehingga mode gelap
// cukup diganti lewat CSS (tanpa render ulang dan tanpa kedip saat hidrasi).

export const TERANG = {
  kertas: '#e5ece6',
  kartu: '#ffffff',
  kartu2: '#edf2ee',
  tinta: '#1c2621',
  tinta2: '#46544c',
  garis: '#d2dcd4',
  garisKuat: '#7d8a82',
  papan: '#1f4a3b',
  papan2: '#2a5c4a',
  tombol: '#1f4a3b',
  nav: '#1f4a3b',
  kapur: '#f5f0e4',
  kapur2: '#c9d8cd',
  pensil: '#f2b632',
  pensilTeks: '#2b2209',
  pensilTipis: '#fbe8b4',
  merah: '#a8322a',
  merahTipis: '#f8e0da',
  hijau: '#1b6a43',
  hijauTipis: '#d8eedf',
  kuning: '#7a5300',
  kuningTipis: '#f8e8c0',
  biru: '#2a5795',
  biruTipis: '#dde7f4',
  aturan: '#b8cfea',
  margin: '#e39a93',
  bayang: 'rgba(28, 38, 33, 0.10)',
  tirai: 'rgba(16, 26, 21, 0.5)',
  fokus: '#2a5795',
};

export const GELAP = {
  kertas: '#0e1713',
  kartu: '#17221c',
  kartu2: '#1f2c25',
  tinta: '#ede7d7',
  tinta2: '#b3bdb4',
  garis: '#2b3b33',
  garisKuat: '#6f8077',
  papan: '#0e271e',
  papan2: '#173a2d',
  tombol: '#2f6b55',
  nav: '#0b2019',
  kapur: '#efe9da',
  kapur2: '#b9c9bd',
  pensil: '#f2b632',
  pensilTeks: '#2b2209',
  pensilTipis: '#3b3117',
  merah: '#ff9d90',
  merahTipis: '#3f211c',
  hijau: '#84d8a6',
  hijauTipis: '#173a29',
  kuning: '#f4c96a',
  kuningTipis: '#3a2e13',
  biru: '#a3c4f3',
  biruTipis: '#1b2b42',
  aturan: '#253a4c',
  margin: '#7d3b35',
  bayang: 'rgba(0, 0, 0, 0.45)',
  tirai: 'rgba(0, 0, 0, 0.62)',
  fokus: '#a3c4f3',
};

const baris = (obj) => Object.entries(obj).map(([k, v]) => `--k-${k}:${v};`).join('');

export function cssTema() {
  return `:root{${baris(TERANG)}color-scheme:light}`
    + `@media (prefers-color-scheme: dark){:root:not([data-tema="terang"]){${baris(GELAP)}color-scheme:dark}}`
    + `:root[data-tema="gelap"]{${baris(GELAP)}color-scheme:dark}`;
}
