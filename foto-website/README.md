# Foto website — cukup salin ke folder

1. Masukkan JPG/JPEG/PNG/WebP/AVIF ke `galeri/` untuk halaman lengkap `/galeri/`.
2. Jalankan `npm run dev`: folder dipantau dan browser diperbarui otomatis.
3. Untuk hasil publikasi: `npm run build`, lalu unggah kembali hasil `out/`.

Folder per bagian:

| Folder | Hasil |
|---|---|
| galeri | Semua foto di halaman Galeri; homepage hanya cuplikan |
| discover | Dua foto pertama mengganti foto utama; sisanya di halaman Galeri |
| pengalaman | Foto tambahan pada halaman Galeri |
| fasilitas | Dokumentasi pada halaman Fasilitas dan Galeri |
| momen | Menambah koleksi lengkap Galeri |
| lokasi | Dokumentasi tambahan pada halaman Galeri |
| kuliner/id-menu | Foto pertama mengganti ilustrasi item menu tersebut |

Nama id-menu sudah dibuatkan sebagai subfolder. Nama/harga/stok menu tidak berubah.
Hapus foto sumber untuk menghilangkannya pada proses sinkronisasi berikutnya.
Original tetap aman; hasil optimasi berada di public/assets/local-photos.
Jangan mengedit content/local-photos.json karena dihasilkan otomatis.

Metadata opsional: buat `foto.json` di folder foto, contoh:

```json
{
  "01-pantai.jpg": {
    "caption": "Senja di tepi laut.",
    "alt": "Langit senja dan ombak di tepi pantai.",
    "credit": "Foto: nama pemilik",
    "order": 1
  }
}
```

Tanpa metadata, judul memakai nama file dan kredit umum. Gunakan nama file pendek
dan jelas. Batas25MB/60megapixel per foto. Symlink, SVG dan video tidak dipindai.
Pakai foto yang dimiliki/diizinkan, termasuk izin orang yang tampil. Memasukkan foto
bukan konfirmasi fasilitas, jam atau harga. Seed awal berasal dari dokumentasi yang
sebelumnya sudah diizinkan; credit dipertahankan di galeri/foto.json.

Ini pengelolaan konten lokal sebelum build; browser pengunjung tidak membaca folder
komputer Anda dan website yang sudah dihosting memerlukan build/deploy ulang.
