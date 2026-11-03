import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {execFileSync} from 'node:child_process';
const photos=JSON.parse(await readFile('evidence/test-runs/source-photos.json','utf8'));
const videos=JSON.parse(await readFile('evidence/test-runs/source-videos.json','utf8'));
const media=JSON.parse(await readFile('content/media.json','utf8')),gallery=JSON.parse(await readFile('content/gallery.json','utf8'));
const captions={1:['Satu bingkai, berdua.','Dua orang dalam sesi foto dengan dekorasi bunga di tepi pantai.'],5:['Sepiring cerita.','Dokumentasi sajian dengan nasi, lauk dan sayuran; bukan konfirmasi nama menu atau harga.'],6:['Cerita dalam monokrom.','Kolase potret pasangan dalam warna dan hitam putih.'],7:['Dua sudut, satu cerita.','Komposisi foto pasangan dan detail gelas dalam sesi foto.'],8:['Potret dalam cahaya.','Potret seorang perempuan dengan permainan cahaya merah.'],9:['Potongan suasana.','Kolase potret seorang perempuan dengan suasana tepi pantai.'],10:['Warna sebuah momen.','Potret seorang perempuan dengan efek gerak cahaya merah.'],12:['Dari senja, untuk dikenang.','Kolase potret dengan matahari senja dan ombak.'],13:['Cahaya dan kenangan.','Kolase pasir pantai dan potret dengan cahaya merah.']};
await mkdir('public/assets/documentation',{recursive:true});
const records=[];
for(const photo of photos.filter(p=>p.file!=='Menu.png')){
 const existing=media.assets.find(a=>a.sourceType==='owner'&&a.type==='image'&&a.sourceFile?.endsWith(photo.file));
 if(existing&&gallery.items.some(i=>i.assetId===existing.id))continue;
 const id=`documentation-photo-${String(photo.index).padStart(2,'0')}`;
 if(media.assets.some(a=>a.id===id))continue;
 const src=`/assets/documentation/photo-${photo.index}.webp`,small=`/assets/documentation/photo-${photo.index}-420.webp`;
 const info=await sharp(path.join('Assets/foto-ig',photo.file)).rotate().resize({width:900,withoutEnlargement:true}).webp({quality:85}).toFile(`public${src}`);
 await sharp(path.join('Assets/foto-ig',photo.file)).rotate().resize({width:420,withoutEnlargement:true}).webp({quality:82}).toFile(`public${small}`);
 const [caption,alt]=captions[photo.index]??['Cerita yang terekam.','Foto dokumentasi yang disediakan untuk proyek ini.'];
 const credit=photo.file.includes('raja_poutrett')?'Foto: @raja_poutrett':photo.file.includes('PREWED')?'Kredit pada gambar dan nama sumber dipertahankan.':'Dokumentasi yang disediakan untuk proyek ini; kredit pada gambar dipertahankan.';
 media.assets.push({id,src,type:'image',sceneId:'golden-memories',sourceType:'owner',license:'Owner-provided; usage permission confirmed in chat 2026-11-03',attribution:credit,verified:true,isPlaceholder:false,alt,width:info.width,height:info.height,variants:[small],loading:'lazy',pivot:[.5,.5],depth:.5,status:'approved',promptVersion:'owner-original',provenance:'docs/implementation/SCENE_CONTINUITY.md',sourceFile:photo.file,permission:'owner-confirmed-2026-11-03'});
 gallery.items.push({id:`moment-documentation-${photo.index}`,type:'image',assetId:id,caption,alt,verified:false,credit,sortOrder:0});records.push({id,source:photo.file,bytes:info.size});
}
for(const index of [1,2]){
 const source=videos[index],id=`documentation-film-${index}`,src=`/assets/documentation/film-${index}.mp4`,poster=`/assets/documentation/film-${index}-poster.webp`;
 if(media.assets.some(a=>a.id===id))continue;
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',path.join('Assets/foto-ig',source.file),'-t','14','-an','-vf','scale=540:-2','-r','24','-c:v','libx264','-crf','25','-movflags','+faststart',`public${src}`]);
 const posterPng=`assets-source/documentation-film-${index}-poster.png`;
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss','1','-i',`public${src}`,'-frames:v','1',posterPng]);
 const info=await sharp(posterPng).webp({quality:86}).toFile(`public${poster}`);
 const base={sceneId:'golden-memories',sourceType:'owner',license:'Owner-provided; permission confirmed in chat 2026-11-03; derivative has no soundtrack',attribution:'Dokumentasi yang disediakan untuk proyek ini.',verified:true,isPlaceholder:false,alt:index===1?'Kolase video dokumentasi Nuansa, tanpa suara.':'Video area duduk di atas pasir dan suasana pesisir, tanpa suara.',width:info.width,height:info.height,variants:[],loading:'lazy',pivot:[.5,.5],depth:.5,status:'approved',promptVersion:'owner-silent-excerpt',provenance:'docs/implementation/SCENE_CONTINUITY.md',sourceFile:source.file,permission:'owner-confirmed-2026-11-03'};
 media.assets.push({...base,id,src,type:'video',durationSeconds:14,hasAudio:false},{...base,id:`${id}-poster`,src:poster,type:'image'});
 gallery.items.push({id:`moment-film-${index}`,type:'video',assetId:id,posterAssetId:`${id}-poster`,caption:index===1?'Banyak cerita, satu perjalanan.':'Duduk dekat debur ombak.',alt:base.alt,verified:false,credit:base.attribution,sortOrder:0});records.push({id,source:source.file});
}
// Keep the four established opening images; all films follow the complete photo set.
gallery.items.sort((a,b)=>(a.type==='video'?1:0)-(b.type==='video'?1:0));gallery.items.forEach((item,i)=>item.sortOrder=i);
await writeFile('content/media.json',JSON.stringify(media,null,2)+'\n');await writeFile('content/gallery.json',JSON.stringify(gallery,null,2)+'\n');
await writeFile('assets-source/documentation-processed-assets.json',JSON.stringify(records,null,2));
console.log(`${gallery.items.filter(i=>i.type==='image').length} photos and ${gallery.items.filter(i=>i.type==='video').length} silent films indexed; originals preserved.`);
