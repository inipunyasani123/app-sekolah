import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Kartu, Segmen, Tautan, Tombol } from '@/components/Dasar';
import Ikon from '@/components/Ikon';
import { Logo } from '@/components/Avatar';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, usePesan } from '@/lib/pakai';
import { useToko, ubah, aturUlang } from '@/lib/toko';
import { APP, SEKOLAH } from '@/lib/data';

export function generateMetadata() {
  return meta(
    '/menu',
    'Menu Aplikasi Kapur: Semua Fitur dan Tampilan | Kapur',
    'Semua fitur Kapur dalam satu menu: absensi, tagihan SPP, kabar sekolah, pesan wali kelas, profil anak, rapor, serta pilihan mode gelap.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  ubin: { width: '47.5%', flexGrow: 1, minHeight: 104, borderRadius: 20, padding: 14, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, gap: 8, justifyContent: 'space-between' },
  ubinLebar: { width: '100%' },
  ikonBulat: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  judul: { ...berat(700), fontSize: 15, lineHeight: 20, color: c.tinta },
  ket: { ...berat(500), fontSize: 12.5, lineHeight: 17, color: c.tinta2 },
  ditekan: { opacity: 0.85 },
  tentang: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  konfirmasi: { flexDirection: 'row', gap: 8 },
}));

const MENU = [
  { href: '/absensi', judul: 'Absensi', ket: 'Kehadiran dan izin', ikon: 'absen', w: 'hijau' },
  { href: '/tagihan', judul: 'Tagihan SPP', ket: 'Bayar dan bukti', ikon: 'dompet', w: 'kuning' },
  { href: '/kabar', judul: 'Kabar sekolah', ket: 'Pengumuman', ikon: 'kabar', w: 'merah' },
  { href: '/kabar?tab=kalender', judul: 'Kalender', ket: 'Agenda akademik', ikon: 'jadwal', w: 'biru' },
  { href: '/pesan', judul: 'Pesan', ket: 'Wali kelas', ikon: 'pesan', w: 'biru' },
  { href: '/nilai/rapor', judul: 'Rapor', ket: 'Semester lalu', ikon: 'buku', w: 'merah' },
  { href: '/profil', judul: 'Profil anak', ket: 'Data dan kesehatan', ikon: 'profil', w: 'hijau', lebar: true },
];

export default function Menu() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  const { tema } = useToko();
  const { baru } = usePesan(anak);
  const [yakin, setYakin] = useState(false);
  const [info, setInfo] = useState('');
  return (
    <Layar kepala={{ judul: 'Menu', sub: `Semua fitur untuk ${anak.panggil}` }}>
      <View style={g.grid}>
        {MENU.map((m) => (
          <Tautan key={m.href} href={m.href} style={[g.ubin, m.lebar && g.ubinLebar]} styleTekan={g.ditekan}>
            <View style={[g.ikonBulat, { backgroundColor: c[`${m.w}Tipis`] }]}>
              <Ikon nama={m.ikon} ukuran={22} warna={c[m.w]} />
            </View>
            <View>
              <Text style={g.judul}>{m.judul}</Text>
              <Text style={g.ket}>{m.href === '/pesan' && baru ? `${baru} pesan baru` : m.ket}</Text>
            </View>
          </Tautan>
        ))}
      </View>
      <Kartu style={{ gap: 10 }}>
        <Teks jenis="bagian" level={2}>Tampilan</Teks>
        <Segmen
          label="Mode tampilan"
          nilai={tema}
          onUbah={(v) => ubah((s) => ({ ...s, tema: v }))}
          pilihan={[{ nilai: 'otomatis', judul: 'Ikuti sistem' }, { nilai: 'terang', judul: 'Terang' }, { nilai: 'gelap', judul: 'Gelap' }]}
        />
        <Teks jenis="kecil">Mode gelap memakai papan tulis malam: teks kapur di atas hijau tua.</Teks>
      </Kartu>
      <Kartu style={{ gap: 12 }}>
        <View style={g.tentang}>
          <Logo ukuran={44} />
          <View style={{ flex: 1, gap: 4 }}>
            <Teks jenis="bagian" level={2}>Tentang demo ini</Teks>
            <Teks jenis="kecil">{`${APP.nama} adalah aplikasi contoh buatan PintuWeb. ${SEKOLAH.nama}, siswa, guru, nilai, dan tagihan di sini rekaan. Semua data disimulasikan dan hanya tersimpan di perangkat ini.`}</Teks>
          </View>
        </View>
        <Tombol jenis="pensil" ikon="luar" judul="Pesan aplikasi seperti ini" onPress={() => Linking.openURL(APP.kontak)} />
        {yakin ? (
          <View style={{ gap: 8 }}>
            <Teks jenis="tebal">Hapus pengajuan izin, pembayaran, pesan, dan paraf di demo ini?</Teks>
            <View style={g.konfirmasi}>
              <Tombol jenis="utama" judul="Ya, atur ulang" style={{ flex: 1 }} onPress={() => { aturUlang(); setYakin(false); setInfo('Data demo sudah diatur ulang.'); }} />
              <Tombol jenis="garis" judul="Batal" style={{ flex: 1 }} onPress={() => setYakin(false)} />
            </View>
          </View>
        ) : (
          <Tombol jenis="garis" ikon="hapus" judul="Atur ulang data demo" onPress={() => { setInfo(''); setYakin(true); }} />
        )}
        {info ? <Teks jenis="kecil" aria-live="polite">{info}</Teks> : null}
      </Kartu>
    </Layar>
  );
}
