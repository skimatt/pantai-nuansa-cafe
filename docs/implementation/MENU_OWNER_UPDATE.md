# Menu dan foto berlisensi — 3 November2026

Data terbaru diberikan langsung oleh pengguna, disimpan pada content/menu-source.json:
nama usaha, alamat Desa Lipah Rayeuk/Jeumpa/Bireuen, Instagram, TikTok, empat kategori
dan11 pilihan menu. Daftar ini menggantikan enam transkripsi menu sebelumnya.
Menu.png lama dipertahankan sebagai arsip sumber, tidak ditampilkan sebagai acuan
harga terkini. Nama/harga baru divalidasi terhadap dokumen sumber pengguna,
termasuk Rp25.000/ons untuk ikan dan rentang Rp12.000–Rp15.000 untuk Sanger.
Rentang tersebut tidak dipecah menjadi harga panas/dingin yang belum diberikan.
Nama varian gabungan tetap satu pilihan sesuai data, bukan klaim stok harian.

Foto dari Wikimedia Commons, diperiksa melalui API resmi imageinfo/extmetadata
sebelum diunduh. Hanya lisensi CC BY, CC BY-SA, CC0 atau public domain dipakai.
Original dan metadata lisensi/author/sourceURL tersimpan di assets-source/menu-web/.
Versi web maksimum1920px, varian640px, tanpa upscaling. Setiap turunan mempertahankan
lisensi gambar sumber; konversi WebP/resize dan CSS crop diungkapkan. Share-alike
berlaku pada gambar turunan terkait, bukan klaim melisensikan kode situs ulang.
Metadata lengkap juga dikirim pada public/licenses/menu-photos.json dan kredit
serta tautan sumber/lisensi tampil di katalog dan foto unggulan.

Foto merupakan referensi penyajian, bukan foto produk restoran, dan tidak
membuktikan spesies ikan, isi seafood, jenis kopi atau varian tertentu. UI memberi
label tersebut. sourceType=licensed, verified=false, isPlaceholder=true menjaga
pemisahan antara menu owner yang faktual dan foto ilustratif. Foto internet tidak
dimasukkan sebagai dokumentasi lokasi di galeri. Foto asli pengguna nantinya
dapat mengganti referensi melalui foto-website/kuliner/{id-menu}/.

Tidak memakai API berbayar, API key, hotlink ke gambar atau scraping media sosial.
Sumber foto: https://commons.wikimedia.org/ ; kebijakan lisensi individual ada pada
selected.json dan setiap halaman File. Gambar lama hasil AI tetap tersimpan
sebagai artefak produksi proposal, tetapi bukan gambar menu aktif yang baru.

Pipeline: tools/prepare-menu-web.py mengambil original yang lisensinya disaring;
tools/install-menu-web.mjs mengoptimasi dan mencatat provenance. Preview contact
sheet assets-source/menu-web/review.jpg dipakai untuk pemeriksaan komposisi.
Foto jus yang semula berisi orang/vendor diganti foto minuman; foto kopi dan lemon
juga dipilih ulang. Nama dan harga tidak ditafsirkan dari foto.

Hasil akhir: lint/typecheck/build lulus;18 unit/folder test dan10 browser test
terarah lulus. Test mencakup11 foto ter-resolve,4 kategori, search, harga per ons,
rentang Sanger, kredit HTTPS, tidak menampilkan menu arsip, alamat dan TikTok,
axe, tanpa overflow pada1440/360px, serta cuplikan3 item pada homepage. Screenshot
aktual evidence/owner-menu/ dan evidence/detail-pages/ ditinjau visual.
Pemeriksaan axe juga menemukan ikon pause berbentuk teks Roman numeral dianggap
label berbeda; ikon diganti SVG dekoratif, mempertahankan label tombol yang jelas.
Ini bukan klaim menu telah difoto di restoran atau pengujian HP fisik selesai.

## Foto daftar menu ditampilkan kembali — 6 November 2026

Atas permintaan terbaru pemilik, halaman /menu/ kembali menampilkan Menu.png pada bagian Daftar dari pengelola setelah katalog. Berkas public/assets/cafe/menu-original.png identik SHA-256 dengan Assets/foto-ig/Menu.png (5423FA5344B5A75F669A2C83D54BB274594DDE36206442FEFA98A1EE54218783). Tidak membuat salinan baru atau mengubah gambar. Klik foto/tautan membuka gambar ukuran asli. Data katalog dari menu-source.json tetap dipertahankan; permintaan ini menambahkan foto, tanpa menyalin ulang harga pada poster ke katalog.

Pemeriksaan langsung server development pada desktop 1440x900 dan mobile 360x800: gambar berhasil didekode, tautan membuka berkas benar, tidak ada overflow horizontal. Screenshot evidence/menu-photo/desktop.png dan mobile.png telah ditinjau. Tidak ada dependensi/layanan/biaya tambahan.
