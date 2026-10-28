import { View, Text, StyleSheet } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Kartu, Tombol, Lencana, Pemisah } from '@/components/Dasar';
import Avatar from '@/components/Avatar';
import Foto from '@/components/Foto';
import { berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useToko, ubah } from '@/lib/toko';
import { ANAK, GURU, ORTU, SEKOLAH, kelasAnak } from '@/lib/data';

export function generateMetadata() {
  return meta(
    '/profil',
    'Profil Anak dan Data Sekolah | Kapur',
    'Profil tiap anak: kelas, wali kelas, ekstrakurikuler, catatan kesehatan, dan jemputan. Ganti anak aktif kapan saja di demo aplikasi Kapur.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  kepala: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  baris: { flexDirection: 'row', gap: 12, paddingVertical: 8 },
  kunci: { width: 110, ...berat(500), fontSize: 13.5, lineHeight: 19, color: c.tinta2 },
  nilai: { flex: 1, ...berat(600), fontSize: 13.5, lineHeight: 19, color: c.tinta },
  aktif: { borderColor: c.tombol, borderWidth: 2 },
}));

function Baris({ k, v }) {
  const g = useGaya();
  return (
    <View style={g.baris}>
      <Text style={g.kunci}>{k}</Text>
      <Text style={g.nilai}>{v}</Text>
    </View>
  );
}

export default function Profil() {
  const g = useGaya();
  const c = useWarna();
  const { anak: aktifId } = useToko();
  return (
    <Layar kepala={{ judul: 'Profil anak', sub: `Akun orang tua: ${ORTU.nama}`, kembali: '/menu' }}>
      {ANAK.map((a) => {
        const aktif = a.id === aktifId;
        return (
          <Kartu key={a.id} style={[{ gap: 6 }, aktif && g.aktif]}>
            <View style={g.kepala}>
              <Avatar siapa={a.id} ukuran={64} />
              <View style={{ flex: 1, gap: 4 }}>
                <Teks jenis="subjudul" level={2}>{a.nama}</Teks>
                <Teks jenis="kecil">{`Kelas ${kelasAnak(a)} · NIS ${a.nis}`}</Teks>
                {aktif ? <Lencana teks="Sedang dipilih" ikon="centang" warna={c.hijau} latar={c.hijauTipis} /> : null}
              </View>
            </View>
            <Pemisah style={{ marginVertical: 4 }} />
            <Baris k="Wali kelas" v={GURU[a.wali].nama} />
            <Baris k="Lahir" v={a.lahir} />
            <Baris k="Ekstrakurikuler" v={a.ekskul.join(', ')} />
            <Baris k="Kesehatan" v={a.kesehatan} />
            <Baris k="Jemputan" v={a.jemput} />
            <Baris k="Kartu gerbang" v={a.gerbang.replace('Kartu gerbang ', '')} />
            {!aktif ? <Tombol jenis="garis" ikon="ganti" judul={`Pilih ${a.panggil}`} onPress={() => ubah((s) => ({ ...s, anak: a.id }))} /> : null}
          </Kartu>
        );
      })}
      <Kartu style={{ gap: 2 }}>
        <Teks jenis="bagian" level={2}>Sekolah</Teks>
        <View style={{ borderRadius: 12, overflow: 'hidden', marginVertical: 6 }}>
          <Foto jenis="sekolah" tinggi={150} label="Foto gedung sekolah dan halaman" />
        </View>
        <Baris k="Nama" v={`${SEKOLAH.nama} (rekaan)`} />
        <Baris k="Alamat" v={`${SEKOLAH.alamat} (alamat rekaan)`} />
        <Baris k="Kepala sekolah" v={SEKOLAH.kepala} />
        <Baris k="Jam layanan" v={SEKOLAH.jamLayanan} />
      </Kartu>
    </Layar>
  );
}
