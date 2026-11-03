import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const root='deliverables/coastal-asset-kit',kit=JSON.parse(await readFile(`${root}/manifest.json`,'utf8')),assets=[],models=[];
for(const a of kit.assets){
 const png=await sharp(`${root}/${a.png}`).stats(),meta=await sharp(`${root}/${a.png}`).metadata();
 assert.equal(meta.width,a.width);assert.equal(meta.height,a.height);assert.equal(meta.hasAlpha,true);assert.equal(png.channels[3].min,0);assert.ok(png.channels[3].max>0);
 const svg=await readFile(`${root}/${a.svg}`,'utf8');assert.ok(!/<script|<foreignObject|javascript:|onload=/i.test(svg));assert.ok(a.layers.length>0);
 let uniqueFrames=1;if(a.frames>1){const hashes=[];for(let i=0;i<a.frames;i++)hashes.push(createHash('sha256').update(await readFile(`${root}/frames/${a.id}/${String(i).padStart(2,'0')}.png`)).digest('hex'));uniqueFrames=new Set(hashes).size;assert.ok(uniqueFrames>1);const sprite=await sharp(`${root}/${a.sprite}`).metadata();assert.equal(sprite.width,a.frameWidth*a.frames);assert.equal(sprite.height,a.frameHeight);}
 assets.push({id:a.id,width:meta.width,height:meta.height,alpha:[png.channels[3].min,png.channels[3].max],layers:a.layers.length,uniqueFrames,bytes:(await stat(`${root}/${a.png}`)).size});
}
for(const m of kit.models){const glb=await readFile(`${root}/${m.glb}`);assert.equal(glb.readUInt32LE(0),0x46546c67);assert.equal(glb.readUInt32LE(4),2);assert.equal(glb.readUInt32LE(8),glb.length);assert.ok((await stat(`${root}/${m.obj}`)).size>100);models.push({id:m.id,validGlbHeader:true,clips:m.animationClips.length});}
await writeFile('evidence/test-runs/coastal-kit-files.json',JSON.stringify({assets,models},null,2));console.log(`PASS: ${assets.length} alpha/layer assets, ${models.length} GLB/OBJ models; animation frames differ.`);
