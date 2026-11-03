# Handoff aset dan album lokal — 3 November 2026

## Hasil yang dapat ditinjau

- Website development: http://127.0.0.1:3000/#album, pemantauan folder aktif.
- Ekspor produksi lokal: http://127.0.0.1:4173/#album.
- Studio aset: http://127.0.0.1:4181/viewer/ dan viewer/animation.html.
- Paket157 file: `deliverables/Pantai-Nuansa-Coastal-Asset-Kit.zip`, sekitar19MB.
- Board: `deliverables/coastal-asset-kit/proposal/asset-board.png`.
- Preview animasi: `deliverables/coastal-asset-kit/proposal/motion-preview.mp4`.
- Screenshot album desktop/mobile/foto/pop-up: `evidence/album/`.

## Perubahan utama

Pipeline aset: `tools/build-coastal-kit.mjs`, `build-coastal-models.mjs`,
`prepare-kit-trees.mjs`, `clean-kit-alpha.py`, `present-coastal-kit.mjs`,
`animate-coastal-kit.mjs`, `install-coastal-kit.mjs`, `validate-coastal-kit.mjs`,
`preview-coastal-kit.mjs`. Sumber raster ada di `assets-source/generated/`;
keluaran editable dan derivatif ada di paket.15 kelompok,48 frame,8 model,
6 clip; sumber/lisensi/pengecualian Blender dijelaskan pada laporan aset.

Foto lokal: `foto-website/README.md`, folder section, `tools/sync-local-photos.mjs`,
`dev-with-photos.mjs`, `content/local-photos.json`, `tests/local-photos.test.mjs`.
Galeri: `src/components/FolderPhotos.tsx`, `src/app/folder-photos.css`,
`tests/e2e/album.spec.ts`, `tools/capture-album.mjs`.
Integrasi/ref guard/copy pada `src/lib/content.ts`, `scene-kit.ts`,
SceneAtmosphere/WaveNavigation/JourneyScenes/CafeScenes/GoldenScenes,
GalleryViewer/ConceptCatalog, `content/{scenes,media,sections,navigation}.json`.
PhotoSurf membulatkan koordinat SVG untuk mencegah beda floating point hydration.

## Pemeriksaan aktual

`npm run lint`, `npm run typecheck`, `npm run build`: lulus.
`npm run test`:14/14 lulus. `npm run test:e2e`:38/38 lulus,0 flaky/skipped.
`node tools/validate-coastal-kit.mjs`:15 aset alpha/layer dan8 GLB/OBJ lulus.
Viewer WebGL memuat8 model tanpa error, mengenali6 clip. ZIP diuji CRC dan
memuat checksum tiap file. Audit produksi0, audit dev16 moderate yang tercatat.
Kontras kredit foto diperbaiki; pemeriksaan axe pada suite browser lulus.

Uji foto pada server development:13→14→13 melalui tambah/hapus satu foto,
tanpa error. Original tidak dihapus; foto uji dibersihkan. Menu override hanya
mengganti gambar; nama/harga tidak diubah. File rusak/unsupported dan perubahan
konten/cache/delete diuji pada workspace sementara yang terisolasi.

| Bagian | Multimedia/perilaku yang diuji |
|---|---|
| Opening/Hero | Intro alami/skip/sekali sesi, deformasi laut, daun, parallax, jeda |
| Discover | Foto tersibak buih, depth/scroll reversible, lingkungan hidup |
| Experience | Video opt-in, silent hover preview, pause saat offscreen/dialog |
| Explore | Hotspot keyboard, informasi fasilitas terkonfirmasi, pohon/pasir |
| Taste | Pilihan menu, foto AI berlabel, katalog, transisi sajian |
| Moments |13 foto+3 video, slider otomatis, jeda hover/kontrol, viewer |
| Album Foto |13 foto awal, masonry sederhana, pop-up/panah/Escape/focus return |
| Find Us/Footer | Pin/kontak diberikan pemilik, tautan/navigasi/lingkungan |
| Lintas section | Tirai ombak, hash/history/fokus, audio mute, reduced motion/no-JS |

Tangkapan desktop1440px dan mobile360/390px ditinjau visual; tablet768px juga
masuk suite browser. Gerak terlihat dan dapat dijeda; overlay offscreen tidur.
Album sengaja tidak memiliki Canvas raksasa yang tumbuh mengikuti jumlah foto.
Performa versi ini dicatat di `evidence/performance/coastal-album-mobile.json`;
angka simulasi bukan skor perangkat fisik atau bukti penelitian responden.

Pengukuran akhir tanpa tes/rekaman/encoding bersamaan: Chromium156,390×844,
CPU4×,latensi150ms,unduh200000B/detik. LCP3212ms, CLS0.02531, transfer perjalanan
3.36MB; request video sebelum klik0. Overlay mayoritas19.98–20.45draw/detik;
penghubung dengan overlap Hero9.94draw/detik. Reduced motion tidak memiliki loop
berulang (satu repaint asset/layout pada Explore/Moments). Album tanpa Canvas.
LCP belum mencapai target2.5detik pada simulasi ini; optimalisasi transfer/render
awal dan overlap Hero tetap pekerjaan performa rilis. Tidak menyamakan draw cadence
dengan FPS layar. Raw pengukuran disimpan untuk perbandingan berikutnya.

## Pemakaian

Jalankan `npm run dev`, kemudian salin gambar ke `foto-website/galeri/` atau
folder section. Caption/alt/kredit/urutan opsional melalui `foto.json`.
Untuk publikasi jalankan `npm run build`, unggah ulang `out/`.
Panduan lengkap dan keamanan input: `LOCAL_PHOTO_WORKFLOW.md`.

Belum deploy. Uji Android/iOS fisik, Safari/Firefox, screen reader manual,
penilaian pengelola/akademik, domain, jam operasional dan alamat jalan tetap
terbuka. Tidak mengklaim seluruh quality gate rilis atau skripsi selesai.
Tidak ada API key, backend, transaksi, tracker atau layanan berbayar baru;
imagegen memakai tool bawaan dengan kuota/tarif akun yang tidak bisa diperiksa.
