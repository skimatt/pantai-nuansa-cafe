# Perpindahan section homepage — 3 November2026

Pilihan: entrance translate pendek untuk heading/copy, opacity lembut pada media
ketika masuk/keluar viewport. Parallax environment yang sudah ada dipertahankan,
bukan menulis transform yang sama dari dua controller. Hero/opening tidak diubah.
Tidak menambahkan pinning, scroll hijack, blur/filter, library atau ticker baru.

use-section-transitions.ts memakai GSAP/ScrollTrigger yang sudah tersedia.
Konfigurasi content/animations.json.sectionTransitions: travel16px desktop,
9px mobile, scrub0.45, edgeOpacity0.78. Schema menjaga nilai tidak berlebihan.
Media terang pada bagian tengah perjalanan; opacity berkurang di tepi viewport.
Teks/caption/harga tidak difade agar kontras tidak turun saat membaca. Reversible
ketika scroll mundur; reduced-motion/no-JS menampilkan seluruh konten normal.
Jeda gerak membersihkan timeline dan mengembalikan tampilan statis, tanpa
mengubah posisi scroll. Semua context/matchMedia/timeline dibersihkan saat unmount.

File: src/lib/use-section-transitions.ts, CoastalArrival.tsx, animations.json,
content.ts, tests/e2e/section-transitions.spec.ts. Bukti screenshot dan nilai
opacity entry/centre/reverse: evidence/section-transitions/.
Tidak ada aset baru, API atau biaya layanan. Lulus build bukan jaminan60FPS;
perangkat fisik dan keterbatasan performa rilis sebelumnya tetap terbuka.

Fade awal pada foto menu sempat ditimpa CSS animation dish-surface; opacity
dihapus dari keyframe lama, menyisakan translate/scale masuk. Properti opacity
foto kini dimiliki satu controller scroll. Pengujian entry/centre/reverse sudah
lulus pada desktop/mobile, juga fallback tanpa JavaScript.

Native reduced motion tetap default statis. Pilihan eksplisit Aktifkan animasi
kini juga mengaktifkan transisi ringan ini melalui shared preference store;
mematikannya mengembalikan opacity/transform normal. Tidak menyalakan kembali
pinning/intro kamera kompleks di perangkat reduced motion. Ini perluasan pilihan
ambient sebelumnya, sesuai permintaan transisi pengguna saat ini.

Hasil akhir: lint/typecheck/build dan18 unit/folder test lulus. Tujuh uji
continuity/lifecycle lulus; setelah penyesuaian native opt-in,9 uji motion dan
section-transitions lulus. Screenshot enam section pada desktop/mobile ditinjau.
Raw opacity entry/centre/reverse tersedia pada desktop.json dan mobile.json.

Simulasi CPU4×,390×844, scroll cepat turun-naik6.01detik:133 callback RAF,
main-thread TaskDuration6.26detik,0 page error. Angka ini mencakup seluruh
environment/renderer dan pemuatan selama scroll, bukan biaya transisi saja.
Tidak ada baseline pembanding sehingga tidak mengklaim60FPS atau peningkatan
performa. Main thread masih padat pada simulasi ini; optimasi renderer/perangkat
fisik tetap pekerjaan rilis. Raw evidence/section-transitions/performance.json.

## Bingkai foto dan sambungan lingkungan 5 November 2026

Foto Discover memakai pinggiran krem tipis, keterangan transparan, dan jarak antarbingkai. Foto sekunder tidak lagi bertumpuk dengan foto utama pada desktop. Pada tablet kedua foto tersusun vertikal. Rotasi animasi foto dihilangkan dan perpindahan vertikal diperkecil. Lapisan PhotoSurf pada dokumentasi dilepas dari render dan timeline. PhotoSurf pada sajian menu tetap dipakai untuk perpindahan pilihan menu.

Dokumentasi tambahan, Moments, dan koleksi detail memakai pinggiran senada. Moments menampilkan rasio asli foto dengan keterangan di luar bingkai. Video memakai garis tepi tipis.

Bagian prolog sampai Find Us memiliki sapuan transparansi pada latar atas dan bawah melalui pseudo-element CSS. Warna tepi pasangan section sama sehingga perubahan suasana terang/gelap tersambung. Lapisan fade tidak menerima klik. Section yang berubah kontras mendapat ruang bawah agar keterangan tidak berada di atas bagian transisi. Tidak ada renderer, library, filter blur, atau ticker tambahan.

Build, lint, typecheck, 19 uji unit, dan tiga uji browser section-transitions lulus. Inspeksi visual pada 1440 × 900, 360 × 800, dan 768 × 1024 memeriksa bingkai serta lima sambungan section. Kedua foto Discover tidak saling menimpa pada tiga ukuran tersebut, tanpa error halaman atau luapan horizontal. Bukti berada di evidence/photo-polish.

## Sambungan Hero ke Prolog

Lapisan bawah Hero memudar ke warna ivory yang sama dengan tepi atas Prolog. Fade ditempatkan di atas lapisan cahaya dunia dan di bawah konten Hero. Tinggi adaptif 110–190 piksel mengikuti layar. Desktop 1440 × 900 dan mobile 360 × 800 ditinjau melalui evidence/hero-join. Sampel warna tepat di kedua sisi tepi menghasilkan selisih nol pada area yang diukur. Navigasi Jelajahi Nuansa ke Prolog, batas layout, dan error halaman diperiksa. Build, lint, typecheck, 19 uji unit, dan uji browser opening/session lulus.
