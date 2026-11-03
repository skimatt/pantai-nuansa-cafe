# Laporan checkpoint opening + Hero — 3 November 2026

Snapshot sebelum P3. Status implementasi terkini ada di [P3_REPORT.md](P3_REPORT.md); output pengujian/screenshot dengan nama umum dapat diperbarui oleh regression run berikutnya.

## Hasil dan batas checkpoint
Fondasi P0–P2 telah diimplementasikan, dibuild dan ditinjau dalam browser lokal. Ini **bukan laporan selesai seluruh website**. Scene Discover, Experience, Explore, Taste penuh, Moments dan Find Us belum dibuat. Prolog dan katalog konsep adalah pendamping checkpoint, bukan klaim bahwa scene tersebut telah selesai. Quality gate perangkat fisik, lint security tooling dan persetujuan visual pemilik masih terbuka.

## Implementasi
- Next.js 16.4.4 App Router + React/TypeScript + Tailwind, ekspor statis `out/`.
- Hero environment painterly, master pantai + crop mobile + awan/ombak/burung + foreground alpha terpisah.
- Opening target 5,5 detik, DOM/kamera menyatu ke Hero, skip sejak pemutaran, sekali per sesi, replay, deep-link skip, reduced motion, fallback tanpa JS dan storage diblokir.
- GSAP context/ScrollTrigger reversible, ambient ringan, visibility pause/cleanup.
- Navigasi desktop/mobile dan keyboard, focus indicators, skip-content, katalog native dialog dengan Escape/fokus kembali.
- Audio ombak sintetis opt-in, mute default, error fallback, cleanup AudioContext. Reload selalu mute; tidak menjanjikan autoplay preferensi aktif.
- Delapan gambar konsep makanan/minuman individual, label AI, verified=false/isPlaceholder=true/sourceType=generated, harga/ketersediaan null. Katalog lazy-loaded.
- Semua copy/konten di JSON, sembilan schema Zod, guard duplikasi/referensi/URL/path/placeholder, file dan provenance sebelum build. Zod tidak masuk bundle browser.
- Metadata Indonesia dan noindex untuk pratinjau; tanpa alamat/jam/review/schema bisnis fiktif.

## Verifikasi aktual
Lingkungan: Windows, Node 24.19.0, npm 11.17.0, Playwright 1.64.1 / Chromium 156.0.8078.4.

| Pemeriksaan | Hasil |
|---|---|
| npm run lint | Lulus, tanpa warning pada pemeriksaan final |
| npm run typecheck | Lulus |
| npm run test | 7 lulus, 0 gagal |
| npm run validate | 9 konfigurasi JSON, 14 aset, referensi/file/provenance/anchor aktif lulus |
| npm run build | Lulus; route statis /, not-found, icon; hasil out/ |
| npm run test:e2e | 8 lulus, 0 gagal pada run final (25,8 detik) |
| axe halaman + katalog | 0 pelanggaran terdeteksi pada desktop/tablet/dua mobile; bukan sertifikasi aksesibilitas |
| Console/page errors + HTTP gagal | Tidak ditemukan pada smoke opening desktop/mobile |
| Anchor aktif | Semua target ditemukan |
| npm audit --omit=dev | 0 temuan |
| npm audit seluruh dependensi | 16 moderate pada rantai alat ESLint/minimatch; 0 high/critical |

E2e: penyelesaian natural, kesinambungan node scene, skip/replay, sesi, default mute/toggle, dialog 8 item, Escape/focus containment/focus return, responsive/no overflow, file resolved, keyboard mobile, navigasi anchor, reduced motion runtime, storage diblokir, tanpa JavaScript, deep link, scroll maju/mundur dengan wheel. Tidak ada klaim uji Safari/touch fisik atau responden penelitian.

## Review visual dan perbaikan
Screenshot diperiksa pada 1440×900, 390×844, 360×800, 768×1024. Opening arrival/reveal/settle diperiksa untuk desktop/mobile. Contact sheet seluruh delapan gambar diperiksa. Lingkungan menjadi visual utama, headline terbaca, komposisi mobile sendiri, tombol tidak bertumpuk, tidak ada card stack di halaman.

Perbaikan dari iterasi: foreground SVG v1 terlalu masuk area teks → foliage painterly alpha v2 di sudut; label logo tidak cocok nama aksesibel → whitespace semantik; angka bab dan hover link kurang kontras → warna lebih gelap; modal terletak kiri atas akibat reset CSS → margin auto; preload desktop mengunduh gambar kedua di mobile → picture dengan eager/fetchPriority; schema Zod dikirim ke client → parsing server/build; screenshot lazy dialog diambil sebelum siap → tunggu dialog/gambar; uji scroll programatik bersaing dengan refresh media-query → gunakan interaksi wheel pengguna.

## Performa terukur
Lihat `evidence/performance/mobile-baseline.json`: simulasi viewport 390×844, CPU 4×, latency 150ms, download 200000 byte/s, HTTP lokal tanpa kompresi. Run final baseline: gerak normal LCP 1584ms, CLS 0,001999; reduced motion LCP 1516ms, CLS 0,001999. Transfer resource awal sekitar 1,05MB; versi mobile tidak lagi mengunduh master desktop dan menu tidak diunduh sebelum katalog dibuka. Sampel interaction duration tertinggi 112ms normal / 96ms reduced, **bukan field INP**. Interval frame median 16,7ms; p95 sekitar 33,4ms normal. Ini single-run sintetis dengan proses pengujian lain berjalan pada host, bukan benchmark terkontrol atau skor perangkat menengah. CPU long tasks masih tercatat; optimasi lanjut harus memakai profiling perangkat nyata.

Baseline sebelum optimasi disimpan terpisah. Jangan mengklaim peningkatan LCP dari dua run ini: beban host berbeda dan run sesudah tidak lebih cepat. Keuntungan yang terkonfirmasi adalah hilangnya request background duplikat dan berkurangnya transfer resource.

## Bukti
- `evidence/test-runs/e2e-results.json`
- `evidence/test-runs/axe-*.json` (halaman dan katalog untuk empat ukuran)
- `evidence/test-runs/opening-visual-smoke.json`
- `evidence/test-runs/npm-audit-production.json`, `npm-audit-final.json`
- `evidence/test-runs/dependency-licenses.json`
- `evidence/screenshots/hero-{desktop,mobile,small-mobile,tablet}.png`
- `evidence/screenshots/opening-{desktop,mobile}-{arrival,reveal,settle}.png`
- `evidence/screenshots/catalog-*.png`, `prolog-*.png`, `hero-reduced-motion.png`
- `evidence/screenshots/menu-contact-sheet.png`
- `evidence/performance/mobile-baseline.json`, `mobile-before-optimization.json`

## Lisensi, layanan, keamanan
Imagegen built-in untuk sepuluh output (master, foliage, delapan menu), SVG orisinal untuk layer/UI. Original PNG + exact prompts dipertahankan di workspace. Tidak ada scraping atau API key. Tidak berlangganan/membeli layanan berbayar terpisah; biaya/kuota internal tool tidak dapat diinspeksi. Font self-hosted OFL; GSAP Standard License; lisensi langsung tersimpan. Tidak memakai Blender atau plugin dengan eksekusi scene eksternal.

Sharp awal 0.34.5 memiliki advisory high, diperbarui ke 0.35.5. Audit produksi bersih. Temuan moderate16 berasal dari alat lint/transitive minimatch; tidak ikut static export, tetapi perlu ditangani sebelum menerima pola glob dari input tak tepercaya atau menjalankan tooling pada sumber tidak tepercaya. `npm audit fix --force` tidak dijalankan karena saran audit menurunkan ESLint/config ke versi tidak kompatibel. Catatan ini tidak menyatakan seluruh dependency bebas kerentanan.

## Kebutuhan pemilik dan gate terbuka
1. Review visual keyframe/screenshot; belum ada persetujuan eksplisit arah visual final.
2. Alamat/maps, jam, kontak/sosial, logo resmi, daftar menu/harga, fasilitas terverifikasi.
3. Foto/video sudah diizinkan lewat chat, tetapi URL sumber asli, kredit rinci, tanggal dan cakupan izin perlu dicatat sebelum publikasi dokumentasi.
4. Proposal resmi untuk judul, batas MDLC, instrumen/sampel pengujian; belum membuat data responden, SUS atau dampak kunjungan.
5. Uji Android/iOS menengah fisik, Safari/Firefox, orientasi, screen reader dan audio monitoring; audit otomatis tidak mencakup semuanya.
6. Website penuh, domain/canonical/social image, lisensi release review, deployment dan live QA.

## Handoff file dan langkah berikutnya
File implementasi utama: `src/components/CoastalArrival.tsx`, `ConceptCatalog.tsx`, `icons.tsx`; `src/app/page.tsx`, `layout.tsx`, `globals.css`, `icon.svg`; `src/lib/content.ts`, `intro.ts`, `ocean-audio.ts`. Konfigurasi: package/lockfile, Next/TypeScript/PostCSS/ESLint/Playwright, .gitignore/.env.example. Konten JSON diperbarui, delapan menu dan 14 referensi aset, sumber generasi dan tools pipeline/testing. Dokumen: audit, art bible, architecture, provenance, report, MDLC handoff dan decision log. Daftar rinci di `evidence/test-runs/created-files.txt`.

Jalankan `npm ci`, `npm run dev`; atau `npm run build` lalu `npm run preview`. Preview lokal tidak berarti sudah deploy. Repository awal belum Git; tidak membuat commit atau push. Setelah review fondasi, lanjut Discover/Experience dengan media berizin, kemudian Explore/Taste, Moments/Find Us/Footer, sambil mempertahankan quality gate per scene.
