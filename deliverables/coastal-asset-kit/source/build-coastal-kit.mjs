import {mkdir,writeFile,copyFile} from 'node:fs/promises';
import sharp from 'sharp';
export const root='deliverables/coastal-asset-kit';
export const palette={ink:'#173746',sea:'#327d86',deep:'#23616b',light:'#89b5a6',foam:'#f7ebcf',sand:'#e4c79f',wet:'#aeac8a',leaf:'#426d51',bark:'#7b6447'};
const rand=n=>{const v=Math.sin(n*127.1+34.8)*43758.5453;return v-Math.floor(v);};
const svg=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const path=(id,d,fill,extra='')=>`<path id="${id}" d="${d}" fill="${fill}" ${extra}/>`;
const ellipse=(cx,cy,rx,ry,fill,extra='')=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const line=(x1,y1,x2,y2,color,width=2)=>`<path d="M${x1},${y1}L${x2},${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
export function wave(phase=0,w=1920,h=420,curl=false){
 const points=[];for(let x=0;x<=w;x+=8){const y=h*.36+Math.sin(x*.009+phase)*34+Math.sin(x*.027-phase*.8)*12+Math.sin(x*.103+phase)*3.5;points.push(`${x},${y.toFixed(2)}`);}
 const crest=`M${points.join('L')}`,fill=`${crest}L${w},${h}H0Z`;
 return svg(w,h,`<defs><linearGradient id="water" x2="0" y2="1"><stop stop-color="${palette.sea}"/><stop offset="1" stop-color="${palette.deep}"/></linearGradient></defs><g id="foam-back" transform="translate(0 19)">${path('back',fill,palette.foam)}</g><g id="foam-mid" transform="translate(0 9)">${path('middle',fill,palette.light)}</g><g id="water-body">${path('body',fill,'url(#water)')}</g><g id="foam-teeth">${path('rim',crest,'none',`stroke="${palette.foam}" stroke-width="4" stroke-linecap="round"`)}${Array.from({length:80},(_,i)=>{const x=i/79*w,y=h*.36+Math.sin(x*.009+phase)*34+Math.sin(x*.027-phase*.8)*12;return ellipse(x,y+9+rand(i)*16,1.5+rand(i+4)*4,.8+rand(i+11)*1.3,palette.foam,'opacity=".65"');}).join('')}</g>${curl?`<g id="curl">${path('curl-shape',`M${w*.56},${h*.77}C${w*.68},${h*.76} ${w*.68},${h*.1} ${w*.49},${h*.2}C${w*.68},${-h*.07} ${w*.8},${h*.59} ${w*.66},${h}`,palette.light)}${path('curl-foam',`M${w*.56},${h*.77}C${w*.68},${h*.76} ${w*.68},${h*.1} ${w*.49},${h*.2}`,'none',`stroke="${palette.foam}" stroke-width="8"`)}</g>`:''}`);
}
export function sand(phase=0,gust=false){
 const w=1200,h=360;
 if(gust)return svg(w,h,`<g id="wind-streaks">${Array.from({length:125},(_,i)=>{const p=(rand(i)+phase/Math.PI/2)%1,x=p*(w+100)-50,y=70+rand(i+200)*220-Math.sin(p*Math.PI)*35;return `<path d="M${x},${y}q${8+rand(i+41)*30},-3 ${18+rand(i+42)*42},-2" fill="none" stroke="${i%3?palette.sand:palette.wet}" stroke-width="${.6+rand(i+15)*1.4}" opacity="${Math.sin(p*Math.PI)*.7}"/>`;}).join('')}</g>`);
 return svg(w,h,`<g id="dune-back">${path('far','M0 180Q180 60 430 150T900 110Q1080 75 1200 135V360H0Z','#bcb895')}</g><g id="dune-mid">${path('mid','M0 230Q250 70 520 210T1200 170V360H0Z','#d2ba91')}</g><g id="dune-front">${path('near','M0 305Q280 170 650 267T1200 235V360H0Z',palette.sand)}</g><g id="sand-ripples">${Array.from({length:25},(_,i)=>`<path d="M${i*51-100},${288+i%3*9}q150,-60 315,-1" fill="none" stroke="${i%2?'#f1d9b2':'#b9a17d'}" stroke-width="${1+i%2}" opacity=".46"/>`).join('')}</g><g id="grains">${Array.from({length:450},(_,i)=>{const x=rand(i)*w,y=250+rand(i+501)*110;return ellipse(x,y,.6+rand(i+10)*1.2,.55,i%3?'#9c8769':'#f7dfb8','opacity=".35"');}).join('')}</g>`);
}
export function bird(phase=0,egret=false,standing=false){
 const w=320,h=280,flap=Math.sin(phase)*62,ink=egret?'#496b69':'#365c65',white='#f8f0d9';
 if(standing)return svg(w,h,`<g id="legs">${line(158,171,151,250,'#5e6151',3)}${line(172,173,178,251,'#5e6151',3)}${line(151,250,132,254,'#5e6151',2)}${line(178,251,195,253,'#5e6151',2)}</g><g id="body">${ellipse(162,149,32,46,white)}${path('folded-wing','M152 116Q196 131 176 188Q147 174 142 145Z','#d6ded0')}${path('feathers','M160 125Q177 150 170 180M153 132Q165 154 160 175','none','stroke="#a8beb0" stroke-width="1.5"')}</g><g id="neck">${path('long-neck','M153 123C154 92 187 91 190 68C192 54 180 48 176 51C205 42 217 65 201 84C189 99 176 100 177 127Z',white)}</g><g id="head">${ellipse(188,53,18,13,white)}${path('beak','M204 50L249 58L204 60Z','#bc914d')}${ellipse(195,51,2.3,2.3,ink)}${path('head-plume','M174 47Q150 47 141 62Q163 52 181 53Z','#dbe1cf')}</g>`);
 const backWing=`M154 135Q103 ${80-flap*.7} 59 ${54-flap*.45}Q88 ${110-flap*.25} 125 150Z`;
 const frontWing=`M153 143Q119 ${78-flap} 42 ${68-flap*.8}Q69 ${105-flap*.5} 82 ${116-flap*.33}L64 ${112-flap*.4}Q113 ${158-flap*.2} 160 156Z`;
 return svg(w,h,`<g id="far-wing">${path('back-wing',backWing,'#b9cec2',`stroke="${ink}" stroke-width="1"`)}</g><g id="body">${ellipse(160,148,43,13,white)}${path('tail','M123 142L81 153L126 157Z',egret?'#eef0d7':ink)}</g><g id="near-wing">${path('wing',frontWing,white,`stroke="${ink}" stroke-width="1.4"`)}${path('wing-ink',`M44 ${69-flap*.8}Q76 ${105-flap*.5} 82 ${116-flap*.33}L64 ${112-flap*.4}Q95 ${139-flap*.27} 116 ${144-flap*.18}Q83 ${95-flap*.5} 44 ${69-flap*.8}Z`,egret?'#d4dfd0':ink)}</g>${egret?`<g id="neck">${path('neck','M191 143C207 135 196 117 217 115Q233 113 239 122L234 129Q216 122 214 134Q219 151 191 153Z',white,`stroke="${ink}" stroke-width=".8"`)}</g><g id="legs">${line(136,156,80,172,'#686956',2)}${line(143,158,91,181,'#686956',2)}${line(80,172,65,170,'#686956',1.2)}</g>`:''}<g id="head">${ellipse(egret?237:203,egret?123:139,egret?13:15,9,white)}${path('beak',egret?'M248 120L285 127L248 128Z':'M215 138L237 143L215 145Z','#bf9452')}${ellipse(egret?241:207,egret?122:138,1.8,1.8,ink)}</g>`);
}
export function tree(kind){
 const w=600,h=900,bark=palette.bark;
 let body=path('trunk','M267 858Q290 597 287 311L308 303Q311 623 332 858Z',bark);
 if(kind==='banyan'){
  body=path('trunk','M225 864Q284 660 257 390L329 374Q314 668 383 866L329 850L294 686L266 858Z',bark);
  for(let i=0;i<32;i++){const x=95+rand(i)*400,y=240+rand(i+12)*180;body+=line(x,y,x+Math.sin(i)*14,600+rand(i+31)*160,'#8b7957',1+rand(i+41)*2);}
 }
 const count=kind==='pine'?55:kind==='almond'?60:85;
 let leaves='';for(let i=0;i<count;i++){
  let x,y,rx,ry;if(kind==='pine'){y=100+rand(i+4)*570;const breadth=(y/900)*260;x=300+(rand(i+1)-.5)*breadth*2;rx=28+rand(i+2)*45;ry=10+rand(i+3)*21;}
  else if(kind==='almond'){const tier=i%4;y=180+tier*117+rand(i+4)*25;x=300+(rand(i+1)-.5)*(390-tier*40);rx=35+rand(i+2)*40;ry=12+rand(i+3)*18;}
  else{x=300+Math.cos(i*2.399)*Math.sqrt(rand(i+1))*230;y=300+Math.sin(i*2.399)*Math.sqrt(rand(i+2))*140;rx=25+rand(i+2)*60;ry=20+rand(i+3)*40;}
  leaves+=ellipse(x,y,rx,ry,['#214b40','#426d51','#71854f','#536f48'][i%4],`opacity="${.75+rand(i+11)*.23}"`);
 }
 return svg(w,h,`<g id="trunk-and-roots">${body}</g><g id="canopy-wind-pivot">${leaves}</g><g id="bark-highlights">${line(298,390,306,800,'#b59a6c',3)}</g>`);
}
export function object(kind){
 if(kind==='grass')return svg(600,420,`<g id="grass-roots">${Array.from({length:58},(_,i)=>{const x=150+rand(i)*260;return path(`blade-${i}`,`M${x} 405Q${x-80+rand(i+8)*160} ${220-rand(i+9)*100} ${x-125+rand(i+18)*250} ${60+rand(i+11)*250}`,'none',`stroke="${['#406b52','#8a9259','#b4aa71'][i%3]}" stroke-width="${1+rand(i+14)*4}" stroke-linecap="round"`);}).join('')}</g>`);
 if(kind==='rocks')return svg(640,360,`<g id="far-stone">${path('rock-a','M260 272L289 159L369 121L444 157L497 278Z','#7c8372')}</g><g id="near-stones">${path('rock-b','M39 306L102 199L202 171L299 231L324 321Z','#596f67')}${path('rock-c','M367 318L410 236L519 214L600 289L602 328Z','#8c8c70')}</g><g id="light-facets">${path('facet-a','M102 199L202 171L169 227L39 306Z','#a9ac8b')}${path('facet-b','M289 159L369 121L351 200L260 272Z','#b8b293')}</g>`);
 if(kind==='shell')return svg(420,360,`<g id="shell-body">${path('shell','M206 304C142 277 47 230 65 146C77 88 164 40 210 51C272 38 351 91 360 148C377 222 267 281 221 305Z','#d3b28e','stroke="#a28a70" stroke-width="3"')}</g><g id="shell-ribs">${Array.from({length:11},(_,i)=>{const a=Math.PI+i/10*Math.PI,x=210+Math.cos(a)*150,y=155+Math.sin(a)*96;return path(`rib-${i}`,`M214 298Q${210+(x-210)*.64} 173 ${x} ${y}`,'none','stroke="#f4dfbd" stroke-width="5"');}).join('')}</g>`);
 return svg(760,320,`<g id="driftwood">${path('branch','M51 250Q194 208 361 190L537 63L564 65L443 175L696 141L720 160L472 209L392 283L368 273L402 222L74 269Z','#8f7959')}</g><g id="bark">${path('grooves','M80 254Q258 216 418 204L685 154M369 200L548 77','none','stroke="#c4ad81" stroke-width="6"')}${path('grain','M138 245L391 210L514 183','none','stroke="#5e6550" stroke-width="2"')}</g>`);
}
export const definitions=[
 ['wave-serrated','Ombak bergerigi','transition',1920,420,()=>wave(),12,'wave'],
 ['wave-curl','Gulungan ombak','transition',1920,420,()=>wave(.4,1920,420,true),12,'wave'],
 ['foam-edge','Tepi buih','overlay',1920,180,()=>wave(.3,1920,180),1,'foam'],
 ['dune-sand','Gundukan dan tekstur pasir','environment',1200,360,()=>sand(),1,'sand'],
 ['sand-gust','Pasir tertiup angin','particle',1200,360,()=>sand(0,true),8,'gust'],
 ['gull-flight','Burung laut terbang','fauna',320,280,()=>bird(),8,'gull'],
 ['egret-flight','Bangau tematik terbang','fauna',320,280,()=>bird(0,true),8,'egret'],
 ['egret-standing','Bangau tematik berdiri','fauna',320,280,()=>bird(0,true,true),1,'standing'],
 ['tree-coastal-pine','Pohon pesisir ramping','vegetation',600,900,()=>tree('pine'),1,'pine'],
 ['tree-almond','Ketapang tematik','vegetation',600,900,()=>tree('almond'),1,'almond'],
 ['tree-banyan','Beringin tematik','vegetation',600,900,()=>tree('banyan'),1,'banyan'],
 ['coastal-grass','Rumpun rumput pesisir','vegetation',600,420,()=>object('grass'),1,'grass'],
 ['shore-rocks','Batu pesisir','prop',640,360,()=>object('rocks'),1,'rocks'],
 ['shell-marker','Kerang untuk penanda','prop',420,360,()=>object('shell'),1,'shell'],
 ['driftwood-branch','Ranting kayu pesisir','prop',760,320,()=>object('wood'),1,'wood'],
];
export async function build(){
 for(const dir of ['svg','png','webp','sprites','frames','models','proposal','licenses','source'])await mkdir(`${root}/${dir}`,{recursive:true});
 await mkdir('public/assets/coastal-kit',{recursive:true});
 const manifest=[];
 for(const [id,label,category,width,height,draw,frames,kind]of definitions){
  const source=draw();await writeFile(`${root}/svg/${id}.svg`,source);
  await sharp(Buffer.from(source)).png().toFile(`${root}/png/${id}.png`);
  await sharp(Buffer.from(source)).webp({quality:88}).toFile(`${root}/webp/${id}.webp`);
  const entry={id,label,category,width,height,sourceType:'procedural',verified:false,isPlaceholder:true,license:'Original procedural artwork by project; see provenance',svg:`svg/${id}.svg`,png:`png/${id}.png`,webp:`webp/${id}.webp`,frames,pivot:category==='vegetation'?[.5,.96]:[.5,.5],layers:[...source.matchAll(/<g id="([^"]+)"/g)].map(m=>m[1])};
  if(frames>1){
   const fw=kind==='gull'||kind==='egret'?320:kind==='gust'?600:960,fh=Math.round(height/width*fw),tiles=[];
   await mkdir(`${root}/frames/${id}`,{recursive:true});
   for(let i=0;i<frames;i++){
    const phase=i/frames*Math.PI*2,body=kind==='gull'||kind==='egret'?bird(phase,kind==='egret'):kind==='gust'?sand(phase,true):wave(phase,width,height,id==='wave-curl');
    const buffer=await sharp(Buffer.from(body)).resize(fw,fh).png().toBuffer();await writeFile(`${root}/frames/${id}/${String(i).padStart(2,'0')}.png`,buffer);tiles.push({input:buffer,left:i*fw,top:0});
   }
   await sharp({create:{width:fw*frames,height:fh,channels:4,background:'#00000000'}}).composite(tiles).png().toFile(`${root}/sprites/${id}.png`);
   await sharp(`${root}/sprites/${id}.png`).webp({quality:88}).toFile(`${root}/sprites/${id}.webp`);
   Object.assign(entry,{sprite:`sprites/${id}.webp`,frameWidth:fw,frameHeight:fh,fps:kind==='gull'||kind==='egret'?10:8});
  }
  manifest.push(entry);
 }
 await copyFile('node_modules/three/LICENSE',`${root}/licenses/three-MIT.txt`);
 await writeFile(`${root}/manifest.json`,JSON.stringify({version:1,name:'Pantai Nuansa — Coastal Asset Kit',themeNotice:'Ilustrasi tematik; bukan inventaris vegetasi/satwa atau dokumentasi fasilitas lokasi.',assets:manifest},null,2));
 console.log(`Created ${manifest.length} layered SVG/PNG/WebP assets and frame sequences.`);
 return manifest;
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/build-coastal-kit.mjs'))await build();
