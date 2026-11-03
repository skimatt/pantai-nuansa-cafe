import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,stat,unlink,rm,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import {syncLocalPhotos} from '../tools/sync-local-photos.mjs';
async function fixture(){const dir=await mkdtemp(path.join(tmpdir(),'nuansa-photos-'));await mkdir(path.join(dir,'content'));await writeFile(path.join(dir,'content/menu.json'),JSON.stringify({items:[{id:'nasi-goreng-telur'}]}));await mkdir(path.join(dir,'foto-website/galeri'),{recursive:true});return dir;}
async function cleanup(dir){const resolved=await realpath(dir),base=await realpath(tmpdir());assert.ok(resolved.startsWith(base+path.sep)&&path.basename(resolved).startsWith('nuansa-photos-'));await rm(resolved,{recursive:true,force:true});}
const photo=(file,color)=>sharp({create:{width:80,height:100,channels:3,background:color}}).jpeg().toFile(file);
test('folder import adds, caches, replaces and removes photos without deleting other originals',async()=>{
 const dir=await fixture();try{
  const source=path.join(dir,'foto-website/galeri/01-pantai.jpg');await photo(source,'#327d86');
  await writeFile(path.join(dir,'foto-website/galeri/foto.json'),JSON.stringify({'01-pantai.jpg':{caption:'Pantai pilihan',credit:'Pengelola',order:1}}));
  const first=await syncLocalPhotos({workspace:dir,quiet:true});assert.equal(first.output.gallery.length,1);assert.equal(first.output.gallery[0].caption,'Pantai pilihan');
  const manifest=path.join(dir,'content/local-photos.json'),stamp=(await stat(manifest)).mtimeMs;
  assert.equal((await syncLocalPhotos({workspace:dir,quiet:true})).changed,false);assert.equal((await stat(manifest)).mtimeMs,stamp);
  await photo(source,'#e4c79f');const second=await syncLocalPhotos({workspace:dir,quiet:true});
  assert.equal(second.output.assets[0].id,first.output.assets[0].id);assert.notEqual(second.output.assets[0].src,first.output.assets[0].src);
  await assert.rejects(stat(path.join(dir,'public',first.output.assets[0].src)),/ENOENT/);await stat(source);
  await unlink(source);const empty=await syncLocalPhotos({workspace:dir,quiet:true});assert.equal(empty.output.gallery.length,0);await stat(path.join(dir,'foto-website/galeri/foto.json'));
 }finally{await cleanup(dir);}
});
test('section folders and menu overrides are indexed; invalid/unsupported files preserve valid manifest',async()=>{
 const dir=await fixture();try{
  await mkdir(path.join(dir,'foto-website/discover'),{recursive:true});await photo(path.join(dir,'foto-website/discover/pantai.jpg'),'#173746');
  await mkdir(path.join(dir,'foto-website/kuliner/nasi-goreng-telur'),{recursive:true});await photo(path.join(dir,'foto-website/kuliner/nasi-goreng-telur/sajian.jpg'),'#e4c79f');
  await writeFile(path.join(dir,'foto-website/galeri/unsafe.svg'),'<svg><script>bad()</script></svg>');
  const good=await syncLocalPhotos({workspace:dir,quiet:true});assert.equal(good.output.assets.length,2);assert.equal(good.output.sections.discover.length,1);assert.equal(good.output.menuOverrides[0].menuId,'nasi-goreng-telur');
  const manifest=path.join(dir,'content/local-photos.json'),before=await readFile(manifest,'utf8');await writeFile(path.join(dir,'foto-website/galeri/incomplete.jpg'),'not an image');
  await assert.rejects(syncLocalPhotos({workspace:dir,quiet:true}));assert.equal(await readFile(manifest,'utf8'),before);
 }finally{await cleanup(dir);}
});
