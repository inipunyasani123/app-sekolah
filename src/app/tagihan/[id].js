import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Layar from '@/components/Layar';
import { Teks, Kartu, Kerangka, Tombol, Lencana } from '@/components/Dasar';
import { Stempel } from '@/components/Kertas';
import Ikon from '@/components/Ikon';
import { Svg, Path, Rect } from '@/components/svg';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { useToko, ubah } from '@/lib/toko';
import { SEKOLAH, kelasAnak } from '@/lib/data';
import { fmtTanggal, rupiah, hariIni, fmtJamDariMs } from '@/lib/waktu';
import { tagihan, SEMUA_ID_TAGIHAN, nomorVA, nomorBukti } from '@/lib/bangkit';
import { QR_BAYAR } from '@/lib/qr-bayar';
import { bagikanTeks, salinTeks } from '@/lib/bagikan';
import { getar } from '@/lib/getar';

export function generateStaticParams() {
  return SEMUA_ID_TAGIHAN.map((id) => ({ id }));
}

export function generateMetadata(_req, params) {
  const id = params?.id || '';
  const nama = id.startsWith('spp') ? 'SPP Bulanan' : id === 'buku' ? 'Buku Pendamping' : 'Iuran Kegiatan';
  return meta(
    `/tagihan/${id}`,
    `Bayar ${nama}: QRIS, Transfer, Bukti | Kapur`,
    `Rincian tagihan ${nama.toLowerCase()}, simulasi pembayaran lewat QRIS atau transfer virtual account, dan bukti bayar yang bisa dibagikan di demo Kapur.`,
    { noindex: true },
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  baris: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 7 },
  kunci: { ...berat(500), fontSize: 13.5, lineHeight: 19, color: c.tinta2 },
  nilai: { ...berat(700), fontSize: 13.5, lineHeight: 19, color: c.tinta, flexShrink: 1, textAlign: 'right' },
  nominal: { fontFamily: F.serif, fontSize: 36, lineHeight: 42, color: c.tinta, fontVariant: ['tabular-nums'] },
  metode: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: c.garis, backgroundColor: c.kartu, minHeight: 64 },
  metodeAktif: { borderColor: c.tombol, borderWidth: 2, backgroundColor: c.hijauTipis },
  bulat: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: c.garisKuat, alignItems: 'center', justifyContent: 'center' },
  bulatAktif: { borderColor: c.tombol },
  bulatIsi: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.tombol },
  metodeJudul: { ...berat(700), fontSize: 15, lineHeight: 20, color: c.tinta },
  metodeKet: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  qrBingkai: { alignSelf: 'center', padding: 14, backgroundColor: '#ffffff', borderRadius: 18, borderWidth: 1, borderColor: c.garis },
  hitung: { ...berat(800), fontSize: 15, color: c.merah, textAlign: 'center', fontVariant: ['tabular-nums'] },
  va: { fontFamily: F.serif, fontSize: 24, lineHeight: 30, color: c.tinta, letterSpacing: 1 },
  langkah: { flexDirection: 'row', gap: 10 },
  langkahNo: { width: 24, height: 24, borderRadius: 12, backgroundColor: c.kartu2, alignItems: 'center', justifyContent: 'center' },
  langkahNoTeks: { ...berat(800), fontSize: 13, color: c.tinta },
  struk: { backgroundColor: c.kartu, borderRadius: 18, borderWidth: 1, borderColor: c.garis, overflow: 'hidden' },
  strukAtas: { padding: 18, alignItems: 'center', gap: 6, backgroundColor: c.papan },
  strukJudul: { ...berat(800), fontSize: 13, letterSpacing: 0.6, color: c.kapur2 },
  strukNominal: { fontFamily: F.serif, fontSize: 34, lineHeight: 40, color: c.kapur, fontVariant: ['tabular-nums'] },
  sobek: { flexDirection: 'row', alignItems: 'center', height: 20 },
  lubang: { width: 20, height: 20, borderRadius: 10, backgroundColor: c.kertas },
  putus: { flex: 1, height: 0, borderTopWidth: 2, borderTopColor: c.garis, borderStyle: 'dashed' },
  strukIsi: { paddingHorizontal: 18, paddingBottom: 18, gap: 2 },
  catatan: { ...berat(600), fontSize: 13, lineHeight: 18, color: c.hijau },
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

function HitungMundur({ sampai }) {
  const g = useGaya();
  const [kini, setKini] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setKini(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const sisa = Math.max(0, Math.floor((sampai - kini) / 1000));
  const mm = String(Math.floor(sisa / 60)).padStart(2, '0');
  const ss = String(sisa % 60).padStart(2, '0');
  return <Text style={g.hitung}>{sisa ? `Selesaikan dalam ${mm}:${ss}` : 'Waktu habis, buat kode baru'}</Text>;
}

function Bukti({ t, anak, baru }) {
  const g = useGaya();
  const c = useWarna();
  const [pesan, setPesan] = useState('');
  const teks = `Bukti bayar ${t.judul} untuk ${anak.nama} (kelas ${kelasAnak(anak)}), ${SEKOLAH.nama}: ${rupiah(t.nominal)}, ${t.bayar.metode}, ${fmtTanggal(hariIni(t.bayar.ms))} ${fmtJamDariMs(t.bayar.ms)} WIB. No. ${t.bayar.nomor}. (Simulasi demo Kapur)`;
  return (
    <>
      <View style={g.struk}>
        <View style={g.strukAtas}>
          <Text style={g.strukJudul}>BUKTI PEMBAYARAN</Text>
          <Text style={g.strukNominal}>{rupiah(t.nominal)}</Text>
          <Lencana teks="Pembayaran berhasil" ikon="centang" warna={c.hijau} latar={c.hijauTipis} />
        </View>
        <View style={g.sobek} aria-hidden>
          <View style={[g.lubang, { marginLeft: -10 }]} />
          <View style={g.putus} />
          <View style={[g.lubang, { marginRight: -10 }]} />
        </View>
        <View style={g.strukIsi}>
          <Baris k="Untuk" v={t.judul} />
          <Baris k="Siswa" v={`${anak.nama} · ${kelasAnak(anak)}`} />
          <Baris k="NIS" v={anak.nis} />
          <Baris k="Waktu" v={`${fmtTanggal(hariIni(t.bayar.ms), { pendek: true })}, ${fmtJamDariMs(t.bayar.ms)} WIB`} />
          <Baris k="Metode" v={t.bayar.metode} />
          <Baris k="Nomor bukti" v={t.bayar.nomor} />
          <Baris k="Penerima" v={SEKOLAH.nama} />
          <View style={{ alignItems: 'flex-end', marginTop: 6 }}>
            <Stempel teks="LUNAS" style={{ alignSelf: 'flex-end' }} animasi={baru} />
          </View>
        </View>
      </View>
      <Tombol jenis="garis" ikon="bagikan" judul="Bagikan bukti" onPress={async () => {
        const r = await bagikanTeks(teks, 'Bukti bayar Kapur');
        setPesan({ dibagikan: 'Bukti sudah dibagikan.', disalin: 'Teks bukti disalin ke papan klip.', batal: '', gagal: 'Perangkat ini tidak mendukung berbagi.' }[r]);
      }} />
      {pesan ? <Text style={g.catatan} aria-live="polite">{pesan}</Text> : null}
      <Tombol href="/tagihan" judul="Lihat tagihan lainnya" />
      <Tombol href="/" jenis="garis" ikon="rumah" judul="Kembali ke beranda" />
      <Teks jenis="kecil">Bukti ini contoh dari simulasi. Tidak ada transaksi sungguhan.</Teks>
    </>
  );
}

export default function DetailTagihan() {
  const g = useGaya();
  const c = useWarna();
  const { id } = useLocalSearchParams();
  const anak = useAnak();
  const h = useHari();
  const toko = useToko();
  const [metode, setMetode] = useState('qris');
  const [tahap, setTahap] = useState('pilih');
  const [batas, setBatas] = useState(0);
  const [pesanSalin, setPesanSalin] = useState('');
  const [baruLunas, setBaruLunas] = useState(false);
  const t = useMemo(() => (h ? tagihan(anak, h.hari, h.sem, toko.bayar).find((x) => x.id === id) : null), [anak, h, toko.bayar, id]);
  useEffect(() => setTahap('pilih'), [anak.id]);

  const lunasi = () => {
    setTahap('proses');
    setTimeout(() => {
      const ms = Date.now();
      const bayar = { ms, metode: metode === 'qris' ? 'QRIS' : 'Transfer virtual account', nomor: nomorBukti(anak, id, hariIni(ms)) };
      ubah((s) => ({ ...s, bayar: { ...s.bayar, [`${anak.id}:${id}`]: bayar } }));
      getar('sukses');
      setBaruLunas(true);
      setTahap('pilih');
    }, 1400);
  };

  const judul = t ? (t.status === 'lunas' ? 'Bukti pembayaran' : 'Bayar tagihan') : 'Tagihan';
  return (
    <Layar kepala={{ judul, sub: t ? t.judul : `${anak.panggil} · kelas ${kelasAnak(anak)}`, kembali: '/tagihan', anakTampil: !t || t.status === 'lunas' }}>
      {!h ? (
        <>
          <Kerangka tinggi={180} />
          <Kerangka tinggi={140} />
        </>
      ) : !t ? (
        <Kartu style={{ gap: 10 }}>
          <Teks jenis="tebal">{`Tagihan ini belum terbit untuk ${anak.panggil}.`}</Teks>
          <Teks jenis="kecil">SPP terbit setiap tanggal 16 untuk bulan berikutnya. Iuran kegiatan hanya untuk kelas tertentu.</Teks>
          <Tombol href="/tagihan" jenis="garis" judul="Lihat semua tagihan" />
        </Kartu>
      ) : t.status === 'lunas' ? (
        <Bukti t={t} anak={anak} baru={baruLunas} />
      ) : tahap === 'pilih' ? (
        <>
          <Kartu style={{ gap: 2 }}>
            <Teks jenis="label">{`${anak.nama.toUpperCase()} · KELAS ${kelasAnak(anak)}`}</Teks>
            <Text style={g.nominal}>{rupiah(t.nominal)}</Text>
            <Teks jenis="kecil">{t.rincian}</Teks>
            <View style={{ marginTop: 8 }}>
              <Baris k="Terbit" v={fmtTanggal(t.terbit, { tahun: false })} />
              <Baris k="Jatuh tempo" v={fmtTanggal(t.jatuhTempo, { tahun: false })} />
              <Baris k="Biaya layanan" v="Rp0" />
            </View>
          </Kartu>
          <Teks jenis="bagian" level={2} nativeID="lbl-metode">Pilih cara bayar</Teks>
          <View role="radiogroup" aria-labelledby="lbl-metode" style={{ gap: 10 }}>
            {[
              { v: 'qris', judul: 'QRIS', ket: 'Pindai dari aplikasi bank atau dompet digital', ikon: 'qr' },
              { v: 'va', judul: 'Transfer virtual account', ket: 'Transfer dari m-banking atau ATM', ikon: 'bank' },
            ].map((m) => (
              <Pressable key={m.v} role="radio" aria-checked={metode === m.v} onPress={() => setMetode(m.v)} style={[g.metode, metode === m.v && g.metodeAktif]}>
                <View style={[g.bulat, metode === m.v && g.bulatAktif]}>{metode === m.v ? <View style={g.bulatIsi} /> : null}</View>
                <View style={{ flex: 1 }}>
                  <Text style={g.metodeJudul}>{m.judul}</Text>
                  <Text style={g.metodeKet}>{m.ket}</Text>
                </View>
                <Ikon nama={m.ikon} ukuran={24} warna={c.papan2} />
              </Pressable>
            ))}
          </View>
          <Tombol jenis="pensil" judul={`Lanjut bayar ${rupiah(t.nominal)}`} onPress={() => { setBatas(Date.now() + 15 * 60000); setTahap('bayar'); }} />
          <Teks jenis="kecil">Simulasi: tidak ada uang yang berpindah.</Teks>
        </>
      ) : tahap === 'bayar' ? (
        metode === 'qris' ? (
          <>
            <Kartu style={{ gap: 10, alignItems: 'center' }}>
              <Teks jenis="bagian" level={2}>Pindai kode QR</Teks>
              <View style={g.qrBingkai}>
                <Svg width={200} height={200} viewBox={`0 0 ${QR_BAYAR.ukuran} ${QR_BAYAR.ukuran}`} accessibilityLabel="Kode QR simulasi pembayaran, bukan QRIS sungguhan">
                  <Rect x={0} y={0} width={QR_BAYAR.ukuran} height={QR_BAYAR.ukuran} fill="#ffffff" />
                  <Path d={QR_BAYAR.d} fill="#1c2621" />
                </Svg>
              </View>
              <Text style={g.nominal}>{rupiah(t.nominal)}</Text>
              <HitungMundur sampai={batas} />
              <Teks jenis="kecil" style={{ textAlign: 'center' }}>Kode QR ini hanya berisi teks simulasi. Memindainya tidak memulai pembayaran apa pun.</Teks>
            </Kartu>
            <Tombol jenis="utama" ikon="centang" judul="Simulasikan pembayaran berhasil" onPress={lunasi} />
            <Tombol jenis="garis" judul="Ganti cara bayar" onPress={() => setTahap('pilih')} />
          </>
        ) : (
          <>
            <Kartu style={{ gap: 10 }}>
              <Teks jenis="label">NOMOR VIRTUAL ACCOUNT (CONTOH)</Teks>
              <Text style={g.va} selectable>{nomorVA(anak, id)}</Text>
              <Tombol jenis="garis" ikon="salin" judul="Salin nomor" onPress={async () => {
                const r = await salinTeks(nomorVA(anak, id).replace(/\s/g, ''));
                setPesanSalin(r === 'disalin' ? 'Nomor disalin.' : r === 'dibagikan' ? 'Nomor dibagikan.' : 'Salin manual: tekan lama pada nomor.');
              }} />
              {pesanSalin ? <Text style={g.catatan} aria-live="polite">{pesanSalin}</Text> : null}
              <Baris k="Nominal tepat" v={rupiah(t.nominal)} />
              <HitungMundur sampai={batas} />
            </Kartu>
            <Kartu style={{ gap: 10 }}>
              <Teks jenis="bagian" level={2}>Cara transfer</Teks>
              {['Buka m-banking atau ATM, pilih transfer ke virtual account.', 'Masukkan nomor di atas, cek nama penerima SD Rindang Jati.', 'Masukkan nominal tepat, lalu konfirmasi.'].map((l, i) => (
                <View key={l} style={g.langkah}>
                  <View style={g.langkahNo}><Text style={g.langkahNoTeks}>{i + 1}</Text></View>
                  <Teks style={{ flex: 1 }}>{l}</Teks>
                </View>
              ))}
              <Teks jenis="kecil">Nomor contoh untuk simulasi, tidak terhubung ke bank mana pun.</Teks>
            </Kartu>
            <Tombol jenis="utama" ikon="centang" judul="Simulasikan transfer berhasil" onPress={lunasi} />
            <Tombol jenis="garis" judul="Ganti cara bayar" onPress={() => setTahap('pilih')} />
          </>
        )
      ) : (
        <Kartu style={{ alignItems: 'center', gap: 8, paddingVertical: 28 }}>
          <Ikon nama="jam" ukuran={36} warna={c.papan2} />
          <Teks jenis="tebal" aria-live="polite">Memeriksa pembayaran…</Teks>
          <Teks jenis="kecil">Simulasi konfirmasi dari bank.</Teks>
        </Kartu>
      )}
    </Layar>
  );
}
