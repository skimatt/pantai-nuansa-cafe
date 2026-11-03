import { mkdir,readFile,writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import path from 'node:path';
await mkdir('public/assets/golden',{recursive:true});
const sources=JSON.parse(await readFile('evidence/test-runs/source-photos.json','utf8')),records=[];
for(const [name,index] of [['close',3],['sunset',11]]){
 const src=`/assets/golden/${name}.webp`;
 const out=await sharp(path.join('Assets/foto-ig',sources[index].file)).rotate().resize({width:1080,withoutEnlargement:true}).webp({quality:85}).toFile(`public${src}`);
 records.push({src,width:out.width,height:out.height,bytes:out.size,sourceFile:sources[index].file});
}
for(const [name,width,height] of [['coast',1536,null],['coast-mobile',780,1200]]){
 const src=`/assets/golden/${name}.webp`,image=sharp('assets-source/generated/golden-coast-v1.png');
 const result=await (height?image.resize(width,height,{fit:'cover',position:'left'}):image.resize({width,withoutEnlargement:true})).webp({quality:84}).toFile(`public${src}`);
 records.push({src,width:result.width,height:result.height,bytes:result.size});
}
await writeFile('assets-source/golden-processed-assets.json',JSON.stringify(records,null,2));
console.log(`Prepared ${records.length} Golden Memories assets; originals preserved.`);
