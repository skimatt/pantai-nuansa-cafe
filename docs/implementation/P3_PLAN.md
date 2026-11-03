# P3 — Discover / Experience, 3 November 2026

## Scope dan izin
Pengguna meminta melanjutkan setelah fondasi. Implementasikan dua scene berikutnya dan verifikasi sebelum mengerjakan scene lain. Konfirmasi izin aset sebelumnya tetap berlaku; tidak meminta ulang. Tidak deploy pada checkpoint website yang belum selesai. Fakta menu, harga, alamat, jam dan daftar fasilitas belum diverifikasi.

## Asset selection dan production
- Foto portrait indeks 0 dan 2 dari source-photos.json: dokumentasi sesi foto dengan laut/pantai, kredit @raja_poutrett dari nama sumber. Tidak memakai arch/dekor sesi sebagai klaim fasilitas permanen.
- Video indeks 0 (30,856 detik, portrait 720×1280): pengunjung duduk di tepi laut saat senja. Pertahankan rasio, tidak membuat video AI sebagai dokumentasi.
- Optimasi lokal Sharp + FFmpeg yang sudah terpasang; jangan mengubah original. Audio dihapus pada derivatif web karena rincian hak musik belum terpisah. Video tanpa suara diberi label, kontrol native, poster dari frame asli dan deskripsi visual.
- Generate satu background pesisir imajinatif untuk Discover; sourceType generated/isPlaceholder=true/verified=false, label ilustrasi terpisah dari dokumentasi.
- Tidak menambah provider/API berbayar, embed, tracking atau dependensi runtime.

## Storyboard dan komposisi
D1: Hero menuju pasir hangat; prolog singkat tetap sebagai jembatan. Discover dengan serif besar kiri, dua portrait editorial di kanan pada environment dunes/laut. Reveal scrub vertikal perlahan + pergeseran foto berbeda kedalaman, reversible. Caption dan teks tetap HTML. Mobile: satu alur vertikal dengan jarak baca dan rasio gambar asli; bukan desktop dikecilkan.
E1: pasir beralih ke coastal ink/teal; video portrait menjadi focal point kanan, judul/deskripsi kiri. Source video baru dipasang saat pengguna memilih putar, bukan unduhan background saat LCP. Poster tersimpan lokal, native controls setelah aktivasi, pause saat keluar viewport/tab disembunyikan, tidak autoplay/resume otomatis. Fallback pesan dan coba lagi bila gagal.

## Arsitektur
Komponen Journey terpisah, children server-rendered di dalam main existing. GSAP/ScrollTrigger yang sama, scoped matchMedia dan cleanup. Tidak ada scroll controller kedua atau pinning wajib. Data di sections/scenes/media JSON, Zod dan referential integrity diperluas. Active navigation hero/discover/experience, anchor perjalanan lama tetap valid. Katalog konsep tetap dapat diakses.

## Gate
Lint/typecheck/content tests/build; regression fondasi; e2e foto/video/play/pause/reduced motion/failed media/keyboard/deep link; axe dan console/network; screenshot 1440×900, 390×844, 360×800/tablet. Profiling terpisah tanpa proses e2e bersamaan; catat bahwa CDP bukan perangkat fisik. Belum mengklaim seluruh website, Distribution, usability atau persetujuan akademik selesai.
