# Arah burung dan angin sepoi — 3 November2026

Audit generator tools/build-coastal-kit.mjs menemukan paruh kedua atlas burung
(camar dan bangau) berada di kanan. Posisi x di SceneAtmosphere dan DetailBackdrop
justru berkurang terhadap waktu, sehingga terlihat terbang mundur.

src/lib/coastal-air.ts menyatukan forwardFlight: perjalanan kanan sesuai paruh,
wrap80 unit di luar viewport, perbedaan kecepatan/ukuran untuk kedalaman, naik
turun5 unit dan bank maksimal0.035radian. SceneAtmosphere, DetailBackdrop dan
siluet Hero memakai arah yang sama. Frame kepak serta gambar sumber tidak
diubah; tidak perlu gambar/lisensi/provider baru.

drawSeaBreeze menggambar dua sapuan Bezier tipis yang bergantian, dengan tail
transparan, fade sinusoidal dan jeda antarhembusan. Lebih tenang di tengah
komposisi detail karena tetap melewati mask environment. Reduced motion tidak
menggambar garis angin; tombol opt-in native, jeda, visibility/offscreen sleep,
shared scheduler dan cleanup tetap berlaku. Tidak membuat ticker baru, efek
suara otomatis, confetti atau elemen UI promosi tambahan.

Sumber: file baru coastal-air.ts, integrasi SceneAtmosphere.tsx,
DetailBackdrop.tsx dan coastal-world.ts. Test arah pada tests/content.test.ts
memeriksa gerak maju, batas wrap untuk1jam waktu virtual, fase siklus dan batas
bank pada lebar600/1440. Ini bukan soak test1jam browser nyata.

Lint/typecheck/build berhasil;17 unit/folder tests lulus. Suite motion, continuity,
detail-background dan route-motion dipilih untuk menguji desktop/mobile, pause,
reduced motion/opt-in dan perpindahan halaman. Hasil akhir dicatat setelah run.
Screenshot berjalan di evidence/continuity/ dan evidence/detail-background/.
Tidak ada dependency, biaya/API atau perubahan fakta pengelola.

Hasil akhir:16/16 browser test terarah lulus. Screenshot desktop/mobile ditinjau.
Probe drawImage pada renderer galeri merekam36 sampel: x760.70→795.70 dalam
sekitar1.8detik, sesuai paruh kanan pada aset sumber. Raw:
`evidence/detail-background/forward-flight-rendered.json`. Ini memeriksa jalur
yang benar-benar digambar, selain unit test controller. Bukan klaim menjalankan
ulang seluruh45 test atau pengukuran HP fisik. Build/lint/typecheck juga lulus.
