'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Asset, FoundationContent } from '@/lib/content';

type Copy=FoundationContent['sections']['journey']['experience'];
export default function DocumentaryVideo({copy,source,poster,preview,onPlay,suspended}:{copy:Copy;source:Asset;poster:Asset;preview:Asset;onPlay:()=>void;suspended:boolean}){
  const videoRef=useRef<HTMLVideoElement>(null), frameRef=useRef<HTMLDivElement>(null);
  const [activated,setActivated]=useState(false),[playing,setPlaying]=useState(false),[loaded,setLoaded]=useState(false);
  const [failed,setFailed]=useState(false),[ended,setEnded]=useState(false),[attempt,setAttempt]=useState(0);
  const previewRef=useRef<HTMLVideoElement>(null),hoverTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const [previewing,setPreviewing]=useState(false),[previewLoaded,setPreviewLoaded]=useState(false);
  const leave=()=>{clearTimeout(hoverTimer.current);setPreviewing(false);setPreviewLoaded(false);previewRef.current?.pause();};
  const enter=()=>{
    if(activated||suspended||!matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches)return;
    if((navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData)return;
    hoverTimer.current=setTimeout(()=>setPreviewing(true),650);
  };
  useEffect(()=>{
    const frame=frameRef.current;if(!frame)return;
    const stop=()=>{clearTimeout(hoverTimer.current);previewRef.current?.pause();setPreviewing(false);setPreviewLoaded(false);};
    const visibility=()=>{if(document.hidden)stop();};
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>{if(reduced.matches)stop();};
    const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)stop();});observer.observe(frame);
    document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',change);
    return ()=>{clearTimeout(hoverTimer.current);observer.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',change);};
  },[]);

  useEffect(()=>{
    const video=videoRef.current,frame=frameRef.current;if(!video||!frame)return;
    const hidden=()=>{if(document.hidden)video.pause();};
    const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)video.pause();},{threshold:.15});
    observer.observe(frame);document.addEventListener('visibilitychange',hidden);
    return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',hidden);video.pause();video.removeAttribute('src');video.load();};
  },[]);

  useEffect(()=>{
    if(!activated)return;
    const video=videoRef.current;if(!video)return;
    let alive=true;
    if(attempt>0)video.load();
    if(document.activeElement===document.body)video.focus({preventScroll:true});
    void video.play().catch(()=>{if(alive)setFailed(true);});
    return ()=>{alive=false;video.pause();};
  },[activated,attempt]);
  useEffect(()=>{if(suspended)videoRef.current?.pause();},[suspended]);

  const toggle=()=>{
    const video=videoRef.current;if(!video)return;
    if(playing){video.pause();return;}
    if(!activated){setActivated(true);return;}
    if(ended){video.currentTime=0;setEnded(false);}
    void video.play().catch(()=>setFailed(true));
  };
  const retry=()=>{setFailed(false);setLoaded(false);setEnded(false);setAttempt(n=>n+1);};
  return <div className="documentary-player">
    <div className="video-frame" ref={frameRef} data-active={activated} data-loaded={loaded&&!failed} data-failed={failed} data-preview={previewLoaded&&previewing&&!activated&&!suspended} onPointerEnter={enter} onPointerLeave={leave}>
      <Image className="documentary-poster" src={poster.src} width={poster.width} height={poster.height} alt={poster.alt} loading="lazy" sizes="(max-width: 640px) 85vw, 360px"/>
      {previewing&&!activated&&!suspended&&<video ref={previewRef} className="hover-film" src={preview.src} muted playsInline autoPlay loop preload="none" aria-hidden="true" tabIndex={-1} onPlaying={()=>setPreviewLoaded(true)} onError={()=>setPreviewing(false)}/>}
      <video ref={videoRef} className="documentary-video" src={activated?source.src:undefined} controls={activated&&!failed} preload="none" muted playsInline tabIndex={activated?0:-1} width={source.width} height={source.height}
        aria-label={copy.titleLabel} aria-describedby="video-visual-description"
        onLoadedData={()=>setLoaded(true)} onPlay={()=>{setPlaying(true);setEnded(false);onPlay();}}
        onPause={()=>setPlaying(false)} onEnded={()=>{setPlaying(false);setEnded(true);}}
        onError={()=>{if(activated)setFailed(true);}}/>
      {!activated&&<button className="film-play" aria-describedby="video-duration-label" onClick={toggle}>
        <span className="film-play-circle"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="m12 7 14 9-14 9V7Z" fill="currentColor"/></svg></span>
        <span>{copy.playLabel}</span>
      </button>}
      {!activated&&<span id="video-duration-label" className="film-duration">{copy.durationLabel}</span>}
      {activated&&!loaded&&!failed&&<p className="video-loading" role="status">{copy.loadingLabel}</p>}
    </div>
    <div className="video-toolbar"><span>{copy.silentNotice}</span>{activated&&!failed&&<button onClick={toggle}>{playing?copy.pauseLabel:ended?copy.replayLabel:copy.playLabel}<span aria-hidden="true">{playing?'Ⅱ':'▷'}</span></button>}</div>
    {!activated&&<p className="hover-hint">{copy.previewHint}</p>}
    {failed&&<div className="video-failure"><p role="alert">{copy.errorMessage}</p><button onClick={retry}>{copy.retryLabel}<span aria-hidden="true"> ↻</span></button></div>}
    <details className="video-description"><summary>{copy.descriptionLabel}</summary><p id="video-visual-description">{copy.visualDescription}</p></details>
    <p className="documentary-credit">{copy.credit}</p>
    <noscript><p className="video-no-script">{copy.noScriptMessage} <a href={source.src}>{copy.openFileLabel}</a></p></noscript>
  </div>;
}
