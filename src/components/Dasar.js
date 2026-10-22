import { forwardRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { F, berat } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import Ikon from './Ikon';

/**
 * Tautan blok: Link + Pressable. Link asChild menggabungkan gaya sebagai objek (Slot),
 * jadi gaya harus diratakan dulu dan tidak boleh berbentuk fungsi; efek tekan memakai state sendiri.
 */
export function Tautan({ href, style, styleTekan, children, ...p }) {
  const [tekan, setTekan] = useState(false);
  return (
    <Link href={href} asChild>
      <Pressable {...p} onPressIn={() => setTekan(true)} onPressOut={() => setTekan(false)} style={StyleSheet.flatten([style, tekan && (styleTekan || TEKAN)])}>
        {children}
      </Pressable>
    </Link>
  );
}

const TEKAN = { opacity: 0.82 };

const useGayaTeks = buatGaya((c) => StyleSheet.create({
  judul: { fontFamily: F.serif, fontSize: 28, lineHeight: 34, color: c.tinta },
  subjudul: { fontFamily: F.serif, fontSize: 20, lineHeight: 26, color: c.tinta },
  bagian: { fontFamily: F.serif, fontSize: 18, lineHeight: 24, color: c.tinta },
  angka: { fontFamily: F.serif, fontSize: 40, lineHeight: 44, color: c.tinta },
  isi: { ...berat(400), fontSize: 15, lineHeight: 22, color: c.tinta },
  tebal: { ...berat(700), fontSize: 15, lineHeight: 21, color: c.tinta },
  kecil: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  label: { ...berat(700), fontSize: 12, lineHeight: 16, letterSpacing: 0.4, color: c.tinta2 },
  tulis: { fontFamily: F.tulis, fontSize: 15, lineHeight: 28, color: c.biru },
}));

export function Teks({ jenis = 'isi', style, level, children, ...p }) {
  const g = useGayaTeks();
  const peran = level ? { role: 'heading', 'aria-level': level } : null;
  return (
    <Text {...peran} {...p} style={[g[jenis], style]}>
      {children}
    </Text>
  );
}

const useGayaUmum = buatGaya((c) => StyleSheet.create({
  kartu: { backgroundColor: c.kartu, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: c.garis },
  tombol: { minHeight: 46, borderRadius: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  utama: { backgroundColor: c.tombol },
  utamaTeks: { color: c.kapur },
  pensil: { backgroundColor: c.pensil },
  pensilTeks: { color: c.pensilTeks },
  garis: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: c.garisKuat },
  garisTeks: { color: c.tinta },
  tombolTeks: { ...berat(700), fontSize: 15 },
  ditekan: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  mati: { opacity: 0.5 },
  chip: { minHeight: 36, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5, borderColor: c.garis, backgroundColor: c.kartu, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  chipAktif: { backgroundColor: c.tombol, borderColor: c.tombol },
  chipTeks: { ...berat(600), fontSize: 14, color: c.tinta },
  chipTeksAktif: { color: c.kapur },
  segmen: { flexDirection: 'row', backgroundColor: c.kartu2, borderRadius: 14, padding: 4, gap: 4 },
  segmenItem: { flex: 1, minHeight: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  segmenAktif: { backgroundColor: c.kartu, boxShadow: `0 1px 3px ${c.bayang}` },
  segmenTeks: { ...berat(600), fontSize: 14, color: c.tinta2 },
  segmenTeksAktif: { color: c.tinta },
  kerangka: { backgroundColor: c.kartu2, borderRadius: 14 },
  lencana: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5 },
  lencanaTeks: { ...berat(700), fontSize: 12, lineHeight: 16 },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingVertical: 10 },
  pemisah: { height: 1, backgroundColor: c.garis },
}));

export function useGayaDasar() {
  return useGayaUmum();
}

export function Kartu({ style, children, ...p }) {
  const g = useGayaUmum();
  return (
    <View {...p} style={[g.kartu, style]}>
      {children}
    </View>
  );
}

export const Tombol = forwardRef(function Tombol({ jenis = 'utama', ikon, judul, onPress, href, mati, style, label, ...p }, ref) {
  const g = useGayaUmum();
  const c = useWarna();
  const warnaTeks = g[`${jenis}Teks`] || g.utamaTeks;
  const isi = (
    <>
      {ikon ? <Ikon nama={ikon} ukuran={20} warna={warnaTeks.color} /> : null}
      <Text style={[g.tombolTeks, warnaTeks]}>{judul}</Text>
    </>
  );
  const gaya = ({ pressed }) => [g.tombol, g[jenis], pressed && g.ditekan, mati && g.mati, style];
  if (href) {
    return (
      <Tautan href={href} aria-label={label} style={[g.tombol, g[jenis], style]} styleTekan={g.ditekan} {...p}>
        {isi}
      </Tautan>
    );
  }
  return (
    <Pressable ref={ref} role="button" aria-label={label} aria-disabled={mati || undefined} disabled={mati} onPress={onPress} style={gaya} {...p}>
      {isi}
    </Pressable>
  );
});

export function Chip({ aktif, judul, onPress, ikon, label, peran = 'button', ...p }) {
  const g = useGayaUmum();
  return (
    <Pressable
      role={peran}
      aria-pressed={peran === 'button' ? !!aktif : undefined}
      aria-selected={peran === 'tab' ? !!aktif : undefined}
      aria-label={label}
      onPress={onPress}
      style={({ pressed }) => [g.chip, aktif && g.chipAktif, pressed && g.ditekan]}
      {...p}
    >
      {ikon}
      <Text style={[g.chipTeks, aktif && g.chipTeksAktif]}>{judul}</Text>
    </Pressable>
  );
}

export function Segmen({ pilihan, nilai, onUbah, label }) {
  const g = useGayaUmum();
  return (
    <View role="tablist" aria-label={label} style={g.segmen}>
      {pilihan.map((p) => {
        const aktif = p.nilai === nilai;
        return (
          <Pressable
            key={p.nilai}
            role="tab"
            aria-selected={aktif}
            onPress={() => onUbah(p.nilai)}
            style={({ pressed }) => [g.segmenItem, aktif && g.segmenAktif, pressed && g.ditekan]}
          >
            <Text style={[g.segmenTeks, aktif && g.segmenTeksAktif]}>{p.judul}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Kerangka({ tinggi = 80, style }) {
  const g = useGayaUmum();
  return <View aria-hidden style={[g.kerangka, { height: tinggi }, style]} />;
}

export function Lencana({ teks, warna, latar, ikon }) {
  const g = useGayaUmum();
  return (
    <View style={[g.lencana, { backgroundColor: latar }]}>
      {ikon ? <Ikon nama={ikon} ukuran={13} warna={warna} tebal={2.4} /> : null}
      <Text style={[g.lencanaTeks, { color: warna }]}>{teks}</Text>
    </View>
  );
}

export function Pemisah({ style }) {
  const g = useGayaUmum();
  return <View style={[g.pemisah, style]} />;
}

/** Baris tautan dalam kartu: ikon di kiri, teks, panah di kanan. */
export function BarisTautan({ href, ikon, judul, keterangan, kanan, warnaIkon }) {
  const g = useGayaUmum();
  const c = useWarna();
  return (
    <Tautan href={href} style={g.baris} styleTekan={g.ditekan}>
      {ikon ? <Ikon nama={ikon} ukuran={22} warna={warnaIkon || c.papan2} /> : null}
      <View style={{ flex: 1 }}>
        <Teks jenis="tebal">{judul}</Teks>
        {keterangan ? <Teks jenis="kecil">{keterangan}</Teks> : null}
      </View>
      {kanan}
      <Ikon nama="kanan" ukuran={18} warna={c.tinta2} />
    </Tautan>
  );
}

export const STATUS_ABSEN = {
  H: { teks: 'Hadir', kunci: 'hijau' },
  S: { teks: 'Sakit', kunci: 'merah' },
  I: { teks: 'Izin', kunci: 'kuning' },
  A: { teks: 'Alpa', kunci: 'tinta2' },
  belum: { teks: 'Belum tercatat', kunci: 'biru' },
};

export function warnaStatus(c, kunci) {
  return { warna: c[kunci], latar: c[`${kunci}Tipis`] || c.kartu2 };
}
