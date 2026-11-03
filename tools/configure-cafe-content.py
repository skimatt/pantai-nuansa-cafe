import json
from pathlib import Path
def read(n):return json.loads(Path(f'content/{n}.json').read_text(encoding='utf-8-sig'))
def write(n,v):Path(f'content/{n}.json').write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
menu=read('menu')
if 'conceptItems' not in menu:menu['conceptItems']=menu['items']
menu.update(notice='Nama dan harga mengacu pada menu yang dikonfirmasi pengelola. Gambar AI hanya ilustrasi penyajian, bukan foto produk asli.',sourceAssetId='owner-menu',verified=True,currency='IDR',confirmedAt='2026-11-03')
choices=[('nasi-goreng-telur','Nasi Goreng Telur',15000,'menu-placeholder-01'),('nasi-goreng-ayam','Nasi Goreng Ayam',20000,'menu-rice-chicken'),('nasi-goreng-seafood','Nasi Goreng Seafood',35000,'menu-rice-seafood'),('nasi-goreng-katsu','Nasi Goreng Chicken Katsu',30000,'menu-rice-katsu'),('chicken-steak-pepper','Chicken Steak Black Pepper',35000,'menu-chicken-pepper'),('mie-aceh-telor','Mie Aceh Kuah Telor',15000,'menu-aceh-noodles')]
menu['items']=[{'id':id,'name':name,'price':price,'imageAssetId':image,'category':'makanan','description':'Pilihan dari daftar menu pengelola. Tampilan pada gambar merupakan ilustrasi AI.','featured':True,'available':None,'verified':True,'isPlaceholder':True,'sourceType':'owner','sourceAssetId':'owner-menu'} for id,name,price,image in choices]
write('menu',menu)
sections=read('sections');sections['cafe']={
 'explore':{'chapter':'04 / 07','eyebrow':'SEBUAH RUANG UNTUK SINGGAH','title':'Di bawah atap,','titleAccent':'di atas pasir.','description':'Area duduk outdoor beratap, dengan meja melingkar dan kursi langsung di atas pasir. Pandangan pantai terbuka di depan mata.','legendLabel':'Kenali areanya','artNotice':'Ilustrasi berdasarkan keterangan pengelola; bentuk bangunan bukan dokumentasi.','nextLabel':'Temukan pilihan rasa','sourceLabel':'Fasilitas dikonfirmasi pengelola','verified':True,'sourceType':'owner-chat','confirmedAt':'2026-11-03',
 'hotspots':[{'id':'seating','number':'01','label':'Area duduk di atas pasir','description':'Area duduk beratap dengan meja melingkar. Kursi dan meja berada langsung di atas pasir.','x':74,'y':65},{'id':'sea-view','number':'02','label':'Pandangan langsung ke pantai','description':'Area outdoor berada di pinggir pantai, dengan pandangan langsung ke pantai dan laut.','x':53,'y':44}]},
 'taste':{'chapter':'05 / 07','eyebrow':'PILIHAN RASA NUANSA','title':'Biar rasa','titleAccent':'bercerita.','description':'Pilih satu menu, bayangkan momennya. Nama dan harga di bawah mengacu pada daftar yang dikonfirmasi pengelola.','listLabel':'Pilihan menu','imageBadge':'Ilustrasi AI · bukan foto produk','sourceLabel':'Nama & harga: menu pengelola','fullMenuLabel':'Lihat menu lengkap','originalLabel':'Daftar menu pengelola','originalOpenLabel':'Buka gambar menu ukuran penuh','noScriptLabel':'Lihat menu asli','imageNotice':'Foto penyajian asli dapat menggantikan ilustrasi ini nanti.'}}
write('sections',sections)
site=read('site');ui=site['ui'];ui.update(secondaryCta='Menu kuliner',catalogEyebrow='PILIHAN MENU',catalogTitle='Cita rasa di tepi laut.',catalogOpen='Lihat menu lengkap',catalogBadge='Ilustrasi AI · bukan foto produk',catalogHint='Gambar hanya ilustrasi penyajian. Ketersediaan harian dapat dikonfirmasi kepada pengelola.',catalogLabel='Daftar menu Nuansa');write('site',site)
sections['journey']['experience']['nextLabel']='Lanjutkan ke pilihan kuliner';write('sections',sections)
nav=read('navigation')
for item in nav['items']:
 if item['target'] in ['#explore','#taste']:item['enabled']=True
nav['foundationItems']=[{'label':'Jelajahi','target':'#discover'},{'label':'Suasana','target':'#experience'},{'label':'Fasilitas','target':'#explore'}];write('navigation',nav)
scenes=read('scenes');scenes['cafe']={'id':'the-cafe','backgroundAssetId':'cafe-setting','mobileAssetId':'cafe-setting-mobile','tasteBackgroundAssetId':'journey-dunes','foregroundAssetId':'arrival-palm','timelinePreset':'cafe-editorial-v1'};write('scenes',scenes)
media=read('media');existing={a['id'] for a in media['assets']}
def asset(id,src,w,h,source,alt,**extra):
 if id in existing:return
 a={'id':id,'src':src,'type':'image','sceneId':'the-cafe','sourceType':source,'license':'Owner-confirmed project use, chat 2026-11-03' if source=='owner' else 'Generated concept; review before public release','attribution':'Menu supplied and confirmed by owner' if source=='owner' else 'Produced by Codex, imagegen built-in, 2026-11-03','verified':source=='owner','isPlaceholder':source!='owner','alt':alt,'width':w,'height':h,'variants':[],'loading':'lazy','pivot':[.5,.5],'depth':0,'status':'approved' if source=='owner' else 'prototype','promptVersion':'owner-source-v1' if source=='owner' else 'v1','provenance':'docs/implementation/P4_PROVENANCE.md'}
 a.update(extra);media['assets'].append(a)
asset('cafe-setting','/assets/cafe/setting-1536.webp',1536,1024,'generated','Ilustrasi konsep area duduk beratap dengan meja melingkar dan kursi langsung di atas pasir, menghadap laut.')
asset('cafe-setting-mobile','/assets/cafe/setting-900.webp',900,600,'generated','Ilustrasi fasilitas pantai, bukan foto konstruksi lokasi sebenarnya.')
for name in ['rice-chicken','rice-seafood','rice-katsu','chicken-pepper','aceh-noodles']:asset('menu-'+name,'/assets/cafe/'+name+'.webp',640,640,'generated','Ilustrasi AI penyajian makanan, bukan foto produk asli.')
asset('owner-menu','/assets/cafe/menu-original.png',674,905,'owner','Daftar menu Nuansa Pantai yang diberikan dan dikonfirmasi masih berlaku oleh pengelola.',sourceFile='Menu.png',permission='owner-confirmed-2026-11-03')
write('media',media)
