import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layar from '@/components/Layar';
import { Teks, Kerangka, Tautan, Lencana } from '@/components/Dasar';
import { Stempel } from '@/components/Kertas';
import Ikon from '@/components/Ikon';
import { berat, F } from '@/lib/fonts';
import { buatGaya, useWarna } from '@/lib/pakai-tema';
import { meta } from '@/lib/seo';
import { useAnak, useHari } from '@/lib/pakai';
import { useToko } from '@/lib/toko';
import { kelasAnak } from '@/lib/data';
import { fmtTanggal, rupiah, relatifHari, hariIni, fmtJamDariMs } from '@/lib/waktu';
import { tagihan } from '@/lib/bangkit';

export function generateMetadata() {
  return meta(
    '/tagihan',
    'Tagihan SPP dan Riwayat Pembayaran | Kapur',
    'Tagihan SPP bulanan dan iuran kegiatan sekolah, status jatuh tempo, simulasi bayar QRIS atau transfer, serta bukti bayar di demo Kapur.',
  );
}

const useGaya = buatGaya((c) => StyleSheet.create({
  ringkas: { borderRadius: 22, backgroundColor: c.pensil, padding: 18, gap: 4 },
  ringkasLabel: { ...berat(800), fontSize: 13, lineHeight: 18, letterSpacing: 0.4, color: c.pensilTeks },
  ringkasAngka: { fontFamily: F.serif, fontSize: 38, lineHeight: 46, color: c.pensilTeks, fontVariant: ['tabular-nums'] },
  ringkasTeks: { ...berat(600), fontSize: 13.5, lineHeight: 19, color: c.pensilTeks },
  kartu: { borderRadius: 18, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, padding: 14, gap: 6 },
  atas: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  judul: { ...berat(700), fontSize: 15.5, lineHeight: 21, color: c.tinta, flex: 1 },
  nominal: { fontFamily: F.serif, fontSize: 20, lineHeight: 26, color: c.tinta, fontVariant: ['tabular-nums'] },
  ket: { ...berat(500), fontSize: 13, lineHeight: 18, color: c.tinta2 },
  bayar: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: c.tombol, borderRadius: 12, paddingHorizontal: 14, minHeight: 40, marginTop: 4 },
  bayarTeks: { ...berat(700), fontSize: 14, color: c.kapur },
  riwayat: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: c.kartu, borderWidth: 1, borderColor: c.garis, minHeight: 64 },
  ditekan: { opacity: 0.85 },
}));

export default function Tagihan() {
  const g = useGaya();
  const c = useWarna();
  const anak = useAnak();
  const h = useHari();
  const t = useToko();
  const daftar = useMemo(() => (h ? tagihan(anak, h.hari, h.sem, t.bayar) : []), [anak, h, t.bayar]);
  const belum = daftar.filter((x) => x.status === 'belum');
  const lunas = daftar.filter((x) => x.status === 'lunas');
  const total = belum.reduce((a, b) => a + b.nominal, 0);
  return (
    <Layar kepala={{ judul: 'Tagihan sekolah', sub: `${anak.panggil} · kelas ${kelasAnak(anak)}`, kembali: '/menu' }}>
      {!h ? (
        <>
          <Kerangka tinggi={130} />
          <Kerangka tinggi={110} />
          <Kerangka tinggi={64} />
          <Kerangka tinggi={64} />
        </>
      ) : (
        <>
          <View style={g.ringkas}>
            <Text style={g.ringkasLabel}>BELUM DIBAYAR</Text>
            <Text style={g.ringkasAngka}>{rupiah(total)}</Text>
            <Text style={g.ringkasTeks}>
              {belum.length ? `${belum.length} tagihan · terdekat jatuh tempo ${fmtTanggal(belum[0].jatuhTempo, { tahun: false })}` : 'Semua tagihan sudah lunas. Terima kasih.'}
            </Text>
          </View>
          {belum.length ? <Teks jenis="bagian" level={2}>Perlu dibayar</Teks> : null}
          {belum.map((x) => (
            <Tautan key={x.id} href={`/tagihan/${x.id}`} style={g.kartu} styleTekan={g.ditekan}>
              <View style={g.atas}>
                <Text style={g.judul}>{x.judul}</Text>
                <Text style={g.nominal}>{rupiah(x.nominal)}</Text>
              </View>
              <Text style={g.ket}>{`Jatuh tempo ${fmtTanggal(x.jatuhTempo, { tahun: false })} (${relatifHari(x.jatuhTempo, h.hari).toLowerCase()})`}</Text>
              <View style={g.bayar}>
                <Ikon nama="qr" ukuran={18} warna={c.kapur} />
                <Text style={g.bayarTeks}>Bayar</Text>
              </View>
            </Tautan>
          ))}
          <Teks jenis="bagian" level={2}>Riwayat pembayaran</Teks>
          {lunas.map((x) => (
            <Tautan key={x.id} href={`/tagihan/${x.id}`} style={g.riwayat} styleTekan={g.ditekan}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[g.judul, { fontSize: 14.5 }]}>{x.judul}</Text>
                <Text style={g.ket}>{`${rupiah(x.nominal)} · ${x.bayar.metode} · ${fmtTanggal(hariIni(x.bayar.ms), { hari: false, tahun: false })}, ${fmtJamDariMs(x.bayar.ms)}`}</Text>
                {x.demo ? <Lencana teks="Dibayar di demo ini" warna={c.biru} latar={c.biruTipis} /> : null}
              </View>
              <Stempel teks="LUNAS" miring={-8} skala={0.78} />
            </Tautan>
          ))}
          <Teks jenis="kecil">Pembayaran di Kapur adalah simulasi: tidak ada uang yang berpindah dan nomor rekening atau QR di sini bukan milik bank mana pun.</Teks>
        </>
      )}
    </Layar>
  );
}
