# Asset Production Pipeline

## Kewajiban
Codex **harus menghasilkan aset ilustrasi awal**, termasuk **gambar menu makanan/minuman prototipe**, sebelum menunggu dokumentasi asli. Aset prototipe tidak boleh dipresentasikan sebagai bukti fasilitas/menu sebenarnya. Foto/video asli akan disisipkan setelah diterima dan diizinkan pengelola.

## Sumber
(1) Image-generation API/tool yang benar-benar tersedia dan diizinkan; (2) SVG kode untuk awan, ombak, daun, ikon; (3) custom procedural PixiJS; (4) sumber CC0/lisensi sesuai; (5) Blender MCP opsional untuk render/2.5D; (6) sumber media resmi pengelola. Jangan gunakan scraping ilegal/berlisensi tidak jelas.

## Prosedur
1. Buat art bible + keyframe master + asset list per scene.
2. Generate background master untuk masing-masing environment, kemudian generate layer/objek terpisah (jangan hanya crop gambar datar dan berharap parallax sempurna).
3. Buat alpha clean, inpaint area occluded, tentukan anchor/pivot, cek konsistensi perspektif/pencahayaan.
4. Buat spritesheet bila perlu, WebP/AVIF untuk gambar raster yang sesuai, PNG transparan bila diperlukan, SVG bersih untuk vektor; simpan original editable.
5. Catat `id`, `scene`, `src`, `sourceType`, `license`, `attribution`, `verified`, `isPlaceholder`, `width`, `height`, `pivot`, `depth`, `status`, `promptVersion`.
6. Validasi path, ukuran, alpha, transparansi, rasio, safe crop mobile, duplikasi, ukuran file; preview langsung di scene.
7. Iterasi visual dengan screenshot; jangan menganggap hasil pertama final.

## Menu khusus
Buat 5–8 **concept images** makanan/minuman umum sebagai placeholder ilustratif bila daftar menu belum tersedia. Jangan menetapkan nama/harga/tersedia secara faktual. Setelah data menu asli diterima, ganti gambar dengan dokumentasi resmi atau ilustrasi berdasarkan foto yang disetujui.

## Asset sourcing log
Setiap aset eksternal harus punya URL sumber, nama kreator, lisensi dan tanggal akses. Simpan catatan izin untuk foto/video nyata. Jangan mengirim file font berlisensi kepada pihak lain.

## MCP governance
MCP tidak wajib. Audit izin, scope filesystem, eksekusi kode, akses jaringan, biaya. Blender MCP menjalankan script potensial berisiko; gunakan sandbox dan review setiap operasi yang berpotensi destruktif.
