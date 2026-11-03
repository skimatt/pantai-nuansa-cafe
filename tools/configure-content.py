"""One-time foundation setup. Intentionally preserves future section specifications."""
import json
from pathlib import Path

def read(name):
    return json.loads(Path(f'content/{name}.json').read_text(encoding='utf-8-sig'))
def write(name, value):
    Path(f'content/{name}.json').write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

site=read('site')
site['ui']={
 'skipContent':'Langsung ke konten','skipIntro':'Lewati pembuka','replayIntro':'Putar ulang pembuka',
 'soundOff':'Suara mati','soundOn':'Suara hidup','soundError':'Suara belum dapat diputar. Silakan coba lagi.',
 'openMenu':'Buka navigasi','close':'Tutup','chapterLabel':'Perjalanan Nuansa',
 'prototype':'Pratinjau ilustratif','artNotice':'Ilustrasi suasana imajinatif, bukan dokumentasi lokasi.',
 'eyebrow':'SEBUAH PERJALANAN DI TEPI LAUT',
 'headline':['Pelan sejenak.','Rasakan','nuansanya.'],
 'heroDescription':'Selamat datang di dunia Pantai Nuansa Cafe. Sebuah undangan untuk berhenti sejenak dan menikmati cerita di tepi laut.',
 'primaryCta':'Jelajahi Nuansa','secondaryCta':'Konsep kuliner','scroll':'Gulir untuk memulai cerita',
 'chapterNumber':'01 / 07','chapterName':'AWAL SEBUAH CERITA','introLabel':'Menyusuri cakrawala',
 'prologEyebrow':'DI BALIK CAKRAWALA','prologTitle':'Setiap tempat punya cerita.','prologItalic':'Ini awal cerita Nuansa.',
 'prologDescription':'Perjalanan ini dimulai dari sebuah ilustrasi. Cerita tempat, fasilitas, dan dokumentasi Pantai Nuansa Cafe akan hadir setelah informasinya dikonfirmasi pengelola.',
 'catalogEyebrow':'STUDI VISUAL KULINER','catalogTitle':'Rasa dalam imajinasi.','catalogOpen':'Lihat konsep kuliner',
 'catalogBadge':'Gambar AI · konsep ilustratif','catalogHint':'Gambar ini bukan foto produk Pantai Nuansa Cafe. Nama, harga, dan ketersediaan menunggu konfirmasi.',
 'footerNote':'Pantai Nuansa Cafe · Pratinjau perjalanan multimedia','backTop':'Kembali ke awal',
 'nextChapter':'Cerita selanjutnya sedang disiapkan.','catalogLabel':'Pratinjau konsep kuliner',
 'ambientLabel':'Ambience ombak sintetis, hanya diputar atas pilihan Anda.'
}
write('site',site)
opening=read('opening');opening['storageKey']='nuansa-opening-v1';write('opening',opening)
nav=read('navigation')
for item in nav['items']: item['enabled']=item['target']=='#hero'
nav['foundationItems']=[{'label':'Beranda','target':'#hero'},{'label':'Cerita','target':'#perjalanan'}]
write('navigation',nav)
scenes=read('scenes')
scenes['arrival']={
 'id':'coastal-arrival','backgroundAssetId':'coastal-master','mobileAssetId':'coastal-mobile',
 'layerAssetIds':['arrival-clouds','arrival-waves','arrival-birds','arrival-palm'],
 'camera':{'introScale':1.14,'heroScale':1,'scrollY':60},
 'breakpoints':{'mobileMax':640},
 'safeArea':{'desktop':[.075,.22,.49,.73],'mobile':[.075,.20,.92,.66]},
 'loadingPriority':'high','audioZone':'synthetic-ocean','timelinePreset':'coastal-arrival-v1'
}
write('scenes',scenes)
menu=read('menu')
names=['Konsep nasi goreng','Konsep mi goreng','Konsep ikan bakar','Konsep pisang goreng','Konsep kopi susu dingin','Konsep kelapa muda','Konsep jeruk limau','Konsep es teh']
for i,item in enumerate(menu['items']):
 item.update(name=names[i],category='makanan' if i<4 else 'minuman',sourceType='generated')
write('menu',menu)
assets=[]
def asset(id,src,typ,scene,source,width,height,depth=0):
 return {'id':id,'src':src,'type':typ,'sceneId':scene,'sourceType':source,
 'license':'Generated concept; review before public release' if source=='generated' else 'Original project vector artwork',
 'attribution':'Produced by Codex for this project, 2026-11-03','verified':False,'isPlaceholder':True,
 'alt':'Ilustrasi konsep pantai imajinatif' if scene=='coastal-arrival' else 'Konsep visual kuliner, bukan foto produk asli',
 'width':width,'height':height,'variants':[],'loading':'eager' if id.startswith('coastal') else 'lazy',
 'pivot':[.5,.5],'depth':depth,'status':'prototype','promptVersion':'v1',
 'provenance':'docs/implementation/ASSET_PROVENANCE.md'}
assets.append(asset('coastal-master','/assets/environment/coastal-master-v1.webp','image','coastal-arrival','generated',1536,1024))
assets.append(asset('coastal-mobile','/assets/environment/coastal-mobile-v1.webp','image','coastal-arrival','generated',780,1200))
for id,file,w,h,d in [('clouds','clouds',1440,700,.08),('waves','waves',1440,900,.12),('birds','birds',1440,900,.18),('palm','palm-foreground',700,720,.35)]:
 assets.append(asset('arrival-'+id,f'/assets/environment/{file}.svg','image','coastal-arrival','procedural',w,h,d))
for i in range(1,9):assets.append(asset(f'menu-placeholder-{i:02}',f'/assets/menu/menu-{i:02}.webp','image','taste','generated',640,640))
write('media',{'assets':assets,'note':'Aset generated/procedural adalah konsep ilustratif. Izin dokumentasi Assets/foto-ig dikonfirmasi pemilik 2026-11-03; belum diintegrasikan pada fondasi.'})
