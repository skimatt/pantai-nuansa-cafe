# Design System

## Prinsip
Environmental editorial layout. Layout fluid, tanpa card sebagai default. Gunakan semantic sections, grid hanya untuk tata letak bila diperlukan, bukan tampilan dashboard.

## Typography
Gunakan font display yang legal dan berkarakter untuk headline, sans modern untuk body; maksimal 2 keluarga. Skala clamp() responsif; body nyaman dibaca, line-height 1.5–1.7, panjang baris sekitar 45–75 karakter pada desktop.

## Tokens
CSS custom properties: `--ink`, `--ivory`, `--sand`, `--ocean`, `--palm`, `--sunset`, `--space-*`, `--radius-interactive`, `--z-environment`, `--z-media`, `--z-content`, `--z-navigation`, `--z-modal`.

## UI primitives
Navbar transparan adaptif, skip intro, mute toggle, scroll indicator, accessible buttons, media lightbox, modal katalog menu, hotspot info panel. Semua memiliki focus ring dan ESC close bila relevan.

## Motion
Default transisi ease dan durasi dari presets, bukan nilai acak. Perhatikan overscroll, pinning, focus, touch, reduced motion. Tidak mengunci scroll kecuali selama intro yang bisa dilewati dan tidak menghalangi akses.

## Layout responsive
Breakpoint berbasis konten, bukan sekadar perangkat. Komposisi scene mobile menggunakan crop/position/asset alternatif; hindari teks di atas area visual sibuk.
