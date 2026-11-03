# Art bible / reference board / shot list — Coastal Arrival v1

## Reference board internal (tanpa aset situs lain)
- Langit: kertas hangat, biru pucat, awan peach, cahaya sore terarah.
- Laut: lapisan petrol/teal, cakrawala jernih, garis ombak horizontal, pantulan gading.
- Daratan: pasir kapur hangat, kurva teluk mengarahkan mata menuju laut.
- Foreground: siluet kelapa hijau tua dengan tepi bercahaya; memberi kedalaman, bukan bingkai kotak.
- Tipografi: display serif editorial, body sans ringkas, angka bab kecil.
- UI: garis tipis, tombol oval solid, navigasi ringkas; tidak memakai kartu/glass/glow.

## Master keyframe
Landscape pantai imajinatif tanpa bangunan, fasilitas, papan nama, orang atau klaim geografis. Titik fokus: horizon bercahaya di kanan tengah. Desktop: headline di kiri tengah, laut luas di kanan; mobile: headline di bagian atas, teluk/laut di bawah. Copy menyatakan ilustrasi konseptual.

## Layer / anchor
Master painterly sebagai land/ocean/horizon. SVG orisinal transparan terpisah untuk awan (depth .08), pantulan/ombak (.12), burung (.18), foreground kelapa (.35). Layer tidak hanya crop master. Rasio master lebar; mobile crop independen. Tidak ada bangunan kafe rekaan.

## Shot list
O1 0–1.5s: laut/sky tampak sejak frame pertama, kamera scale 1.14, tint ink transparan; tidak layar loading hitam.
O2 1.5–3s: foreground bergerak keluar dari area baca, awan bergeser ringan.
O3 3–4.5s: identitas terungkap; skala kamera 1.03.
O4 4.5–5.5s: kamera 1, Hero settle; kontrol tersedia.
H1: ombak/awan lambat, scroll menggerakkan foreground dan environment berbeda kedalaman; reversible tanpa pinning.
Reduced motion: scene final statis dan semua teks langsung tampak. Skip: selesaikan timeline ke frame final pada DOM yang sama.

## Menu prototipe
Delapan konsep: nasi, mi, ikan, camilan, kopi dingin, kelapa, citrus dingin, teh. Bukan daftar sajian Pantai Nuansa. Tanpa harga/ketersediaan. Gambar individual, cahaya konsisten hangat, latar keramik/sand sederhana; label placeholder wajib pada preview.

## Persetujuan dan batasan
Arahan pengguna memberi kewenangan produksi dan iterasi; pemilihan keyframe ditinjau agent dengan screenshot, bukan dinyatakan sebagai persetujuan eksplisit pemilik. Master dan mobile wajib diinspeksi sebelum status gate lulus.
