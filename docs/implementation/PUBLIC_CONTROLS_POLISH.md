# Kontrol ringkas dan copy publik — 3 November2026

Permintaan pengguna: kontrol animasi/suara kecil dan bersih, hapus petunjuk gulir
serta keterangan ilustrasi suasana pada Hero, hilangkan copy development.

Ikon memakai lingkaran terlihat34px dengan hit area44×44 untuk touch/keyboard.
Label tidak memenuhi layar tetapi tetap ada melalui aria-label/title. Posisi
dock konsisten, state aria-pressed tetap berfungsi. Hero tidak lagi menampilkan
scroll cue, world hint, status pratinjau atau art notice yang diminta dihapus.
Copy galeri tidak lagi menyebut folder lokal, sumber menu tidak membicarakan
proses transkripsi, deskripsi prolog menjadi copy pengunjung. Label makanan AI
dan informasi fasilitas yang belum terbukti secara fotografis tetap jelas.

Gain ambience diturunkan0.13→0.09, kedalaman modulasi0.06→0.035. Ini penurunan
amplitudo nominal, bukan pengukuran loudness di speaker fisik. Mute default,
persetujuan pengguna, pause/resume/dispose tidak diubah.

File: compact-controls.css, layout.tsx, CoastalArrival.tsx, DetailFrame.tsx,
AmbientMotionControl.tsx, ocean-audio.ts, content/site.json, content/pages.json.
Regression: tests/e2e/compact-controls.spec.ts. Screenshot aktual pada
evidence/compact-controls/ memeriksa1440×900 dan360×800. Tidak ada aset/provider/
dependency/biaya baru. Tidak berarti domain, fakta operasional, perangkat fisik
atau seluruh gate publikasi sudah ditutup.

Hasil aktual: lint/typecheck/build serta17 unit/folder test lulus;11 browser test
terarah lulus (compact controls, motion dan detail backgrounds). Setelah final
alignment kontrol Hero ke dock kanan yang sama, build dan2 regression kontrol
desktop/mobile dijalankan ulang dan lulus. Screenshot final diperiksa; aria-label,
keyboard, touch bounds, toggle audio dan reduced-motion opt-in tetap berfungsi.

Koreksi posisi ikon: label berukuran font0 masih membentuk anonymous grid row,
sehingga ikon tampak naik. SVG kini ditempatkan absolut pada50%/50% dengan
translate(-50%,-50%), independen dari baris label. Regression mengukur selisih
pusat bounding box SVG dan tombol (toleransi0.25px) pada desktop dan mobile,
termasuk kontrol opt-in reduced motion. Ukuran lingkaran/hit target tetap sama.
