import {readFile,writeFile,copyFile} from 'node:fs/promises';
import sharp from 'sharp';
const root='deliverables/coastal-asset-kit',manifest=JSON.parse(await readFile(`${root}/manifest.json`,'utf8'));
const media=JSON.parse(await readFile('content/media.json','utf8'));
for(const asset of manifest.assets){
 const file=asset.sprite??asset.webp,src=`/assets/coastal-kit/${asset.id}.webp`;await copyFile(`${root}/${file}`,`public${src}`);
 const meta=await sharp(`public${src}`).metadata(),id=`kit-${asset.id}`;
 const entry={id,src,type:'image',sceneId:'journey',sourceType:asset.sourceType,license:asset.sourceType==='generated'?'Generated thematic concept; review before public release':'Original procedural artwork; project source and provenance retained',attribution:asset.sourceType==='generated'?'Produced with built-in imagegen, 2026-11-03':'Original SVG/Three.js procedural artwork by project, 2026-11-03',verified:false,isPlaceholder:true,alt:`${asset.label}, ilustrasi tematik bukan dokumentasi lokasi.`,width:meta.width,height:meta.height,variants:[],loading:'lazy',pivot:asset.pivot,depth:.7,status:'prototype',promptVersion:'coastal-kit-v1',provenance:'docs/implementation/COASTAL_ASSET_KIT.md'};
 const i=media.assets.findIndex(a=>a.id===id);if(i<0)media.assets.push(entry);else media.assets[i]=entry;
}
await writeFile('content/media.json',JSON.stringify(media,null,2)+'\n');
const scenes=JSON.parse(await readFile('content/scenes.json','utf8'));
scenes.assetKit={wave:'kit-wave-serrated',waveFrame:[960,210,12],gull:'kit-gull-flight',egret:'kit-egret-flight',flightFrame:[320,280,8],sand:'kit-sand-gust',sandFrame:[600,180,8],standingEgret:'kit-egret-standing',trees:{pine:'kit-tree-coastal-pine',almond:'kit-tree-almond',banyan:'kit-tree-banyan'}};
await writeFile('content/scenes.json',JSON.stringify(scenes,null,2)+'\n');console.log('15 kit assets added to web manifest; source/models remain outside the web bundle.');
