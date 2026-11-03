# Animation System

## Dua sumber gerak
1. Ambient autonomous: ombak, awan, daun, burung, pantulan cahaya. 2. Scroll-controlled: camera pan, zoom, photo reveal, pinned gallery, section transitions. Jangan menggabungkan keduanya secara tidak terkendali.

## GSAP conventions
Timeline per scene dengan scope/context dan cleanup; ScrollTrigger dengan scrub hanya jika relevan; hindari excessive pinning dan transform layout thrash; gunakan transform/opacity/mask terukur; refresh saat ukuran media berubah.

## Intro
State machine: `loading` → `ready` → `playing` → `skipped/completed` → `hero`. Session flag untuk tidak mengulang terus; skip tersedia sejak awal; no forced sound; no hard reload.

## Media motion presets
`photo-reveal-mask`, `staggered-editorial`, `cinematic-scale`, `horizontal-gallery`, `foreground-wipe`, `camera-depth`, `light-transition`. JSON memilih preset + parameter aman; implementasi di TypeScript, tidak eval string.

## Reduced motion
Hapus scrub/pinning kompleks, gunakan static scene dan konten langsung; pertahankan navigasi, caption, galeri, video controls. Animasi dekoratif tidak boleh menjadi satu-satunya cara memperoleh informasi.

## Interaction states
Hover, focus, tap, open, close, escape; pointer hit targets cukup besar di mobile. Jika animasi sedang berlangsung, hindari double-trigger dan race conditions.
