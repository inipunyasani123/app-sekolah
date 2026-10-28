import { Image } from 'react-native';

// Foto asli (CC0/PD) untuk objek: benda, tempat, dan kegiatan sekolah. Sumber di assets/foto/SUMBER.md.
// Murid, guru, dan orang tua tetap ilustrasi tanpa wajah (components/Avatar.js).
const FOTO = {
  buku: require('../../assets/foto/buku.jpg'),
  pertemuan: require('../../assets/foto/pertemuan.jpg'),
  gigi: require('../../assets/foto/gigi.jpg'),
  bibit: require('../../assets/foto/bibit.jpg'),
  sas: require('../../assets/foto/sas.jpg'),
  kantin: require('../../assets/foto/kantin.jpg'),
  libur: require('../../assets/foto/libur.jpg'),
  'jadwal-libur': require('../../assets/foto/jadwal-libur.jpg'),
  'tugas-kosong': require('../../assets/foto/tugas-kosong.jpg'),
  'nilai-kosong': require('../../assets/foto/nilai-kosong.jpg'),
  sekolah: require('../../assets/foto/sekolah.jpg'),
  bus: require('../../assets/foto/bus.jpg'),
};

export default function Foto({ jenis, tinggi = 180, label, style }) {
  return (
    <Image
      source={FOTO[jenis]}
      resizeMode="cover"
      accessibilityLabel={label}
      aria-hidden={label ? undefined : true}
      style={[{ width: '100%', height: tinggi }, style]}
    />
  );
}

/** Foto bus antar-jemput sekolah (kartu antar-jemput di beranda). */
export function Bus({ lebar = 96, label }) {
  return (
    <Image
      source={FOTO.bus}
      resizeMode="cover"
      accessibilityLabel={label}
      aria-hidden={label ? undefined : true}
      style={{ width: lebar, height: Math.round(lebar * 0.73), borderRadius: 10 }}
    />
  );
}
