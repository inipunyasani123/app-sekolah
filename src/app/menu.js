import { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Kartu, Segmen, Tautan, Tombol } from '@/components/Dasar';
import Ikon from '@/components/Ikon';
import { Logo } from '@/components/Avatar';
import { berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, usePerhatian } from '@/lib/pakai';
import { useToko, ubah, aturUlang } from '@/lib/toko';
import { APP, SEKOLAH } from '@/lib/data';
import { namaRute } from '@/lib/rute';

export function generateMetadata() {
  return meta(
    '/menu',
    'Lainnya: Absensi, Tagihan, Kabar, Pesan | Kapur',
    'Semua fitur Kapur di satu tempat: absensi, tagihan SPP, kabar sekolah, kalender, pesan wali kelas, rapor, profil anak, dan mode gelap.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  ubin: { width: '47.5%', flexGrow: 1, minHeight: 104, borderRadius: 20, padding: 14, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, gap: 8, justifyContent: 'space-between' },
  ubinPerlu: { borderColor: c.pensil, borderWidth: 2 },
  ubinLebar: { width: '100%' },
  atas: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  ikonBulat: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  lencana: { minWidth: 26, height: 26, borderRadius: 13, paddingHorizontal: 7, backgroundColor: c.pensil, alignItems: 'center', justifyContent: 'center' },
  lencanaTeks: { ...berat(800), fontSize: 13, lineHeight: 16, color: c.pensilTeks, fontVariant: ['tabular-nums'] },
  judul: { ...berat(700), fontSize: 15, lineHeight: 20, color: c.tinta },
  ket: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  ditekan: { opacity: 0.85 },
  terakhir: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pilTerakhir: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis },
  pilTeks: { ...berat(600), fontSize: 14, color: c.tinta },
  tentang: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  konfirmasi: { flexDirection: 'row', gap: 8 },
}));

export default function Lainnya() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  const { tema, terakhir } = useToko();
  const p = usePerhatian(anak);
  const [yakin, setYakin] = useState(false);
  const [info, setInfo] = useState('');
  const MENU = [
    { href: '/absensi', judul: 'Absensi', ket: 'Kehadiran dan izin', ikon: 'absen', w: 'hijau' },
    { href: '/tagihan', judul: 'Tagihan SPP', ket: p.tagihan ? `${p.tagihan} belum dibayar` : 'Bayar dan bukti', ikon: 'dompet', w: 'kuning', n: p.tagihan, label: `Tagihan SPP, ${p.tagihan} belum dibayar` },
    { href: '/pesan', judul: 'Pesan', ket: p.pesan ? `${p.pesan} pesan baru` : 'Wali kelas', ikon: 'pesan', w: 'biru', n: p.pesan, label: `Pesan, ${p.pesan} belum dibaca` },
    { href: '/kabar', judul: 'Kabar sekolah', ket: p.kabar ? `${p.kabar} kabar baru` : 'Pengumuman', ikon: 'kabar', w: 'merah', n: p.kabar, label: `Kabar sekolah, ${p.kabar} belum dibaca` },
    { href: '/kabar?tab=kalender', judul: 'Kalender', ket: 'Agenda akademik', ikon: 'jadwal', w: 'biru' },
    { href: '/nilai/rapor', judul: 'Rapor', ket: 'Semester lalu', ikon: 'buku', w: 'merah' },
    { href: '/profil', judul: 'Profil anak', ket: 'Data, kesehatan, jemputan', ikon: 'profil', w: 'hijau', lebar: true },
  ];
  const riwayat = (terakhir || []).map((r) => ({ r, n: namaRute(r) })).filter((x) => x.n).slice(0, 3);
  return (
    <Layar kepala={{ judul: 'Lainnya', sub: `Semua fitur untuk ${anak.panggil}` }}>
      {riwayat.length ? (
        <View style={{ gap: 8 }}>
          <Teks jenis="label" level={2}>TERAKHIR DIBUKA</Teks>
          <View style={g.terakhir}>
            {riwayat.map(({ r, n }) => (
              <Tautan key={r} href={r} style={g.pilTerakhir} styleTekan={g.ditekan}>
                <Ikon nama={n[2]} ukuran={16} warna={c.tinta2} />
                <Text style={g.pilTeks}>{n[1]}</Text>
              </Tautan>
            ))}
          </View>
        </View>
      ) : null}
      <View style={g.grid}>
        {MENU.map((m) => (
          <Tautan key={m.href} href={m.href} style={[g.ubin, m.lebar && g.ubinLebar, m.n ? g.ubinPerlu : null]} styleTekan={g.ditekan}>
            <View style={g.atas}>
              <View style={[g.ikonBulat, { backgroundColor: c[`${m.w}Tipis`] }]}>
                <Ikon nama={m.ikon} ukuran={22} warna={c[m.w]} />
              </View>
              {m.n ? (
                <View style={g.lencana} aria-hidden>
                  <Text style={g.lencanaTeks}>{m.n}</Text>
                </View>
              ) : null}
            </View>
            <View>
              <Text style={g.judul}>{m.judul}</Text>
              <Text style={g.ket}>{m.ket}</Text>
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
      <Kartu style={{ gap: 10 }}>
        <Teks jenis="bagian" level={2}>Bantuan</Teks>
        <Teks jenis="kecil">Pengenalan singkat: memilih anak, paraf buku penghubung, dan pembayaran simulasi.</Teks>
        <Tombol jenis="garis" ikon="info" judul="Putar ulang pengenalan" onPress={() => ubah((s) => ({ ...s, sambut: false }))} />
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
