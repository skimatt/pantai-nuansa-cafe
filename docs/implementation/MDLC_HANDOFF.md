# Traceability MDLC — checkpoint fondasi

Tabel awal adalah snapshot historis. Status implementasi terbaru: FULL_SITE_REPORT.md dan pembaruan P4/P5 di bawah.

| Tahap | Bukti aktual | Batas |
|---|---|---|
| Concept | FOUNDATION_AUDIT.md, spesifikasi terkunci, konfirmasi izin lewat chat | Proposal dan riset lapangan belum tersedia |
| Design | ART_BIBLE.md, ARCHITECTURE.md, storyboard sumber, scenes/animations JSON | Belum persetujuan visual eksplisit pemilik |
| Material Collecting | PNG original, prompt, manifest, provenance, font/library licenses | Foto/video asli belum diintegrasikan; detail kredit masih diperlukan |
| Assembly | Next static export, opening/Hero, delapan konsep menu, pipeline dan schemas | Scene lanjutan belum dibuat |
| Testing | 7 unit/content + 8 e2e, axe, screenshot, console/link smoke, baseline sintetis | Belum perangkat fisik atau responden; tidak membuat skor usability |
| Distribution | Build out/ dan petunjuk run/deploy | Belum deploy; cakupan proposal belum diverifikasi |

Tidak menyatakan seluruh penelitian atau website selesai. Semua angka, screenshot dan status mengacu hasil lokal yang benar-benar dijalankan. Lihat FOUNDATION_REPORT.md untuk rincian dan gate yang masih terbuka.

## Update P3 — 3 November 2026
Discover/Experience ditambahkan: art/storyboard `P3_PLAN.md`, material `P3_PROVENANCE.md` dan manifest, assembly dua komponen + media derivatif, testing 9 unit/content dan 15 browser, 16 laporan axe tanpa pelanggaran terdeteksi serta baseline CPU/network simulasi. Bukti dan batas: `P3_REPORT.md`. Tidak ada pengujian responden atau deployment. Enam tahap MDLC tetap traceability pengembangan, bukan klaim seluruh penelitian selesai.

## Update P4/P5/P6 lokal — 3 November 2026
Pemilik mengonfirmasi fasilitas/menu dan memberikan kontak/pin. Design/art bible dilanjutkan P4_PLAN.md dan P5_PLAN.md, material/provenance P4/P5 tersimpan, assembly seluruh section selesai dipasang lokal. Testing akhir mencakup 11 unit/content, 26 browser, 36 laporan axe, screenshot empat ukuran, smoke opening/anchor dan baseline CPU/network simulasi. Notice lisensi font/runtime disertakan. Seluruh angka/bukti berasal dari implementasi nyata; tidak ada responden/SUS/ahli media atau klaim dampak kunjungan. Distribution tetap rencana: out/ siap ditinjau pada host lokal, belum deploy dan batas proposal belum diketahui. Uji perangkat fisik, cross-browser dan screen reader manual masih terbuka.


## Revisi multimedia — 3 November 2026

User menolak kualitas motion checkpoint sebelumnya. Gate motion dibuka ulang,
konsep diganti dari flat-image translation menjadi scene Canvas 2D, desain rig
berasal dari frond generasi baru dan pipeline alpha, assembly mencakup deformasi
air/foam/foliage serta media depth dan hover video. Testing menambahkan pengukuran
perubahan piksel pada area laut/daun, freeze saat jeda, reduced-motion still,
offscreen sleep, hover playback, rekaman desktop/mobile dan simulasi CPU/network.
Angka hasil aktual dan keterbatasan: MOTION_REBUILD.md. Tidak mengarang responden,
skor skripsi, penilaian dosen atau kelayakan akademik. Distribution belum publik.


## Kontinuitas semua scene — 3 November 2026

Persetujuan visual Hero dicatatD025. Design/assembly dilanjutkan dengan scheduler
lingkungan bersama, frond reuse, sand/birds/surf, navigation curtain dan cover
SVG foto/menu. Material collecting mencakup seluruh13 foto berizin, tiga cuplikan
video senyap dan poster; original/attribution dipertahankan. Testing final12 unit
serta35 browser lulus, termasuk temporal screenshot, autoplay/pause, reduced motion,
focus/history, media fallback dan axe. Native animated-polygon regression ditemukan,
diganti SVG dan diuji ulang; detail/rekaman/performance/limits di SCENE_CONTINUITY.md.
Belum dilakukan pengujian responden, fisik, dampak promosi atau publikasi.
