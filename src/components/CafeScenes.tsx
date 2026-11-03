'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect,useRef,useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { FoundationContent } from '@/lib/content';
import { formatMenuPrice } from '@/lib/menu-price';
import { Arrow } from './icons';
import SceneAtmosphere from './SceneAtmosphere';
import {sceneKit} from '@/lib/scene-kit';
import PhotoSurf from './PhotoSurf';
import FolderPhotos from './FolderPhotos';
gsap.registerPlugin(ScrollTrigger);

export default function CafeScenes({content,paused}:{content:FoundationContent;paused:boolean}){
 const root=useRef<HTMLDivElement>(null),{explore,taste}=content.sections.cafe,scene=content.scenes.cafe;
 const [selectedHotspot,setHotspot]=useState(explore.hotspots[0].id),[selectedMenu,setMenu]=useState(content.menu.items[0].id);
 const get=(id:string)=>content.media.assets.find(a=>a.id===id)!;
 const activeHotspot=explore.hotspots.find(h=>h.id===selectedHotspot)!;
 const activeMenu=content.menu.items.find(i=>i.id===selectedMenu)!;
 const art=get(scene.backgroundAssetId),mobile=get(scene.mobileAssetId),food=get(activeMenu.imageAssetId),original=get(content.menu.sourceAssetId);
 useEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const context=gsap.context(()=>{
    gsap.fromTo('.cafe-world',{y:-15},{y:20,ease:'none',scrollTrigger:{trigger:'#explore',start:'top bottom',end:'bottom top',scrub:.8}});
    gsap.fromTo('.taste-art',{y:25},{y:-20,ease:'none',scrollTrigger:{trigger:'#taste',start:'top bottom',end:'bottom top',scrub:.8}});
   },root);
   return ()=>context.revert();
  });
  return ()=>mm.revert();
 },[]);
 return <div ref={root} className="cafe-scenes">
  <section id="explore" className="explore-scene" aria-labelledby="explore-title">
   <div className="journey-heading"><span>{explore.chapter}</span><p className="eyebrow">{explore.eyebrow}</p></div>
   <div className="explore-copy"><h2 id="explore-title">{explore.title}<br/><em>{explore.titleAccent}</em></h2><p>{explore.description}</p></div>
   <div className="facility-stage"><div className="cafe-environment" aria-hidden="true"><picture className="cafe-world"><source media="(max-width: 640px)" srcSet={mobile.src}/><Image src={art.src} width={art.width} height={art.height} alt="" loading="lazy" sizes="100vw"/></picture><div className="cafe-mist"/><SceneAtmosphere preset={content.animations.atmospheres.explore} kit={sceneKit(content,'explore')} frond={get("rigged-palm-frond").src} paused={paused}/></div>
    <div className="facility-hotspots" role="group" aria-label={explore.legendLabel}>{explore.hotspots.map(h=><button key={h.id} className={h.id===selectedHotspot?'facility-hotspot is-selected':'facility-hotspot'} style={{left:`${h.x}%`,top:`${h.y}%`}} aria-label={`${h.number} · ${h.label}`} aria-pressed={h.id===selectedHotspot} aria-controls="facility-info" onClick={()=>setHotspot(h.id)}><span>{h.number}</span></button>)}</div>
   </div>
   <div className="facility-info" id="facility-info" role="status" aria-live="polite" aria-atomic="true"><span className="eyebrow">{explore.sourceLabel}</span><h3 className="facility-description" key={activeHotspot.id}>{activeHotspot.label}</h3><p>{activeHotspot.description}</p></div>
   <Link className="journey-link facility-next" href={content.pages.routes.facilities}>{content.pages.labels.facilities}<Arrow/></Link>
   <FolderPhotos content={content} entries={content.localPhotos.sections.explore}/>
   <p className="cafe-art-notice">{explore.artNotice}</p>
   <noscript><dl className="facility-no-script">{explore.hotspots.map(h=><div key={h.id}><dt>{h.label}</dt><dd>{h.description}</dd></div>)}</dl></noscript>
  </section>
  <section id="taste" className="taste-scene" aria-labelledby="taste-title">
   <div className="taste-environment" aria-hidden="true"><Image src={get(scene.tasteBackgroundAssetId).src} width={1536} height={1024} alt="" loading="lazy" sizes="100vw"/><SceneAtmosphere preset={content.animations.atmospheres.taste} kit={sceneKit(content,'taste')} frond={get("rigged-palm-frond").src} paused={paused}/></div>
   <div className="journey-heading"><span>{taste.chapter}</span><p className="eyebrow">{taste.eyebrow}</p></div>
   <div className="taste-intro"><h2 id="taste-title">{taste.title}<br/><em>{taste.titleAccent}</em></h2><p>{taste.description}</p></div>
   <div className="taste-composition"><ul className="menu-selection" aria-label={taste.listLabel}>{content.menu.items.map((item,index)=><li key={item.id}><button aria-controls="taste-selected-media" aria-pressed={selectedMenu===item.id} onClick={()=>setMenu(item.id)}><span className="menu-index">{String(index+1).padStart(2,'0')}</span><span className="menu-name">{item.name}</span><span className="menu-price">{formatMenuPrice(item,content.menu.currency)}</span><Arrow/></button></li>)}</ul>
    <figure className="taste-art" id="taste-selected-media" aria-live="polite"><PhotoSurf key={activeMenu.id} dish/><span className="taste-image-badge">{food.isPlaceholder?taste.imageBadge:taste.imageOwnerBadge}</span><Image key={food.id} className="dish-reveal" src={food.src} width={food.width} height={food.height} alt={`${activeMenu.name}. ${food.alt}`} loading="lazy" sizes="(max-width: 640px) 86vw, 480px"/><figcaption><h3>{activeMenu.name}</h3><p>{food.isPlaceholder?taste.imageNotice:taste.imageOwnerNotice}</p>{food.sourceUrl&&<p className="photo-credit"><a href={food.sourceUrl} target="_blank" rel="noopener noreferrer">{food.author}</a>{' · '}<a href={food.licenseUrl} target="_blank" rel="noopener noreferrer">{food.license}</a></p>}</figcaption></figure>
   </div>
   <div className="taste-footer"><p>{taste.sourceLabel}</p><Link className="journey-link" href={content.pages.routes.menu}>{content.pages.labels.menu}<Arrow/></Link></div>
   {!content.menu.sourceDocument&&<noscript><a className="journey-link" href={original.src} target="_blank" rel="noopener noreferrer">{taste.noScriptLabel}<Arrow/></a></noscript>}
  </section>
 </div>;
}
