// Metadata per rute (generateMetadata) dan data terstruktur. Judul ≤60, deskripsi ≤155 karakter.
import { APP, SEKOLAH } from './data';

export const OG_ALT = 'Aplikasi Kapur di ponsel: papan tulis hijau, buku penghubung bergaris, dan tagihan SPP bertanda lunas';

export function meta(path, judul, deskripsi, { noindex = false } = {}) {
  const url = `${APP.url}${path}`;
  return {
    title: judul,
    description: deskripsi,
    applicationName: APP.nama,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url,
      siteName: APP.nama,
      title: judul,
      description: deskripsi,
      images: [{ url: `${APP.url}/og.jpg`, width: 1200, height: 630, alt: OG_ALT }],
    },
    twitter: { card: 'summary_large_image', title: judul, description: deskripsi, images: [`${APP.url}/og.jpg`] },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export const FITUR = [
  'Pengalih untuk lebih dari satu anak',
  'Jadwal pelajaran hari ini dan minggu ini',
  'Absensi gerbang serta pengajuan izin dan sakit',
  'Nilai per mapel dengan grafik perkembangan dan rapor',
  'Tugas dan tenggat dengan tanda pendampingan orang tua',
  'Pengumuman dan kalender akademik',
  'Tagihan SPP dengan simulasi QRIS atau transfer dan bukti bayar',
  'Pesan dengan wali kelas (simulasi)',
  'Mode gelap',
];

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${APP.url}/#situs`,
      url: `${APP.url}/`,
      name: APP.nama,
      inLanguage: 'id-ID',
      publisher: { '@id': 'https://www.pintuweb.id/#organisasi' },
    },
    {
      '@type': ['WebApplication', 'MobileApplication'],
      '@id': `${APP.url}/#aplikasi`,
      name: APP.nama,
      alternateName: `Kapur, aplikasi orang tua ${SEKOLAH.nama}`,
      description: `Demo aplikasi orang tua untuk sekolah rekaan ${SEKOLAH.nama}. Data contoh disimulasikan di perangkat, tanpa server. Dibuat oleh PintuWeb dengan React Native dan Expo.`,
      url: `${APP.url}/`,
      image: `${APP.url}/og.jpg`,
      screenshot: `${APP.url}/og.jpg`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Android, iOS, Web',
      inLanguage: 'id-ID',
      isAccessibleForFree: true,
      featureList: FITUR,
      creator: { '@id': 'https://www.pintuweb.id/#organisasi' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.pintuweb.id/#organisasi',
      name: 'PintuWeb',
      url: 'https://www.pintuweb.id',
    },
  ],
};
