# Build and Deployment

## Revisi halaman detail — 3 November2026

Ekspor kini berisi `/`, `/menu/`, `/galeri/` dan `/fasilitas/`. Upload seluruh
`out/` beserta berkas `.txt` RSC dan direktori route. Build menjalankan
`tools/normalize-static-export.mjs` untuk alias nama segment Next16.4 Windows;
jangan melewati tahap itu saat menyiapkan hasil publikasi. Tidak perlu backend
atau rewrite bisnis. Tes memeriksa navigasi Next Link dan response404 pada
server statis biasa, selain pemuatan langsung tiap halaman.

## Environment
Node LTS compatible with installed Next.js; lockfile; `.env.example` without secrets; local `.env` ignored. Document exact package manager and commands after project scaffold.

## Release
Validate JSON, assets, links, licenses → lint/typecheck/tests → build → smoke test production preview → deploy to compatible host → inspect mobile/live links. For static export, confirm all routes/features are compatible; otherwise use standard Next.js hosting without adding database.

## Content update
Edit `/content/*.json`, replace referenced files, run validation/build, redeploy. No admin interface. Maintain backup and version control. Preserve asset IDs or update manifest references.

## Operational docs
README installation, environment requirements, media replacement guide, how to regenerate assets, fallback procedures, license credits, known limitations.

## Implementasi aktual — 3 November 2026
Node 24.19.0 / npm 11.17.0 digunakan. `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run test:e2e`. Build menjalankan license-report dan validasi, lalu mengekspor seluruh website ke out/. `npm run preview` menyajikan hasil di port 4173; development port 3000 terpisah. Upload seluruh out/, termasuk _next, assets, icon dan licenses; bukan hanya index.html. Konfigurasi sekarang memakai root domain, belum basePath untuk subdirectory hosting. Tidak ada runtime API key/database.

Belum publikasi ke host. Sebelum rilis: domain/canonical/OG absolut dan indexing, uji perangkat fisik/cross-browser, review sumber/izin, konfirmasi jam bila ingin ditampilkan, serta cocokkan Distribution dengan proposal. Tidak menambahkan akun hosting atau menimbulkan biaya deployment pada sesi ini.
