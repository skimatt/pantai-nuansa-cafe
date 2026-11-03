# Perpindahan section homepage — 3 November2026

Pilihan: entrance translate pendek untuk heading/copy, opacity lembut pada media
ketika masuk/keluar viewport. Parallax environment yang sudah ada dipertahankan,
bukan menulis transform yang sama dari dua controller. Hero/opening tidak diubah.
Tidak menambahkan pinning, scroll hijack, blur/filter, library atau ticker baru.

use-section-transitions.ts memakai GSAP/ScrollTrigger yang sudah tersedia.
Konfigurasi content/animations.json.sectionTransitions: travel16px desktop,
9px mobile, scrub0.45, edgeOpacity0.78. Schema menjaga nilai tidak berlebihan.
Media terang pada bagian tengah perjalanan; opacity berkurang di tepi viewport.
Teks/caption/harga tidak difade agar kontras tidak turun saat membaca. Reversible
ketika scroll mundur; reduced-motion/no-JS menampilkan seluruh konten normal.
Jeda gerak membersihkan timeline dan mengembalikan tampilan statis, tanpa
mengubah posisi scroll. Semua context/matchMedia/timeline dibersihkan saat unmount.

File: src/lib/use-section-transitions.ts, CoastalArrival.tsx, animations.json,
content.ts, tests/e2e/section-transitions.spec.ts. Bukti screenshot dan nilai
opacity entry/centre/reverse: evidence/section-transitions/.
Tidak ada aset baru, API atau biaya layanan. Lulus build bukan jaminan60FPS;
perangkat fisik dan keterbatasan performa rilis sebelumnya tetap terbuka.

Fade awal pada foto menu sempat ditimpa CSS animation dish-surface; opacity
dihapus dari keyframe lama, menyisakan translate/scale masuk. Properti opacity
foto kini dimiliki satu controller scroll. Pengujian entry/centre/reverse sudah
lulus pada desktop/mobile, juga fallback tanpa JavaScript.

Native reduced motion tetap default statis. Pilihan eksplisit Aktifkan animasi
kini juga mengaktifkan transisi ringan ini melalui shared preference store;
mematikannya mengembalikan opacity/transform normal. Tidak menyalakan kembali
pinning/intro kamera kompleks di perangkat reduced motion. Ini perluasan pilihan
ambient sebelumnya, sesuai permintaan transisi pengguna saat ini.

Hasil akhir: lint/typecheck/build dan18 unit/folder test lulus. Tujuh uji
continuity/lifecycle lulus; setelah penyesuaian native opt-in,9 uji motion dan
section-transitions lulus. Screenshot enam section pada desktop/mobile ditinjau.
Raw opacity entry/centre/reverse tersedia pada desktop.json dan mobile.json.

Simulasi CPU4×,390×844, scroll cepat turun-naik6.01detik:133 callback RAF,
main-thread TaskDuration6.26detik,0 page error. Angka ini mencakup seluruh
environment/renderer dan pemuatan selama scroll, bukan biaya transisi saja.
Tidak ada baseline pembanding sehingga tidak mengklaim60FPS atau peningkatan
performa. Main thread masih padat pada simulasi ini; optimasi renderer/perangkat
fisik tetap pekerjaan rilis. Raw evidence/section-transitions/performance.json.
