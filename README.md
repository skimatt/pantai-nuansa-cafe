# Pantai Nuansa Cafe

Website promosi multimedia dengan homepage scrollytelling: **opening 2D → Hero → Discover → Experience → Explore → Taste → Moments → Find Us → Footer**, serta halaman lengkap **Menu, Galeri, Fasilitas**. Next.js App Router, TypeScript, Tailwind, GSAP/ScrollTrigger dan konten JSON dengan validasi Zod. Bahasa Indonesia. Tanpa database, login, CMS backend, transaksi atau pemesanan.

Homepage menampilkan tiga menu pilihan, empat media dan satu informasi fasilitas, dengan Lihat semua ke halaman detail. Halaman menu memuat enam item terstruktur dan gambar daftar asli; galeri lengkap13 foto lokal+3 video; fasilitas memuat dua informasi terkonfirmasi. Opening5,5detik, skip/replay/sesi, lingkungan hidup, Google Maps dan kontak tetap tersedia. Gambar sajian AI berlabel ilustrasi. Konsep awal tersimpan terpisah pada menu.conceptItems dan tidak dinyatakan sebagai menu aktual.

## Menjalankan

Pengujian memakai Node 24.19.0 dan npm 11.17.0. Node 24 LTS direkomendasikan. Tidak perlu `.env` atau API key.

```powershell
npm ci
npm run dev
```

Buka http://127.0.0.1:3000. Untuk hasil produksi statis:

```powershell
npm run build
npm run preview
```

Build menghasilkan `out/` serta menyertakan notice lisensi runtime/font di `out/licenses/`. `next start` tidak digunakan untuk static export. Gunakan server preview; jangan membuka index.html langsung melalui file browser.
Preview hasil build dibuka di http://127.0.0.1:4173 agar terpisah dari server pengembangan port 3000. Uji browser memakai port 4173 dan hasil ekspor statis, bukan overlay server pengembangan.

## Verifikasi

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
node tools/performance.mjs
node tools/profile-journey.mjs
```

E2e memakai build `out/` dan menyalakan preview bila belum ada. Build ulang setelah perubahan sumber. Profiling dijalankan saat `npm run preview` aktif, setelah e2e selesai. Pemeriksaan aktual: 16 uji konten/folder dan 42 uji browser lulus; pemeriksaan axe pada suite browser tanpa pelanggaran terdeteksi. Bukti di `evidence/test-runs/`, `evidence/screenshots/p3/`, `p4/`, `p5/` dan `evidence/performance/`. Simulasi Chromium bukan pengganti perangkat fisik atau sertifikasi aksesibilitas. Lihat [laporan website lengkap](docs/implementation/FULL_SITE_REPORT.md).

## Struktur dan perubahan konten

- `src/app/`: halaman, metadata, style, ikon.
- `src/components/`: opening/Hero, Journey, Cafe, Golden Memories, video, katalog dan viewer yang dimuat saat dibuka.
- `src/lib/content.ts`: schema JSON dan manifest foto lokal dan guard referensi/placeholder, dijalankan di server/build.
- `content/`: teks, navigasi, metadata, scene, opening, manifest dan konsep menu.
- `public/assets/`: WebP/SVG siap web.
- `assets-source/`: original PNG, prompt dan ukuran hasil; tidak masuk ekspor web.
- `tools/`: pemrosesan gambar, generator SVG, validasi, lisensi dan profiling.
- `docs/implementation/`: audit, art bible, provenance, arsitektur dan laporan.

Edit JSON, ganti aset, pertahankan ID/referensi, lalu validasi/build. Pada **item menu**, sourceType=owner/verified=true menyatakan fakta nama/harga. Pada **asset gambar**, sourceType=generated/verified=false/isPlaceholder=true tetap berlaku sampai foto asli disetujui; badge ilustrasi wajib dipertahankan. Stock harian tetap null. Prototype awal di conceptItems tetap tidak memiliki harga/ketersediaan. Seluruh `configure-*-content.py` adalah setup satu kali dan dapat menimpa copy checkpoint; jangan jalankan ulang pada konten editorial final.

Fakta fasilitas, menu, pin Maps dan kontak bersumber dari konfirmasi pengguna 3 November 2026. Jam dan alamat jalan belum diberikan, sehingga tidak dibuat-buat: Find Us memakai pin resmi yang dibagikan dan ajakan menghubungi pengelola. Telepon `tel:+6285320542581`; Instagram ditandai sebagai akun pengelola. Tidak mengasumsikan WhatsApp atau layanan pemesanan.

## Aset, layanan, lisensi

19 original PNG fondasi dan satu lembar pohon pesisir dibuat dengan imagegen built-in, diturunkan menjadi aset WebP/varian; SVG orisinal melengkapi layer/UI. Manifest gabungan kini memuat75 ID aset dan varian (termasuk15 aset kit dan13 foto album lokal). Original/prompt disimpan di assets-source dan tidak ikut static export. Tidak ada API key atau layanan berbayar terpisah; Three.js MIT ditambahkan sebagai alat produksi aset; tarif/kuota internal tool tidak dapat diperiksa. Provenance: [fondasi](docs/implementation/ASSET_PROVENANCE.md), [P3](docs/implementation/P3_PROVENANCE.md), [P4](docs/implementation/P4_PROVENANCE.md), [P5](docs/implementation/P5_PROVENANCE.md). Font lokal Cormorant Garamond/DM Sans (OFL), GSAP Standard License; notice runtime/font disertakan di public/licenses. Versi/lisensi paket di evidence/test-runs/dependency-licenses.json.

Izin foto/video Assets/foto-ig dikonfirmasi pengguna. Seluruh13 foto dokumentasi, tiga cuplikan video14detik, poster dan Menu.png diintegrasikan. Kredit foto dipertahankan; soundtrack dihapus pada derivatif web. Tidak ada scraping, analytics, map embed atau API bisnis. Pipeline lokal: tools/prepare-journey-assets.mjs, prepare-cafe-assets.mjs dan prepare-golden-assets.mjs; FFmpeg lokal diperlukan hanya untuk regenerasi cuplikan, binary tidak dikirim ke website.

## Status rilis

Belum deploy. Pratinjau noindex; canonical/gambar sosial absolut menunggu domain. Jam operasional, alamat jalan, logo resmi, rincian sumber/izin yang belum tercatat, proposal penelitian dan pengujian Android/iOS fisik/Safari/Firefox/screen reader manual tetap diperlukan sebelum rilis penuh. Audit produksi 0 temuan; 16 moderate pada alat lint/transitive dependency tetap tercatat. Tidak mengklaim penelitian, Distribution atau seluruh quality gate rilis selesai. Semua section sudah dapat dijalankan dan ditinjau secara lokal.


## Revisi animasi 2D — 3 November 2026

Penilaian visual/motion sebelumnya dibuka kembali setelah umpan balik pemilik.
Opening/Hero kini memakai Canvas 2D: deformasi permukaan laut, buih, rig daun,
burung, pasir, parallax penunjuk dan riak sentuhan; kamera scroll reversible,
indeks bab, media dengan depth/hover dan cuplikan video senyap. Reduced motion,
jeda gerak dan fallback HTML/gambar tetap tersedia. Instagram bisnis terpisah
dari akun pemilik. Lihat [laporan motion](docs/implementation/MOTION_REBUILD.md).

`node tools/prepare-motion-assets.mjs` menyiapkan frond alpha dan hover clip;
`node tools/capture-motion.mjs` merekam browser produksi di port 4173;
`node tools/profile-motion.mjs` mengukur simulasi mobile tanpa rekaman bersamaan.
Bukti terbaru berada di `evidence/motion/` dan `evidence/test-runs/motion-*.json`.
Uji perangkat fisik dan validasi akademik/pemilik tetap terpisah dari tes otomatis.


## Kontinuitas multimedia seluruh section — 3 November 2026

Hero telah diterima pengguna. Section berikutnya kini memakai lingkungan hidup
bersama: frond, burung, pasir dan buih bergerigi; komposisi mobile mengikuti area
viewport yang sedang dibaca. Navigasi melewati tirai ombak, foto/sajian tersibak
oleh cover SVG, dan galeri otomatis berisi13 foto +3 video dengan kontrol jeda.
Detail/pipeline/biaya/known limits: [laporan kontinuitas](docs/implementation/SCENE_CONTINUITY.md).
Rekaman produksi di `evidence/continuity/desktop-journey.mp4` dan `mobile-journey.mp4`.
Jalankan `node tools/prepare-all-documentation.mjs` untuk derivatif dokumentasi,
`node tools/capture-continuity.mjs` untuk rekaman, dan `node tools/profile-continuity.mjs`
untuk simulasi (tanpa tes/encoding/rekaman bersamaan).

## Album foto dan aset proposal — 3 November 2026

Salin foto ke `foto-website/galeri/`; saat `npm run dev` berjalan, album tambahan
`#album` diperbarui otomatis. Folder discover/pengalaman/fasilitas/momen/lokasi
dan kuliner per ID menu juga tersedia. Panduan lengkap: [folder foto](foto-website/README.md).
Sinkronisasi manual: `npm run photos:sync`. Build melakukan sinkronisasi otomatis;
website yang sudah dipublikasikan perlu build/unggah ulang. Ini workflow lokal
berbasis file, tanpa dashboard, database atau API upload. Caption/alt/kredit/order
opsional melalui `foto.json`. Original tetap aman, derivatif dioptimasi dan metadata
EXIF dihapus. Seed album13 foto yang sudah diizinkan; total manifest gabungan75 aset.

Paket proposal di `deliverables/coastal-asset-kit/`:15 kelompok SVG/PNG/WebP,
48 frame animasi,8 model GLB/OBJ dengan6 clip, sumber generator/prompt, board,
preview MP4/WebM dan viewer offline melalui HTTP. Studio model:
`node tools/preview-coastal-kit.mjs`, lalu buka http://127.0.0.1:4181/viewer/.
Preview2D: http://127.0.0.1:4181/viewer/animation.html.
Laporan: [aset pesisir](docs/implementation/COASTAL_ASSET_KIT.md),
[foto lokal](docs/implementation/LOCAL_PHOTO_WORKFLOW.md).
Three.js0.187.0 MIT hanya alat produksi aset; halaman tetap memakai Canvas/GSAP.
Tidak ada file Blender yang diklaim. Pohon/satwa merupakan ilustrasi tematik,
bukan verifikasi jenis yang ditemukan di lokasi.

Handoff implementasi dan daftar file/pemeriksaan terbaru: [aset + album](docs/implementation/ASSET_ALBUM_HANDOFF.md). Paket siap lampiran: [ZIP aset](deliverables/Pantai-Nuansa-Coastal-Asset-Kit.zip).

## Jika animasi diam di Chrome/Edge

Saat perangkat mengaktifkan pengurangan gerakan, animasi lingkungan dan slider otomatis diam secara default. Klik **Aktifkan animasi** di kanan bawah untuk menghidupkannya khusus situs ini; pilihan tersimpan dan bisa dimatikan kembali. Tidak perlu mengubah Windows atau menjalankan server berbeda. Intro/scroll tetap menghormati pengurangan gerakan dan audio tetap mute. Gunakan origin yang sama karena localhost dan127.0.0.1 memiliki penyimpanan berbeda. Diagnosis native Chrome/Edge dan hasil uji: [perbaikan preferensi gerak](docs/implementation/NATIVE_BROWSER_MOTION_FIX.md).

## Homepage ringkas dan halaman koleksi

Homepage kini menampilkan3 menu pilihan,4 media dan1 informasi fasilitas, dengan Lihat semua ke `/menu/`, `/galeri/`, `/fasilitas/`. Koleksi lengkap memakai sumber JSON/folder yang sama. Pilihan menu/jumlah preview dan copy halaman ada di `content/pages.json`; daftar menu tidak lagi dibatasi8 item. Halaman menu juga menautkan gambar menu asli untuk rincian yang belum ditranskripsi. Foto `foto-website/galeri/` tampil pada halaman Galeri; homepage hanya cuplikan. [Arsitektur, sumber dan hasil pemeriksaan](docs/implementation/HOMEPAGE_DETAIL_PAGES.md).

Build menjalankan normalisasi nama segment ekspor Next16.4 pada Windows. Unggah seluruh `out/`, termasuk seluruh file `__next*.txt` dan subfolder route, agar navigasi klien berfungsi.
