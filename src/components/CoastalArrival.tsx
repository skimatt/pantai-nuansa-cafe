'use client';
import {MotionIcon} from './icons';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { FoundationContent } from '@/lib/content';
import { markSession, readSession, shouldPlayIntro, type IntroState } from '@/lib/intro';
import { OceanAudio } from '@/lib/ocean-audio';
import { Arrow, ExternalArrow, SoundIcon, WaveMark } from './icons';
import JourneyScenes from './JourneyScenes';
import CafeScenes from './CafeScenes';
import GoldenScenes from './GoldenScenes';
import LivingCoast from './LivingCoast';
import AmbientMotionControl from './AmbientMotionControl';
import ChapterRail from './ChapterRail';
import WaveNavigation from './WaveNavigation';
import SceneAtmosphere from './SceneAtmosphere';
import {sceneKit} from '@/lib/scene-kit';
import {useSectionTransitions} from '@/lib/use-section-transitions';
import {useHomepageScroll,scrollHomepageTo} from '@/lib/use-homepage-scroll';


gsap.registerPlugin(ScrollTrigger);
export default function CoastalArrival({content}:{content:FoundationContent}){
  const {site,opening,scenes,navigation}=content, {ui}=site, {arrival}=scenes;
  const assetById=(id:string)=>{
    const asset=content.media.assets.find(a=>a.id===id);
    if(!asset)throw new Error(`Unknown asset: ${id}`);
    return asset;
  };
  const root=useRef<HTMLDivElement>(null), timeline=useRef<gsap.core.Timeline|null>(null);
  const audio=useRef<OceanAudio|null>(null), mutedRef=useRef(true), audioBusy=useRef(false);
  const ambient=useRef<gsap.core.Tween[]>([]),heroOnscreen=useRef(true);
  const [state,setState]=useState<IntroState>('ready');
  const [muted,setMuted]=useState(true),[audioError,setAudioError]=useState('');
  const [menu,setMenu]=useState(false);
  const [replayCount,setReplayCount]=useState(0);
  const [heroVisible,setHeroVisible]=useState(true);
  const [motionPaused,setMotionPaused]=useState(false);
  useHomepageScroll(root,content.animations.smoothScroll);
  useSectionTransitions(root,content.animations.sectionTransitions,motionPaused);
  const finish=useCallback(()=>{markSession(opening.storageKey);setState('hero');},[opening.storageKey]);

  useEffect(()=>{
    const element=root.current;if(!element)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const play=!reduced.matches&&(replayCount>0||shouldPlayIntro({enabled:opening.enabled,reduced:reduced.matches,seen:opening.oncePerSession&&readSession(opening.storageKey),hasHash:!!window.location.hash}));
    const mm=gsap.matchMedia();
    const ctx=gsap.context(()=>{
      if(play){
        // No overlay page: the same camera and background settle into the Hero.
        gsap.set('.world-camera',{scale:arrival.camera.introScale});
        gsap.set('.hero-copy > *',{autoAlpha:0,y:22});
        const tl=gsap.timeline({onComplete:finish});timeline.current=tl;
        tl.call(()=>setState('playing'))
          .to('.world-camera',{scale:arrival.camera.heroScale,duration:opening.durationTargetSeconds,ease:'power2.inOut'},0)
          .to('.hero-copy > *',{autoAlpha:1,y:0,duration:1.2,stagger:.16,ease:'power2.out'},2.7);
      }else{
        queueMicrotask(()=>{if(element.isConnected)setState('hero');});
      }
      mm.add('(prefers-reduced-motion: no-preference)',()=>{
        ambient.current=[];
        if(!heroOnscreen.current||document.hidden)ambient.current.forEach(t=>t.pause());
        gsap.to('.world-parallax',{y:arrival.camera.scrollY,ease:'none',scrollTrigger:{trigger:element.querySelector('#hero'),start:'top top',end:'bottom top',scrub:1}});
        return ()=>{ambient.current=[];};
      });
    },element);
    const change=()=>{if(reduced.matches){timeline.current?.progress(1);finish();}};
    const visibility=()=>{
      if(document.hidden){ctx.getTweens().forEach((t:gsap.core.Tween)=>t.pause());void audio.current?.pause();}
      else {ctx.getTweens().forEach((t:gsap.core.Tween)=>t.resume());if(!heroOnscreen.current)ambient.current.forEach(t=>t.pause());if(!mutedRef.current)void audio.current?.play().catch(()=>{mutedRef.current=true;setMuted(true);setAudioError(ui.soundError);});}
    };
    reduced.addEventListener('change',change);document.addEventListener('visibilitychange',visibility);
    return ()=>{timeline.current=null;mm.revert();ctx.revert();reduced.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility);};
  },[arrival,finish,opening,replayCount,ui.soundError]);

  useEffect(()=>()=>{void audio.current?.dispose();},[]);
  useEffect(()=>{
    const hero=root.current?.querySelector('#hero');if(!hero)return;
    const observer=new IntersectionObserver(([entry])=>{heroOnscreen.current=entry.isIntersecting;ambient.current.forEach(t=>entry.isIntersecting&&!document.hidden?t.resume():t.pause());setHeroVisible(entry.isIntersecting);},{threshold:0});
    observer.observe(hero);return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!menu)return;
    const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setMenu(false);document.getElementById('navigation-toggle')?.focus();}};
    document.addEventListener('keydown',close);return ()=>document.removeEventListener('keydown',close);
  },[menu]);
  const skip=()=>{timeline.current?.progress(1);finish();};
  const replay=()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    scrollHomepageTo(0);
    setReplayCount(count=>count+1);
  };
  const toggleSound=async()=>{
    if(audioBusy.current)return;audioBusy.current=true;
    try{
      audio.current??=new OceanAudio(content.audio);
      if(mutedRef.current){await audio.current.play();mutedRef.current=false;setMuted(false);}
      else{await audio.current.pause();mutedRef.current=true;setMuted(true);}
      setAudioError('');
    }catch{mutedRef.current=true;setMuted(true);setAudioError(ui.soundError);}
    finally{audioBusy.current=false;}
  };
  const videoPlay=()=>{void audio.current?.pause();mutedRef.current=true;setMuted(true);};
  const background=assetById(arrival.backgroundAssetId),mobile=assetById(arrival.mobileAssetId);
  return <div ref={root} className="arrival" data-intro={state}>
    <noscript><style>{'.photo-surf{display:none!important}'}</style></noscript>
    <a className="skip-content" href="#hero-content" onClick={skip}>{ui.skipContent}</a>
    <header className="site-header">
      <a className="brand" href="#hero"><WaveMark/><span>{ui.brandLine}{' '}<span className="brand-small">{ui.brandSuffix}</span></span></a>
      <nav aria-label={ui.chapterLabel} id="main-navigation" className={menu?'navigation is-open':'navigation'}>
        {navigation.foundationItems.map(item=><a href={item.target} key={item.target} onClick={()=>{skip();setMenu(false);}}>{item.label}</a>)}
        <Link href={content.pages.routes.menu} onClick={()=>{skip();setMenu(false);}}>{ui.secondaryCta}<ExternalArrow/></Link>
      </nav>
      <button id="navigation-toggle" className="nav-toggle" aria-label={ui.openMenu} aria-expanded={menu} aria-controls="main-navigation" onClick={()=>setMenu(!menu)}><span/><span/></button>
    </header>
    <AmbientMotionControl enableLabel={ui.enableAmbientMotion} disableLabel={ui.disableAmbientMotion} description={ui.ambientMotionSystemNotice}/>
    <ChapterRail chapters={navigation.items} label={ui.chapterIndexLabel}/>
    <WaveNavigation duration={content.animations.navigation.duration} paused={motionPaused} asset={{src:assetById(scenes.assetKit.wave).src,frame:scenes.assetKit.waveFrame}}/>
    <main>
      <section id="hero" className="hero" aria-labelledby="hero-title">
        <div className="world" aria-hidden="true"><div className="world-parallax"><div className="world-camera">
          <picture><source media={`(max-width: ${arrival.breakpoints.mobileMax}px)`} srcSet={mobile.src}/><Image className="coast-master" src={background.src} alt="" width={background.width} height={background.height} loading="eager" fetchPriority="high" sizes="100vw"/></picture>
          <LivingCoast settings={content.animations.world} desktop={background.src} mobile={mobile.src} frond={assetById(arrival.layerAssetIds[4]).src} paused={motionPaused}/>
          <div className="scene-light"/>
        </div></div>
        <div className="reading-mist"/>
        </div>
        <div id="hero-content" tabIndex={-1} className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line"/>{ui.eyebrow}</p>
          <h1 id="hero-title"><span className="sr-only">{site.brand}. </span>{ui.headline[0]}<br/>{ui.headline[1]}<br/><em>{ui.headline[2]}</em></h1>
          <p className="hero-description">{ui.heroDescription}</p>
          <div className="hero-actions"><a href="#perjalanan" className="primary-button" onClick={skip}>{ui.primaryCta}<Arrow/></a><Link className="secondary-button" href={content.pages.routes.menu} onClick={skip}>{ui.secondaryCta}<ExternalArrow/></Link></div>
        </div>
        <div className="horizon-note" aria-hidden="true"><span>PN — 01</span><i/><span>{ui.chapterName}</span></div>
        <div className="hero-bottom"><button className="motion-control" aria-label={motionPaused?ui.resumeMotion:ui.pauseMotion} title={motionPaused?ui.resumeMotion:ui.pauseMotion} hidden={!heroVisible} aria-pressed={motionPaused} onClick={()=>setMotionPaused(v=>!v)}><MotionIcon paused={motionPaused}/>{motionPaused?ui.resumeMotion:ui.pauseMotion}</button><button className="sound-button" aria-label={muted?ui.soundOff:ui.soundOn} hidden={!heroVisible} onClick={toggleSound} aria-pressed={!muted} title={ui.ambientLabel}><SoundIcon muted={muted}/><span>{muted?ui.soundOff:ui.soundOn}</span></button></div>
        <div className="intro-controls" hidden={state!=='playing'}><span>{ui.introLabel}</span>{opening.showSkip&&<button onClick={skip}>{ui.skipIntro}<Arrow/></button>}<div className="intro-progress" style={{'--intro-duration':`${opening.durationTargetSeconds}s`} as React.CSSProperties}/></div>
      </section>
      <section id="perjalanan" className="prolog" aria-labelledby="prolog-title">
        <div className="prolog-environment" aria-hidden="true"><Image src={assetById(scenes.journey.backgroundAssetId).src} width={1536} height={1024} alt="" loading="lazy" sizes="100vw"/><div className="prolog-wash"/><SceneAtmosphere preset={content.animations.atmospheres.discover} kit={sceneKit(content,'discover')} frond={assetById('rigged-palm-frond').src} paused={motionPaused}/></div>
        <div className="chapter-index"><span>{ui.chapterNumber}</span><span className="eyebrow">{ui.prologEyebrow}</span></div>
        <div className="prolog-copy"><h2 id="prolog-title">{ui.prologTitle}<br/><em>{ui.prologItalic}</em></h2><div className="prolog-detail"><p>{ui.prologDescription}</p><Link href={content.pages.routes.menu} className="ink-link">{content.pages.labels.menu}<Arrow/></Link></div></div>
        <div className="prolog-bottom"><WaveMark/><p>{ui.nextChapter}</p><button className="text-control replay" onClick={replay}>{ui.replayIntro}<span aria-hidden="true"> ↺</span></button></div>
      </section>
      <JourneyScenes content={content} onVideoPlay={videoPlay} suspended={false} paused={motionPaused}/>
      <CafeScenes content={content} paused={motionPaused}/>
      <GoldenScenes content={content} onGalleryOpen={videoPlay} paused={motionPaused}/>
    </main>
    <footer><a href="#hero" aria-label={site.brand}><WaveMark/></a><p>{content.sections.golden.findUs.copyright}<br/>{content.sections.golden.findUs.footerTagline}</p><a href="#hero">{ui.backTop}<span aria-hidden="true"> ↑</span></a></footer>
    {!heroVisible&&<button className="motion-dock" aria-label={motionPaused?ui.resumeMotion:ui.pauseMotion} title={motionPaused?ui.resumeMotion:ui.pauseMotion} onClick={()=>setMotionPaused(v=>!v)} aria-pressed={motionPaused}><MotionIcon paused={motionPaused}/>{motionPaused?ui.resumeMotion:ui.pauseMotion}</button>}
    {!heroVisible&&<button className="sound-dock" aria-label={muted?ui.soundOff:ui.soundOn} onClick={toggleSound} aria-pressed={!muted} title={ui.ambientLabel}><SoundIcon muted={muted}/><span>{muted?ui.soundOff:ui.soundOn}</span></button>}
    <p className="sr-only" role="status">{audioError}</p>
  </div>;
}
