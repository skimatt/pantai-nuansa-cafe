# Paket aset pesisir untuk proposal dan website

Permintaan 2026-11-03: aset harus berupa file yang dapat dilampirkan pada proposal,
bukan hanya gerak yang tertanam dalam kode website. Hero yang diterima dipertahankan.

## Rencana produksi

1. Master prosedural Three.js untuk objek/rig3D dan SVG berlayer untuk shape2D.
2. Ilustrasi pohon transparan memakai imagegen built-in untuk kesesuaian painterly.
3. Keluaran: GLB/OBJ yang dapat diedit di tool3D, SVG berlayer, PNG transparan,
   WebP web, spritesheet burung/bangau, frame ombak dan pasir, manifest/provenance,
   lembar aset bernomor, preview animasi dan paket ZIP proposal.
4. Tinjau preview, validasi alpha/dimensi/path/rig lalu integrasikan aset terpilih
   pada lingkungan/transisi website. Tidak menambahkan fakta fasilitas/vegetasi.
5. Build, lint, typecheck, unit/browser serta screenshot desktop/mobile setelah integrasi.

## Batas interpretasi dan tool

Blender MCP diperiksa: server lokal tidak berjalan; Blender juga belum ditemukan
pada PATH/lokasi instalasi standar. Tidak mengubah scene pengguna, mengunduh Blender
besar atau berpura-pura membuat .blend. Three.js dipakai untuk master GLB/OBJ;
SVG/Canvas untuk ekspor2D dan preview. Panggilan imagegen memakai tool bawaan,
bukan API key/provider berbayar baru; kuota/tarif akun tidak dapat diinspeksi.

Pohon ramping pesisir/cemara, ketapang dan beringin adalah interpretasi tematik.
Nama lokal 'sekay/arun' belum teridentifikasi pasti. Tidak mengklaim spesies tersebut
benar-benar ada di Pantai Nuansa Cafe; bangau/burung juga ilustrasi, bukan inventaris
satwa lapangan. Semua aset generated/prosedural dilabeli konsep pada manifest.

Artefak2D generated dan model3D prosedural memiliki provenance masing-masing;
jangan menyebut raster imagegen sebagai hasil render GLB. Tidak mengambil aset
website lain atau gambar berhak cipta. Hasil pemeriksaan lisensi/audit dan bukti
produksi akan dicatat setelah tool dijalankan.

## Hasil produksi aktual

`deliverables/coastal-asset-kit/` berisi15 kelompok: ombak bergerigi, ombak
menggulung, tepi buih, bukit pasir, hembusan pasir, camar terbang, bangau terbang,
bangau berdiri, pohon pesisir ramping, ketapang tematik, beringin tematik, rumput,
batu, kerang dan ranting. Tersedia SVG berlayer, PNG alpha dan WebP; lima rangkaian
animasi memiliki total48 frame beserta atlas. Pohon painterly berasal dari satu
lembar imagegen transparan, dipisahkan dan dibersihkan; original/prompt disimpan.

Delapan model GLB/OBJ dibuat melalui Three.js0.187.0. Enam clip pada GLB menggerakkan
ombak, dua burung dan tiga pohon. OBJ adalah geometri statis. Model struktural
dan ilustrasi painterly merupakan jalur produksi berbeda, bukan klaim render3D.
Generator sumber, original raster, manifest dan lisensi MIT Three.js ikut paket.
Regenerasi di repository memerlukan Node/dependency project, Python/Pillow untuk
alpha cleanup; FFmpeg hanya untuk konversi rekaman preview. Binary tidak dikirim
ke website. Viewer HTTP memakai modul lokal, tanpa CDN atau akun eksternal.

Validasi file:15/15 gambar memiliki kanal alpha transparan dan isi terlihat;
layer SVG diperiksa; frame animasi berbeda; delapan GLB memiliki header/ukuran
valid dan pasangan OBJ. Viewer WebGL benar-benar memuat8/8 model, tanpa error,
serta mengenali enam clip. Bukti: `evidence/test-runs/coastal-kit-files.json`,
`coastal-model-validation.json`, `evidence/screenshots/kit-model-studio.png`.
Board dan preview Canvas ditinjau visual. Rekaman12detik MP4/WebM dan still PNG
di `proposal/motion-preview.*` berasal dari browser berjalan, tanpa page error.

Integrasi website memakai derivatif ringan pada `public/assets/coastal-kit/`:
atlas ombak untuk tirai navigasi, flap burung, pasir dan pohon suasana yang
dimuat saat mendekati viewport. Three.js hanya devDependency untuk produksi
aset/viewer, tidak ditambahkan sebagai renderer halaman promosi. Hero yang
disetujui dipertahankan; satu scheduler lingkungan tetap dipakai.

Biaya/keamanan: tidak membuat API key, akun, transaksi atau langganan. Imagegen
memakai tool bawaan; tarif/kuota akun tidak dapat diperiksa. Three.js MIT diperiksa
sebelum pemasangan versi terkunci dengan install scripts dinonaktifkan. Audit
produksi0 temuan; audit seluruh dependency16 moderate pada alat pengembangan
yang sudah tercatat, tanpa temuan Three.js. Raw audit disimpan di
`evidence/test-runs/coastal-{production,full}-audit.json`. Tidak mengambil aset
referensi website atau mengklaim izin merek/vegetasi lokasi dari ilustrasi.
