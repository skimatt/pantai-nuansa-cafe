# Decision Log

| ID | Status | Decision | Reason |
|---|---|---|---|
| D001 | Locked | Single-page promotional website | Scope of multimedia promotion |
| D002 | Locked | Static JSON-driven; no admin/database | Simplicity and maintainability |
| D003 | Locked | Environment-first illustrated 2D + real photos/videos | Distinctive cinematic experience with factual media |
| D004 | Locked | Opening seamless into Hero | Narrative continuity |
| D005 | Locked | Gallery + featured culinary menu | Promote beach and cafe |
| D006 | Locked | Agent generates placeholder menu art | Development can begin without final photos |
| D007 | Conditional | Blender MCP | Use only if justified and available |
| D008 | Pending verification | MDLC Distribution execution scope | Must match approved proposal |

Append new decisions with date, owner, tradeoffs, and impacted docs.

| D009 | Implemented 2026-11-03 | P0–P2 lokal: Next static export, DOM/SVG dan GSAP, belum Pixi/Blender/Lenis | Jumlah layer rendah; stack terkunci dipertahankan |
| D010 | Owner confirmed 2026-11-03 | Izin foto/video Assets/foto-ig via chat: “Sudah” | Hak dikonfirmasi; fakta bisnis, sumber/kredit rinci belum otomatis terverifikasi |
| D011 | Implemented 2026-11-03 | Master pantai, foliage alpha v2 dan delapan konsep menu dibuat lewat imagegen built-in | Placeholder, tanpa harga/ketersediaan rekaan, API key atau layanan berbayar terpisah |
| D012 | Checkpoint 2026-11-03 | Belum publikasi atau scene lanjutan pada fondasi opening + Hero | Permintaan terakhir bertahap; website penuh dan scope Distribution belum selesai/terverifikasi |
| D013 | Agent reviewed 2026-11-03 | Keyframe dipilih lewat review screenshot, belum persetujuan visual eksplisit pemilik | Kewenangan produksi dari pengguna; tidak mencatat persetujuan yang belum diberikan |
| D014 | Authorized 2026-11-03 | Pengguna meminta “ok lanjut”; lanjut P3 Discover/Experience dengan arah fondasi | Izin dokumentasi sebelumnya tetap berlaku; tidak meminta ulang |
| D015 | Implemented 2026-11-03 | Dua foto @raja_poutrett dan cuplikan video 0–14 detik; soundtrack dihapus | Dokumentasi nyata dibedakan dari environment imajinatif; tidak mengasumsikan hak musik |
| D016 | Implemented 2026-11-03 | Video opt-in, source kosong sebelum klik, pause offscreen/hidden/katalog | Kurangi transfer awal dan hormati kendali pengguna; tidak auto-resume |
| D017 | Tested 2026-11-03 | Preview QA produksi memakai port 4173 | Pisahkan static export dari server pengembangan yang sudah memakai 3000, tanpa menghentikan server yang tidak diketahui pemiliknya |
| D018 | Owner confirmed 2026-11-03 | Area duduk outdoor beratap, meja melingkar/kursi langsung di pasir, pandangan pantai | Istilah deskriptif dipilih agar tidak mengesankan lantai/panggung; ilustrasi bukan foto konstruksi |
| D019 | Owner confirmed 2026-11-03 | Nama/harga Menu.png masih berlaku; enam item jelas ditranskripsi | Fakta menu verified owner; foto tetap AI placeholder; stok harian null, harga ambigu tidak ditebak |
| D020 | Owner supplied 2026-11-03 | Pin Google Maps, telepon 085320542581 dan Instagram pengelola rs_risna22 | Pin diperiksa 302 ke Google Maps; tidak mengarang alamat/jam atau mengasumsikan WhatsApp |
| D021 | Implemented 2026-11-03 | Seluruh section, galeri fullscreen foto/video dan kontrol suara lintas scene | Native scrolling/media/dialog; tanpa controller kedua, backend atau transaksi |
| D022 | Tested locally 2026-11-03 | 11 unit + 26 browser dan 36 laporan axe | Hasil lokal/simulasi, bukan sertifikasi aksesibilitas atau pengganti perangkat fisik; belum deploy |

| D023 | User revision 2026-11-03 | Prior motion rejected as too static; reopen multimedia quality gate | Canvas 2D deformation, articulated foliage, dynamic surf, media depth and silent hover preview; no claim that previous functional checks prove motion quality |
| D024 | User supplied 2026-11-03 | Business Instagram nuansa_pantai_coffe | Distinct from owner account; fetch failed, no post content inferred |

| D025 | Owner accepted 2026-11-03 | Hero direction accepted explicitly: 'heronya udah sangat mantap' | Preserve Hero art; extend motion into following sections |
| D026 | Implemented 2026-11-03 | Seven following scene overlays share one visibility-aware scheduler | Frond reuse, wind/sand/birds and serrated surf; backing stores shrink to1×1 offscreen |
| D027 | User requested 2026-11-03 | All13 documentary photos plus three silent film excerpts in auto gallery | Owner permission persists; Menu.png stays in catalog; no invented dish availability or photo location |
| D028 | Implemented 2026-11-03 | Wave navigation and SVG paper/foam photo reveals | Animated polygon clip-path produced a Windows headless Chromium crash on long-distance seeking; SVG covers replace dynamic polygon masks, with rectangular overflow and reduced-motion/no-JS fallback |
| D029 | User requested / implemented 2026-11-03 | Separate reusable coastal asset kit,15 groups and8 editable GLB/OBJ models | Blender MCP unavailable; Three.js MIT generates structural models, original SVG/Canvas and imagegen produce2D assets; source paths and distinct provenance retained |
| D030 | User requested / implemented 2026-11-03 | Additional simple Album Foto and local per-section photo folders | Static build-time indexing plus development watcher satisfies local content workflow; no CMS backend/database/admin/API; published exports require rebuild/deploy |
| D031 | Tested 2026-11-03 | Source photo add/remove updates running development album13→14→13 | Explicit local publication intent recorded separately from original chat permission; no source deletion or invented business facts |
| D032 | Native browser reproduced / fixed 2026-11-03 | Installed Chrome and Edge inherit reduced motion; provide explicit ambient-animation opt-in | Honor system preference by default, offer a persistent site-only choice for Canvas environments and Moments; preserve reduced scroll/intro and mute default; do not change OS settings |
| D033 | Owner revision / implemented 2026-11-03 | Cinematic homepage previews plus static /menu/, /galeri/, /fasilitas/ detail pages | Explicitly supersedes single-page-only scope;3 selected dishes,4 media and1 facility aspect on home, complete collections behind Lihat semua; no backend/admin/booking, retain local folder workflow and verified facts |
| D034 | Owner revision / implemented 2026-11-03 | Living coastal backgrounds throughout all three detail collections | Reuse thematic trees, fronds, birds, sand and serrated surf; viewport-bound Canvas on shared clock, quiet centre, pause/reduced-motion opt-in; no new venue claims or external service |
| D035 | Owner refinement 2026-11-03 | Birds travel toward their right-facing beaks; intermittent sea breeze | Shared forward flight/glide paths and thin fading wind strokes, respecting pause/reduced motion; retain existing art and quiet text areas, no new services |
| D036 | Owner requested 2026-11-03 | Icon-only ambient/sound controls and visitor-facing Hero copy |34px visual circles inside44px hit targets, consistent dock, softer mute-default ocean; remove Hero scroll cue, art notice and preview status; retain truthful food-image labels |
| D037 | Owner supplied / implemented 2026-11-03 |11 menu choices in4 categories, Nuansa Pantai Café & Resto name/address/socials | Latest owner JSON supersedes six prior transcriptions; preserve per-ons units and Sanger range, archive old menu image; licensed HD reference photography with visible credits and serving-illustration label, no new paid service |
| D038 | Owner requested 2026-11-03 | Subtle reversible homepage section transitions | Reuse existing parallax and GSAP; short heading travel and media-only edge fade, preserve text contrast; no blur/new pin/scroll controller; explicit motion opt-in includes these gentle transitions |
| D039 | Owner requested / implemented 2026-11-03 | Replace sound with user-supplied GolderHour.mp3 mixed with original procedural ocean | Local FFmpeg mix, opt-in streaming, gentle fades and visibility/video/unmount cleanup; original retained, music publication rights unverified, no paid service |
| D040 | Owner requested / implemented 2026-11-06 | Lenis smooth wheel scrolling on homepage | MIT, pinned 1.3.27, shared GSAP ticker, native touch/reduced-motion fallback, modal lock and inertia-safe wave navigation; desktop local results improve, heavily throttled rendering remains limited; see implementation/SMOOTH_SCROLL.md |
