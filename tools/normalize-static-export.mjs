import {readdir,readFile,copyFile} from 'node:fs/promises';
import path from 'node:path';
// Next16.4's exporter flattens '/' in segment paths, but Windows traversal can
// leave '\\' as directories. Add the flattened filenames the router requests.
// Keep the generated originals; no application server/rewrite is required.
const root=path.resolve('out');let aliases=0;
async function walk(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const source=path.join(dir,entry.name);
  if(entry.isDirectory()){await walk(source);continue;}
  if(!entry.isFile()||!entry.name.endsWith('.txt'))continue;
  const parts=path.relative(root,source).split(path.sep),start=parts.findIndex(p=>p.startsWith('__next.'));
  if(start<0||start===parts.length-1)continue;
  const destination=path.resolve(root,...parts.slice(0,start),parts.slice(start).join('.'));
  if(!destination.startsWith(root+path.sep))throw new Error('Unsafe export alias');
  try{const [a,b]=await Promise.all([readFile(source),readFile(destination)]);if(!a.equals(b))throw new Error(`Conflicting export alias: ${destination}`);}
  catch(error){if(error.code!=='ENOENT')throw error;await copyFile(source,destination);aliases++;}
 }
}
await walk(root);console.log(`Static export segment aliases prepared: ${aliases}.`);
