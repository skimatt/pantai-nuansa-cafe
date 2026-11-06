# Pratinjau foto dan video

Lightbox dokumentasi memakai satu permukaan gelap selebar layar. Media ditampilkan utuh sesuai rasio aslinya. Tombol tutup dan penghitung berada di atas. Panah berada di sisi media pada desktop dan di bawah media pada ponsel. Keterangan, kredit, dan tautan berkas asli berada di bagian bawah. Dialog native mempertahankan Escape, pengembalian fokus, dan navigasi keyboard. Video mulai dalam keadaan dijeda dan tanpa suara, dengan kontrol bawaan peramban.

Perubahan utama ada di `src/components/GalleryViewer.tsx` dan `src/app/golden.css`. Pengujian koleksi menyesuaikan jumlah media terhadap manifest folder dan menyimpan hasil per kasus untuk menghindari benturan penulisan berkas. Pekerjaan ini memakai dependensi yang sudah ada dan tidak membutuhkan layanan atau biaya eksternal.

## Verifikasi

- Lint, pemeriksaan tipe, dan build statis lulus. Semua 18 pengujian unit lulus.
- Tiga pengujian browser album lulus pada pengulangan, termasuk panah, fokus setelah Escape, video, tautan tanpa JavaScript, dan deteksi gulir di dalam dialog.
- Empat pengujian viewer pada desktop, tablet, dan dua ukuran ponsel lulus. Tujuh pengujian dokumentasi dan satu pengujian fallback galeri juga lulus.
- Screenshot foto fasilitas dan video galeri ditinjau pada 1440 × 900, 360 × 800, dan 800 × 360. Tidak ada gulir horizontal atau vertikal pada dialog yang diperiksa. Axe tidak menemukan pelanggaran pada dialog video di ketiga ukuran tersebut.
- Satu pengujian tambahan untuk tombol suara di Hero gagal karena bagian Prolog menerima klik. Kasus tersebut terjadi sebelum pratinjau dibuka dan dicatat terpisah dari perubahan viewer. Pemeriksaan visual menggunakan Chromium emulasi ukuran layar.

Jalankan `npm run dev`, buka Fasilitas atau Galeri, lalu pilih salah satu media. Bukti visual tersedia di `evidence/screenshots/media-preview/`.

## Perbaikan pemutaran inline — 6 November 2026

Masalah direproduksi pada server development pemilik di port 3000: src elemen video menjadi null, readyState 0 dan play() tidak selesai. Cleanup effect menghapus src; React Strict Mode menjalankan ulang setup/cleanup saat membuka dialog, sedangkan setup sebelumnya tidak mengembalikan sumber. Build produksi sebelumnya tidak memicu siklus pengujian development tersebut.

GalleryViewer kini memulihkan src dan menjalankan load pada setup, mempertahankan pause dan pelepasan sumber saat berpindah/menutup. Preload metadata menyediakan durasi pada kontrol video yang sedang dibuka, tanpa memuat semua video galeri. Suara tetap mute default dan pemutaran menunggu tindakan pengguna. Tidak menonaktifkan Strict Mode, tidak menambah library/layanan/biaya.

Pengujian preview-playback.spec.ts membuka video yang sama dengan laporan pengguna (Nama yang menyambut), memutar melalui kontrol keyboard native, memeriksa waktu bertambah, berpindah lalu kembali, menutup dan membuka ulang, serta memastikan video lama dijeda dan fokus dikembalikan. Dua kasus desktop 1440x900 dan mobile 360x800 lolos pada server development sebenarnya. Screenshot diputar di evidence/preview-playback/dev-desktop.png dan dev-mobile.png telah diperiksa visual. Lint, typecheck, 19 tes unit dan build lulus. Pengujian yang sama dijalankan ulang pada ekspor produksi.
