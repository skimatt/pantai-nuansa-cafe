# Dokumentasi pengelola November 2026

Foto dan video berasal dari folder DATA-FOTO-VIDIO yang diberikan pengguna pada 5 November 2026 untuk ditampilkan di website. Nama sumber, SHA-256, ukuran, dan hasil optimasi dicatat dalam evidence/documentation-import/import-manifest.json. Gambar diproses dengan Sharp dan video dengan FFmpeg yang tersedia secara lokal. Biaya layanan eksternal tidak digunakan.

Foto asli dipertahankan pada folder sumber. Galeri menggunakan salinan foto pada foto-website/galeri dan metadata foto.json. Video website memakai turunan H.264 tanpa audio dengan durasi utuh, rasio asli, dan faststart. Poster diambil dari video yang bersangkutan. Suara bawaan berkas sumber tetap tersimpan pada video asli.

Seluruh dokumentasi ditampilkan melalui galeri lengkap. Pilihan foto digunakan untuk Discover dan Fasilitas. Video area duduk outdoor digunakan sebagai cuplikan utama Experience. Izin penayangan mengikuti instruksi pengguna untuk memakai dokumentasi ini. Keterangan visual menyebut apa yang tampak pada media, dengan rincian fasilitas dan harga tetap mengikuti data pengelola.

Jalankan node tools/import-owner-documentation.mjs untuk mengolah ulang kumpulan dokumentasi ini. Kumpulan sumber dan keterangan terdaftar di content/documentation-import.json.

## Hasil pemeriksaan

- Tujuh foto pada folder Gambar tersedia di galeri. Lima foto yang sudah ada dipakai kembali dan dua foto dilengkapi. Foto dipilih ulang untuk Discover dan halaman Fasilitas.
- Tiga puluh video pada folder Video tersedia lengkap dengan poster masing-masing. Durasi dipertahankan sampai akhir berkas. Total video sumber sekitar 183,9 MB dan hasil H.264 sekitar 85,4 MB.
- Galeri lengkap berisi 51 media, terdiri atas 18 foto dan 33 video termasuk dokumentasi sebelumnya. Sidik SHA-256 foto mencegah salinan foto yang dipakai di beberapa section muncul berulang pada galeri lengkap.
- Delapan gambar contoh hutan/gurun yang sebelumnya berada di folder fasilitas dipindah ke foto-website/arsip-contoh-fasilitas. Halaman Fasilitas sekarang menggunakan foto lokasi sebagai gambar utamanya.
- Homepage menampilkan dua foto Discover, dua foto fasilitas, empat pilihan Moments, dan satu video Experience. Koleksi lengkap tersedia di Galeri dan Fasilitas.
- Validasi konten, lint, typecheck, build, dan 19 pengujian unit lulus. Sembilan pengujian browser koleksi/dokumentasi lulus pada sesi pertama. Satu ekspektasi URL video lama pada pengujian tanpa JavaScript diperbarui terhadap konten aktif, lalu pengujian tersebut lulus pada pengulangan.
- Seluruh 30 turunan video diperiksa metadata dan didekode sampai akhir tanpa error. Pemeriksaan browser pada 1440 × 900 dan 360 × 800 memverifikasi 51 entri galeri, 33 video, pemutaran video baru, Escape/pengembalian fokus, serta tidak ada error halaman atau luapan horizontal. Axe pada pratinjau video menghasilkan nol pelanggaran terdeteksi.
- Bukti visual berada di evidence/documentation-import/review. Semua foto dan poster diperiksa melalui lembar kontak sebelum dipilih sebagai tampilan utama. Beberapa video sumber merupakan cuplikan pendek atau rekaman genggam. Video 27 tetap dimasukkan dengan keterangan detail pasir dan tidak dipilih menjadi cuplikan utama.

## Perbaikan build produksi — 6 November 2026

Error Vercel Missing owner original owner-video-01 berasal dari pemeriksaan sumber ../DATA-FOTO-VIDIO/Video yang berada di luar repository. Aset H.264 dan poster website sebenarnya sudah dilacak di public/assets/owner-documentation. Validasi kini menerima sumber eksternal hanya ketika permission local-folder-publish-intent, nama sumber serta tujuan/poster cocok dengan import-manifest.json, SHA-256 sumber tersimpan valid, dan berkas hasil publikasi tersedia. Path Windows pada manifest dinormalisasi untuk Linux. Original di dalam repository tetap wajib tersedia. Metadata asal/izin dipertahankan; tidak menambahkan video master atau menonaktifkan pemeriksaan aset/provenance.

Lint, typecheck dan 20 tes lulus. Regresi mencakup video serta poster tanpa master eksternal, penolakan asal/hash/berkas publikasi yang hilang, serta original lokal yang hilang. Salinan Git terpisah di folder temporer tanpa DATA-FOTO-VIDIO diuji dengan instalasi dependency sendiri (npm ci --ignore-scripts) dan npm run build: lulus, seluruh 156 aset tervalidasi dan tujuh route statis dihasilkan. Percobaan awal berbagi node_modules via junction gagal pada resolusi batas workspace Turbopack; pengujian diulang dengan dependency lokal dan berhasil. Tidak ada perubahan UI/animasi atau layanan berbayar.
