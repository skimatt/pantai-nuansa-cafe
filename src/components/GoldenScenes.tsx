'use client';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect,useRef,useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { FoundationContent } from '@/lib/content';
import { formatPhone } from '@/lib/format';
import { Arrow } from './icons';
import SceneAtmosphere from './SceneAtmosphere';
import FolderPhotos from './FolderPhotos';
import {sceneKit} from '@/lib/scene-kit';
import {useGalleryTour} from '@/lib/use-gallery-tour';
const GalleryViewer=dynamic(()=>import('./GalleryViewer'),{ssr:false});
gsap.registerPlugin(ScrollTrigger);
export default function GoldenScenes({content,onGalleryOpen,paused}:{content:FoundationContent;onGalleryOpen:()=>void;paused:boolean}){
 const root=useRef<HTMLDivElement>(null),strip=useRef<HTMLDivElement>(null);
 const [viewer,setViewer]=useState<number|null>(null),[canPrevious,setCanPrevious]=useState(false),[canNext,setCanNext]=useState(false);
 const {moments,findUs}=content.sections.golden,scene=content.scenes.golden,contact=content.site.contact;
 const tour=useGalleryTour(strip,{seconds:content.animations.gallery.intervalSeconds,enabled:content.animations.gallery.enabled,suspended:paused||viewer!==null});
 const get=(id:string)=>content.media.assets.find(a=>a.id===id)!;
 const background=get(scene.backgroundAssetId),mobile=get(scene.mobileAssetId);
 const updateScroll=()=>{const el=strip.current;if(el){setCanPrevious(el.scrollLeft>2);setCanNext(el.scrollLeft+el.clientWidth<el.scrollWidth-2);}};
 useEffect(()=>{
  const el=strip.current;if(!el)return;
  const observer=new ResizeObserver(()=>{setCanPrevious(el.scrollLeft>2);setCanNext(el.scrollLeft+el.clientWidth<el.scrollWidth-2);});
  observer.observe(el);return ()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const context=gsap.context(()=>{
    gsap.fromTo('.moments-world',{y:-20},{y:25,ease:'none',scrollTrigger:{trigger:'#moments',start:'top bottom',end:'bottom top',scrub:.8}});
    gsap.fromTo('.find-us-world',{y:-20},{y:20,ease:'none',scrollTrigger:{trigger:'#find-us',start:'top bottom',end:'bottom top',scrub:.8}});
   },root);
   return ()=>context.revert();
  });
  return ()=>mm.revert();
 },[]);
 const moveStrip=(direction:number)=>{tour.stop();const el=strip.current;if(el)el.scrollBy({left:direction*el.clientWidth*.8,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 return <div ref={root} className="golden-scenes">
  <section id="moments" className="moments-scene" aria-labelledby="moments-title">
   <div className="golden-environment" aria-hidden="true"><picture className="moments-world"><source media="(max-width:640px)" srcSet={mobile.src}/><Image src={background.src} width={background.width} height={background.height} alt="" loading="lazy" sizes="100vw"/></picture><div className="moments-haze"/><SceneAtmosphere preset={content.animations.atmospheres.moments} kit={sceneKit(content,'moments')} frond={get("rigged-palm-frond").src} paused={paused||viewer!==null}/></div>
   <div className="journey-heading"><span>{moments.chapter}</span><p className="eyebrow">{moments.eyebrow}</p></div>
   <div className="moments-intro"><h2 id="moments-title">{moments.title}<br/><em>{moments.titleAccent}</em></h2><div><p>{moments.description}</p><div className="gallery-controls"><button className="gallery-previous" aria-label={moments.previousLabel} disabled={!canPrevious} onClick={()=>moveStrip(-1)}><Arrow/></button><button aria-label={moments.nextLabel} disabled={!canNext} onClick={()=>moveStrip(1)}><Arrow/></button></div></div></div>
   <div ref={strip} className="gallery-track" data-autoplay={tour.running?'running':'paused'} onScroll={updateScroll} aria-label={moments.viewerLabel} role="group">{content.gallery.items.map((item,index)=>{
    const asset=get(item.assetId),thumbnail=get(item.posterAssetId??item.assetId);
    return <figure className="moment-frame" key={item.id}><button className="moment-open" aria-label={`${moments.openLabel} ${item.alt}`} onClick={()=>{onGalleryOpen();setViewer(index);}}><picture>{thumbnail.variants[0]&&<source media="(max-width:640px)" srcSet={thumbnail.variants[0]}/>}<Image src={thumbnail.src} width={thumbnail.width} height={thumbnail.height} alt={item.alt} loading="lazy" sizes="(max-width:640px) 80vw, 360px"/></picture></button>{item.type==='video'&&<span className="moment-video-label">{moments.videoLabel}<span aria-hidden="true"> ▷</span></span>}<figcaption><span>{String(index+1).padStart(2,'0')}</span><div><h3>{item.caption}</h3><p>{item.credit}</p></div></figcaption><noscript><a className="gallery-original" href={asset.src} target="_blank" rel="noopener noreferrer">{moments.openFileLabel}</a></noscript></figure>;
   })}</div>
   <div className="gallery-auto-controls"><button onClick={tour.toggle} disabled={paused} aria-pressed={tour.paused}><span aria-hidden="true">{tour.paused?'▷':'Ⅱ'}</span>{tour.paused?moments.resumeLabel:moments.pauseLabel}</button><span className="gallery-auto-count">{String(tour.index+1).padStart(2,'0')} / {String(content.gallery.items.length).padStart(2,'0')}</span></div>
   <p className="gallery-auto-notice">{moments.autoLabel}</p><Link className="journey-link gallery-see-all" href={content.pages.routes.gallery}>{content.pages.labels.gallery}<Arrow/></Link>
   <p className="golden-art-notice">{moments.artNotice}</p>
  </section>
  <section id="find-us" className="find-us-scene" aria-labelledby="find-us-title">
   <div className="golden-environment" aria-hidden="true"><picture className="find-us-world"><source media="(max-width:640px)" srcSet={mobile.src}/><Image src={background.src} width={background.width} height={background.height} alt="" loading="lazy" sizes="100vw"/></picture><div className="find-us-shade"/><SceneAtmosphere preset={content.animations.atmospheres.findUs} kit={sceneKit(content,'findUs')} frond={get("rigged-palm-frond").src} paused={paused||viewer!==null}/><Image className="find-us-foliage" src={get(scene.foregroundAssetId).src} width={900} height={600} alt="" loading="lazy"/></div>
   <div className="journey-heading"><span>{findUs.chapter}</span><p className="eyebrow">{findUs.eyebrow}</p></div>
   <div className="find-us-composition"><div><h2 id="find-us-title">{findUs.title}<br/><em>{findUs.titleAccent}</em></h2><p className="find-us-description">{findUs.description}</p>{contact.mapsUrl&&<a className="primary-button maps-link" href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">{findUs.mapsLabel}<Arrow/></a>}</div>
    <div className="contact-details"><dl><div><dt>{findUs.locationLabel}</dt><dd>{contact.address??findUs.locationValue}</dd></div><div><dt>{findUs.hoursLabel}</dt><dd>{contact.hours??findUs.hoursPending}</dd></div></dl>{contact.phone&&<a href={`tel:${contact.phone}`} className="contact-phone"><span>{findUs.phoneLabel}</span><strong>{formatPhone(contact.phone)}</strong><Arrow/></a>}{contact.instagram&&<a className="contact-instagram" href={contact.instagram} target="_blank" rel="noopener noreferrer">{findUs.instagramLabel}<span aria-hidden="true"> ↗</span></a>}<a className="contact-instagram" href={contact.businessInstagram} target="_blank" rel="noopener noreferrer">{contact.businessInstagramLabel}<span aria-hidden="true"> ↗</span></a><a className="contact-instagram" href={contact.tiktok} target="_blank" rel="noopener noreferrer">{contact.tiktokLabel}<span aria-hidden="true"> ↗</span></a></div>
   </div>
   <FolderPhotos content={content} entries={content.localPhotos.sections.findUs} onOpen={onGalleryOpen}/>
   <p className="golden-art-notice">{findUs.artNotice}</p>
  </section>
  {viewer!==null&&<GalleryViewer content={content} initialIndex={viewer} onClose={()=>setViewer(null)}/>}
 </div>;
}
