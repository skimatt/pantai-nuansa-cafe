# JSON Content Architecture

Revisi motion 2026-11-03: `animations.world` memuat `fps`, `pixelRatio`, `wind`, `surfPeriod`, `sandParticles` dengan batas numerik pada Zod. `site.ui` mencakup petunjuk interaksi, jeda/lanjut gerak dan label navigasi bab. `sections.journey.experience.previewAssetId` merujuk cuplikan hover senyap di manifest. Instagram bisnis terpisah dari akun pengelola pada `site.contact`. Behavior tetap TypeScript; JSON tidak menjalankan kode.

## Struktur
`content/site.json`, `navigation.json`, `opening.json`, `sections.json`, `menu.json`, `gallery.json`, `media.json`, `animations.json`, `scenes.json`. File UTF-8; satu sumber kebenaran untuk copy, path, status verifikasi, dan preset. Semua divalidasi Zod atau JSON Schema pada build.

## Rules
- Jangan hardcode teks promosi, alamat, jam, harga, label menu, caption, alt, kontak di JSX.
- Konten JSON bersifat data, tidak boleh mengandung executable JS atau arbitrary HTML.
- `verified=false` untuk fakta yang belum dikonfirmasi; UI tidak boleh menyajikannya sebagai klaim faktual.
- `isPlaceholder=true` untuk gambar menu AI dan media demonstrasi; di produksi harus diganti atau dilabeli eksplisit.
- Fitur enabled dan urutan section dapat diatur di JSON dengan schema, tetapi struktur animasi kompleks tetap kode.

## Minimal menu schema
`id`, `name`, `category`, `description`, `imageAssetId`, `price` (nullable), `featured`, `available` (nullable), `verified`, `isPlaceholder`. Jika data belum diketahui, gunakan placeholder yang tidak mengklaim menu tersedia.

## Minimal gallery schema
`id`, `type` image/video, `assetId`, `posterAssetId?`, `caption`, `alt`, `verified`, `credit`, `sortOrder`.

## Media manifest
`id`, `src`, `type`, `license`, `sourceType`, `verified`, `isPlaceholder`, `alt`, `width`, `height`, `variants`, `loading`, `sceneId`.

## Validation
Schema checking, referential integrity `assetId`, missing file checks, duplicate IDs, unsafe URLs, broken anchors, null-safe rendering, responsive fallback. Fail build untuk JSON rusak; warning untuk data belum diverifikasi.


Kontinuitas2026-11-03: `animations.atmospheres` berisi preset discover/experience/
explore/taste/moments/findUs (wind0.1–3,surf0–2,sand0–60,birds0–6,tone,side,
foliage0–1.5); `animations.navigation.duration`0.5–2detik;
`animations.gallery.intervalSeconds`4–15detik dan enabled. Label jeda/lanjut/
petunjuk otomatis dari `sections.golden.moments`. Gallery13 foto+3 video
semuanya merujuk owner media dengan permission; generated menu tetap terpisah.
