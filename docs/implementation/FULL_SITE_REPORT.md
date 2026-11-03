> CHECKPOINT TERBARU: Hero diterima pengguna; kontinuitas semua scene, galeri13foto/3video dan verifikasi lokal35browser dijelaskan di [SCENE_CONTINUITY.md](SCENE_CONTINUITY.md). Laporan di bawah dipertahankan sebagai riwayat checkpoint.

> STATUS UPDATE 2026-11-03: Motion quality gate REOPENED after user rejection. Earlier tests establish functional checks only; see MOTION_REBUILD.md for revised implementation and evidence.

# Pantai Nuansa Cafe — laporan implementasi lokal

Tanggal: 3 November 2026, Asia/Jakarta. **Seluruh section telah diimplementasikan dan dapat ditinjau lokal. Belum deploy; quality gate rilis fisik/penelitian belum dinyatakan selesai.**

## Hasil
Single-page Next.js App Router + TypeScript + Tailwind + GSAP/ScrollTrigger, static JSON-driven tanpa database, API bisnis, login, CMS, transaksi atau pemesanan. Opening/scene memakai satu scroll browser, bukan navigasi game. Pixi/Blender/Lenis tidak ditambahkan karena kompleksitas layer belum membutuhkannya.

| Bagian | Implementasi |
|---|---|
| Opening + Hero | Lingkungan ilustrasi berlapis, kamera settle pada DOM yang sama, target 5,5 detik, skip, once per session, replay, reduced motion, muted default |
| Discover | Dua foto dokumentasi editorial, kredit fotografer, background pesisir, mask pada gambar dan scroll reversible; caption tidak dimask |
| Experience | Cuplikan asli 14 detik, poster asli, source baru saat klik, native controls, silent, deskripsi visual, pause offscreen/hidden/katalog, fallback dan retry |
| Explore | Dua hotspot keyboard/touch untuk area duduk di atas pasir dan pandangan pantai; hanya fakta yang dikonfirmasi pengguna, ilustrasi bukan dokumentasi bangunan |
| Taste | Enam makanan dengan nama/harga dari Menu.png yang dikonfirmasi; pemilihan gambar editorial, badge AI menempel pada foto, katalog dan sumber menu asli |
| Moments | Empat foto + satu video, native horizontal filmstrip, prev/next, viewer foto/video, Escape/arrows/focus return, tautan berkas untuk fallback no-JS |
| Find Us | Pin Maps pengguna, tel:+6285320542581, Instagram pengelola; jam/alamat jalan tidak dikarang |
| Footer/audio | Copyright/tagline dan kembali ke awal; mute dock lintas scene; ambient Hero berhenti saat offscreen; audio/video tidak autoplay |

Metadata Indonesia dan HTML semantik tersedia. Noindex tetap untuk pratinjau; canonical/OG absolut menunggu domain. Tidak membuat schema bisnis dengan alamat/jam/rating fiktif.

## Data yang dikonfirmasi pengguna
Izin foto/video Assets/foto-ig sudah dikonfirmasi. Pengguna menjelaskan area outdoor beratap, meja melingkar/kursi langsung di pasir, serta pandangan pantai. Istilah deskriptif dipakai agar tidak mengesankan lantai/panggung. Gambar fasilitas merupakan interpretasi ilustratif, bukan klaim konstruksi persis.

Menu.png dikonfirmasi masih berlaku. Enam pilihan: Nasi Goreng Telur Rp15.000; Nasi Goreng Ayam Rp20.000; Nasi Goreng Seafood Rp35.000; Nasi Goreng Chicken Katsu Rp30.000; Chicken Steak Black Pepper Rp35.000; Mie Aceh Kuah Telor Rp15.000. Pepper dinormalkan dari Papper; harga yang tidak tercetak/per ons tidak ditebak. Stock harian tetap null.

**Fakta nama/harga** pada menu bersumber owner dan verified=true. **Gambar penyajian AI** pada media tetap sourceType=generated, verified=false, isPlaceholder=true dan berlabel UI. Delapan konsep awal disimpan terpisah, tidak dipresentasikan sebagai menu minuman aktual. Menu asli disalin byte-identik dan hash dicatat.

Pin, telepon dan akun pengelola berasal dari pengguna. Pin HTTP HEAD diperiksa: redirect 302 ke Google Maps Nuansa Pantai Coffee. Akun Instagram ditandai pengelola; tidak dianggap akun merek, tidak mengasumsikan WhatsApp, dan tidak mengirim pesan/call melalui tool.

## Verifikasi aktual
Windows; Node 24.19.0, npm 11.17.0; Next 16.4.4, Chromium 156.0.8078.4 / Playwright 1.64.1. Browser QA memakai static export out/ di port 4173, terpisah dari development port 3000.

| Pemeriksaan | Hasil |
|---|---|
| npm run lint | Lulus, tanpa warning |
| npm run typecheck | Lulus |
| npm run test | 11 lulus, 0 gagal |
| npm run build | Lulus; license notices + validasi + static export |
| Validasi | 9 schema JSON, 32 asset IDs + varian, file/provenance/credit/referensi/anchor aman |
| npm run test:e2e | 26 lulus, 0 gagal/skipped/flaky; final run sekitar 88,1 detik |
| Axe | 36 laporan halaman/katalog/scene/viewer, masing-masing 0 pelanggaran terdeteksi |
| Smoke opening | Desktop/mobile: console/page/HTTP error tidak ditemukan, semua target anchor ditemukan |
| npm audit --omit=dev | 0 temuan |
| Audit semua dependency | 16 moderate pada rantai alat lint/minimatch, 0 high/critical; tidak diperbaiki dengan downgrade paksa |

Gate bertahap: P3 15 browser lulus sebelum P4; P4 5 kasus lulus sebelum integrasi P5; P5 6 kasus lulus; kemudian seluruh regresi 26 dijalankan bersama. Case mencakup skip/replay/sesi, storage diblokir, no-JS, reduced motion runtime, wheel maju/mundur, keyboard/dialog/fokus, harga/sumber menu, hotspot, source video opt-in, pause/lifecycle, error/retry, viewer video cleanup dan kontak. Visibility media diuji dengan event simulasi; bukan perpindahan aplikasi di ponsel nyata.

Review visual langsung pada 1440×900, 390×844, 360×800 dan tablet 768×1024. Tidak hanya mengandalkan build. Perbaikan mencakup safe area caption tablet, mask gambar tanpa kredit terpotong, posisi hotspot terhadap gambar mobile, badge AI pada foto, label/nama aksesibel, modal center/fokus, pemuatan video tertunda, encoding UTF-8 dan pemisahan QA produksi. Screenshot sesudah perbaikan disimpan.

## Performa terukur
Baseline terakhir: viewport 390×844, CPU 4×, latency 150ms, download 200.000 byte/s, HTTP tanpa kompresi. Profiling dijalankan sesudah e2e, mencakup Hero → video → menu → viewer → Find Us.

| Observasi | Normal | Reduced motion |
|---|---|---|
| LCP Hero | 2552ms | 2352ms |
| CLS | 0,001999 | 0,001999 |
| Resource selesai fase Hero | 1.234.588 byte | 1.234.588 byte |
| Request video sebelum klik | 0 | 0 |
| Request video sesudah klik | 1 | 1 |
| Observasi frame video pertama | 1827,4ms | 1771,9ms |
| Long task tertinggi dalam sampel | 227ms | 180ms |

Single run per mode di Chromium lokal, bukan perangkat menengah fisik, field INP, skor Lighthouse atau benchmark terkontrol. Frame timing mencakup overhead interaksi Playwright; resource selesai tidak mencakup transfer video yang masih parsial. Heap dalam JSON adalah sampel JS, bukan memori total/GPU. Tidak menyimpulkan peningkatan dari run berbeda atau mengarang skor performa/usability.

## Aset, lisensi, biaya
18 original PNG imagegen built-in, SVG orisinal, empat foto dokumentasi, satu cuplikan video beserta poster, dan menu owner. 32 ID media dengan varian; original/prompt di assets-source tidak ikut web export. Daftar source/transformasi/izin: ASSET_PROVENANCE.md, P3_PROVENANCE.md, P4_PROVENANCE.md, P5_PROVENANCE.md. Prompt: assets-source/prompts-v1.json, palm-prompt-v2.txt, journey-prompt-v1.txt, p4-prompts-v1.json, golden-prompt-v1.txt. Output web di public/assets/environment, menu, journey, cafe dan golden.

Imagegen menggunakan akses bawaan; tidak menambah provider, key, langganan atau pembayaran terpisah. Tarif/kuota internal tool tidak diekspos sehingga tidak mengklaim angka biaya nol. Sharp/FFmpeg sudah lokal; FFmpeg hanya untuk proses dan binary tidak dibundel. Tidak scraping aset situs lain, tidak menghapus watermark/kredit. Font OFL dan notice runtime disertakan dalam public/licenses serta out/licenses; versi/lisensi paket di dependency-licenses.json. GSAP memakai Standard License, bukan MIT.

## File utama dan bukti
Komponen: CoastalArrival.tsx, JourneyScenes.tsx, DocumentaryVideo.tsx, CafeScenes.tsx, GoldenScenes.tsx, GalleryViewer.tsx, ConceptCatalog.tsx, icons.tsx. CSS per dunia di src/app; content/ berisi sembilan JSON; src/lib memuat schema/intro/audio/formatter. Tools inspeksi/asset/lisensi/validasi/profiling, unit dan empat suite browser disertakan. Inventori: evidence/test-runs/final-files.txt.

- Hasil: evidence/test-runs/final-e2e-results.json, final-verification-summary.json, final-audit-production.json, final-audit-all.json, opening-visual-smoke.json, dependency-licenses.json.
- Aksesibilitas: axe-*.json, p3/p4/p5-axe-*.json.
- Visual: evidence/screenshots/hero-*.png, opening-*.png, p3/, p4/, p5/ dan final/.
- Performa: evidence/performance/full-site-mobile-baseline.json; baseline fase sebelumnya dipertahankan.
- Reproduksi: README.md, tools/README.md, docs/DEPLOYMENT.md.

## Batas dan kebutuhan rilis
Belum deployment, domain/canonical/OG absolut, uji Android/iOS fisik, Safari/Firefox, screen reader manual, penilaian ahli/responden atau validasi proposal. Jam operasional/alamat jalan/logo resmi serta rincian sumber/izin yang belum tercatat perlu dilengkapi bila ingin ditampilkan/dipublikasikan. Tidak ada data SUS atau klaim peningkatan kunjungan. Dev-tool advisories tetap terbuka; audit produksi bersih tidak berarti seluruh tooling bebas kerentanan. Distribution penelitian belum diklaim terlaksana.

Untuk melihat: development http://127.0.0.1:3000; hasil build `npm run preview` di http://127.0.0.1:4173. Build runnable dan seluruh section dapat ditinjau lokal. Lisensi rilis/data faktual, perangkat fisik dan lingkup Distribution merupakan gate terpisah, bukan dianggap selesai oleh keberhasilan kode.
