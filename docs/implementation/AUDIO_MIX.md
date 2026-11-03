# Penggantian audio — 3 November 2026

Permintaan pengguna: ganti ambience dengan audio dalam `Assets/Audio/` dan campur
dengan ombak. Folder berisi satu berkas: `GolderHour.mp3`. Berkas asli dipertahankan.

## Produksi dan integrasi

- `node tools/mix-cafe-audio.mjs` memakai FFmpeg lokal untuk menghasilkan
  `public/assets/audio/golden-hour-ocean.mp3`: 209,79 detik, stereo 44,1 kHz,
  128 kb/s, 3.357.927 byte. Preview 24 detik: `evidence/audio/mix-preview.mp3`.
- Musik dinormalisasi dan dicampur dengan ombak sintetis orisinal: brown noise
  tersaring 65–1.200 Hz, amplitudo berayun 0,12 Hz. Ini desain suara,
  bukan rekaman dokumentasi ombak di lokasi. Tidak mengambil rekaman pihak ketiga.
- Fade berkas: masuk 2 detik, keluar 3 detik. Loop memulai lagu dari awal sesudah
  fade akhir; bukan loop musik tanpa jeda. Pengukuran FFmpeg: mean -22,1 dBFS,
  peak -7,9 dBFS; tidak ditemukan clipping digital pada hasil pengukuran ini.
- `content/audio.json` divalidasi Zod: jalur lokal, volume 0,6, fade kontrol
  650/250 ms, loop, mute default. Judul tombol: “Musik dan debur ombak”.
- `OceanAudio` memuat elemen audio hanya setelah klik; streaming HTMLAudioElement
  menggantikan generator ambience lama, sehingga ombak tidak ditumpuk dua kali.
  Jeda mempertahankan posisi lagu; hidden langsung pause; kembali visible hanya
  melanjutkan bila sebelumnya pengguna menyalakan suara. Video mematikan ambience.
  Unmount membatalkan fade, melepas source dan menghapus elemen audio.

## Provenance, izin dan biaya

SHA-256 sumber dan resep lengkap berada di `evidence/audio/mix-provenance.json`.
Musik disediakan pengguna untuk pengolahan lokal. Metadata sumber tidak memberi
bukti pencipta atau lisensi publikasi daring. Statusnya
`user-supplied-publication-unverified`; tidak dinyatakan bebas royalti.
Hak publikasi musik perlu dikonfirmasi sebelum situs dipublikasikan.
Tidak menggunakan API, layanan berbayar, unduhan aset, atau dependensi baru.

## Verifikasi

Lint, typecheck, 18 unit test dan build produksi berhasil. Lima uji browser
(`audio-mix.spec.ts` dan `compact-controls.spec.ts`) lolos pada hasil ekspor statis:
desktop 1440×900, mobile 360×800, tanpa unduhan audio sebelum klik, sumber campuran
yang benar, volume mencapai 0,6, posisi jeda/resume, pause hidden, pemulihan visible,
prioritas video dan pelepasan audio saat navigasi. Tidak ada page error pada uji
pemutaran desktop/mobile. Screenshot kedua ukuran diperiksa; kontrol tetap kecil
dan tidak menutupi teks. Bukti tersimpan di `evidence/audio/`.

Iterasi menemukan timestamp requestAnimationFrame yang bisa mendahului waktu
mulai fade; progres kini dijaga pada rentang 0–1 untuk mencegah volume negatif.
Seluruh lima uji diulang dan lolos setelah perbaikan. Build akhir juga berhasil.
Pengujian browser mengukur sumber, waktu pemutaran, volume, jeda dan cleanup;
bukan penilaian subjektif melalui speaker atau pengujian perangkat fisik.
