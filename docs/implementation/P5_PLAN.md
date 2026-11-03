# P5 — Moments, Find Us dan penutup

## Fakta yang sudah tersedia
Pengguna memberikan pin `https://maps.app.goo.gl/zjFpYA9izBekeK8a8`, kontak pemilik 085320542581 dan akun pemilik `https://www.instagram.com/rs_risna22/`. Google redirect diperiksa via HTTP HEAD: 302 ke Google Maps Nuansa Pantai Coffee, pin 5.2255867 / 96.6749856. Tidak menebak alamat jalan atau jam operasional. Instagram adalah akun pengelola, bukan dinyatakan akun merek. Browser fetch Instagram throttled; izin/sumber kontak berasal dari pengguna.

## Desain
Moments: native horizontal filmstrip dengan empat foto dokumentasi berizin, prev/next dan keyboard, fullscreen native dialog dengan Escape/fokus kembali serta navigasi foto. Tanpa scroll hijacking/pinning wajib. Tidak memakai kolase yang menghapus watermark atau kredit.

Golden Memories: satu ilustrasi sunset orisinal baru sebagai lingkungan, berlabel imajinatif. Foto dokumentasi tetap berbeda status. Find Us memakai latar pesisir ilustratif dan CTA eksternal ke pin Google Maps; tanpa peta geografis rekaan, embed wajib atau tracking. Kontak telepon memakai tel dan link akun pengelola. Jam belum dikonfirmasi; arahkan pengunjung untuk menghubungi pengelola. Tidak menambah booking/order.

Footer editorial dengan tautan internal, kembali ke awal, kontak dan sumber/label yang jelas. Kontrol mute tetap mudah dijangkau ketika ambience dipilih dan pengunjung meninggalkan Hero. Noindex tetap untuk pratinjau sampai domain dan review rilis tersedia.

## Urutan gate
Selesaikan P4 dengan build/test/visual terlebih dahulu sebelum integrasi P5. Produksi aset P5 dapat berjalan sambil pemeriksaan P4. Lalu test galerie/lightbox, map/tel/Instagram, data yang hilang, no-JS/reduced motion, seluruh regresi, axe, screenshot desktop/mobile/tablet, baseline simulasi terpisah. Belum mengklaim perangkat fisik atau Distribution/deployment penelitian.
