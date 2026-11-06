'use client';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {foamEdge} from '@/lib/shore-shapes';
import {scrollHomepageTo} from '@/lib/use-homepage-scroll';
export default function WaveNavigation({duration,paused,asset}:{duration:number;paused:boolean;asset:{src:string;frame:[number,number,number]}}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current,c=canvas?.getContext('2d');if(!canvas||!c)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let timeline:gsap.core.Timeline|null=null;
  const waveSprite=new Image();
  const state={p:0};
  const clear=()=>{timeline?.kill();timeline=null;canvas.dataset.active='false';c.clearRect(0,0,canvas.width,canvas.height);};
  const paint=()=>{
   const w=innerWidth,h=innerHeight,t=performance.now()/1000;
   c.clearRect(0,0,w,h);
   for(let j=2;j>=0;j--){
    const top=h*(1.17-1.45*state.p)+j*12;
    c.beginPath();foamEdge(c,w,top,t,28);foamEdge(c,w,top+h*1.44,t+.7,28,true);c.closePath();
    c.fillStyle=j===0?'#296d73':j===1?'#a6c9b4':'#f7e7c9';c.fill();
   }
   const y=h*(1.17-1.45*state.p);
   c.strokeStyle='#edf0cf';c.lineWidth=3;c.beginPath();foamEdge(c,w,y,t,28);c.stroke();
   if(waveSprite.complete&&waveSprite.naturalWidth){const [fw,fh,count]=asset.frame,frame=Math.floor(t*8)%count,dh=w*fh/fw;c.drawImage(waveSprite,frame*fw,0,fw,fh,0,y-dh*.36,w,dh);}
  };
  const resize=()=>{canvas.width=innerWidth;canvas.height=innerHeight;if(timeline)paint();};resize();
  const click=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=(event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
   if(!link||link.classList.contains('skip-content')||link.hasAttribute('download'))return;
   const hash=link.getAttribute('href');if(!hash||!/^#[a-z][a-z0-9-]*$/.test(hash))return;
   const target=document.getElementById(hash.slice(1));if(!target)return;
   const focus=()=>{const heading=target.querySelector<HTMLElement>('h1,h2')??target;heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});};
   event.preventDefault();
   if(reduced.matches||paused){if(location.hash!==hash)history.pushState(null,'',hash);scrollHomepageTo(target);focus();return;}
   if(!waveSprite.src)waveSprite.src=asset.src;clear();state.p=0;canvas.dataset.active='true';
   timeline=gsap.timeline({onComplete:()=>{clear();focus();}})
    .to(state,{p:1,duration:duration*.43,ease:'power2.in',onUpdate:paint})
    .call(()=>{if(location.hash!==hash)history.pushState(null,'',hash);scrollHomepageTo(target);})
    .to(state,{p:2,duration:duration*.57,ease:'power2.out',onUpdate:paint});
  };
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')clear();};
  const hidden=()=>{if(document.hidden)clear();};
  document.addEventListener('click',click);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',hidden);window.addEventListener('resize',resize);
  return ()=>{clear();document.removeEventListener('click',click);document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',hidden);window.removeEventListener('resize',resize);};
 },[duration,paused,asset.src,asset.frame]);
 return <canvas className="navigation-wave" ref={ref} aria-hidden="true" data-active="false"/>;
}
