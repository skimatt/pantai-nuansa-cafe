# Pemeriksaan gerak otomatis — 3 November 2026

Permintaan pengguna: periksa apakah seluruh bagian bergerak otomatis.

| Elemen | Perilaku aktual |
|---|---|
| Opening | Berjalan otomatis, sekali sesi; bisa dilewati |
| Lingkungan Hero | Laut, daun/pohon, burung dan pasir bergerak saat terlihat |
| Discover, Experience, Explore, Taste, Moments, Find Us | Overlay lingkungan otomatis, sesuai preset tiap scene |
| Moments |16 media, berganti otomatis setiap5.5detik; jeda hover/fokus/interaksi |
| Album Foto tambahan | Foto tetap; reveal saat scroll, viewer lewat klik, tanpa autoplay |
| Foto tambahan dari folder per section | Strip manual, reveal saat scroll |
| Parallax/reveal | Mengikuti scroll atau penunjuk, bukan gerakan tanpa input |
| Tirai ombak | Berjalan ketika tautan navigasi section diklik |
| Video | Preview senyap saat hover desktop; video utama melalui tombol putar |
| Audio | Mute default; memerlukan tindakan pengguna |

Preset berbeda dengan sengaja: Explore/Taste tidak menaruh ombak di atas informasi,
Taste tanpa burung; pohon/daun/pasir tetap bergerak. Kanopi Album merupakan gambar
statis. Footer tidak mempunyai animasi otomatis tersendiri. Jadi tidak semua
elemen di seluruh halaman dibuat bergerak tanpa input.

Uji ulang pada produksi:12/12 tes motion/continuity/album lulus, desktop1440px dan
mobile360px. Meliputi perubahan piksel terlihat, slider benar-benar berpindah,
pause/resume, offscreen sleep, reduced motion, hover preview, navigasi dan viewer.
Bukti `evidence/continuity/temporal-{desktop,mobile}.json` dan
`evidence/test-runs/motion-{desktop,mobile}.json` diperbarui melalui browser.

Audit kode menemukan posisi burung memakai remainder negatif setelah terbang
melewati sisi kiri dalam durasi panjang. SceneAtmosphere diperbaiki dengan
wrapping positif, sehingga burung kembali melalui sisi kanan. Hero sudah memakai
wrapping positif. Build (termasuk TypeScript) dan lint setelah perbaikan lulus;
suite continuity dijalankan kembali pada hasil build:5/5 lulus. Tidak mengklaim soak test
berjam-jam atau pengujian HP fisik telah dilakukan.

Gerak hanya aktif saat bagian tampak, tab terlihat, tidak dijeda dan reduced motion
tidak aktif. Ini perilaku yang disengaja untuk kendali pengguna dan beban rendering.
