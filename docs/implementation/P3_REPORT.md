# P3 — Discover dan Experience, 3 November 2026

## Hasil checkpoint
Discover dan Experience diimplementasikan dan diuji pada **hasil build produksi statis**. Kedua scene melanjutkan opening/Hero yang sudah ada: prolog → pesisir ilustratif dengan dua foto dokumentasi → pesisir senja dan pemutar video. Ini bukan penyelesaian seluruh website. Explore, Taste penuh, Moments, Find Us, metadata domain dan deployment masih berikutnya.

## Perubahan utama
- Discover: ilustrasi pesisir baru, dua foto asli berizin dengan kredit @raja_poutrett, layout editorial, reveal pada gambar dan parallax reversible, navigasi menuju Experience.
- Experience: cuplikan dokumentasi 0–14 detik, portrait sesuai rasio asli, poster dari frame asli, native controls, putar/jeda/ulang, deskripsi visual dan fallback/coba lagi.
- Video **tidak memiliki src/request sebelum dipilih pengunjung**. Tidak autoplay dan tidak auto-resume setelah keluar viewport/tab atau setelah menutup katalog. Pemutaran video menjeda ambience sintetis; membuka katalog menjeda video.
- Audio sumber dihapus pada derivatif karena hak soundtrack tidak tercatat terpisah. Tidak mengarang transkrip dialog; deskripsi visual menjelaskan isi cuplikan tanpa suara.
- Keyboard: tombol awal memindahkan fokus ke video saat diaktifkan; kontrol dan details dapat diakses; katalog Escape/focus return dipertahankan. Tanpa JavaScript tersedia foto, konten dan tautan langsung ke berkas video.
- Kontrak JSON/Zod diperluas untuk scene, teks, sourceFile, izin, poster, durasi, flag silent dan referensi. Dokumentasi tidak boleh diam-diam diganti gambar AI. Navigasi ke Discover/Experience aktif; tautan tahap lain tetap nonaktif.

## Aset dan sumber
Semua original dipertahankan. Lihat [P3_PROVENANCE.md](P3_PROVENANCE.md), `assets-source/journey-prompt-v1.txt`, `journey-processed-assets.json`, dan `content/media.json`.

| Derivatif | Ukuran / pengolahan |
|---|---|
| shore / together | Dua foto dari Assets/foto-ig, versi WebP 480×600 dan 960×1200; tanpa crop/edit subjek. Versi mobile sekitar 26KB dan 34KB |
| senja-silent-v1.mp4 | 14 detik; 540×960; H.264 24 fps, faststart, 1.303.447 byte, tanpa stream audio (diperiksa FFprobe) |
| senja-poster-v1.webp | Frame 2 detik dari video sumber, 540×960, 50.038 byte |
| dunes-master/mobile-v1 | Imagegen built-in, pesisir imajinatif; WebP 1536×1024 (190.590 byte), mobile 780×1200 (101.016 byte) |

Tidak menambah paket/dependensi, layanan berbayar, key, analytics, embed atau akun. Imagegen built-in memakai akses tersedia; tarif/kuota internal tidak diekspos. Sharp dan FFmpeg lokal digunakan; binary FFmpeg GPL v3 tidak dibundel ke website. Izin penggunaan dokumentasi telah dikonfirmasi pengguna dalam chat sebelumnya; alamat, menu/harga, daftar fasilitas dan detail sumber unggahan asli belum otomatis terverifikasi.

## Pengujian aktual
Windows, Node 24.19.0, npm 11.17.0, Next.js 16.4.4, Playwright 1.64.1 / Chromium 156.0.8078.4. Preview build khusus **port 4173**, dipisah dari server pengembangan port 3000. Initial exploratory run memakai server pengembangan; semua hasil final/screenshot laporan ini diambil ulang dari `out/` di port 4173.

| Pemeriksaan | Hasil final |
|---|---|
| npm run lint | Lulus, 0 warning |
| npm run typecheck | Lulus |
| npm run test | 9 lulus, 0 gagal |
| npm run validate | 9 schema JSON, 20 aset manifest + varian, file/provenance/referensi/anchor aktif valid |
| npm run build | Lulus, static export out/ |
| npm run test:e2e | 15 lulus, 0 gagal, 0 flaky; 53,2 detik |
| Axe halaman/katalog/Discover/Experience | 16 laporan, masing-masing 0 pelanggaran terdeteksi; bukan sertifikasi aksesibilitas |
| Console/page errors/HTTP gagal tak diharapkan | Tidak ditemukan pada empat skenario Journey produksi; uji error sengaja memblokir video |
| npm audit --omit=dev | 0 temuan |

Skenario meliputi 8 regression fondasi + 7 Journey: viewport 1440×900, 390×844, 360×800, 768×1024; foto resolved, tidak overflow, navigasi/deep link, video lazy, muted/controls/currentTime, deskripsi, keyboard activation/fokus, pause offscreen/page hidden/katalog, tidak auto-resume, error fallback/retry, reduced motion dan akses tanpa JavaScript. Page hidden diuji dengan event visibility simulasi, bukan perpindahan aplikasi fisik. Bukan uji screen reader manual atau validasi responden.

## Review visual dan iterasi
Screenshot desktop/mobile/tablet ditinjau langsung. Background ilustratif tetap dominan; dua foto editorial tidak menjadi grid kartu. Rasio dokumentasi dipertahankan. Mobile menyusun teks dan foto vertikal dengan posisi berbeda, bukan scale desktop. Credit/notice dapat dibaca. Experience memakai video portrait sebagai focal point; panel naratif tidak menutupi media.

Temuan yang diperbaiki: caption primer tertutup foto sekunder → ratakan caption primer ke area aman kanan; animasi clip memotong kredit → mask hanya pada gambar, bukan caption; notice kurang jelas di atas dedaunan → backing gading kecil; label putar tidak mencakup teks durasi → durasi dipisah dari tombol, accessible name berasal dari teks tampil; uji alert menangkap route announcer Next → batasi selector pada fallback video; preview dev memiliki overlay → isolasi QA produksi di port 4173. Setelah perbaikan, suite lengkap diulang dan lulus.

## Performa sintetis
`node tools/profile-journey.mjs` dijalankan **setelah e2e selesai**, dua skenario (normal/reduced motion), CPU 4×, viewport 390×844, latency 150ms, download 200.000 byte/s, HTTP lokal tanpa kompresi.

| Metrik observasi | Gerak normal | Reduced motion |
|---|---|---|
| Hero LCP | 1692ms | 1660ms |
| CLS sampai Journey | 0,001999 | 0,001999 |
| Request video sebelum pilihan putar | 0 | 0 |
| Request video setelah putar | 1 | 1 |
| Waktu observasi frame pertama setelah klik | 1175,5ms | 1160,5ms |
| Long task tertinggi dalam sampel | 204ms | 196ms |

Transfer resource pada fase Hero sekitar 1,21MB tanpa kompresi; berkas video 1,3MB tidak diunduh pada fase ini. Waktu frame pertama mencakup overhead interaksi Playwright/visibility, bukan decoding murni. Resource timing hanya memuat request selesai; penghitung CDP video adalah byte parsial saat observasi. Single run per mode di Chromium lokal **bukan perangkat menengah fisik, field INP, skor Lighthouse atau benchmark terkontrol**. Tidak menyimpulkan peningkatan dari perbandingan run berbeda.

## Bukti dan file
- `evidence/test-runs/p3-e2e-results.json`: hasil lengkap 15 kasus.
- `evidence/test-runs/p3-axe-*.json`, `axe-*.json`: hasil aksesibilitas.
- `evidence/test-runs/p3-audit-production.json`, `p3-verification-summary.json`.
- `evidence/performance/p3-mobile-baseline.json`: angka aktual dan batas pengukuran.
- `evidence/screenshots/p3/discover-{desktop,mobile,small-mobile,tablet}.png` dan `discover-full-*.png`.
- `evidence/screenshots/p3/experience-*.png`, `experience-full-*.png`, `video-error-fallback.png`.
- `evidence/test-runs/source-photos.json`, `source-videos.json`, `ffmpeg-build.txt`.
- `evidence/test-runs/p3-files.txt`: file utama yang dibuat/diubah pada checkpoint.

Implementasi: `JourneyScenes.tsx`, `DocumentaryVideo.tsx`, `journey.css`; integrasi `CoastalArrival.tsx`/layout; schema/content/validator; data enam JSON diperbarui; pipeline inspeksi/proses aset; unit/e2e dan konfigurasi port preview. Prompt dan original di `assets-source/`, delapan derivatif di `public/assets/journey/`. Tidak membuat commit/push karena repository awal belum Git.

## Gate tersisa / data yang diperlukan
Uji Android/iOS menengah fisik, Safari/Firefox, audio monitoring dan screen reader manual belum dilakukan. Temuan moderat alat lint dari fondasi masih dicatat terpisah; P3 tidak mengubah dependency graph. Rincian kreator/URL unggahan video, waktu dokumentasi dan cakupan izin final perlu dilengkapi sebelum publikasi. Proposal resmi/Distribution, domain, data fasilitas/menu/harga/kontak/jam/alamat belum terverifikasi. Tidak membuat data SUS/responden atau klaim dampak kunjungan.

Jalankan `npm run dev` untuk pengembangan (port 3000). Untuk versi yang diuji, `npm run build` lalu `npm run preview` dan buka http://127.0.0.1:4173. Belum deploy. Berikutnya Explore/Taste setelah data faktual dikonfirmasi; komponen yang tidak bergantung fakta dapat memakai placeholder berlabel.

## Konfirmasi setelah review P3
Pengguna kemudian mengonfirmasi area duduk outdoor beratap, meja melingkar/kursi langsung di atas pasir dan pandangan pantai, serta nama/harga Menu.png masih berlaku. Informasi ini digunakan pada P4; snapshot uji P3 di atas tetap untuk implementasi sebelum P4.
