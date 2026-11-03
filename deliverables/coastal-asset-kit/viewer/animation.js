const manifest=await fetch('../manifest.json').then(r=>r.json()),images=new Map();
await Promise.all(manifest.assets.map(async a=>{const im=new Image();im.src='../'+(a.sprite??a.webp);await im.decode();images.set(a.id,im);}));
const canvas=document.querySelector('canvas'),c=canvas.getContext('2d'),w=1600,h=900,start=performance.now();
function image(id,x,y,width,height,t=0){const asset=manifest.assets.find(a=>a.id===id),im=images.get(id);if(asset.sprite){const frame=Math.floor(t*(asset.fps??8))%asset.frames;c.drawImage(im,frame*asset.frameWidth,0,asset.frameWidth,asset.frameHeight,x,y,width,height);}else c.drawImage(im,x,y,width,height);}
function tree(id,x,y,height,t,offset){const im=images.get(id),width=height*im.naturalWidth/im.naturalHeight;c.save();c.translate(x,y);c.rotate(Math.sin(t*.65+offset)*.018);image(id,-width*.5,-height,width,height,t);c.restore();}
function frame(now){const t=(now-start)/1000;const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#fff4e4');sky.addColorStop(.58,'#b8cec1');sky.addColorStop(1,'#e4c79f');c.fillStyle=sky;c.fillRect(0,0,w,h);
c.fillStyle='#173746';c.font='46px Georgia';c.fillText('Nuansa — Studi Aset Pesisir',55,76);c.font='15px Arial';c.fillText('ILUSTRASI TEMATIK  /  GELOMBANG · PASIR · BURUNG · VEGETASI',58,113);
image('dune-sand',0,480,w,400,t);tree('tree-coastal-pine',200,660,460,t,0);tree('tree-almond',650,660,420,t,1);tree('tree-banyan',1110,660,430,t,2);
for(let i=0;i<3;i++){const x=(1200+i*115-t*26)%(w+120);image(i===0?'egret-flight':'gull-flight',x,225+i*31+Math.sin(t*.7+i)*8,i===0?140:95,i===0?123:83,t+i*.2);}
image('shore-rocks',1260,581,220,124,t);image('egret-standing',1270,475,175,153,t);image('coastal-grass',20,630,200,140,t);image('driftwood-branch',700,674,220,93,t);image('shell-marker',960,682,65,56,t);
image('sand-gust',0,635,w,200,t);image('wave-curl',0,725+Math.sin(t*.7)*8,w,350,t);image('wave-serrated',0,763+Math.sin(t*.6)*7,w,350,t+.4);
c.fillStyle='#fff4e4';c.font='14px Arial';c.fillText('15 kelompok aset · 8 model GLB/OBJ · layer SVG · PNG alpha · atlas gerak',55,862);c.font='12px Arial';c.fillText('Bukan dokumentasi vegetasi atau satwa asli lokasi.',1110,862);window.kitAnimationReady=true;requestAnimationFrame(frame);}requestAnimationFrame(frame);
