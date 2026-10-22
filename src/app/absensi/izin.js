import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Kartu, Kerangka, Tombol, Segmen, Chip, Lencana } from '@/components/Dasar';
import { KertasGaris } from '@/components/Kertas';
import Ikon from '@/components/Ikon';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { ubah } from '@/lib/toko';
import { GURU, ORTU, kelasAnak } from '@/lib/data';
import { fmtTanggal, tambahHari, menitSekarang, jamKeMenit, HARI_PENDEK, hariKe, pecah, relatifHari } from '@/lib/waktu';
import { hariSekolahBerikut, tanggalIzin, jamPulang } from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/absensi/izin',
    'Ajukan Izin atau Sakit ke Wali Kelas | Kapur',
    'Formulir izin dan sakit untuk orang tua: pilih tanggal, lama, alasan, dan lampiran surat dokter. Simulasi di demo aplikasi Kapur.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  label: { ...berat(700), fontSize: 14, lineHeight: 19, color: c.tinta, marginBottom: 8 },
  baris: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  input: { minHeight: 110, borderWidth: 1.5, borderColor: c.garisKuat, borderRadius: 14, padding: 12, ...berat(500), fontSize: 15, lineHeight: 22, color: c.tinta, backgroundColor: c.kartu, textAlignVertical: 'top' },
  inputSalah: { borderColor: c.merah },
  salah: { ...berat(600), fontSize: 13, lineHeight: 18, color: c.merah, marginTop: 6 },
  cek: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: c.garis, backgroundColor: c.kartu },
  kotak: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: c.garisKuat, alignItems: 'center', justifyContent: 'center' },
  kotakAktif: { backgroundColor: c.tombol, borderColor: c.tombol },
  cekTeks: { ...berat(600), fontSize: 14.5, lineHeight: 20, color: c.tinta, flex: 1 },
  surat: { fontFamily: F.tulis, fontSize: 14.5, lineHeight: 28, color: c.biru },
  ditekan: { opacity: 0.85 },
  hitung: { ...berat(500), fontSize: 12.5, color: c.tinta2, marginTop: 4, textAlign: 'right' },
}));

export default function Izin() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  const h = useHari();
  const [jenis, setJenis] = useState('sakit');
  const [mulai, setMulai] = useState(null);
  const [lama, setLama] = useState(1);
  const [alasan, setAlasan] = useState('');
  const [lampiran, setLampiran] = useState(false);
  const [coba, setCoba] = useState(false);
  const [terkirim, setTerkirim] = useState(null);
  const wali = GURU[anak.wali];

  const pilihan = useMemo(() => {
    if (!h || h.sem.libur) return [];
    const hasil = [];
    // Hari ini hanya bisa dipilih sebelum jam pulang sekolah.
    const pulang = jamPulang(anak, h.hari);
    const mulaiDari = pulang && menitSekarang(h.ms) < jamKeMenit(pulang) ? h.hari : tambahHari(h.hari, 1);
    let d = hariSekolahBerikut(mulaiDari, h.sem);
    while (d && hasil.length < 5) {
      hasil.push(d);
      d = hariSekolahBerikut(tambahHari(d, 1), h.sem);
    }
    return hasil;
  }, [h, anak]);
  const tanggal = mulai && pilihan.includes(mulai) ? mulai : pilihan[0];
  const alasanSalah = alasan.trim().length < 10;
  const lewatJam = h && tanggal === h.hari && menitSekarang(h.ms) >= 7 * 60;

  const kirim = () => {
    setCoba(true);
    if (alasanSalah || !tanggal) return;
    const izin = { id: `iz-${Date.now()}`, anak: anak.id, jenis, mulai: tanggal, lama, alasan: alasan.trim(), lampiran, dibuat: Date.now() };
    ubah((s) => ({ ...s, izin: [...s.izin, izin] }));
    setTerkirim(izin);
  };

  if (terkirim && h) {
    const tgl = tanggalIzin(terkirim, h.sem);
    return (
      <Layar kepala={{ judul: 'Pengajuan terkirim', sub: `${anak.panggil} · kelas ${kelasAnak(anak)}`, kembali: '/absensi' }}>
        <KertasGaris baris={10}>
          <Text style={g.surat}>{`Yth. ${wali.panggil},`}</Text>
          <Text style={g.surat}>{`${anak.panggil} ${terkirim.jenis === 'sakit' ? 'sakit' : 'izin'} ${tgl.length > 1 ? `${tgl.length} hari` : ''} mulai ${fmtTanggal(terkirim.mulai, { tahun: false })}.`}</Text>
          <Text style={g.surat}>{terkirim.alasan}</Text>
          <Text style={g.surat}>{`Hormat saya, ${ORTU.nama.split(' ')[0]}`}</Text>
        </KertasGaris>
        <Kartu style={{ gap: 8 }}>
          <Lencana teks="Menunggu wali kelas" ikon="jam" warna={c.biru} latar={c.biruTipis} />
          <Teks>{`${wali.panggil} akan menerima pemberitahuan. Dalam demo ini, persetujuan disimulasikan beberapa detik setelah pengajuan dan tampil di halaman Absensi.`}</Teks>
        </Kartu>
        <Tombol href="/absensi" judul="Lihat di Absensi" />
        <Tombol jenis="garis" judul="Ajukan lagi" onPress={() => { setTerkirim(null); setAlasan(''); setCoba(false); setLampiran(false); }} />
      </Layar>
    );
  }

  return (
    <Layar kepala={{ judul: 'Ajukan izin atau sakit', sub: `Untuk ${anak.panggil} · dikirim ke ${wali.panggil}`, kembali: '/absensi' }}>
      {!h ? (
        <>
          <Kerangka tinggi={46} />
          <Kerangka tinggi={90} />
          <Kerangka tinggi={140} />
        </>
      ) : h.sem.libur ? (
        <Kartu><Teks>Sedang libur semester, belum ada hari sekolah yang bisa diajukan izin.</Teks></Kartu>
      ) : (
        <>
          <View>
            <Text style={g.label} nativeID="lbl-jenis">Jenis</Text>
            <Segmen label="Jenis pengajuan" nilai={jenis} onUbah={setJenis} pilihan={[{ nilai: 'sakit', judul: 'Sakit' }, { nilai: 'izin', judul: 'Izin keperluan' }]} />
          </View>
          <View>
            <Text style={g.label}>Mulai tanggal</Text>
            <View style={g.baris} role="radiogroup" aria-label="Mulai tanggal">
              {pilihan.map((d) => (
                <Chip
                  key={d}
                  peran="radio"
                  aria-checked={d === tanggal}
                  aktif={d === tanggal}
                  judul={`${HARI_PENDEK[hariKe(d)]} ${pecah(d).d}`}
                  label={`${HARI_PENDEK[hariKe(d)]} ${pecah(d).d}, ${relatifHari(d, h.hari)}, ${fmtTanggal(d, { tahun: false })}`}
                  onPress={() => setMulai(d)}
                />
              ))}
            </View>
            {lewatJam ? <Teks jenis="kecil" style={{ marginTop: 6 }}>Sudah lewat pukul 07.00 WIB. Pengajuan untuk hari ini tetap dikirim, wali kelas akan mengonfirmasi.</Teks> : null}
          </View>
          <View>
            <Text style={g.label}>Lama</Text>
            <View style={g.baris} role="radiogroup" aria-label="Lama izin">
              {[1, 2, 3].map((n) => (
                <Chip key={n} peran="radio" aria-checked={lama === n} aktif={lama === n} judul={`${n} hari`} onPress={() => setLama(n)} />
              ))}
            </View>
          </View>
          <View>
            <Text style={g.label} nativeID="lbl-alasan">Alasan</Text>
            <TextInput
              aria-labelledby="lbl-alasan"
              accessibilityLabel="Alasan"
              multiline
              value={alasan}
              onChangeText={setAlasan}
              maxLength={240}
              placeholder={jenis === 'sakit' ? 'Contoh: demam sejak semalam, sudah diperiksa dokter' : 'Contoh: menghadiri pernikahan keluarga di luar kota'}
              placeholderTextColor={c.tinta2}
              style={[g.input, coba && alasanSalah && g.inputSalah]}
              aria-invalid={coba && alasanSalah}
              aria-describedby={coba && alasanSalah ? 'salah-alasan' : undefined}
            />
            <Text style={g.hitung}>{`${alasan.length}/240`}</Text>
            {coba && alasanSalah ? <Text style={g.salah} nativeID="salah-alasan" role="alert">Tulis alasan minimal 10 huruf supaya wali kelas paham.</Text> : null}
          </View>
          <Pressable role="checkbox" aria-checked={lampiran} onPress={() => setLampiran(!lampiran)} style={({ pressed }) => [g.cek, pressed && g.ditekan]}>
            <View style={[g.kotak, lampiran && g.kotakAktif]}>{lampiran ? <Ikon nama="centang" ukuran={16} warna={c.kapur} tebal={2.6} /> : null}</View>
            <Text style={g.cekTeks}>{jenis === 'sakit' ? 'Lampirkan foto surat dokter (simulasi)' : 'Lampirkan surat keterangan (simulasi)'}</Text>
            <Ikon nama="lampiran" ukuran={20} warna={c.tinta2} />
          </Pressable>
          <Tombol jenis="utama" ikon="kirim" judul={`Kirim ke ${wali.panggil}`} onPress={kirim} />
          <Teks jenis="kecil">Data hanya tersimpan di perangkat ini. Tidak ada yang benar-benar dikirim ke sekolah.</Teks>
        </>
      )}
    </Layar>
  );
}
