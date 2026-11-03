# Scope, Locking, dan Larangan

## LOCKED
- Homepage scrollytelling promosi berbahasa Indonesia, dengan halaman detail statis
  `/menu/`, `/galeri/`, `/fasilitas/`. Revisi eksplisit pemilik3 November2026:
  homepage hanya cuplikan, koleksi lengkap dibuka lewat Lihat semua (D033).
- Tidak ada MVC klasik yang diwajibkan; React component architecture.
- Tanpa CMS, panel admin, database, login, booking, pembayaran, transaksi.
- JSON untuk konten dan preset; perubahan memerlukan edit file dan deployment.
- Ilustrasi 2D hidup sebagai visual dominan, foto/video nyata tetap hadir.
- Opening 2D menyambung ke Hero; skip dan reduced motion.
- Scrollytelling dengan GSAP; PixiJS untuk scene yang membutuhkan renderer.
- Menu dan galeri interaktif, menu AI hanya prototipe sampai validasi.
- Agent bebas menambah tool relevan dengan evaluasi lisensi/keamanan/biaya.

## NOT LOCKED / perlu validasi
- Data riil pengelola, jumlah menu, nama fasilitas, jam, lokasi, harga.
- Detail metode uji dan sampel responden sesuai proposal/dosen.
- Pemakaian Blender MCP atau provider image API spesifik tergantung akses.
- Distribusi MDLC tahap keenam: harus cocok dengan batasan proposal yang sah.

## Aturan change control
Setiap perubahan scope dicatat di DECISION_LOG dengan alasan, dampak biaya, risiko, dan dokumen terkait. Jangan mengubah arsitektur menjadi CMS tanpa persetujuan.
