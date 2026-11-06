import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { content } from '../src/lib/content';
import { validateOwnerOriginal, type ImportedOriginal } from './owner-original';

const importedOriginals = JSON.parse(readFileSync('evidence/documentation-import/import-manifest.json', 'utf8')).items as ImportedOriginal[];

for(const file of [content.audio.sourceFile,join('public',content.audio.src),'evidence/audio/mix-provenance.json'])if(!existsSync(file))throw new Error(`Missing soundtrack file ${file}`);

for(const a of content.media.assets) {
  for(const file of [a.src,...a.variants])if(!existsSync(join(process.cwd(),'public',file)))throw new Error(`Missing file ${file}`);
  if(a.sourceType==='owner')validateOwnerOriginal(a,importedOriginals);
  if(!existsSync(join(process.cwd(),a.provenance)))throw new Error(`Missing provenance ${a.provenance}`);
  if(a.src.endsWith('.svg')) {
    const source=readFileSync(join('public',a.src),'utf8');
    if(/<script|<foreignObject|onload=|javascript:|https?:\/\//i.test(source.replace('http://www.w3.org/2000/svg','')))throw new Error(`Unsafe SVG ${a.src}`);
  }
}
console.log(`PASS: content schemas + local photo manifest, ${content.media.assets.length} assets, references, active anchors and provenance.`);
console.warn('NOTICE: Venue facts pending verification. Generated visuals are labeled concepts; documentary media retains source credits and permission.');
