# Scene Architecture

## World model
Empat lingkungan besar yang saling bertransisi: Coastal Arrival (opening+Hero), Journey Through Nuansa (Discover+Experience), The Cafe (Explore+Taste), Golden Memories (Moments+Find Us+Footer). Kontinuitas lewat camera pan, depth zoom, foreground wipe, light shift; hindari hard-cut antarlatar kecuali ada alasan naratif.

## Layering
Sky → distant cloud → horizon → ocean → shoreline → structures → foreground foliage → lighting/particles → hotspot overlays. Pisahkan layer yang bergerak independen, simpan pivot/anchor, bounds, zIndex, safeArea.

## Renderer strategy

Revisi implementasi 2026-11-03 (D023): opening/Hero menggunakan native Canvas 2D dengan tekstur ilustrasi, deformasi air dan rig daun tersegmentasi. GSAP tetap mengatur kamera/scroll HTML. DPR/FPS dibatasi, RAF dijeda saat offscreen/hidden dan dibersihkan; reduced motion menjadi still. Lihat `docs/implementation/MOTION_REBUILD.md` dan hasil pengukuran aktual sebelum menambah renderer lain.
PixiJS untuk environment dengan banyak sprite/particle/masks; GSAP untuk DOM media dan transisi; HTML semantik untuk teks. Gunakan satu scroll orchestration layer, satu animation lifecycle manager. Pertimbangkan `prefers-reduced-motion`, visibility pause, low-power fallback.

## Scene contract
`id`, `backgroundAssetIds`, `layers`, `camera`, `breakpoints`, `hotspots`, `timelinePreset`, `audioZone`, `fallbackImage`, `loadingPriority`. Validasi terhadap schema; scene tidak boleh memuat file tanpa manifest.

## Transition contract
Tentukan start/end state, continuity anchor, z-index, scroll trigger, fallback, cleanup. Intro end state = Hero start state untuk mencegah flash/reload.


## Kontinuitas lanjutan — D025–D028

Tujuh scene setelah Hero berbagi scheduler24Hz (`atmosphere-clock.ts`). Hanya
canvas yang dekat viewport memiliki backing store penuh; offscreen kembali1×1.
Foreground mobile mengikuti jendela baca dalam section panjang. `WaveNavigation`
memberi transisi anchor tanpa scroll controller kedua; `PhotoSurf` memakai cover
SVG statis bergerak, menghindari animated polygon clip. Galeri native horizontal
memakai autoplay terkendali; reduced motion/data-saver, hover/focus, modal, tab
hidden atau jeda mematikannya. Detail dan bukti di implementation/SCENE_CONTINUITY.md.
