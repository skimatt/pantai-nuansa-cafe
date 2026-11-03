# Homepage sinematik dan koleksi detail

Revisi pemilik3 November2026: homepage menjadi perjalanan visual ringkas;
data menu, galeri dan fasilitas lengkap dibuka melalui Lihat semua pada page baru.
Keputusan ini mengalahkan batas single-page-only sebelumnya (D033). Aset, stack,
fakta pengelola, izin dan workflow konten statis tetap dipakai.

## Arsitektur dan komposisi

- `/`: opening/Hero, Discover2foto, video pengalaman, cuplikan fasilitas1 aspek,
  tiga menu terkurasi, slider empat media, lokasi/footer. Album panjang terpisah
  di homepage dihapus; rail kembali tujuh section. Lingkungan hidup tetap utama.
- `/menu/`: semua record menu terverifikasi, search/category, sumber gambar menu
  asli. Saat ini6 item terstruktur; gambar asli memuat rincian lain yang belum
  ditranskripsi. Tidak mengarang transkripsi/harga. Batas schema8 item dihapus.
- `/galeri/`: seluruh foto folder galeri + video/metadata berizin; saat ini13foto
  dan3video. Viewer keyboard/fullscreen, no-JS links, mute default. Tidak menggandakan
  foto seed dengan versi lama dari manifest. Penghapusan seluruh foto folder tidak
  menghidupkan kembali foto lama secara diam-diam.
- `/fasilitas/`: kedua informasi terkonfirmasi, ilustrasi berlabel dan semua foto
  dari folder fasilitas bila ditambahkan. Tidak menambah Wi-Fi, parkir atau layanan
  lain yang belum dikonfirmasi.

Homepage memilih tiga ID menu dari content/pages.json; jumlah gallery preview4
dan facility preview1 juga diatur di sana. homepageContent memproyeksikan koleksi
di server dan hanya meneruskan referensi aset yang dipakai ke komponen client.
Penambahan banyak record tidak otomatis membanjiri homepage. Data lengkap tetap
divalidasi sebelum proyeksi. Full pages memakai konten sumber yang sama.

Art direction halaman detail: masthead kecil, judul editorial besar, environment
pesisir beranimasi hanya pada intro yang terbatas tinggi, daftar/menu foto tanpa
kotak berulang, masonry galeri, baris fasilitas dan CTA kembali ke section asal.
Navigasi memakai Next Link; entry animation ringan, reduced-motion fallback.
Canvas tidak dibuat setinggi seluruh koleksi. Native motion opt-in tetap tersedia.

## File dan workflow

Konfigurasi/copy baru `content/pages.json` + schema dalam src/lib/content.ts.
Proyeksi/galeri `src/lib/homepage.ts`; routes src/app/{menu,galeri,fasilitas}/page.tsx;
komponen DetailFrame, MenuCollection, GalleryCollection; style detail-pages.css.
Komponen homepage dan pengujian diarahkan ulang dari katalog overlay menuju page.
Full collection tidak mempunyai checkout/pemesanan/login/unggahan browser.
Semua route kompatibel Next static export dengan trailing slash.

`foto-website/galeri/` tetap sumber foto otomatis pada /galeri/ dan cuplikan home.
Foto tambahan semua folder section juga dapat dibaca di galeri; fasilitas
pada halaman fasilitas. Foto lokasi/discover utama tetap memakai pemetaan lama.
Nama/harga baru ditambahkan di content/menu.json; original dari pengelola harus
tetap menjadi sourceAssetId. Foto asli menu memakai folder kuliner/{id-menu}.
Saat development watcher memperbarui JSON; website publik perlu rebuild/deploy.

## Pemeriksaan

Unit guard memeriksa pertumbuhan30 menu sambil menjaga preview home3, pengurangan
payload, referensi valid, sumber tidak termutasi dan penghapusan foto folder.
Uji browser disesuaikan dengan perilaku baru, bukan menonaktifkan fitur lama tanpa
pengganti: koleksi lengkap kini diuji pada route detail, preview pada homepage.
Desktop1440 dan mobile360 mencakup navigasi bolak-balik, search kosong/hasil,
pop-up/panah/Escape/fokus, sumber menu asli, video mute, reduced motion/no-JS,
axe dan overflow. Screenshot aktual: evidence/detail-pages/.

Hasil akhir: lint, typecheck, build dan16 unit/folder test lulus;42/42 browser
test lulus,0 flaky/skipped. Termasuk dua regresi zero-size/route motion.
Penambahan foto nyata pada folder uji development membuktikan galeri16→17→16
setelah tambah/hapus; homepage tetap4 media.0 page error; foto uji dibersihkan.
Raw: `evidence/test-runs/detail-folder-live-watch.json` dan e2e-results.json.

Tidak ada dependency, sumber gambar eksternal, API atau layanan berbayar baru.
Tidak deploy. Penilaian akademik, domain/fakta operasional yang belum diberikan,
perangkat fisik dan browser lintas platform tetap batas pengujian rilis.

## Ekspor statis Windows

Tes HTTP menemukan request segment Next16.4.4 `/menu/__next.menu.__PAGE__.txt`
mendapat404, sedangkan exporter Windows membuat direktori `__next.menu/__PAGE__.txt`.
Source resmi yang terpasang di node_modules/next/dist/export/index.js memakai
collectSegmentPaths dan convertSegmentPathToStaticExportFilename yang mengganti
slash maju, sehingga separator Windows tertinggal. Bukan data menu yang hilang.
Build kini menjalankan tools/normalize-static-export.mjs untuk menyalin alias
nama datar yang diminta router. Original dipertahankan; tidak memodifikasi
node_modules atau menambahkan API/rewrite server. Pada build ini4 alias dibuat.
Uji halaman detail menangkap semua response>=400 dan kini lulus tanpa404.

## Performa terukur dan batas

Raw `evidence/performance/homepage-detail-mobile.json`: satu sampel Chromium156,
390×844,touch,CPU4×,latensi150ms,unduh200000B/detik, tanpa test/encoding bersamaan.
Initial viewport: homepage LCP2820ms/CLS0.02531; menu5688ms/0.00623;
galeri5716ms/0.00631; fasilitas5076ms/0.000043. Transfer awal teramati1.58MB
homepage dan1.96–2.06MB route detail.0 request video sebelum klik,0 page error,
tanpa overflow. Ini bukan pengukuran full scroll, perangkat fisik atau field INP.
Target LCP2.5detik belum tercapai pada simulasi ini, terutama halaman detail;
optimasi aset/prefetch lebih lanjut tetap pekerjaan rilis, bukan klaim selesai.

## Lifecycle animasi lintas halaman

Pengujian mobile menemukan createLinearGradient menerima nilai non-finite ketika kanvas lama berukuran nol saat route dilepas. Guard ukuran/connected ditambahkan pada SceneAtmosphere, LivingCoast dan CoastalWorld sebelum perhitungan koordinat/resize. Suite regresi route-motion memaksa ukuran nol, memulihkan ukuran dan mengulang navigasi tiga kali sambil memeriksa clock tetap bertambah serta tidak ada page error. Error tidak disembunyikan dengan catch umum.
