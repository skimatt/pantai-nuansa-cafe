# Arsitektur fondasi

## Data
Sembilan JSON → Zod (`src/lib/content.ts`) → referential/file/URL/license guards (`tools/validate-content.ts`) → Next server rendering + props serializable → CoastalArrival client → static export `out/`.

Schema library tidak dikirim ke browser. Copy, CTA, navigasi, menu, metadata dan alt dari JSON. Behavior TypeScript, tanpa eval/kode dari JSON. Scene lanjutan tetap spesifikasi; hanya anchor yang sudah diimplementasikan aktif.

## Renderer/lifecycle
Revisi motion 2026-11-03: HTML semantik untuk konten, native Canvas 2D untuk lingkungan hidup, GSAP/ScrollTrigger untuk kamera dan media. Kamera intro dan Hero tetap memakai DOM yang sama. Canvas menggambar deformasi air, buih, rig batang/daun, burung dan pasir; gambar semula menjadi tekstur dan fallback. Tidak menambah controller scroll, dependency renderer, WebGL, atau layanan berbayar. Detail dan bukti di `MOTION_REBUILD.md`.

Opening ready/playing/hero; final HTML terlihat tanpa JavaScript. Skip memajukan timeline dan menyimpan flag sesi dengan guard storage. Deep link/reduced motion langsung Hero. Replay membangun ulang context. Perubahan reduced motion runtime mengakhiri intro. Visibility menjeda audio/gerak; unmount membersihkan context, ScrollTrigger, listeners dan AudioContext.

Native dialog memberi focus containment, Escape dan fokus kembali ke pemicu. Katalog/gambar menu dimuat saat diminta. Navigasi mobile disclosure dengan Escape. Audio berupa noise terfilter pada user gesture; tidak ada recording atau autoplay. Suara aktif tidak otomatis diputar setelah reload untuk menghormati browser gesture/default mute.

## Visual/performance
Desktop 1440×900, mobile 390×844/360×800, tablet 768×1024. Crop/layout mobile tersendiri. Master + cloud/wave/bird SVG + foreground painterly alpha; mist lokal untuk keterbacaan, bukan pengganti environment. Picture + eager/high-priority image memilih satu background dan menghindari preload desktop pada mobile. Katalog lazy, font WOFF2 lokal, tanpa request eksternal runtime.

Noindex selama prototipe. Domain/canonical/gambar sosial absolut sebelum rilis; tidak memakai schema bisnis dengan fakta rekaan. Static export tanpa API bisnis.

## Referensi primer
- https://nextjs.org/docs/app/guides/single-page-applications
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- https://gsap.com/standard-license/

Versi npm aktual 2026-11-03 dikunci package-lock.json. Stack Next dipertahankan, tidak diganti Sites/Vinext; checkpoint lokal tanpa pendaftaran hosting.
