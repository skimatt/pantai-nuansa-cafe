import json
from pathlib import Path
def read(n):return json.loads(Path(f'content/{n}.json').read_text(encoding='utf-8-sig'))
def write(n,v):Path(f'content/{n}.json').write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
site=read('site');site['contact'].update(mapsUrl='https://maps.app.goo.gl/zjFpYA9izBekeK8a8',phone='+6285320542581',instagram='https://www.instagram.com/rs_risna22/',hours=None,sourceType='owner-chat',confirmedAt='2026-11-03');site['description']='Jelajahi Pantai Nuansa Cafe: suasana tepi laut, area duduk outdoor di atas pasir, pilihan kuliner, galeri dan lokasi.'
site['ui']['footerNote']='Pantai Nuansa Cafe · Bersua di tepi pantai.';site['ui']['nextChapter']='Cerita berlanjut, hingga senja membawa pulang kenangan.'
write('site',site)
sections=read('sections');sections['golden']={
 'moments':{'chapter':'06 / 07','eyebrow':'MOMEN DI NUANSA','title':'Yang singgah,','titleAccent':'yang tinggal.','description':'Satu tempat, banyak cara menyimpan cerita. Jelajahi bingkai dokumentasi dan buka momen yang ingin dilihat lebih dekat.','openLabel':'Buka dokumentasi:','previousLabel':'Dokumentasi sebelumnya','nextLabel':'Dokumentasi berikutnya','closeLabel':'Tutup dokumentasi','viewerLabel':'Dokumentasi Nuansa','videoLabel':'Video tanpa suara','errorMessage':'Media ini belum dapat dimuat. Pilih dokumentasi lain atau buka berkas aslinya.','openFileLabel':'Buka berkas asli','artNotice':'Latar senja adalah ilustrasi. Foto dan video merupakan dokumentasi berizin.'},
 'findUs':{'chapter':'07 / 07','eyebrow':'MARI BERSUA','title':'Ke tepi laut,','titleAccent':'ke Nuansa.','description':'Simpan pin lokasinya, lalu hubungi pengelola untuk informasi kunjungan. Sampai bertemu di tepi pantai.','mapsLabel':'Buka di Google Maps','phoneLabel':'Hubungi pengelola','instagramLabel':'Instagram pengelola','hoursLabel':'Jam operasional','hoursPending':'Konfirmasi kepada pengelola','locationLabel':'Lokasi','locationValue':'Pin dibagikan pengelola','artNotice':'Ilustrasi pesisir; navigasi mengikuti pin Google Maps pengelola.','copyright':'© 2026 Pantai Nuansa Cafe.','footerTagline':'Bersua di tepi pantai.'}}
write('sections',sections)
gallery=read('gallery');gallery['items']=[
 {'id':'moment-together','type':'image','assetId':'journey-together','caption':'Di antara ombak dan cerita.','alt':'Dua orang berjalan di pasir dalam sesi foto tepi pantai.','verified':False,'credit':'Foto: @raja_poutrett','sortOrder':0},
 {'id':'moment-close','type':'image','assetId':'gallery-close','caption':'Dekat, tanpa banyak kata.','alt':'Potret dua orang dalam sesi foto dengan laut di latar belakang.','verified':False,'credit':'Foto: @raja_poutrett','sortOrder':1},
 {'id':'moment-sunset','type':'image','assetId':'gallery-sunset','caption':'Senja dalam satu bingkai.','alt':'Potret seorang perempuan dengan ombak dan cahaya senja di belakangnya.','verified':False,'credit':'Dokumentasi yang disediakan untuk proyek ini.','sortOrder':2},
 {'id':'moment-shore','type':'image','assetId':'journey-shore','caption':'Sejenak di tepi air.','alt':'Sesi foto seorang perempuan di tepian pantai dengan ombak.','verified':False,'credit':'Foto: @raja_poutrett','sortOrder':3},
 {'id':'moment-film','type':'video','assetId':'journey-senja','posterAssetId':'journey-senja-poster','caption':'Senja, dalam gerak.','alt':'Video 14 detik: pengunjung di meja pantai di bawah langit senja, tanpa suara.','verified':False,'credit':'Dokumentasi yang disediakan untuk proyek ini.','sortOrder':4}]
write('gallery',gallery)
nav=read('navigation')
for item in nav['items']:item['enabled']=True
nav['foundationItems']=[{'label':'Jelajahi','target':'#discover'},{'label':'Fasilitas','target':'#explore'},{'label':'Galeri','target':'#moments'},{'label':'Lokasi','target':'#find-us'}]
write('navigation',nav)
scenes=read('scenes');scenes['golden']={'id':'golden-memories','backgroundAssetId':'golden-coast','mobileAssetId':'golden-coast-mobile','foregroundAssetId':'arrival-palm','timelinePreset':'golden-memories-v1'};write('scenes',scenes)
media=read('media');existing={a['id'] for a in media['assets']};sources=json.loads(Path('evidence/test-runs/source-photos.json').read_text())
def asset(id,src,w,h,source,alt,**extra):
 if id in existing:return
 a={'id':id,'src':src,'type':'image','sceneId':'golden-memories','sourceType':source,'license':'Owner-confirmed project use, chat 2026-11-03' if source=='owner' else 'Generated concept; review before public release','attribution':'Foto: @raja_poutrett' if id=='gallery-close' else 'Project-provided documentation' if source=='owner' else 'Produced by Codex, imagegen built-in, 2026-11-03','verified':False,'isPlaceholder':source!='owner','alt':alt,'width':w,'height':h,'variants':[],'loading':'lazy','pivot':[.5,.5],'depth':0,'status':'approved' if source=='owner' else 'prototype','promptVersion':'owner-derivative-v1' if source=='owner' else 'v1','provenance':'docs/implementation/P5_PROVENANCE.md'}
 a.update(extra);media['assets'].append(a)
asset('gallery-close','/assets/golden/close.webp',1080,1350,'owner','Potret dua orang dalam sesi foto tepi pantai.',sourceFile=sources[3]['file'],permission='owner-confirmed-2026-11-03')
asset('gallery-sunset','/assets/golden/sunset.webp',1080,1350,'owner','Potret perempuan dengan latar ombak dan cahaya senja.',sourceFile=sources[11]['file'],permission='owner-confirmed-2026-11-03')
asset('golden-coast','/assets/golden/coast.webp',1536,1024,'generated','Ilustrasi pesisir imajinatif dengan laut teal dan langit senja hangat.')
asset('golden-coast-mobile','/assets/golden/coast-mobile.webp',780,1200,'generated','Komposisi mobile ilustrasi pesisir senja, bukan peta geografis.')
write('media',media)
