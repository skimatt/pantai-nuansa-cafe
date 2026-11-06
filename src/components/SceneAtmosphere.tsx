'use client';
import {ambientMotionPreference} from '@/lib/ambient-motion';
import {useEffect,useRef} from 'react';
import {joinAtmosphere} from '@/lib/atmosphere-clock';
import {drawBentLeaf,foamEdge} from '@/lib/shore-shapes';
import {forwardFlight,drawSeaBreeze} from '@/lib/coastal-air';
import type {SceneKit} from '@/lib/scene-kit';
export type AtmospherePreset={wind:number;surf:number;sand:number;birds:number;tone:'day'|'night'|'sunset';side:'left'|'right';foliage:number};
export default function SceneAtmosphere({preset,frond,paused,kit}:{preset:AtmospherePreset;frond:string;paused:boolean;kit:SceneKit}){
 const ref=useRef<HTMLCanvasElement>(null),pauseRef=useRef(paused),syncRef=useRef<()=>void>(()=>{});
 useEffect(()=>{pauseRef.current=paused;syncRef.current();},[paused]);
 useEffect(()=>{
  const canvas=ref.current,section=canvas?.closest('section');if(!canvas||!section)return;
  const c=canvas.getContext('2d');if(!c)return;
  const reduced=ambientMotionPreference(),sprite=new Image(),cache=document.createElement('canvas');
  const birdSprite=new Image(),treeSprite=new Image(),sandSprite=new Image();let kitLoaded=false;
  cache.width=320;cache.height=214;let w=1440,h=900,visible=false,ready=false,painted=false,scroll=0,clock=0,pointer=0;
  const paint=(time:number)=>{
   const bounds=canvas.getBoundingClientRect();
   if(!canvas.isConnected||bounds.width<1||bounds.height<1||!Number.isFinite(h)||h<1)return;
   clock=time;painted=true;c.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);c.clearRect(0,0,w,h);
   const mobile=w<700,t=reduced.matches?10:time,night=preset.tone==='night';
   const viewTop=mobile?Math.max(0,-bounds.top*w/bounds.width):0;
   const viewHeight=mobile?Math.max(0,Math.min(h-viewTop,(innerHeight-Math.max(0,bounds.top))*w/bounds.width)):h;
   // A distant thematic tree is a separate alpha asset, kept behind information.
   if(treeSprite.complete&&treeSprite.naturalWidth&&preset.foliage>0){
    const treeHeight=mobile?170:290,treeWidth=treeHeight*treeSprite.naturalWidth/treeSprite.naturalHeight;
    c.save();c.globalAlpha=night?.15:.22;c.translate(preset.side==='left'?w-12:12,viewTop+viewHeight*.94);c.rotate(Math.sin(t*.6)*.018*preset.wind);
    c.drawImage(treeSprite,-treeWidth*.5,-treeHeight,treeWidth,treeHeight);c.restore();
   }
   // Palm material is shared with the approved Hero; different wind phases and framing.
   if(ready&&preset.foliage>0){
    const side=preset.side==='left'?-1:1,x=side<0?-65:w+65;
    const base=side<0?-.35:Math.PI+.25;
    c.save();c.globalAlpha=night?.62:.83;
    const lengths=mobile?[155,130]:[285,235,190];
    lengths.forEach((len,i)=>drawBentLeaf(c,cache,320,214,x,viewTop-25+i*9-scroll*24,base+(side<0?1:-1)*i*.41,len*preset.foliage,t+i*.83,preset.wind,mobile));c.restore();
   }
   // Shoreline advances and falls back, breaking into a scalloped foam fringe.
   if(preset.surf>0){
    const amplitude=(mobile?15:25)*preset.surf;
    const y=(mobile?viewTop+viewHeight*.82:h*(night?.68:.83))+Math.sin(t*.48)*amplitude+scroll*25;
    for(let j=2;j>=0;j--){
     c.beginPath();foamEdge(c,w,y+j*13,t*.65+j*.43,amplitude);c.lineTo(w+24,h+30);c.lineTo(-24,h+30);c.closePath();
     const wash=c.createLinearGradient(0,y-20,0,y+(mobile?100:170));
     wash.addColorStop(0,j===0?(night?'rgba(78,155,153,.5)':'rgba(55,128,135,.38)'):j===1?'rgba(218,236,212,.5)':'rgba(247,235,203,.7)');wash.addColorStop(1,'rgba(55,128,135,0)');c.fillStyle=wash;c.fill();
    }
    c.beginPath();foamEdge(c,w,y-2,t*.65,amplitude);c.strokeStyle=night?'#c5dbbf':'#fff1cc';c.globalAlpha=.8;c.lineWidth=1.8;c.stroke();c.globalAlpha=1;
    // Foam flecks stretch along wind and disperse rather than forming a neat line.
    c.fillStyle='rgba(252,243,214,.75)';
    for(let i=0;i<(mobile?24:55);i++){
     const x=(i*41.73+t*9)%(w+30),rise=(i*.731+t*.09)%1;
     c.globalAlpha=(1-rise)*.65;c.fillRect(x,y+Math.sin(x*.009+t*.65)*amplitude-rise*28,2+rise*2,1);
    }c.globalAlpha=1;
   }
   // Sand travels across the lower ground plane; safe areas remain quiet.
   if(sandSprite.complete&&sandSprite.naturalWidth&&preset.sand>0){const [fw,fh,count]=kit.sandFrame,frame=reduced.matches?0:Math.floor(t*8)%count;c.save();c.globalAlpha=night?.22:.35;c.drawImage(sandSprite,frame*fw,0,fw,fh,0,viewTop+viewHeight*.7,w,viewHeight*.24);c.restore();}
   for(let i=0;i<preset.sand;i++){
    const p=(i*.618+t*.022*preset.wind)%1,x=p*(w+120)-60;
    const y=viewTop+viewHeight*(.72+(i*.381)%1*.27)-Math.sin(p*Math.PI)*22;
    c.fillStyle=night?'rgba(230,211,163,.4)':'rgba(132,104,67,.29)';c.fillRect(x+pointer*8,y,1.5+(i%3),.8);
   }
   if(!reduced.matches)drawSeaBreeze(c,w,viewTop,viewHeight,t,preset.wind,night);
   c.strokeStyle=night?'#a0bdb0':'#416b65';c.lineWidth=1.1;
   for(let i=0;i<preset.birds;i++){
    const flight=forwardFlight(w,t,i),x=flight.x,y=viewTop+viewHeight*.16+i*11+flight.rise,wing=Math.sin(t*3.2+i)*4;
    if(birdSprite.complete&&birdSprite.naturalWidth){const [fw,fh,count]=kit.flightFrame,frame=reduced.matches?0:Math.floor(t*10+i*2)%count,size=(mobile?35:43)*(1-i*.11),height=size*fh/fw;c.save();c.translate(x,y);c.rotate(flight.bank);c.drawImage(birdSprite,frame*fw,0,fw,fh,-size*.5,-height*.45,size,height);c.restore();continue;}
    c.beginPath();c.moveTo(x-6,y-wing);c.quadraticCurveTo(x-2,y-2,x,y+1);c.quadraticCurveTo(x+2,y-2,x+6,y-wing);c.stroke();
   }
   canvas.dataset.frames=String(Number(canvas.dataset.frames??0)+1);
  };
  const client=joinAtmosphere(paint);
  for(const image of [birdSprite,treeSprite,sandSprite])image.onload=()=>{if(visible)paint(reduced.matches?10:clock);};
  const sync=()=>{const active=visible&&!pauseRef.current&&!reduced.matches;client.active(active);canvas.dataset.motion=reduced.matches?'reduced':active&&!document.hidden?'running':'paused';if(visible&&(!painted||reduced.matches))paint(reduced.matches?10:clock);};syncRef.current=sync;
  const resize=()=>{
   const r=canvas.getBoundingClientRect();if(r.width<1||r.height<1)return;
   w=r.width<641?600:1440;h=w*r.height/r.width;painted=false;
   // Keep only visible backing stores. CSS preserves layout while dormant
   // sections release their potentially large raster surfaces.
   if(!visible){canvas.width=1;canvas.height=1;return;}
   const ratio=Math.min(devicePixelRatio||1,r.width<641?1:1.25);
   canvas.width=Math.round(r.width*ratio);canvas.height=Math.round(r.height*ratio);paint(clock);
  };
  const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
  const io=new IntersectionObserver(([entry])=>{const changed=visible!==entry.isIntersecting;visible=entry.isIntersecting;if(visible&&!kitLoaded){kitLoaded=true;birdSprite.src=kit.bird.src;treeSprite.src=kit.tree.src;sandSprite.src=kit.sand.src;}if(changed)resize();sync();},{rootMargin:'40px'});io.observe(section);
  const scrolling=()=>{if(!visible)return;const r=section.getBoundingClientRect();scroll=Math.max(-1,Math.min(1,r.top/innerHeight));};
  const move=(e:PointerEvent)=>{pointer=(e.clientX/innerWidth-.5)*2;};
  sprite.onload=()=>{cache.getContext('2d')!.drawImage(sprite,0,0,320,214);ready=true;if(visible)paint(clock);};sprite.src=frond;
  section.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scrolling,{passive:true});reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  return ()=>{client.dispose();sprite.onload=null;for(const image of [birdSprite,treeSprite,sandSprite])image.onload=null;syncRef.current=()=>{};ro.disconnect();io.disconnect();section.removeEventListener('pointermove',move);window.removeEventListener('scroll',scrolling);reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
 },[preset,frond,kit.bird.src,kit.tree.src,kit.sand.src,kit.flightFrame,kit.sandFrame]);
 return <canvas ref={ref} className="scene-atmosphere" aria-hidden="true"/>;
}
