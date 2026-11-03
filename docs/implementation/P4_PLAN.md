# P4 — Explore / Taste

## Konfirmasi pengguna 3 November 2026
Fasilitas: area outdoor di pinggir pantai dengan pandangan pantai langsung; area duduk seperti gazebo tetapi tanpa lantai, meja melingkar dan kursi langsung di atas pasir. Istilah UI: **area duduk outdoor beratap di atas pasir**, agar tidak mengesankan panggung/lantai atau konstruksi yang belum dikonfirmasi. Tidak menambah parkir, Wi-Fi, mushola, toilet, layanan pemotretan, booking atau jam.

Pengguna mengonfirmasi nama/harga pada `Assets/foto-ig/Menu.png` masih berlaku. Gambar diperiksa langsung. Pilih enam item dengan harga terbaca jelas: Nasi Goreng Telur 15k, Nasi Goreng Ayam 20k, Nasi Goreng Seafood 35k, Nasi Goreng Chicken Katsu 30k, Chicken Steak Black Pepper 35k, Mie Aceh Kuah Telor 15k. Ejaan Pepper dinormalkan dari Papper; harga ikan per ons dan harga yang tidak tercetak tidak diinterpretasikan. Jangan menganggap ketersediaan stok harian terkonfirmasi.

## Visual / produksi
Explore: satu illustrated environment pesisir dengan area duduk beratap tanpa lantai dan meja melingkar, berdasarkan deskripsi pengguna. Tetap labelled ilustrasi; bukan dokumentasi bentuk konstruksi. Dua hotspot: area duduk dan pandangan laut. Fallback teks, tombol keyboard/touch, informasi tanpa hover. Background asset baru + foliage/layer yang sudah ada untuk depth; mobile komposisi tersendiri.

Taste: enam baris menu editorial di kiri, satu gambar terpilih besar di kanan, label ilustrasi AI menempel. Tidak grid kartu. Interaksi klik/fokus tombol memilih item/gambar, harga dari JSON. Sumber fakta menu owner dan sumber foto generated dipisahkan. Katalog menampilkan pilihan terverifikasi serta gambar menu asli untuk daftar lengkap; delapan konsep awal tetap tersimpan terpisah dan tidak dianggap daftar minuman/produk asli.

Gunakan concept image nasi goreng telur yang sudah ada + lima gambar AI individual baru agar jenis visual mendekati nama item. Semua gambar AI tetap isPlaceholder=true, verified=false, sourceType=generated. Nama/harga dapat verified=true sebagai fakta dari sumber owner; ini tidak mengubah status gambar. Menu asli disalin tanpa retouch, kredit izin dan provenance dipertahankan.

## Gate
P3 ditutup dengan koreksi tablet, test dan review sebelum integrasi P4. Kemudian lint/typecheck/validation/build, tests meaningful untuk pemisahan fakta/foto, hotspot, menu selection/catalog, harga/sumber, mobile keyboard/reduced motion. Screenshot desktop 1440×900, 390×844, 360×800/tablet; console/network/axe. Tidak deploy/menambah layanan berbayar. Alamat/kontak/jam/proposal masih belum diketahui.
