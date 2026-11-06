import {readdir,readFile,writeFile,mkdir,stat,unlink} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {z} from 'zod';
const folders={galeri:'gallery',discover:'discover',pengalaman:'experience',fasilitas:'explore',momen:'moments',lokasi:'findUs'};
const allowed=/\.(jpe?g|png|webp|avif)$/i;
const metadataSchema=z.record(z.string(),z.object({caption:z.string().min(1).max(180).optional(),alt:z.string().min(1).max(400).optional(),credit:z.string().min(1).max(300).optional(),order:z.number().int().min(0).max(10000).optional()}));
const hash=value=>createHash('sha256').update(value).digest('hex');
async function readJson(file,fallback){try{return JSON.parse(await readFile(file,'utf8'));}catch(error){if(error.code==='ENOENT')return fallback;throw error;}}
async function writeChanged(file,value){const body=JSON.stringify(value,null,2)+'\n';let previous='';try{previous=await readFile(file,'utf8');}catch{}if(body!==previous){await writeFile(file,body);return true;}return false;}
export async function syncLocalPhotos({workspace=process.cwd(),quiet=false}={}){
 const inputRoot=path.resolve(workspace,'foto-website'),outputRoot=path.resolve(workspace,'public/assets/local-photos'),manifestFile=path.resolve(workspace,'content/local-photos.json');
 const previous=await readJson(manifestFile,{assets:[]}),assets=[],gallery=[],sections={discover:[],experience:[],explore:[],moments:[],findUs:[]},menuOverrides=[];
 const cache=new Map(previous.assets.map(a=>[a.id,a]));
 const menu=await readJson(path.join(workspace,'content/menu.json'),{items:[]});
 async function folder(name,role,menuId){
  const absolute=path.resolve(inputRoot,name);if(!absolute.startsWith(inputRoot+path.sep))throw new Error('Photo input outside root');await mkdir(absolute,{recursive:true});
  const metadata=metadataSchema.parse(await readJson(path.join(absolute,'foto.json'),{}));
  const files=(await readdir(absolute,{withFileTypes:true})).filter(d=>d.isFile()&&!d.isSymbolicLink()&&!d.name.startsWith('.')&&allowed.test(d.name)).map(d=>d.name).sort((a,b)=>(metadata[a]?.order??9999)-(metadata[b]?.order??9999)||a.localeCompare(b,'id',{numeric:true}));
  const entries=[];
  for(const [order,file]of files.entries()){
   const source=path.join(absolute,file),info=await stat(source);if(info.size>25*1024*1024)throw new Error(`Foto lebih dari25MB: ${name}/${file}`);
   const bytes=await readFile(source),key=hash(name+'/'+file).slice(0,12),digest=hash(bytes).slice(0,16),id=`folder-${role}-${key}`;
   const base=`${role}-${key}-${digest}`,src=`/assets/local-photos/${base}.webp`,small=`/assets/local-photos/${base}-480.webp`;
   await mkdir(outputRoot,{recursive:true});
   const cached=cache.get(id);let width,height;
   if(cached?.src===src){width=cached.width;height=cached.height;try{await stat(path.join(workspace,'public',src));await stat(path.join(workspace,'public',small));}catch{width=undefined;}}
   if(!width){
    const result=await sharp(bytes,{limitInputPixels:60000000}).rotate().resize({width:1200,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile(path.join(workspace,'public',src));width=result.width;height=result.height;
    await sharp(bytes,{limitInputPixels:60000000}).rotate().resize({width:480,height:640,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(path.join(workspace,'public',small));
   }
   const caption=metadata[file]?.caption??(file.replace(/\.[^.]+$/,'').replace(/^\d+[-_ .]*/,'').replace(/[-_]+/g,' ').slice(0,180)||'Dokumentasi Nuansa');
   const alt=metadata[file]?.alt??caption,credit=metadata[file]?.credit??'Dokumentasi dari folder pengelola.';
   const asset={id,src,type:'image',sceneId:role==='gallery'?'album':role,sourceType:'owner',license:'Local-folder publication intent; uploader must own or hold permission',attribution:credit,verified:false,isPlaceholder:false,alt,width,height,variants:[small],loading:'lazy',pivot:[.5,.5],depth:.5,status:'prototype',promptVersion:'local-folder-v1',provenance:'docs/implementation/LOCAL_PHOTO_WORKFLOW.md',contentHash:hash(bytes),sourceFile:path.relative(workspace,source).replaceAll('\\','/'),permission:'local-folder-publish-intent'};
   assets.push(asset);entries.push({id:`local-${role}-${key}`,type:'image',assetId:id,caption,alt,credit,verified:false,sortOrder:order});
  }
  if(role==='gallery')gallery.push(...entries);else if(role==='taste'){if(entries[0])menuOverrides.push({menuId,assetId:entries[0].assetId});}else sections[role].push(...entries);
 }
 for(const [name,role]of Object.entries(folders))await folder(name,role);
 for(const item of menu.items)await folder(`kuliner/${item.id}`,'taste',item.id);
 const output={assets,gallery,sections,menuOverrides};const changed=await writeChanged(manifestFile,output);
 const retained=new Set(assets.flatMap(a=>[a.src,...a.variants]));
 for(const asset of previous.assets){for(const file of [asset.src,...asset.variants]){
  if(retained.has(file)||!/^\/assets\/local-photos\/[a-z0-9-]+\.webp$/.test(file))continue;
  const target=path.resolve(workspace,'public','.'+file);if(!target.startsWith(outputRoot+path.sep))throw new Error('Unsafe derived photo path');try{await unlink(target);}catch(error){if(error.code!=='ENOENT')throw error;}
 }}
 if(!quiet)console.log(`Foto lokal: ${assets.length} gambar, ${gallery.length} album; ${changed?'manifest diperbarui':'tidak ada perubahan'}.`);
 return {changed,output};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/sync-local-photos.mjs'))await syncLocalPhotos();
