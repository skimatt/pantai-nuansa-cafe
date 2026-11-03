# Chrome/Edge tampak statis — penyebab dan perbaikan

3 November2026. Pengguna melaporkan animasi berjalan pada browser pengujian agent,
tetapi seluruhnya diam pada Chrome dan Edge ketika server dijalankan sendiri.

## Penyebab yang direproduksi

Server development tetap aktif dan halaman berhasil dimuat. Chrome dan Edge
terpasang diperiksa menggunakan browser berjendela dengan preferensi emulasi
dikosongkan melalui CDP, sehingga memakai preferensi perangkat sebenarnya.
Keduanya melaporkan `prefers-reduced-motion:reduce=true`. LivingCoast berada pada
status `reduced` sebelum dan sesudah penantian, tanpa frame loop. Tidak ada page
error. Ini mematikan ambient Canvas, slider otomatis dan scroll/intro animation
sesuai fallback aksesibilitas. Pengaturan registry animasi Windows juga ditemukan
nonaktif; tidak ada pengaturan OS/browser yang diubah.

Pengujian otomatis sebelumnya tidak menyamai preferensi native tersebut.
Lulusnya perubahan piksel pada konteks no-preference tidak membuktikan gerak
pada browser dengan reduced motion aktif. Diagnosis sebelumnya bahwa masalah
hanya amplitudo gerak terlalu kecil tidak cukup menjelaskan laporan pengguna.

## Perbaikan

Tombol `Aktifkan animasi` tampil saat perangkat meminta reduced motion. Pengguna
dapat secara eksplisit menghidupkan ambient laut/daun/burung/pasir dan slider
Moments, lalu mematikannya lagi. Default tetap menghormati reduced motion.
Pilihan khusus situs disimpan pada localStorage `nuansa-ambient-motion-v1`;
ketika storage diblokir, pilihan tetap bekerja selama halaman terbuka.

`src/lib/ambient-motion.ts` menyatukan preferensi efektif, notifikasi dan cleanup.
LivingCoast, SceneAtmosphere dan useGalleryTour mendengarkan perubahan tersebut.
AmbientMotionControl menyajikan pilihan keyboard/touch dengan aria-pressed.
Copy berasal dari content/site.json, divalidasi schema. Tombol selalu berlabel
teks pada mobile. Tidak mengubah Windows, memaksa audio atau mengabaikan
pengurangan gerakan pada intro, scroll, photo reveal dan navigasi.

Server development milik pengguna tidak dihentikan/dijalankan ulang. Aset/stack/
dependency/fakta promosi tidak diubah; tanpa API, unduhan atau biaya baru.

## Bukti aktual

Raw sebelum: `evidence/native-motion/system-browser-check.json`.
Setelah: `evidence/native-motion/system-browser-fixed.json`.
Chrome1440×900: setelah opt-in frame18→75; Edge360×800:24→90.
Kedua browser tetap melaporkan reduced motion native=true, tetapi canvas running
setelah opt-in dan sesudah reload. Klik Matikan animasi mengembalikan status
reduced. Kedua browser0 page error. Screenshot `*-enabled.png` ditinjau visual;
rekaman native tersimpan di folder video pada evidence/native-motion.

`npm run lint`, `npm run typecheck`,14 unit/folder test, dan build lulus.
Dua regression test baru pada motion.spec.ts memeriksa opt-in desktop/mobile,
perubahan piksel area laut dan daun, penyimpanan setelah reload, scene berikutnya,
autoplay galeri dan kembali statis ketika dinonaktifkan. Suite browser produksi
dijalankan ulang setelah build:40/40 lulus,0 flaky/skipped, termasuk kedua
regression test baru. Hasil akhir pada `evidence/test-runs/e2e-results.json`.

Cara mencoba: server `npm run dev` tetap terbuka, buka http://127.0.0.1:3000,
Ctrl+F5 lalu klik Aktifkan animasi di kanan bawah. localhost dan127.0.0.1 mempunyai
penyimpanan terpisah; pilihan disimpan untuk origin yang sedang digunakan.

Ini memperbaiki perbedaan preferensi browser. Penguatan art direction/gerak objek
besar yang masih menyatu pada ilustrasi latar merupakan pekerjaan visual terpisah;
tidak diklaim telah dikerjakan melalui perubahan ini.
