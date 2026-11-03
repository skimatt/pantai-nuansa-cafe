import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const rows=JSON.parse(await readFile('assets-source/menu-web/selected.json','utf8'));
await mkdir('public/assets/menu-web',{recursive:true});await mkdir('public/licenses',{recursive:true});
const media=JSON.parse(await readFile('content/media.json','utf8'));
for(const row of rows){
 row.licenseUrl=row.licenseUrl.replace(/^http:/,'https:');
 const file=`/assets/menu-web/${row.id}.webp`,thumb=`/assets/menu-web/${row.id}-640.webp`;
 await sharp(row.local).rotate().resize({width:1920,height:1920,fit:'inside',withoutEnlargement:true}).webp({quality:90}).toFile('public'+file);
 await sharp(row.local).rotate().resize({width:640,height:800,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile('public'+thumb);
 const meta=await sharp('public'+file).metadata();
 const asset={id:`web-${row.id}`,src:file,type:'image',sceneId:'the-cafe',sourceType:'licensed',license:row.license,licenseUrl:row.licenseUrl,sourceUrl:row.sourcePage,author:row.author,attribution:`${row.author} / Wikimedia Commons / ${row.license}; resize/WebP; illustrative serving`,verified:false,isPlaceholder:true,alt:'Foto ilustrasi penyajian, bukan foto hidangan restoran.',width:meta.width,height:meta.height,variants:[thumb],loading:'lazy',pivot:[.5,.5],depth:.6,status:'prototype',promptVersion:'licensed-photo-v1',provenance:'docs/implementation/MENU_OWNER_UPDATE.md'};
 const index=media.assets.findIndex(a=>a.id===asset.id);if(index<0)media.assets.push(asset);else media.assets[index]=asset;
}
await writeFile('content/media.json',JSON.stringify(media,null,2)+'\n');
await writeFile('public/licenses/menu-photos.json',JSON.stringify(rows,null,2)+'\n');
console.log(`Prepared ${rows.length} licensed food photographs and credits.`);
