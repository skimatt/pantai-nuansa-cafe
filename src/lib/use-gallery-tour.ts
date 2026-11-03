'use client';
import {ambientMotionPreference} from '@/lib/ambient-motion';
import {useEffect,useState,type RefObject} from 'react';
import gsap from 'gsap';
export function useGalleryTour(strip:RefObject<HTMLDivElement|null>,{seconds,enabled,suspended}:{seconds:number;enabled:boolean;suspended:boolean}){
 const [paused,setPaused]=useState(false),[running,setRunning]=useState(false),[index,setIndex]=useState(0);
 useEffect(()=>{
  const el=strip.current;if(!el)return;
  const reduced=ambientMotionPreference();
  const saver=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData;
  let visible=false,hovered=false,focused=false,timer:ReturnType<typeof setInterval>|undefined;
  const context=gsap.context(()=>{},el);
  const advance=()=>{
   const frames=[...el.children] as HTMLElement[],max=el.scrollWidth-el.clientWidth;
   if(el.scrollLeft>=max-4){
    context.add(()=>{gsap.to(el,{opacity:.35,duration:.25,onComplete:()=>{el.scrollTo({left:0,behavior:'instant'});gsap.to(el,{opacity:1,duration:.45});}});});
    return;
   }
   const next=frames.find(frame=>frame.offsetLeft-frames[0].offsetLeft>el.scrollLeft+12);
   if(next)el.scrollTo({left:next.offsetLeft-frames[0].offsetLeft,behavior:'smooth'});
  };
  const sync=()=>{
   clearInterval(timer);
   const on=enabled&&!paused&&!suspended&&!saver&&!reduced.matches&&visible&&!hovered&&!focused&&!document.hidden;
   setRunning(on);if(on)timer=setInterval(advance,seconds*1000);
  };
  const update=()=>{
   const frames=[...el.children] as HTMLElement[];if(!frames.length)return;
   let nearest=0,distance=Infinity;frames.forEach((frame,i)=>{const d=Math.abs(frame.offsetLeft-frames[0].offsetLeft-el.scrollLeft);if(d<distance){nearest=i;distance=d;}});setIndex(nearest);
  };
  const enter=()=>{hovered=true;sync();},leave=()=>{hovered=false;sync();};
  const focus=()=>{focused=true;sync();},blur=(e:FocusEvent)=>{if(!el.contains(e.relatedTarget as Node|null)){focused=false;sync();}};
  const interact=()=>setPaused(true);
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.2});io.observe(el);
  el.addEventListener('pointerenter',enter);el.addEventListener('pointerleave',leave);el.addEventListener('focusin',focus);el.addEventListener('focusout',blur);el.addEventListener('pointerdown',interact);el.addEventListener('wheel',interact,{passive:true});el.addEventListener('scroll',update,{passive:true});
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  return ()=>{clearInterval(timer);context.revert();io.disconnect();el.removeEventListener('pointerenter',enter);el.removeEventListener('pointerleave',leave);el.removeEventListener('focusin',focus);el.removeEventListener('focusout',blur);el.removeEventListener('pointerdown',interact);el.removeEventListener('wheel',interact);el.removeEventListener('scroll',update);reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
 },[strip,seconds,enabled,suspended,paused]);
 return {paused,running,index,toggle:()=>setPaused(value=>!value),stop:()=>setPaused(true)};
}
