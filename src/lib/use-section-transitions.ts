'use client';
import {useEffect,useSyncExternalStore,type RefObject} from 'react';
import gsap from 'gsap';
import {ambientMotionEnabled,subscribeAmbientMotion} from './ambient-motion';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
type Settings={enabled:boolean;travel:number;mobileTravel:number;scrub:number;edgeOpacity:number};
/** Uses the existing native scroll and GSAP ticker. Never fades readable text
 * or transforms the same layer as the existing photo/camera animations. */
export function useSectionTransitions(root:RefObject<HTMLElement|null>,settings:Settings,paused:boolean){
 const reduced=useSyncExternalStore(subscribeAmbientMotion,()=>matchMedia('(prefers-reduced-motion:reduce)').matches&&!ambientMotionEnabled(),()=>true);
 useEffect(()=>{
  const element=root.current;if(!element)return;
  const sections=[...element.querySelectorAll<HTMLElement>('main section[id]')].filter(section=>section.id!=='hero');
  sections.forEach(section=>section.dataset.transition='static');
  if(!settings.enabled||paused||reduced)return;
  const media=gsap.matchMedia();
  media.add({all:'(min-width:0px)',mobile:'(max-width:640px)'},context=>{
   const scope=gsap.context(()=>{
    const travel=context.conditions?.mobile?settings.mobileTravel:settings.travel;
    for(const section of sections){
     section.dataset.transition='active';
     const headings=section.querySelectorAll('.journey-heading,.chapter-index,.prolog-copy,.discover-copy,.experience-copy,.explore-copy,.taste-intro,.moments-intro,.find-us-composition');
     if(headings.length){
      gsap.fromTo(headings,{y:travel},{y:0,ease:'none',scrollTrigger:{trigger:section,start:'top 94%',end:'top 62%',scrub:settings.scrub}});
     }
     const layers=section.querySelectorAll<HTMLElement>('.photo-window,.documentary-player,.cafe-world,.taste-art>img,.moment-open,.find-us-world');
     for(const layer of layers){
      const opacity=Number(getComputedStyle(layer).opacity)||1;
      gsap.timeline({scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:settings.scrub}})
       .fromTo(layer,{opacity:opacity*settings.edgeOpacity},{opacity,duration:.22,ease:'none'})
       .to(layer,{opacity,duration:.56,ease:'none'})
       .to(layer,{opacity:opacity*settings.edgeOpacity,duration:.22,ease:'none'});
     }
    }
   },element);
   return ()=>{scope.revert();sections.forEach(section=>section.dataset.transition='static');};
  });
  return ()=>{media.revert();sections.forEach(section=>delete section.dataset.transition);};
 },[root,settings,paused,reduced]);
}
