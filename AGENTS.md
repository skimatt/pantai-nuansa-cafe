# AGENTS.md — Pantai Nuansa Cafe

> Instruksi otoritatif untuk Codex/agent pengembang. Baca seluruh `docs/` dan manifest sebelum menulis kode. Proyek ini adalah website promosi multimedia interaktif berbasis MDLC, bukan aplikasi pemesanan atau CMS.

## 0. Misi dan definisi selesai
Bangun website **single-page cinematic multimedia scrollytelling** yang terasa seperti perjalanan menjelajahi Pantai Nuansa Cafe: opening 2D, Hero menyatu, lingkungan ilustrasi hidup, foto/video nyata terintegrasi dalam scroll, fasilitas, kuliner, galeri, lokasi, dan penutup. Prioritaskan kualitas visual, kegunaan, kecepatan, kebenaran informasi, dan aksesibilitas. Selesaikan implementasi end-to-end sampai bisa di-build dan diuji; jangan klaim selesai hanya karena kode berhasil dibuat.

## 1. Keputusan terkunci
- Next.js App Router + TypeScript + Tailwind CSS; GSAP/ScrollTrigger; PixiJS bila kompleksitas scene membutuhkannya; HTML5 video; Howler.js opsional; Lenis opsional; Blender MCP opsional.
- Static JSON-driven: tanpa database, API bisnis, login, CMS, dashboard admin, transaksi, checkout, booking, atau pemesanan. Perubahan konten dilakukan pada JSON, lalu build/deploy ulang.
- Bahasa antarmuka Indonesia. Semantik HTML, metadata SEO, akses keyboard, reduced motion, audio mute default.
- Desain **environment-first**: latar berupa scene ilustrasi 2D berlapis yang hidup, bukan warna polos/gradient generik. Foto/video asli tetap tampil sinematik.
- Opening 2D ~5–6 detik sebagai target, tombol lewati, dimainkan sekali per sesi bila sesuai; transisi **seamless** ke Hero tanpa reload atau cut hitam.
- Section: Hero, Discover, Experience video, Explore fasilitas, Taste/menu, Moments galeri, Find Us, Footer.
- Menu unggulan 5–8 item jika datanya tersedia; overlay katalog opsional; tanpa pemesanan. Foto menu prototipe **harus dihasilkan oleh agent** terlebih dahulu, diberi label placeholder dan tidak boleh disalahartikan sebagai produk asli.
- Konten promosi/fasilitas/harga/lokasi yang belum dikonfirmasi tidak boleh dikarang. Proposal adalah acuan riset, bukan izin mengada-ada data.

## 2. Urutan prioritas dokumen
1. `docs/PROJECT_SPEC.md` dan `docs/SCOPE_AND_DECISIONS.md`.
2. `docs/ART_DIRECTION.md`, `docs/DESIGN_SYSTEM.md`, `docs/SCENE_ARCHITECTURE.md`.
3. `docs/STORYBOARD.md`, `docs/ANIMATION_SYSTEM.md`, `docs/ASSET_PIPELINE.md`.
4. `docs/CONTENT_SCHEMA.md`, `docs/AUDIO_VIDEO.md`, `docs/ACCESSIBILITY_SEO.md`.
5. `docs/PERFORMANCE.md`, `docs/TESTING.md`, `docs/MDLC_DOCUMENTATION.md`.
6. `docs/AGENT_WORKFLOW.md`, `docs/DEPLOYMENT.md`, `docs/SECURITY_LICENSING.md`.
Jika konflik, keputusan eksplisit pengguna di atas mengalahkan rekomendasi implementasi. Catat konflik di `docs/DECISION_LOG.md`.

## 3. Aturan anti-AI-slop — WAJIB
- DILARANG: layout SaaS, dashboard, hero dengan gradient abstrak, card berulang, section berupa kotak-kotak, glassmorphism berlebihan, glow dekoratif, ikon tanpa fungsi, animasi asal-asalan, dummy Lorem Ipsum.
- Gunakan full-bleed illustrated environments, komposisi editorial, negative space, tipografi kontras, transisi yang memiliki motivasi naratif. Card hanya bila fungsi membutuhkannya (contoh katalog overlay), bukan default.
- **Background adalah karya visual utama**, dibangun dari layer sky, cloud, horizon, ocean, land, environment, foreground, light/particles, interactive hotspots.
- Setiap scene harus memiliki focal point, depth hierarchy, safe area teks desktop/mobile, palet atmosfer, dan continuity dengan scene sebelum/sesudahnya.
- Dilarang menambahkan fitur/section hanya demi terlihat lengkap. Gunakan kriteria penerimaan visual sebelum maju.

## 4. Kewenangan agent untuk aset dan tool
- Agent WAJIB membuat aset awal sendiri: environment opening/Hero, layer, pohon, awan, ombak, ikon, menu ilustratif, poster video, placeholder foto/video, dan scene pendukung. Prioritaskan aset asli dengan style bible.
- Jalur: image generation API/tool tersedia; SVG kode; canvas/Python; repository aset berlisensi; procedural graphics; spritesheet; pemrosesan dengan Sharp/Pillow. Blender MCP hanya jika menambah nilai nyata dan tersedia/diizinkan.
- Jangan menganggap model image-generation API/MCP tersedia sebelum memeriksa akses. Jika tidak tersedia, buat aset SVG/prosedural berkualitas, dokumentasikan gap, dan jangan berpura-pura sudah generate aset fotorealistis.
- Jangan scraping gambar berhak cipta atau menyalin aset website referensi. Periksa lisensi per aset, simpan attribution/source/provenance. Jangan commit API key atau secret.
- Aset gambar menu hasil AI wajib diberi `isPlaceholder: true`, `verified: false`, `sourceType: generated`, dan teks UI prototipe yang tidak menyatakan makanan itu benar-benar tersedia.
- Dilarang memakai gambar hasil generasi yang menyiratkan fasilitas tidak ada sebagai fakta lokasi. Gunakan referensi observasi resmi untuk elemen spesifik.

## 5. Implementasi dan pemisahan tanggung jawab
- Konten di `/content/*.json` dan validasi dengan Zod/JSON Schema. Jangan hardcode copy pemasaran di JSX.
- Teks SEO, metadata, label CTA, galeri, fasilitas, menu, lokasi, audio, intro, pengaturan scene, preset animasi ditarik dari JSON bila tepat.
- Animasi kompleks dan behavior ditulis di TypeScript, **bukan** mengeksekusi string kode dari JSON.
- Gunakan HTML untuk teks/CTA/foto/video yang perlu diindeks; PixiJS untuk layer lingkungan yang benar-benar membutuhkan renderer; GSAP untuk transisi dan scroll; hindari duplikasi scroll controller.
- Semua event listener, ticker, timeline, audio, observer harus dibersihkan saat unmount. Lazy-load scene berat, jaga hydration Next.js.
- Tetapkan komposisi mobile tersendiri; jangan sekadar scale desktop. Pastikan keyboard navigation, focus, alt, caption/subtitle video bila tersedia, mute, skip intro, reduced motion.

## 6. Workflow wajib (jangan langsung membuat semua halaman)
1. Audit repository; tulis rencana dan daftar asumsi. Validasi ketentuan proposal yang tersedia; jika dokumen sumber tidak tersedia, tandai belum diverifikasi.
2. Susun art direction, reference board, asset manifest, storyboard dan shot list; cek lisensi.
3. Bangun pipeline aset (generate → edit → layer → optimize → validate → manifest).
4. Hasilkan aset **opening + Hero** dan aset **menu prototipe**; cek preview dan provenance.
5. Implementasikan opening + Hero secara lengkap, transisi seamless, audio mute, reduced motion, desktop/mobile.
6. Screenshot review desktop/mobile, iterasi sampai quality gate lolos.
7. Implementasikan Discover → Experience → Explore → Taste → Moments → Find Us → Footer satu per satu.
8. Isi JSON dengan data yang terverifikasi; placeholder untuk data yang belum tersedia.
9. Jalankan lint, typecheck, build, test fungsi, accessibility, performance; dokumentasikan hasil aktual (jangan mengarang skor).
10. Siapkan deployment dan dokumentasi MDLC serta bukti pengujian.

## 7. Quality gates wajib
Setiap scene harus memenuhi: tidak ada error console/build; visual bukan template generik; scene hidup tetapi tidak mengganggu baca; animasi scroll reversible dan stabil; semua asset resolved; mobile 360px dan desktop 1440px tertangani; tombol dapat diklik/keyboard; reduced-motion fallback; suara tidak autoplay dengan volume; media tidak blocking LCP; keterangan faktual diverifikasi; tidak ada broken link; performa diuji pada perangkat menengah.

## 8. Perintah verifikasi minimal
Gunakan skrip project yang benar-benar tersedia: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test` dan e2e jika disediakan. Jangan mengklaim perintah berhasil tanpa mengeksekusinya. Lakukan review screenshot dan tulis laporan issue.

## 9. Kondisi penghentian dan eskalasi
Tanyakan ke pemilik proyek jika diperlukan informasi faktual (alamat tepat, menu, harga, fasilitas, foto/video asli), izin API berbayar, lisensi ambigu, atau perubahan ruang lingkup. Sambil menunggu, lanjutkan komponen yang tidak bergantung pada data tersebut dengan placeholder berlabel.

## 10. Handoff
Kirim daftar file yang dibuat, screenshot, cara run, sumber aset, biaya/layanan eksternal yang dipakai, checklist fitur, test report, known issues, dan kebutuhan data asli dari pengelola. Jangan menyebut 'sempurna' tanpa bukti review.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
