'use client';
import {useEffect,useRef} from 'react';
import type {FoundationContent} from '@/lib/content';
import {joinAtmosphere} from '@/lib/atmosphere-clock';
import {ambientMotionPreference} from '@/lib/ambient-motion';
import {drawBentLeaf,foamEdge} from '@/lib/shore-shapes';
import {forwardFlight,drawSeaBreeze} from '@/lib/coastal-air';

/** A viewport-sized environment, clipped to the collection. It never allocates
 * a canvas as tall as an arbitrarily growing photo/menu collection. */
export default function DetailBackdrop({content,kind,paused}:{content:FoundationContent;kind:'menu'|'gallery'|'facilities';paused:boolean}){
 const ref=useRef<HTMLCanvasElement>(null),pauseRef=useRef(paused),syncRef=useRef(()=>{});
 useEffect(()=>{pauseRef.current=paused;syncRef.current();},[paused]);
 const kit=content.scenes.assetKit;
 const get=(id:string)=>content.media.assets.find(a=>a.id===id)!.src;
 const tree=get(kind==='gallery'?kit.trees.banyan:kind==='facilities'?kit.trees.almond:kit.trees.pine),frond=get('rigged-palm-frond'),bird=get(kind==='facilities'?kit.egret:kit.gull),sand=get(kit.sand);
 const flightFrame=kit.flightFrame,sandFrame=kit.sandFrame;
 useEffect(()=>{
  const canvas=ref.current,body=canvas?.parentElement?.querySelector<HTMLElement>('.detail-body');if(!canvas||!body)return;
  const c=canvas.getContext('2d');if(!c)return;
  const images=[tree,frond,bird,sand].map(()=>new Image()),mask=document.createElement('canvas'),preference=ambientMotionPreference();
  let visible=false,loaded=false,disposed=false,w=1440,h=900,time=0;
  const paint=(now:number)=>{
   if(disposed||!canvas.isConnected||canvas.width<1||!Number.isFinite(h))return;
   time=now;const t=preference.matches?10:now,mobile=innerWidth<641,rect=body.getBoundingClientRect(),scale=w/innerWidth,top=Math.max(0,rect.top*scale),bottom=Math.min(h,rect.bottom*scale);
   c.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);c.clearRect(0,0,w,h);if(bottom<=top)return;
   c.save();c.beginPath();c.rect(0,top,w,bottom-top);c.clip();
   // Continuous canopy shear keeps the root anchored without raster strip seams.
   const treeImage=images[0];
   if(treeImage.naturalWidth){
    const height=mobile?310:Math.min(640,h*.85),width=height*treeImage.naturalWidth/treeImage.naturalHeight,x=kind==='gallery'?w-width*.42:-width*.55,base=h+30;
    c.save();c.globalAlpha=.82;c.translate(x+width*.5,base);c.rotate(Math.sin(t*.67)*.012);c.transform(1,0,Math.sin(t*.67+.5)*.035,1,0,0);c.drawImage(treeImage,-width*.5,-height,width,height);c.restore();
   }
   if(images[1].naturalWidth){
    c.globalAlpha=.76;const right=kind!=='gallery',x=right?w+25:-25;
    [mobile?210:350,mobile?165:260].forEach((length,i)=>drawBentLeaf(c,images[1],images[1].naturalWidth,images[1].naturalHeight,x,Math.max(top-60,-15)+i*25,right?Math.PI+.45-i*.4:.1+i*.4,length,t+i*.7,1.8,mobile));
   }
   // Layered serrated whitewater advances and recedes around the collection.
   c.globalAlpha=1;
   for(let i=2;i>=0;i--){const y=h*(mobile?.91:.88)+Math.sin(t*.48+i*.7)*(mobile?15:25)+i*16;c.beginPath();foamEdge(c,w,y,t*.7+i*.8,mobile?12:22);c.lineTo(w+25,h+30);c.lineTo(-25,h+30);c.closePath();c.fillStyle=i===0?'#7aaea6':i===1?'#b9d1bd':'#e4dfbc';c.fill();c.strokeStyle='#fff4e4';c.lineWidth=2;c.stroke();}
   if(images[3].naturalWidth){const [fw,fh,count]=sandFrame,frame=preference.matches?0:Math.floor(t*8)%count;c.globalAlpha=.46;c.drawImage(images[3],frame*fw,0,fw,fh,0,h*.68,w,h*.23);}
   // The centre stays quiet; animation is strongest in gutters and interstitials.
   c.globalAlpha=1;if(!preference.matches)drawSeaBreeze(c,w,top,bottom-top,t,1.6);
   c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0,w,h);c.globalCompositeOperation='source-over';
   if(images[2].naturalWidth){const [fw,fh,count]=flightFrame;c.globalAlpha=.5;for(let i=0;i<3;i++){const flight=forwardFlight(w,t,i),y=Math.max(top+40,h*.15)+i*14+flight.rise;if(y>bottom-30)continue;const frame=preference.matches?0:Math.floor(t*10+i*2)%count,size=(mobile?33:47)*(1-i*.1),height=size*fh/fw;c.save();c.translate(flight.x+size*.5,y+height*.5);c.rotate(flight.bank);c.drawImage(images[2],frame*fw,0,fw,fh,-size*.5,-height*.5,size,height);c.restore();}}
   c.restore();canvas.dataset.frames=String(Number(canvas.dataset.frames??0)+1);
  };
  const client=joinAtmosphere(paint);
  const sync=()=>{if(disposed)return;const active=visible&&!pauseRef.current&&!preference.matches;client.active(active);canvas.dataset.motion=preference.matches?'reduced':active&&!document.hidden?'running':'paused';paint(time);};syncRef.current=sync;
  const resize=()=>{
   if(disposed||innerWidth<1||innerHeight<1)return;w=innerWidth<641?600:1440;h=w*innerHeight/innerWidth;
   const ratio=Math.min(devicePixelRatio||1,1.25);canvas.width=Math.round(innerWidth*ratio);canvas.height=Math.round(innerHeight*ratio);mask.width=w;mask.height=Math.ceil(h);
   const m=mask.getContext('2d')!,edge=m.createLinearGradient(0,0,w,0);edge.addColorStop(0,'rgba(0,0,0,.9)');edge.addColorStop(.14,'rgba(0,0,0,.16)');edge.addColorStop(.27,'rgba(0,0,0,.025)');edge.addColorStop(.73,'rgba(0,0,0,.025)');edge.addColorStop(.86,'rgba(0,0,0,.16)');edge.addColorStop(1,'rgba(0,0,0,.9)');m.fillStyle=edge;m.fillRect(0,0,w,h);
   const wash=m.createLinearGradient(0,h*.78,0,h);wash.addColorStop(0,'transparent');wash.addColorStop(1,'rgba(0,0,0,.32)');m.fillStyle=wash;m.fillRect(0,h*.78,w,h*.22);paint(time);
  };
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!loaded){loaded=true;images.forEach((image,i)=>{image.onload=()=>paint(time);image.src=[tree,frond,bird,sand][i];});}sync();},{rootMargin:'100px'});io.observe(body);
  const scroll=()=>{if(visible&&(preference.matches||pauseRef.current))paint(time);};
  resize();window.addEventListener('resize',resize);window.addEventListener('scroll',scroll,{passive:true});preference.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  return ()=>{disposed=true;syncRef.current=()=>{};client.dispose();io.disconnect();images.forEach(image=>image.onload=null);window.removeEventListener('resize',resize);window.removeEventListener('scroll',scroll);preference.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
 },[tree,frond,bird,sand,kind,flightFrame,sandFrame]);
 return <canvas ref={ref} className="detail-living-backdrop" aria-hidden="true"/>;
}
