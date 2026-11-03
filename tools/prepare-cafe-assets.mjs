import { mkdir,copyFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
await mkdir('public/assets/cafe',{recursive:true});
const records=[];
for(const name of ['rice-chicken','rice-seafood','rice-katsu','chicken-pepper','aceh-noodles']){
 const src=`/assets/cafe/${name}.webp`;
 const out=await sharp(`assets-source/generated/menu-${name}-v1.png`).resize(640,640,{fit:'cover'}).webp({quality:83}).toFile(`public${src}`);
 records.push({src,width:out.width,height:out.height,bytes:out.size});
}
for(const width of [1536,900]){
 const src=`/assets/cafe/setting-${width}.webp`;
 const out=await sharp('assets-source/generated/cafe-setting-v1.png').resize({width,withoutEnlargement:true}).webp({quality:85}).toFile(`public${src}`);
 records.push({src,width:out.width,height:out.height,bytes:out.size});
}
await copyFile('Assets/foto-ig/Menu.png','public/assets/cafe/menu-original.png');
const original=await readFile('Assets/foto-ig/Menu.png'),copy=await readFile('public/assets/cafe/menu-original.png');
if(!original.equals(copy))throw new Error('Menu original must remain byte-identical');
records.push({src:'/assets/cafe/menu-original.png',width:674,height:905,bytes:copy.length,sha256:createHash('sha256').update(copy).digest('hex'),sourceFile:'Menu.png'});
await writeFile('assets-source/cafe-processed-assets.json',JSON.stringify(records,null,2));
console.log(`Prepared ${records.length} cafe assets. Owner menu is byte-identical to supplied image.`);
