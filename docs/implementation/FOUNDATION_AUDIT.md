# Audit fondasi — 3 November 2026

## Cakupan dibaca
AGENTS.md, README.md, 18 dokumen docs/, tools/README.md, dan seluruh sembilan JSON content/. Repository belum memiliki package.json, aplikasi, lockfile, atau Git. Proposal resmi tidak tersedia; batas penelitian dan Distribution belum diverifikasi.

## Tahap aktif
P0–P2: arsitektur, art direction, pipeline aset, delapan konsep menu, opening + Hero. Scene lanjutan tetap dalam spesifikasi, belum dinyatakan selesai. Tidak publikasi pada checkpoint ini.

## Keputusan
- Next.js App Router, TypeScript, Tailwind, GSAP/ScrollTrigger; ekspor statis.
- HTML semantik untuk konten, SVG/DOM untuk layer lingkungan. Tidak perlu Pixi, Lenis, Blender, database, atau layanan bisnis.
- Satu dunia dan satu timeline kamera untuk opening 5,5 detik dan Hero. Flag per sesi; skip, reduced motion, tab tersembunyi, storage diblokir dan JavaScript nonaktif mendapat fallback.
- Teks/fakta dan aset di JSON, Zod + pemeriksaan referensi, file, URL dan duplikasi sebelum build.
- Font Cormorant Garamond dan DM Sans self-hosted (OFL). Library diperiksa melalui metadata npm dan lisensi paket terpasang.

## Fakta dan hak
Pemilik mengonfirmasi izin foto/video Assets/foto-ig melalui chat (2026-11-03: “Sudah”). Konfirmasi ini tidak memverifikasi alamat, harga, fasilitas, atau identitas orang. Nama berkas dan detail fotografer dipertahankan; sumber unggahan asli masih diperlukan. Tidak scraping. Proposal dan logo resmi belum ada.

## Aset dan biaya
Imagegen built-in tersedia dan digunakan sesuai permintaan pengguna. Tidak membuka API berbayar terpisah, tidak memakai key, tidak berlangganan/membeli layanan. Harga/kuota internal tool tidak dapat diinspeksi. Tidak ada pembayaran tambahan yang diotorisasi. SVG orisinal untuk layer; gambar AI berstatus placeholder, bukan dokumentasi.

## Urutan quality gate
1. Art bible, frame, manifest, prompt.
2. Produksi dan inspeksi opening/Hero + delapan konsep menu.
3. Implementasi desktop/mobile, audio opt-in, fallback dan kontrol.
4. Lint, typecheck, build, uji konten + e2e + axe.
5. Screenshot 1440×900, 390×844, 360×800; tinjau dan perbaiki.
6. Laporan hasil aktual dan keterbatasan; lanjutkan scene lain setelah fondasi tervalidasi.

