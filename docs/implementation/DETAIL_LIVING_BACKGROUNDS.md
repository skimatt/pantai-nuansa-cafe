# Latar hidup sepanjang halaman detail

Revisi pemilik3 November2026: area koleksi menu, fasilitas dan galeri terlalu
polos. Gunakan aset pesisir yang sudah diproduksi untuk environment yang tenang,
profesional dan bergerak, bukan hanya ilustrasi pada intro.

`DetailBackdrop.tsx` memasang Canvas2D fixed seukuran viewport, di belakang konten
dan terpotong pada area `.detail-body`. Pohon cemara/ketapang/beringin tematik
berbeda per page; canopy menggunakan shear kontinu dan sway berfase sehingga akar tetap
tertambat. Frond kelapa menekuk, bird atlas mengepak dan melintas, pasir memakai
atlas hembusan, ombak bergerigi bergerak dalam tiga lapisan.

Mask alpha hasil cache menjaga pusat komposisi tenang dan memperkuat tepi/bagian
bawah. Foto tetap opaque, caption/harga menggunakan wash ivory tipis. Tidak
menambahkan card baru, data promosi, spesies yang diklaim ada di lokasi atau foto
palsu fasilitas. Aset adalah ilustrasi tematik dari kit yang provenance-nya sudah
tercatat pada COASTAL_ASSET_KIT.md; tidak ada download, API, dependency atau biaya
baru. Hero/homepage tidak diubah.

Renderer bergabung dengan satu shared scheduler24Hz yang sudah ada. Intersection
observer menghentikan loop ketika koleksi di luar layar; tab hidden dan jeda
global juga menghentikan loop. Canvas tidak dibuat setinggi semua foto. Resize
dan scroll menghitung clipping viewport, dengan guard detached/zero-size.
Mask dicache, rasio backing store maksimal1.25; seluruh listener/observer/images
dan scheduler subscription dibersihkan saat unmount.

Reduced motion menghasilkan pose statis. Tombol Aktifkan animasi khusus situs
tetap dihormati; scrolling saat mode statis hanya memperbarui clipping. Tombol
jeda dipindahkan keluar dari stacking context intro supaya tidak tertutup foto
atau terpotong, dan tetap mempunyai ikon/touch target pada mobile.

File: src/components/DetailBackdrop.tsx, DetailFrame.tsx,
src/app/detail-pages.css, tests/e2e/detail-background.spec.ts.
Bukti browser/screenshot: evidence/detail-background/. Uji memeriksa perubahan
kanvas aktual, alpha terlihat, jeda/resume, native reduced-motion opt-in, batas
dimensi viewport, ketiga halaman pada1440×900/360×800, serta navigasi berulang.
Suite koleksi juga menjalankan axe, pencarian, viewer keyboard, fallback no-JS
dan guard404. Hasil aktual ditambahkan setelah seluruh pemeriksaan selesai.

Hasil aktual: lint, typecheck, build dan16 unit/folder test lulus. Delapan uji
browser terarah (koleksi, background, lifecycle navigasi) lulus. Setelah review
visual, pohon diganti dari strip menjadi shear kontinu untuk menghapus garis
sambungan raster; build/lint dan ketiga uji background desktop/mobile/reduced
dijalankan lagi dan3/3 lulus. Bukan klaim menjalankan seluruh45 test suite baru.
Screenshot keenam kombinasi route/viewport ditinjau. Bukti JSON pada
evidence/detail-background/{desktop,mobile}.json mencatat batas viewport dan
hasil pause/resume; tidak ada page error. Server development milik pengguna
tetap aktif, HTTP200, markup backdrop baru sudah tersedia.

Ini bukan pengukuran FPS perangkat fisik atau sertifikasi aksesibilitas. Performa
awal halaman detail yang dicatat sebelumnya tetap merupakan pekerjaan rilis;
penambahan dekorasi tidak diklaim mempercepat pemuatan.
