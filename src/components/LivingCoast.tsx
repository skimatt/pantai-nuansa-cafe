'use client';
import {ambientMotionPreference} from '@/lib/ambient-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CoastalWorld, type WorldSettings } from '@/lib/coastal-world';

gsap.registerPlugin(ScrollTrigger);
export default function LivingCoast({settings,desktop,mobile,frond,paused}:{settings:WorldSettings;desktop:string;mobile:string;frond:string;paused:boolean}){
  const canvas=useRef<HTMLCanvasElement>(null);
  const pausedRef=useRef(paused),syncRef=useRef<()=>void>(()=>{});
  useEffect(()=>{pausedRef.current=paused;syncRef.current();},[paused]);
  useEffect(()=>{
    const element=canvas.current,hero=element?.closest<HTMLElement>('#hero');if(!element||!hero)return;
    let world:CoastalWorld;
    try{world=new CoastalWorld(element,settings,matchMedia('(max-width:640px)').matches?mobile:desktop,frond);}catch{return;}
    const motion=ambientMotionPreference();
    let raf=0,visible=true,clock=0,last=0,disposed=false,samples=0,intervals=0,economy=false;
    const frame=(now:number)=>{
      if(disposed)return;
      // RAF timestamps round to sub-milliseconds; allow a small tolerance so
      // 33.3ms does not accidentally become a 50ms interval on a 60Hz display.
      if(now-last>=1000/settings.fps-.6){
        const interval=now-last;
        clock+=Math.min((now-last)/1000,.075);last=now;
        world.draw(clock);element.dataset.frames=String(world.frames);
        if(!economy&&matchMedia('(max-width:640px)').matches){
          samples++;intervals+=Math.min(interval,150);
          if(samples>=30&&intervals/samples>46){economy=true;world.economy();resize();element.dataset.quality='economy';}
        }
      }
      raf=requestAnimationFrame(frame);
    };
    const stop=()=>{cancelAnimationFrame(raf);raf=0;};
    const sync=()=>{
      stop();
      if(motion.matches){world.draw(12,true);element.dataset.motion='reduced';}
      else if(visible&&!document.hidden&&!pausedRef.current){last=performance.now();raf=requestAnimationFrame(frame);element.dataset.motion='running';}
      else element.dataset.motion='paused';
    };
    syncRef.current=sync;
    const resize=()=>{const rect=element.getBoundingClientRect();if(disposed||!element.isConnected||rect.width<1||rect.height<1)return;world.setBackdrop(matchMedia('(max-width:640px)').matches?mobile:desktop);world.resize(rect.width,rect.height);world.draw(clock,motion.matches);};
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});intersection.observe(hero);
    const move=(e:PointerEvent)=>{if(motion.matches||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();world.move((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);};
    const leave=()=>world.move(.5,.5);
    const tap=(e:PointerEvent)=>{if(motion.matches||(e.target as Element).closest('a,button'))return;const r=hero.getBoundingClientRect();world.touch((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height,clock);};
    hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',leave);hero.addEventListener('pointerdown',tap,{passive:true});
    motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
    const mm=gsap.matchMedia();mm.add({motion:'(prefers-reduced-motion: no-preference)',tall:'(min-height:900px)',mobileFits:'(max-width:640px) and (min-height:800px)'},media=>{
      if(!media.conditions?.motion)return;
      const context=gsap.context(()=>{
        const departure=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'+=55%',pin:media.conditions?.tall||media.conditions?.mobileFits?hero:false,pinSpacing:true,scrub:1,invalidateOnRefresh:true}});
        departure.to(world,{camera:1,duration:1,ease:'none'},0)
          .to(hero.querySelector('.hero-copy'),{y:-75,duration:.8,ease:'none'},.15)
          .to(hero.querySelector('.world-hint'),{autoAlpha:0,duration:.3},0);
      },hero);return ()=>context.revert();
    });
    element.dataset.ready='true';sync();
    return ()=>{disposed=true;world.dispose();syncRef.current=()=>{};stop();observer.disconnect();intersection.disconnect();mm.revert();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);hero.removeEventListener('pointerdown',tap);motion.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
  },[settings,desktop,mobile,frond]);
  return <canvas ref={canvas} className="living-coast" aria-hidden="true"/>;
}
