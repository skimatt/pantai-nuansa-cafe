"""P3 setup only: preserve original content while appending the journey contract."""
import json
from pathlib import Path
def read(name):return json.loads(Path(f'content/{name}.json').read_text(encoding='utf-8-sig'))
def write(name,value):Path(f'content/{name}.json').write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
sections=read('sections')
sections['journey']={
 'discover':{
  'chapter':'02 / 07','eyebrow':'JELAJAHI NUANSA','title':'Di antara laut','titleAccent':'dan cerita.',
  'description':'Ada cerita di balik setiap bingkai. Dari sesi foto di tepi pantai, perjalanan berlanjut menuju suasana senja yang tertangkap dalam gerak.',
  'note':'Dokumentasi pilihan, ditampilkan dengan izin penggunaan.','nextLabel':'Menuju suasana senja',
  'backgroundNotice':'Latar ilustratif. Foto merupakan dokumentasi, bukan gambar AI.',
  'photos':[{'assetId':'journey-together','number':'01','caption':'Cerita berdua, di tepi laut.','credit':'Foto: @raja_poutrett','sizes':'(max-width: 640px) 78vw, (max-width: 1000px) 50vw, 400px'},
            {'assetId':'journey-shore','number':'02','caption':'Satu bingkai. Banyak cerita.','credit':'Foto: @raja_poutrett','sizes':'(max-width: 640px) 65vw, (max-width: 1000px) 40vw, 280px'}]
 },
 'experience':{
  'chapter':'03 / 07','eyebrow':'RASAKAN SUASANANYA','title':'Sebentar,','titleAccent':'di tepi laut.',
  'description':'Langit senja, gerak ombak, dan momen bersama. Putar cuplikan dokumentasi untuk melihat suasananya lebih dekat.',
  'assetId':'journey-senja','posterAssetId':'journey-senja-poster','titleLabel':'Cuplikan suasana senja di tepi laut',
  'durationLabel':'00:14','formatLabel':'DOKUMENTASI · VIDEO TANPA SUARA','credit':'Sumber: dokumentasi yang disediakan untuk proyek ini.',
  'playLabel':'Putar video senja','pauseLabel':'Jeda video senja','replayLabel':'Putar ulang video senja','loadingLabel':'Menyiapkan cuplikan…',
  'errorMessage':'Video belum dapat diputar. Anda tetap dapat melihat poster dan membaca deskripsi visualnya.',
  'retryLabel':'Coba putar lagi','descriptionLabel':'Deskripsi visual video',
  'visualDescription':'Cuplikan menampilkan sekelompok pengunjung duduk mengelilingi meja di atas pasir, dengan kursi merah dan laut di belakangnya. Langit berwarna jingga menjelang senja. Kamera bergerak mendekati meja dan mengarah ke garis pantai. Cuplikan ini ditampilkan tanpa suara.',
  'noScriptMessage':'Pemutar interaktif memerlukan JavaScript. Video tetap dapat dibuka langsung.',
  'openFileLabel':'Buka berkas video','silentNotice':'Tanpa suara · tanpa putar otomatis',
  'nextLabel':'Lanjutkan ke konsep kuliner','artNotice':'Latar pesisir adalah ilustrasi. Video dan poster berasal dari dokumentasi.'
 }
}
for section in sections['sections']:
 if section['id']=='discover':section['description']='Dokumentasi sesi foto pantai dan perjalanan menuju suasana senja.'
 if section['id']=='experience':section['description']='Cuplikan video senja tanpa suara, diputar atas pilihan pengunjung.'
write('sections',sections)
nav=read('navigation')
for item in nav['items']:
 if item['target'] in ['#discover','#experience']:item['enabled']=True
nav['foundationItems']=[{'label':'Beranda','target':'#hero'},{'label':'Jelajahi','target':'#discover'},{'label':'Suasana','target':'#experience'}]
write('navigation',nav)
site=read('site');site['ui']['prologDescription']='Dari pesisir dalam ilustrasi, perjalanan beralih ke dokumentasi. Sesi foto, langit senja, dan momen yang tertangkap menjadi awal untuk mengenal Nuansa lebih dekat.'
site['ui']['nextChapter']='Cerita berlanjut, dari satu bingkai ke bingkai berikutnya.'
write('site',site)
scenes=read('scenes');scenes['journey']={'id':'journey','backgroundAssetId':'journey-dunes','mobileAssetId':'journey-dunes-mobile','experienceBackgroundAssetId':'coastal-master','foregroundAssetId':'arrival-palm','waveAssetId':'arrival-waves','mobileMax':640,'timelinePreset':'editorial-coast-v1','safeArea':{'desktop':[.06,.22,.41,.72],'mobile':[.07,.1,.9,.4]}}
write('scenes',scenes)
animations=read('animations');animations['presets']['journey']={'photoTravel':28,'backdropTravel':36,'scrub':.8};write('animations',animations)
media=read('media');existing={a['id'] for a in media['assets']}
records=json.loads(Path('assets-source/journey-processed-assets.json').read_text())
photos=json.loads(Path('evidence/test-runs/source-photos.json').read_text())
def asset(id,src,typ,w,h,source,alt,**extra):
 r={'id':id,'src':src,'type':typ,'sceneId':'journey','sourceType':source,'license':'Owner-confirmed project use, chat 2026-11-03; retain credits' if source=='owner' else 'Generated concept; review before public release','attribution':'Foto: @raja_poutrett' if id in ['journey-shore','journey-together'] else 'Provided project documentation' if source=='owner' else 'Produced by Codex, imagegen built-in, 2026-11-03','verified':False,'isPlaceholder':source!='owner','alt':alt,'width':w,'height':h,'variants':[],'loading':'lazy','pivot':[.5,.5],'depth':.1,'status':'approved' if source=='owner' else 'prototype','promptVersion':'owner-derivative-v1' if source=='owner' else 'v1','provenance':'docs/implementation/P3_PROVENANCE.md'}
 r.update(extra)
 if id not in existing:media['assets'].append(r)
asset('journey-shore','/assets/journey/shore-960.webp','image',960,1200,'owner','Seorang perempuan dalam sesi foto di pantai, dengan ombak dan laut di belakangnya.',variants=['/assets/journey/shore-480.webp'],sourceFile=photos[0]['file'],permission='owner-confirmed-2026-11-03')
asset('journey-together','/assets/journey/together-960.webp','image',960,1200,'owner','Dua orang dalam sesi foto berdiri di atas pasir, berlatar garis pantai.',variants=['/assets/journey/together-480.webp'],sourceFile=photos[2]['file'],permission='owner-confirmed-2026-11-03')
asset('journey-senja','/assets/journey/senja-silent-v1.mp4','video',540,960,'owner','Pengunjung duduk di meja tepi laut di bawah langit senja.',durationSeconds=14,hasAudio=False,permission='owner-confirmed-2026-11-03',sourceFile=records[4]['sourceFile'])
asset('journey-senja-poster','/assets/journey/senja-poster-v1.webp','image',540,960,'owner','Frame dokumentasi: pengunjung di meja pantai dengan langit senja.',sourceFile=records[4]['sourceFile'],permission='owner-confirmed-2026-11-03')
asset('journey-dunes','/assets/journey/dunes-master-v1.webp','image',1536,1024,'generated','Ilustrasi pesisir imajinatif dengan pasir, rerumputan dan laut teal.')
asset('journey-dunes-mobile','/assets/journey/dunes-mobile-v1.webp','image',780,1200,'generated','Komposisi mobile ilustrasi pesisir imajinatif.')
media['note']='Ilustrasi generated berlabel konsep; dokumentasi pengguna diintegrasikan pada Discover/Experience setelah izin chat 2026-11-03. Fakta bisnis belum diverifikasi.'
write('media',media)
