// Dokumen HTML akar untuk web (hanya berjalan di Node.js saat ekspor statis).
// Panel samping, bingkai ponsel, QR, dan bilah demo dirender di sini sebagai HTML statis,
// jadi tidak menambah JavaScript di peramban. React hanya menghidrasi #root di dalam bingkai.
import { useServerDocumentContext } from 'expo-router/html';
import QRCode from 'qrcode';
import { cssTema } from '@/lib/tema';
import { APP, SEKOLAH } from '@/lib/data';
import { jsonLd } from '@/lib/seo';

function jalurQR(teks) {
  const qr = QRCode.create(teks, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  let d = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (qr.modules.get(x, y)) d += `M${x + 4} ${y + 4}h1v1h-1z`;
    }
  }
  return { d, ukuran: n + 8 };
}

const BUTIR = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .055 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CSS = `
@font-face{font-family:"Young Serif";src:url(/fonts/young-serif.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"Plus Jakarta Sans";src:url(/fonts/plus-jakarta-sans.woff2) format("woff2");font-weight:400 800;font-style:normal;font-display:swap}
@font-face{font-family:"Playwrite ID";src:url(/fonts/playwrite-id.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"Young Serif Fallback";src:local("Georgia");size-adjust:104%;ascent-override:92%;descent-override:24%}
${cssTema()}
html,body{height:100%}
body{margin:0;display:flex;flex-direction:column;overflow:hidden;background:var(--k-papan);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%;text-size-adjust:100%;font-family:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.panggung{flex:1;min-height:0;display:flex}
.ponsel{flex:1;min-width:0;min-height:0;display:flex;position:relative}
.layar{flex:1;min-width:0;min-height:0;display:flex;position:relative;overflow:hidden;background:var(--k-kertas)}
#root{flex:1;display:flex;min-width:0;min-height:0}
#root>div{flex:1}
.panel,.kiri,.pulau{display:none}
html [data-aman-atas]{padding-top:env(safe-area-inset-top,0px)}
:focus-visible{outline:3px solid var(--k-fokus)!important;outline-offset:2px}
.panggung a:focus-visible{outline-color:#f2b632!important}
input:focus-visible,textarea:focus-visible{outline-offset:0}
::selection{background:#f2b632;color:#2b2209}
.bilah-demo{flex:none;display:block;margin:0;padding:5px 12px calc(5px + env(safe-area-inset-bottom,0px));background:#0f1b33;color:#dfe6f3;font:400 12px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-align:center}
.bilah-demo a{color:#fff;font-weight:600;text-decoration:underline;text-underline-offset:3px}
@media (min-width:768px){
  .bilah-demo{padding:9px 14px;font-size:13px;line-height:1.5}
  body{background-color:#1c4335;background-image:radial-gradient(1100px 520px at 12% 6%,rgba(245,240,228,.07),transparent 62%),radial-gradient(900px 460px at 88% 92%,rgba(245,240,228,.06),transparent 60%),radial-gradient(520px 180px at 64% 28%,rgba(245,240,228,.04),transparent 70%),${BUTIR}}
  .panggung{display:grid;grid-template-columns:auto minmax(0,350px);justify-content:center;align-content:safe center;align-items:safe center;gap:clamp(32px,5vw,72px);padding:24px 28px;overflow:auto}
  .ponsel{flex:none;width:390px;height:min(844px,calc(100dvh - 92px));min-height:560px;padding:11px;box-sizing:border-box;border-radius:58px;background:#0b0f0d;box-shadow:0 0 0 1.5px #2b332f,0 0 0 7px #121815,0 30px 60px -18px rgba(0,0,0,.6),0 12px 24px rgba(0,0,0,.25)}
  .ponsel::before,.ponsel::after{content:"";position:absolute;width:4px;border-radius:2px;background:#2b332f}
  .ponsel::before{left:-11px;top:160px;height:64px}
  .ponsel::after{right:-11px;top:200px;height:96px}
  .layar{border-radius:47px;isolation:isolate}
  .pulau{display:block;position:absolute;top:21px;left:50%;width:104px;height:30px;margin-left:-52px;border-radius:18px;background:#0b0f0d;z-index:60;pointer-events:none}
  html [data-aman-atas]{padding-top:34px}
  .panel{display:flex;flex-direction:column;gap:14px;color:#f5f0e4;max-width:350px}
  .p-label{margin:0;font:700 12px/1.4 "Plus Jakarta Sans",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#c9d8cd}
  .p-merek{margin:0;font:400 44px/1.32 "Playwrite ID","Segoe Print",cursive;color:#f5f0e4}
  .p-merek span{display:inline-block;width:46px;height:8px;margin-left:10px;border-radius:3px;background:#f2b632;transform:rotate(-14deg) translateY(-10px)}
  .p-sub{margin:10px 0 0;font:400 20px/1.3 "Young Serif","Young Serif Fallback",Georgia,serif;color:#f5f0e4}
  .p-sub small{display:block;margin-top:4px;font:500 13px/1.5 "Plus Jakarta Sans",system-ui,sans-serif;color:#c9d8cd}
  .p-isi{margin:0;font:400 15px/1.6 "Plus Jakarta Sans",system-ui,sans-serif;color:#e4ece6}
  .p-fitur{margin:0;padding:0;list-style:none;display:grid;gap:8px;counter-reset:f}
  .p-fitur li{counter-increment:f;display:grid;grid-template-columns:30px 1fr;gap:10px;align-items:baseline;font:600 14px/1.45 "Plus Jakarta Sans",system-ui,sans-serif;color:#f5f0e4;padding-bottom:8px;border-bottom:1px dashed rgba(245,240,228,.22)}
  .p-fitur li::before{content:counter(f) ".";font:400 19px/1 "Playwrite ID","Segoe Print",cursive;color:#f2b632}
  .p-bawah{display:flex;gap:18px;align-items:center}
  .p-qr{position:relative;margin:6px 0 0;flex:none;width:124px;padding:11px 11px 9px;background:#f7dc78;color:#2b2209;transform:rotate(-3deg);box-shadow:0 10px 18px -8px rgba(0,0,0,.55);border-radius:2px}
  .p-qr::before{content:"";position:absolute;top:-10px;left:50%;width:58px;height:20px;margin-left:-29px;background:rgba(245,240,228,.55);transform:rotate(4deg)}
  .p-qr svg{display:block;width:102px;height:102px;background:#fff;border-radius:2px}
  .p-qr figcaption{margin-top:7px;font:700 11.5px/1.3 "Plus Jakarta Sans",system-ui,sans-serif;text-align:center}
  .p-cta{display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 20px;border-radius:14px;background:#f2b632;color:#2b2209;font:800 15px/1.2 "Plus Jakarta Sans",system-ui,sans-serif;text-decoration:none;box-shadow:0 3px 0 #b07d10}
  .p-cta:hover{background:#ffc94d}
  .p-teknik{margin:10px 0 0;font:500 12.5px/1.5 "Plus Jakarta Sans",system-ui,sans-serif;color:#c9d8cd}
  .p-tips{margin:0;padding:14px 16px;border:1.5px dashed rgba(245,240,228,.35);border-radius:16px}
  .p-tips p{margin:0 0 6px;font:400 17px/1.4 "Young Serif","Young Serif Fallback",Georgia,serif}
  .p-tips ol,.kiri ol{margin:0;padding-left:20px;display:grid;gap:6px;font:500 13.5px/1.5 "Plus Jakarta Sans",system-ui,sans-serif;color:#e4ece6}
  .p-tips a,.kiri a{color:#fff;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(242,182,50,.8)}
}
@media (min-width:768px) and (max-height:900px){.p-isi,.p-tips{display:none}}
@media (min-width:768px) and (max-height:740px){.p-fitur li:nth-child(n+4){display:none}.p-sub small{display:none}}
@media (min-width:1200px){
  .panggung{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)}
  .kiri{display:flex;flex-direction:column;gap:12px;justify-self:end;max-width:270px;color:#f5f0e4}
  .kiri .k-judul{margin:0;font:400 26px/1.2 "Playwrite ID","Segoe Print",cursive;color:#f2b632}
  .kiri .k-isi{margin:0;font:500 13.5px/1.55 "Plus Jakarta Sans",system-ui,sans-serif;color:#c9d8cd}
  .panel{justify-self:start}
  .p-tips{display:none}
}
`;

const TEMA_AWAL = "try{var t=JSON.parse(localStorage.getItem('kapur:v1')||'{}').tema;if(t==='terang'||t==='gelap')document.documentElement.setAttribute('data-tema',t)}catch(e){}";

const FITUR_PANEL = [
  'Satu akun untuk beberapa anak, tinggal ketuk untuk berganti',
  'Absensi gerbang dan pengajuan izin atau sakit',
  'Nilai per mapel dengan grafik perkembangan dan rapor',
  'Bayar SPP lewat QRIS atau transfer (simulasi) lengkap dengan bukti',
];

function Tips() {
  return (
    <ol>
      <li><a href="/tagihan">Bayar tagihan lewat QRIS (simulasi), lalu buka buktinya</a></li>
      <li><a href="/absensi/izin">Ajukan izin sakit untuk besok</a></li>
      <li><a href="/nilai">Lihat grafik perkembangan nilai</a></li>
      <li><a href="/pesan">Kirim pesan ke wali kelas</a></li>
    </ol>
  );
}

export default function Root({ children, pathname }) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();
  const tidakAda = !pathname || pathname.includes('not-found');
  const qr = jalurQR(`${APP.url}/`);
  return (
    <html lang="id" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1f4a3b" />
        <meta name="color-scheme" content="light dark" />
        <meta name="author" content="PintuWeb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Kapur" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preload" href="/fonts/plus-jakarta-sans.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/young-serif.woff2" as="font" type="font/woff2" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: TEMA_AWAL }} />
        <style id="kapur" dangerouslySetInnerHTML={{ __html: CSS }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {tidakAda ? (
          <>
            <title>Halaman Tidak Ada di Jadwal | Kapur</title>
            <meta name="description" content="Halaman yang kamu cari tidak ada di aplikasi Kapur. Kembali ke beranda buku penghubung." />
            <meta name="robots" content="noindex, follow" />
          </>
        ) : null}
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        <div className="panggung">
          <aside className="kiri" aria-label="Alur yang bisa dicoba">
            <p className="k-judul">Coba alur ini</p>
            <Tips />
            <p className="k-isi">Ketuk nama anak di pojok kanan atas untuk berganti antara Nayla (kelas 5) dan Bima (kelas 2). Semua data tersimpan di perangkatmu saja.</p>
          </aside>
          <div className="ponsel">
            <div className="pulau" aria-hidden="true" />
            <div className="layar">{children}</div>
          </div>
          <aside className="panel" aria-label="Tentang demo Kapur">
            <p className="p-label">Demo aplikasi mobile · PintuWeb</p>
            <p className="p-merek">Kapur<span aria-hidden="true" /></p>
            <p className="p-sub">
              Aplikasi orang tua {SEKOLAH.nama}
              <small>Sekolah, siswa, dan guru rekaan. Data disimulasikan di perangkat.</small>
            </p>
            <p className="p-isi">Buku penghubung sekolah pindah ke ponsel: orang tua memantau jadwal, absensi, nilai, tugas, dan SPP anak, lalu bertanya langsung ke wali kelas.</p>
            <ol className="p-fitur">
              {FITUR_PANEL.map((f) => <li key={f}>{f}</li>)}
            </ol>
            <div className="p-tips">
              <p>Coba alur ini</p>
              <Tips />
            </div>
            <div className="p-bawah">
              <figure className="p-qr">
                <svg viewBox={`0 0 ${qr.ukuran} ${qr.ukuran}`} role="img" aria-label={`Kode QR menuju ${APP.url.replace('https://', '')}`} shapeRendering="crispEdges">
                  <path d={qr.d} fill="#1c2621" />
                </svg>
                <figcaption>Pindai untuk membuka di ponsel</figcaption>
              </figure>
              <div>
                <a className="p-cta" href={APP.kontak}>Pesan aplikasi seperti ini</a>
                <p className="p-teknik">React Native + Expo: satu kode untuk Android, iOS, dan web.</p>
              </div>
            </div>
          </aside>
        </div>
        {bodyNodes}
        <aside className="bilah-demo" aria-label="Tentang situs demo ini">
          Situs demo buatan PintuWeb — nama dan isinya rekaan.{' '}
          <a href={APP.kontak}>Buat yang seperti ini →</a>
        </aside>
      </body>
    </html>
  );
}
