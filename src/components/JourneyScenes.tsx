'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { FoundationContent } from '@/lib/content';
import { Arrow } from './icons';
import SceneAtmosphere from './SceneAtmosphere';
import {sceneKit} from '@/lib/scene-kit';
import DocumentaryVideo from './DocumentaryVideo';
import { useMediaDepth } from '@/lib/use-media-depth';
import PhotoSurf from './PhotoSurf';
import FolderPhotos from './FolderPhotos';

gsap.registerPlugin(ScrollTrigger);
export default function JourneyScenes({content,onVideoPlay,suspended,paused}:{content:FoundationContent;onVideoPlay:()=>void;suspended:boolean;paused:boolean}){
  const root=useRef<HTMLDivElement>(null);
  useMediaDepth(root);
  const {discover,experience}=content.sections.journey,scene=content.scenes.journey,preset=content.animations.presets.journey;
  const get=(id:string)=>content.media.assets.find(a=>a.id===id)!;
  const background=get(scene.backgroundAssetId),mobile=get(scene.mobileAssetId),ocean=get(scene.experienceBackgroundAssetId);
  useEffect(()=>{
    const element=root.current;if(!element)return;
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      const ctx=gsap.context(()=>{
        gsap.to('.discover-world',{y:preset.backdropTravel,ease:'none',scrollTrigger:{trigger:'#discover',start:'top bottom',end:'bottom top',scrub:preset.scrub}});
        gsap.utils.toArray<HTMLElement>('.documentary-photo').forEach((photo,index)=>{
          const trigger={trigger:photo,start:'top 95%',end:'center 42%',scrub:preset.scrub};
          gsap.fromTo(photo,{y:preset.photoTravel*3,rotation:index===0?7:-8,scale:.91},{y:-preset.photoTravel,rotation:index===0?-2:3,scale:1,ease:'none',scrollTrigger:trigger});
          gsap.fromTo(photo.querySelector('.photo-surf'),{yPercent:0},{yPercent:-130,ease:'none',scrollTrigger:trigger});
        });
        gsap.fromTo('.experience-ocean',{y:-25},{y:25,ease:'none',scrollTrigger:{trigger:'#experience',start:'top bottom',end:'bottom top',scrub:preset.scrub}});
      },element);
      return ()=>ctx.revert();
    });
    return ()=>mm.revert();
  },[preset]);
  return <div className="journey-scenes" ref={root}>
    <section id="discover" className="discover-scene" aria-labelledby="discover-title">
      <div className="discover-environment" aria-hidden="true"><div className="discover-world"><picture><source media={`(max-width: ${scene.mobileMax}px)`} srcSet={mobile.src}/><Image src={background.src} width={background.width} height={background.height} alt="" loading="lazy" sizes="100vw"/></picture></div><div className="discover-haze"/><SceneAtmosphere preset={content.animations.atmospheres.discover} kit={sceneKit(content,'discover')} frond={get("rigged-palm-frond").src} paused={paused}/></div>
      <div className="journey-heading"><span>{discover.chapter}</span><p className="eyebrow">{discover.eyebrow}</p></div>
      <div className="discover-composition">
        <div className="discover-copy"><h2 id="discover-title">{discover.title}<br/><em>{discover.titleAccent}</em></h2><p>{discover.description}</p><a href="#experience" className="journey-link">{discover.nextLabel}<Arrow/></a><p className="documentary-note">{discover.note}</p><Link className="journey-link discover-all" href={content.pages.routes.gallery}>{content.pages.labels.gallery}<Arrow/></Link></div>
        <div className="documentary-photos">{discover.photos.map((photo,index)=>{
          const asset=get(photo.assetId);
          return <figure key={photo.assetId} className={`documentary-photo photo-${index===0?'primary':'secondary'}`}>
            <div className="photo-window"><picture>{asset.variants[0]&&<source media="(max-width: 640px)" srcSet={asset.variants[0]}/>}<Image src={asset.src} width={asset.width} height={asset.height} alt={asset.alt} loading="lazy" sizes={photo.sizes}/></picture><PhotoSurf/></div>
            <figcaption><span className="photo-number">{photo.number}</span><div><p>{photo.caption}</p><span>{photo.credit}</span></div></figcaption>
          </figure>;
        })}</div>
      </div>
      <FolderPhotos content={content} entries={content.localPhotos.sections.discover.slice(2)} onOpen={onVideoPlay}/>
      <p className="journey-art-notice">{discover.backgroundNotice}</p>
      <svg className="tideline" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62C170 82 245 8 432 35S725 97 928 46 1220 14 1440 62V100H0Z" fill="currentColor"/></svg>
    </section>
    <section id="experience" className="experience-scene" aria-labelledby="experience-title">
      <div className="experience-environment" aria-hidden="true"><Image className="experience-ocean" src={ocean.src} width={ocean.width} height={ocean.height} alt="" loading="lazy" sizes="100vw"/><div className="experience-shade"/><SceneAtmosphere preset={content.animations.atmospheres.experience} kit={sceneKit(content,'experience')} frond={get("rigged-palm-frond").src} paused={paused}/><Image className="experience-foliage" src={get(scene.foregroundAssetId).src} width={900} height={600} alt="" loading="lazy"/></div>
      <div className="journey-heading"><span>{experience.chapter}</span><p className="eyebrow">{experience.eyebrow}</p></div>
      <div className="experience-composition"><div className="experience-copy"><p className="eyebrow film-format">{experience.formatLabel}</p><h2 id="experience-title">{experience.title}<br/><em>{experience.titleAccent}</em></h2><p>{experience.description}</p><span className="film-rule"/><Link className="journey-link" href={content.pages.routes.gallery}>{content.pages.labels.gallery}<Arrow/></Link></div>
        <DocumentaryVideo copy={experience} source={get(experience.assetId)} poster={get(experience.posterAssetId)} preview={get(experience.previewAssetId)} onPlay={onVideoPlay} suspended={suspended}/>
      </div>
      <FolderPhotos content={content} entries={content.localPhotos.sections.experience} onOpen={onVideoPlay}/>
      <p className="journey-art-notice">{experience.artNotice}</p>
    </section>
  </div>;
}
