# P3 media provenance — 3 November 2026

Izin penggunaan semua media `Assets/foto-ig` dikonfirmasi pemilik dalam chat sebelumnya: “Sudah”. Permintaan lanjut tidak mencabut izin. Source files asli tidak diubah. Media nyata tidak dinyatakan berasal dari imagegen; latar ilustrasi diberi label terpisah. Tidak mengklaim tanggal rekam, alamat spesifik, fasilitas permanen, harga atau ketersediaan menu dari visual.

| ID | Sumber | Pemrosesan | Hak/status |
|---|---|---|---|
| journey-together | `By @raja_poutrett muse- @awehsaragih_ & @kyamarissa_ Mua @aisyamakeup10 Decor @momol.projectPlac (3).jpg` | Sharp resize 960/480 lebar, WebP, tanpa crop/edit subjek | Izin pengguna dikonfirmasi; kredit @raja_poutrett ditampilkan. Geolokasi/tanggal tidak diverifikasi |
| journey-shore | `By @raja_poutrett muse- @awehsaragih_ & @kyamarissa_ Mua @aisyamakeup10 Decor @momol.projectPlac (1).jpg` | Sharp resize 960/480 lebar, WebP, tanpa crop/edit subjek | Izin dan kredit sama; dekor sesi tidak diklaim fasilitas |
| journey-senja | `AQMYMeidF_7Lhc9p40b07qFZF5M3sRexnvPrmz5gY_rbggpQhvKvdolg5EOL4bElxVvz1LmjN-gz4ANI-L89Zdqa.mp4` | Ambil 0–14 detik, 540×960, 24 fps H.264, audio dihapus, metadata dihapus, faststart | Izin penggunaan dokumentasi dikonfirmasi; hak musik tidak diasumsikan. Tidak ada musik/dialog di derivatif |
| journey-senja-poster | Video sumber di atas, frame 2 detik | WebP 540×960 | Frame asli dokumentasi, bukan gambar AI |
| journey-dunes / journey-dunes-mobile | Imagegen built-in, prompt `assets-source/journey-prompt-v1.txt` | Original PNG tersimpan; WebP dan crop mobile | Pesisir imajinatif, placeholder=true/verified=false; bukan bukti kondisi lokasi |

Kredit lain yang tercantum dalam nama file asli dipertahankan di manifest/sourceFile. URL unggahan asli, identitas kreator video, tanggal dan rincian cakupan izin tidak tersedia; perlu dilengkapi sebelum rilis publik. `verified=false` di manifest tidak berarti media AI: jenis sumber dan status placeholder dipisahkan dari verifikasi faktual.

Pemrosesan memakai Sharp yang sudah terpasang serta FFmpeg 9.0.2 lokal (build GPL v3, flags tersimpan di evidence/test-runs/ffmpeg-build.txt). Binary FFmpeg tidak dikirim dalam website; hanya derivatif media. Tidak mengunduh alat baru, scraping, membeli lisensi atau memakai API key/layanan berbayar tambahan. Imagegen built-in mengikuti akses yang telah tersedia; tarif/kuota internal tidak diekspos. Tidak memasukkan audio sumber ke bundle atau output web.

Pipeline reproduksi: `node tools/inspect-source-media.mjs`, pilih media dengan preview, salin hasil imagegen ke `assets-source/generated/journey-dunes-v1.png`, `node tools/prepare-journey-assets.mjs`, review metadata dan preview, update manifest, validasi/build dan screenshot. `tools/configure-journey-content.py` merupakan setup P3 satu kali, bukan editor konten final.
