'use client';
import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';

/** Pointer and scroll never write to the same transform: the figure owns the
 * scroll track; its inner picture owns the pointer depth. Touch stays native. */
export function useMediaDepth(root:RefObject<HTMLElement|null>){
  useEffect(()=>{
    const element=root.current;if(!element)return;
    const mm=gsap.matchMedia();
    mm.add('(hover:hover) and (prefers-reduced-motion:no-preference)',()=>{
      const cleanups:(()=>void)[]=[];
      const context=gsap.context(()=>{
        element.querySelectorAll<HTMLElement>('.documentary-photo .photo-window, .video-frame').forEach(frame=>{
          gsap.set(frame,{transformPerspective:1100,transformOrigin:'50% 50%'});
          const rx=gsap.quickTo(frame,'rotationX',{duration:.8,ease:'power2.out'});
          const ry=gsap.quickTo(frame,'rotationY',{duration:.8,ease:'power2.out'});
          const move=(e:PointerEvent)=>{if(e.pointerType==='touch')return;const box=frame.getBoundingClientRect();rx(-((e.clientY-box.top)/box.height-.5)*9);ry(((e.clientX-box.left)/box.width-.5)*12);};
          const leave=()=>{rx(0);ry(0);};
          frame.addEventListener('pointermove',move,{passive:true});frame.addEventListener('pointerleave',leave);
          cleanups.push(()=>{frame.removeEventListener('pointermove',move);frame.removeEventListener('pointerleave',leave);});
        });
      },element);
      return ()=>{cleanups.forEach(fn=>fn());context.revert();};
    });
    return ()=>mm.revert();
  },[root]);
}
