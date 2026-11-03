# Pantai Nuansa — Coastal Asset Kit

Buka proposal/asset-board.png untuk lembar aset. proposal/DAFTAR_ASET.md dan CSV dapat dijadikan bahan tabel proposal. png/ berisi gambar transparan, svg/ vektor berlayer, webp/ versi web, sprites/ atlas animasi, frames/ frame individual. models/ berisi 8 GLB (material + rig/clip) dan OBJ statis. source/ menyimpan generator dan original/prompt imagegen.

Preview: dari root repository jalankan node tools/preview-coastal-kit.mjs lalu buka http://127.0.0.1:4181/viewer/. Paket viewer juga dapat disajikan dengan server HTTP statis biasa. Akses file:// langsung tidak mendukung pemuatan GLB/module. Drag model untuk melihat sudut lain, pilih objek, gunakan tombol jeda. Three.js MIT disertakan di licenses/. Tidak memakai CDN, tracker atau layanan berbayar.

Regenerasi dari root repository: node tools/build-coastal-kit.mjs → node tools/build-coastal-models.mjs → node tools/prepare-kit-trees.mjs → node tools/present-coastal-kit.mjs. prepare-kit-trees.mjs menggunakan original imagegen yang dicatat pada source; sesuaikan lokasi input bila memindahkan proyek.

Ilustrasi pohon/satwa bersifat tematik. Nama lokal sekay/arun belum diidentifikasi; tidak mengklaim inventaris lokasi. Ilustrasi painterly pohon bukan render dari GLB; kedua jalur sumber dicatat terpisah. Blender MCP tidak tersedia pada produksi ini, sehingga tidak ada file .blend yang diklaim.

## Keluaran dan dependensi

Preview2D: viewer/animation.html. Rekaman browser12detik: proposal/motion-preview.mp4 (dan WebM), gambar: proposal/motion-preview.png. Regenerasi memakai dependency repository Node/Sharp/Three.js serta Python/Pillow untuk alpha cleanup. Original imagegen portable ada di assets-source/generated/coastal-tree-sheet-v1.png dalam repository dan salinannya di source/. Generator dijalankan dari root repository; folder hasil tidak merupakan project Node terpisah. Viewer dapat dijalankan melalui server HTTP statis dari folder paket.

Laporan produksi dan hasil validasi file/model ada di verification/. Pohon painterly, model struktural dan vektor memiliki provenance berbeda. Tidak ada API key atau langganan baru; imagegen memakai tool bawaan dengan kuota/tarif akun yang tidak dapat diperiksa.
