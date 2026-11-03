# Perjalanan pesisir hidup — audit dan rencana

Hero disetujui pengguna pada 2026-11-03. Pertahankan komposisi/renderer Hero.
Permintaan lanjutan: lingkungan setiap section hidup, ombak berujung buih yang
menyapu elemen, angin lebih kuat pada bagian laut, semua foto dokumentasi tersedia
dalam galeri otomatis, navigasi mempunyai proses transisi.

## Arsitektur dan art direction

- Reuse material frond generated yang sudah berprovenance; renderer overlay
  transparan untuk palm, pasir, burung dan wavefront prosedural. Satu scheduler
  RAF untuk seluruh overlay, menggambar hanya scene yang tampak, dibatasi FPS/DPR.
- Discover: dune dan pasir hangat, daun di pinggir bingkai; Experience: laut lebih
  berangin dengan gulungan buih; Explore: pasir dan pohon di tepi area duduk;
  Taste: dune/leaf shadow yang tenang; Moments/Find Us: ombak senja dan foliage.
- Lapisan lingkungan berada di belakang teks/media. Sapuan transisi batas scene
  menggunakan tepi bergerigi organik, mengikuti scroll dua arah. Navigasi memakai
  wave curtain singkat: tutup → perpindahan kamera → buka, hash dan focus tetap
  benar; reduced motion memakai anchor langsung. Tidak menambah scroll controller.
- Galeri menampilkan semua foto sumber berizin selain Menu.png (tetap di katalog),
  otomatis berpindah ketika terlihat, berhenti saat hover/focus/interaksi/viewer,
  tombol jeda tersedia; reduced motion/data-saver tidak memulai autoplay.

## Tool/lisensi/biaya

GSAP/ScrollTrigger dan Canvas 2D yang sudah ada mencukupi rig 2D dan masks ini.
Three.js dipertimbangkan dari dokumentasi resminya, tetapi scene 3D/dependency
WebGL tambahan belum memberi manfaat untuk efek 2D yang diminta. Tidak menginstal
paket, membeli aset, memakai API berbayar, menyalin aset referensi, atau scraping.
Foto Assets/foto-ig sudah diizinkan pengguna; kredit yang tampak dipertahankan.
Foto tidak dipakai untuk mengarang fasilitas, jam, stok, atau alamat.

## Quality gates

1. Implement Discover/Experience + bukti gerak/visual desktop/mobile.
2. Implement Explore/Taste + periksa hotspot, label AI, safe area.
3. Implement Moments/Find Us + seluruh foto, autoplay/pause dan navigasi.
4. Lint/typecheck/build/unit/e2e/axe, rekaman dan simulasi CPU/network final.
   Catat hasil aktual, jangan menyamakan simulasi dengan HP fisik atau uji skripsi.

Asumsi: 'semua foto' berarti semua foto dokumentasi unik dari folder yang telah
diizinkan; poster/video dan Menu.png memiliki penyajian tersendiri. Tidak memaksa
halaman menggulir sendiri ketika pengunjung sedang membaca section lain.


## Implementasi dan provenance

- `SceneAtmosphere.tsx`, `atmosphere-clock.ts`, `shore-shapes.ts`: tujuh overlay
  termasuk penghubung prolog; satu clock24Hz; frond Hero dipakai ulang dengan
  fase/gust berbeda. Canvas transparan hanya memiliki backing store penuh ketika
  dekat viewport, lalu kembali1×1 saat tidak tampak. Suara tidak ditambahkan.
- `WaveNavigation.tsx`: tirai buih bergerigi1,1detik, menutup → memindahkan kamera
  → membuka. Anchor/hash/history/focus tetap berfungsi; Escape membatalkan tirai,
  reduced motion memakai native anchor. Tidak menambah controller scroll.
- `PhotoSurf.tsx`: bidang kertas/buih SVG orisinal bergerak di atas foto dan sajian.
  SVG statis ditranslasikan; tidak memakai animated polygon clip-path. Caption dan
  badge AI berada di luar bidang reveal. No-JS dan reduced motion menyembunyikan cover.
- `use-gallery-tour.ts`: autoplay5,5detik saat galeri tampak; hover/focus/jeda,
  interaksi manual, dialog, tab tersembunyi, reduced motion/data-saver menghentikannya.
  Berputar ke awal dengan dissolve, tanpa menggulir halaman vertikal otomatis.
- `prepare-all-documentation.mjs`: source-photos/source-videos inventory → metadata
  → Sharp900px/420px WebP → FFmpeg540px/24fps14detik tanpa audio + poster. Semua
  original dipertahankan. Metadata/credits di media/gallery JSON. Tiga film masing-
  masing14detik; source asli lebih panjang tidak dipublikasikan mentah.

Seluruh13 foto asli unik tampil tanpa crop pada galeri (`object-fit:contain`),
termasuk kolase dan foto sajian. Menu.png tetap tersedia dalam katalog. Foto sajian
ini tidak dipakai untuk menyatakan nama/harga/stok menu. Setiap source baru memiliki
`sourceType:owner`, `permission:owner-confirmed-2026-11-03`, nama source relatif
folder Assets/foto-ig, dan provenance dokumen ini. Manifest total47 asset ID.

## Review issue dan batas

Review pertama: daun mendekati judul, kontrol mobile menutup teks, serta gelombang
terlalu rendah untuk terlihat pada viewport awal. Diperbaiki lewat posisi/ukuran
kanopi, tombol mobile44px, safe spacing dan lapisan wash yang transparan.

Stress case pause/resume Hero → immediate seek ke Find Us menyebabkan native
Chromium EXCEPTION_BREAKPOINT. Instrumentasi awal mengarah pada Canvas readback,
namun penonaktifan clip-path pada build diagnostik menghilangkan crash. Dynamic
polygon clipping diganti cover SVG yang bergeser; tiga pengulangan mobile pada
build baru lulus. Canvas crop coordinates juga dibatasi dalam texture dan dormant
surfaces dibebaskan. Pemeriksaan temporal kini memakai screenshot compositor +
Sharp di proses tes, mengukur gambar yang terlihat tanpa mengubah backend Canvas.
Bukan klaim bahwa setiap browser/perangkat fisik telah diuji.

Tidak ada dependency/API/biaya layanan baru; hanya library dan alat lokal yang sudah
ada. Three.js tidak diinstal karena kebutuhan ini berupa komposit2D dan navigasi,
bukan dunia3D. Referensi teknis yang diperiksa: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
dan https://threejs.org/docs/ . Notice lisensi runtime/font tetap ikut build.

## Handoff

`npm run dev` → port3000; `npm run build` lalu `npm run preview` → port4173.
Edit informasi/preset pada content JSON, bukan JSX. Pipeline foto/film:
`node tools/prepare-all-documentation.mjs`. Rekaman:
`node tools/capture-continuity.mjs`. Profil simulasi:
`node tools/profile-continuity.mjs` (sendirian, setelah tes/rekaman selesai).

File baru: SceneAtmosphere, WaveNavigation, PhotoSurf, atmosphere-clock,
shore-shapes, use-gallery-tour, scene-continuity.css, prepare-all-documentation,
capture-continuity, profile-continuity, continuity.spec.ts dan derivatif dokumentasi.
Integrasi: CoastalArrival/JourneyScenes/CafeScenes/GoldenScenes/use-media-depth,
layout/content schemas dan JSON. Hero hanya menerima pengamanan batas source crop;
arah visual Hero yang telah disetujui tetap dipertahankan.

Jam/alamat jalan/logo/proposal resmi, Android/iOS fisik, Safari/Firefox, screen
reader manual, responden serta validasi akademik tetap belum tersedia/dilaksanakan.
Foto menu AI tetap placeholder. Tidak menyatakan kelayakan akademik atau dampak
promosi tanpa penelitian; tidak ada publikasi hosting pada tahap ini.


## Hasil verifikasi final lokal

- Lint, typecheck dan static build lulus; build memvalidasi9 schema,47 asset ID,
  file/referensi/izin/provenance dan20 notice dependency langsung.
- `npm run test`:12/12 lulus. `npm run test:e2e`:35/35 lulus pada build final,
  termasuk semua pemeriksaan axe yang tersedia (tanpa pelanggaran terdeteksi).
- Viewport1440×900,768×1024,390×844 dan360×800 diuji. Screenshot scene dan
  gambar temporal: `evidence/continuity/`; raw suite `evidence/test-runs/e2e-results.json`.
- Bukti temporal mobile membuktikan perubahan piksel terlihat pada setiap section,
  lalu berhenti saat jeda; offscreen/reduced fallback dan focus/hash/history diuji.
  Temuan bahwa dekor mobile sempat keluar viewport diperbaiki dengan framing
  terhadap area baca, bukan hanya koordinat awal section panjang.
- Rekaman production browser desktop dan touch-mobile: `evidence/continuity/desktop-journey.mp4`
  dan `mobile-journey.mp4`. Capture report:0 page error pada kedua viewport,
 16 media; auto-gallery bergerak0→359px desktop dan0→301px mobile tanpa klik next.
- Cek pemicu crash mobile diulang3kali setelah perubahan SVG:3/3 lulus. Tes tidak
  dinonaktifkan atau mengubah konfigurasi trace; pengukuran piksel dipindah ke
  screenshot compositor agar menguji hasil visual yang benar-benar tampil.

Tidak mengklaim hasil ini sebagai sertifikasi aksesibilitas, physical-device
benchmark, field INP atau penilaian kelayakan skripsi. Semua screenshot/rekaman
berasal dari aplikasi berjalan, bukan mockup.


## Performa aktual (simulasi, tanpa pekerjaan browser lain)

Raw: `evidence/performance/scene-continuity-mobile.json`.
Chromium156,390×844,touch,CPU4×,latensi150ms,unduh200000B/detik:
LCP Hero2536ms, CLS0.02531, resource seluruh perjalanan teramati2485896byte,
video request sebelum klik0. Cadence overlay setelah Hero sekitar19.9–20.4draw/detik;
prolog12.21draw/detik ketika Hero dan penghubung sama-sama tampak. Ini menunjukkan
biaya overlap, bukan janji display FPS24/60 atau hasil HP fisik. Reduced motion
menghasilkan0draw berulang pada scene berikutnya; prolog satu repaint layout.
Satu sampel lokal tidak menjadi benchmark komparatif atau ukuran INP lapangan.

Review rekaman/screenshot final telah memeriksa waveform di Experience/Find Us,
kanopi/sand di Explore/Taste, safe spacing/caption mobile dan foto tanpa crop.
Build lokal dapat ditinjau; keputusan rilis fisik/cross-browser tetap terbuka.
