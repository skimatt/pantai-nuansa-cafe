import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
const pkg=JSON.parse(await readFile('package.json','utf8'));
const all={...pkg.dependencies,...pkg.devDependencies};
const licenses=[];
for(const name of Object.keys(all)){
 const p=JSON.parse(await readFile(`node_modules/${name}/package.json`,'utf8'));
 licenses.push({name,version:p.version,license:p.license??'See upstream package notices',homepage:p.homepage??null});
}
await mkdir('evidence/test-runs',{recursive:true});
await writeFile('evidence/test-runs/dependency-licenses.json',JSON.stringify(licenses,null,2));
await mkdir('public/licenses',{recursive:true});
const runtimeNames=['next','react','react-dom','gsap','lenis','@fontsource/cormorant-garamond','@fontsource/dm-sans'];
const notices=[];
for(const name of runtimeNames){
 const entry=licenses.find(item=>item.name===name);
 const source=(await readdir(`node_modules/${name}`)).find(file=>/^license(?:\..*)?$/i.test(file));
 if(source){
  const target=`${name.replace(/^@/,'').replaceAll('/','-')}-LICENSE.txt`;
  await writeFile(`public/licenses/${target}`,await readFile(`node_modules/${name}/${source}`));
  notices.push(`${name} ${entry.version}\nLicense: ${entry.license}\nOriginal notice: ${target}\nSource: ${entry.homepage??'npm package'}\n`);
 }else{
  notices.push(`${name} ${entry.version}\nLicense: ${entry.license}\nSource: ${entry.homepage??'npm package'}\n`);
 }
}
await writeFile('public/licenses/THIRD_PARTY_NOTICES.txt',notices.join('\n'));
console.log(`${licenses.length} direct dependency licenses recorded; runtime/font notices prepared in public/licenses/.`);
