import sharp from 'sharp';
import {execFileSync} from 'node:child_process';
// Preserve the generated original. Defringe translucent background haze only.
const {data,info}=await sharp('assets-source/generated/palm-frond-rig-v1.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let i=3;i<data.length;i+=4)data[i]=Math.max(0,Math.round((data[i]-32)*255/223));
await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).resize(900).webp({quality:88}).toFile('public/assets/environment/palm-frond-rig-v1.webp');
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss','2','-i','public/assets/journey/senja-silent-v1.mp4','-t','4','-an','-vf','scale=270:-2','-r','18','-c:v','libx264','-crf','29','-movflags','+faststart','public/assets/journey/senja-hover-v1.mp4']);
console.log('Preserved original; alpha WebP frond and silent hover excerpt prepared.');
