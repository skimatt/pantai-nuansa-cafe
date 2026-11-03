# Pipeline aset fondasi

1. Brief dan safe area: `docs/implementation/ART_BIBLE.md`.
2. Generate lewat imagegen built-in, prompt: `assets-source/prompts-v1.json` dan `palm-prompt-v2.txt`. Tidak ada runner API berbayar, retry otomatis, atau fallback diam-diam. Inspeksi setiap hasil dan simpan PNG di `assets-source/generated/`.
3. `node tools/generate-layers.mjs`: SVG orisinal. Palm SVG v1 dipertahankan sebagai alternatif editable; final memakai foliage alpha v2.
4. `npm run assets:process`: Sharp resize/WebP dengan alpha; original tidak dihapus. Output di `public/assets/`, ukuran di `assets-source/processed-assets.json`. Crop mobile terpisah.
5. Update `content/media.json`: ID, dimensi, pivot/depth, scene, sumber, status, placeholder, provenance.
6. `npm run assets:validate`, test, build, screenshot dan inspeksi desktop/mobile.

Atlas/spritesheet tidak dibutuhkan oleh beberapa layer DOM/SVG; tidak ada build-atlas yang tidak terpakai. `configure-content.py` setup satu kali, bukan editor konten. `npm run licenses` mencatat paket langsung. `node tools/performance.mjs` mengukur simulasi lokal Chromium, bukan skor perangkat nyata atau field INP.

P3: `node tools/inspect-source-media.mjs` menyiapkan contact sheet/metadata/frame; `node tools/prepare-journey-assets.mjs` menghasilkan WebP foto, poster, video silent 14 detik dan varian environment. Sumber asli tidak diubah. FFmpeg lokal harus tersedia pada PATH; binary tidak dibundel ke web. Script `configure-journey-content.py` adalah setup sekali, jangan dijalankan ulang pada konten editorial final. `node tools/profile-journey.mjs` menguji transfer dan pemuatan video opt-in pada preview produksi port 4173, sesudah e2e selesai.
