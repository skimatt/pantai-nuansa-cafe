import { readFile,writeFile,mkdir,stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import sharp from 'sharp';
const source='Assets/foto-ig';
const sources=JSON.parse(await readFile('evidence/test-runs/source-photos.json','utf8'));
const videos=JSON.parse(await readFile('evidence/test-runs/source-videos.json','utf8'));
await mkdir('public/assets/journey',{recursive:true});
const outputs=[];
for(const [name,index] of [['shore',0],['together',2]]){
 for(const width of [480,960]){
  const src=`/assets/journey/${name}-${width}.webp`;
  const result=await sharp(path.join(source,sources[index].file)).rotate().resize({width,withoutEnlargement:true}).webp({quality:83}).toFile(`public${src}`);
  outputs.push({src,width:result.width,height:result.height,bytes:result.size,sourceFile:sources[index].file});
 }
}
// Preserve supplied original. First 14 seconds form a continuous waterfront shot.
const videoSource=path.join(source,videos[0].file);
const videoPath='public/assets/journey/senja-silent-v1.mp4';
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',videoSource,'-t','14','-vf','scale=540:960,fps=24','-an','-c:v','libx264','-preset','medium','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart','-map_metadata','-1',videoPath]);
const metadata=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height','-of','json',videoPath],{encoding:'utf8'}));
if(metadata.streams.some(s=>s.codec_type==='audio'))throw new Error('Silent derivative unexpectedly contains audio');
outputs.push({src:'/assets/journey/senja-silent-v1.mp4',...metadata,sourceFile:videos[0].file});
const frame=execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','2','-i',videoSource,'-frames:v','1','-f','image2pipe','-vcodec','png','-'],{maxBuffer:10*1024*1024});
const poster=await sharp(frame).resize(540,960).webp({quality:85}).toFile('public/assets/journey/senja-poster-v1.webp');
outputs.push({src:'/assets/journey/senja-poster-v1.webp',width:poster.width,height:poster.height,bytes:poster.size,sourceFile:videos[0].file,frameSeconds:2});
for(const [name,width] of [['dunes-master-v1',1536],['dunes-mobile-v1',780]]){
 const image=sharp('assets-source/generated/journey-dunes-v1.png');
 const result=await (width===780?image.resize(780,1200,{fit:'cover',position:'left'}):image.resize({width,withoutEnlargement:true})).webp({quality:83}).toFile(`public/assets/journey/${name}.webp`);
 outputs.push({src:`/assets/journey/${name}.webp`,width:result.width,height:result.height,bytes:result.size});
}
await writeFile('assets-source/journey-processed-assets.json',JSON.stringify(outputs,null,2));
await writeFile('evidence/test-runs/ffmpeg-build.txt',execFileSync('ffmpeg',['-version'],{encoding:'utf8'}));
console.log(`Prepared ${outputs.length} derivatives; video ${(await stat(videoPath)).size} bytes, no audio stream.`);
