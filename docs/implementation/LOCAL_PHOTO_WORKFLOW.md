# Foto berbasis folder — perubahan yang diminta pengguna

2026-11-03: pengguna meminta galeri tambahan yang sederhana dan penggantian foto
section melalui folder lokal. Ini memperluas workflow konten statis: tidak membuat
database, akun, dashboard atau API upload. Foto diolah sebelum build; `npm run dev`
memantau folder dan memperbarui manifest untuk HMR. Ekspor publik perlu build ulang.

Folder sumber `foto-website/`: galeri, discover, pengalaman, fasilitas, momen,
lokasi, kuliner/{id-menu}. JPG/JPEG/PNG/WebP/AVIF diterima; SVG/video tidak diimpor
otomatis. Metadata opsional `foto.json`: objek nama file → caption/alt/credit/order.
Konten JSX tetap mengambil JSON yang dihasilkan, tanpa mengeksekusi isi metadata.

Galeri baru `#album` menyajikan dinding foto sederhana dan viewer keyboard. Folder
discover mengganti dua foto utama, sisanya muncul dalam strip; pengalaman/fasilitas/
lokasi menampilkan strip dokumentasi; momen menambah slider existing. Foto di folder
id-menu mengganti ilustrasi menu tersebut, tanpa mengubah nama/harga/stok.

File sumber tidak dihapus. Derivatif diproses Sharp (orientasi, batas pixel/file,
strip metadata, resize WebP, thumbnail); manifest stabil dan nama file output memakai
hash konten. Menghapus foto sumber menghapus referensinya; hanya derivatif yang
tercatat dan berada di output khusus boleh dibersihkan. Symlink diabaikan.

Meletakkan file di folder adalah maksud publikasi dari pengelola, bukan verifikasi
fasilitas/harga atau bukti izin semua subjek. Gunakan hanya foto yang dimiliki/diizinkan.
Provenance baru `local-folder-publish-intent` dibedakan dari izin chat sumber awal.

Seed galeri berasal dari13 foto yang sebelumnya telah diizinkan; kredit dan original
dipertahankan. Semua hasil uji aktual dan batas akan ditambahkan setelah implementasi.

## Bukti implementasi

Uji import terisolasi membuktikan tambah/cache/ganti/hapus foto, pembatasan output,
pengabaian SVG dan pemetaan section/menu. Original tidak dihapus. Uji browser pada
server pengembangan membuktikan13→14 foto setelah satu JPG ditambahkan, lalu14→13
setelah JPG uji dihapus; tidak ada error console. Bukti:
`evidence/test-runs/local-folder-live-watch.json`. Foto uji tidak tersisa.

Galeri desktop1440px dan mobile360px diperiksa:13 foto, rasio asli, caption/kredit,
pop-up, panah keyboard, Escape/focus return, tanpa overflow horizontal. Fallback
tanpa JavaScript dan reduced motion diuji. Kontras kredit yang semula terlalu
pudar telah diperbaiki. Tes browser galeri berada di `tests/e2e/album.spec.ts`.
Build menghasilkan75 aset terdaftar;13 foto album merupakan derivatif sumber
yang sudah berizin, bukan foto baru hasil scraping.

Panduan pengguna ada di `foto-website/README.md`. `npm run dev` memantau perubahan;
`npm run photos:sync` untuk sinkronisasi manual; build menjalankan sinkronisasi
otomatis. Website statis yang sudah dihosting harus di-build dan diunggah ulang.
Folder kuliner mengganti gambar saja; JSON tetap mengatur informasi nama/harga.
Foto/fasilitas/lokasi tambahan belum diisi otomatis dengan fakta yang tidak ada.
