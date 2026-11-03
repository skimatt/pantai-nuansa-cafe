import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import path from 'node:path';
const source='Assets/foto-ig';
const destination='evidence/screenshots/p3';
await mkdir(destination,{recursive:true});
const files=await readdir(source),rows=[],tiles=[];
for(const file of files.filter(f=>/\.(jpg|webp|png)$/i.test(f))){
 const i=rows.length,metadata=await sharp(path.join(source,file)).metadata();
 rows.push({index:i,file,width:metadata.width,height:metadata.height});
 const image=await sharp(path.join(source,file)).rotate().resize(240,240,{fit:'contain',background:'#ece4d7'}).toBuffer();
 tiles.push({input:image,left:i%4*260+10,top:Math.floor(i/4)*280+10});
 tiles.push({input:Buffer.from(`<svg width="240" height="30"><text x="0" y="20" font-size="16">${i}</text></svg>`),left:i%4*260+10,top:Math.floor(i/4)*280+250});
}
await sharp({create:{width:1040,height:Math.ceil(rows.length/4)*280,channels:3,background:'#fff4e4'}}).composite(tiles).png().toFile(`${destination}/source-photos.png`);
await writeFile('evidence/test-runs/source-photos.json',JSON.stringify(rows,null,2));
const videos=[];
for(const file of files.filter(f=>f.endsWith('.mp4'))){
 const index=videos.length;
 const info=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration,size:stream=index,codec_type,codec_name,width,height','-of','json',path.join(source,file)],{encoding:'utf8'}));
 videos.push({index,file,...info});
 for(const [frame,time] of [1,6,12].entries()){
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',String(time),'-i',path.join(source,file),'-frames:v','1','-vf','scale=270:-2',`${destination}/video-${index}-frame-${frame}.jpg`]);
 }
}
await writeFile('evidence/test-runs/source-videos.json',JSON.stringify(videos,null,2));
console.log(JSON.stringify({photos:rows,videos:videos.map(v=>({index:v.index,file:v.file,duration:v.format.duration}))},null,2));
