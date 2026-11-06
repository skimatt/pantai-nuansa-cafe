'use client';
import Image from 'next/image';
import { useEffect,useRef,useState } from 'react';
import type { FoundationContent } from '@/lib/content';
import { Arrow, ExternalArrow } from './icons';
export default function GalleryViewer({content,initialIndex,onClose,entries,label}:{content:FoundationContent;initialIndex:number;onClose:()=>void;entries?:FoundationContent['gallery']['items'];label?:string}){
 const [index,setIndex]=useState(initialIndex),[failedId,setFailedId]=useState<string|null>(null);
 const dialog=useRef<HTMLDialogElement>(null),videoRef=useRef<HTMLVideoElement>(null);
 const items=entries??content.gallery.items,copy=content.sections.golden.moments,item=items[index];
 const asset=content.media.assets.find(a=>a.id===item.assetId)!,poster=content.media.assets.find(a=>a.id===item.posterAssetId);
 const failed=failedId===asset.id;
 useEffect(()=>{
  const element=dialog.current;if(!element)return;
  const previous=document.activeElement as HTMLElement|null,old=document.body.style.overflow;
  element.showModal();document.body.style.overflow='hidden';
  const visibility=()=>{if(document.hidden)videoRef.current?.pause();};
  document.addEventListener('visibilitychange',visibility);
  return ()=>{element.close();document.body.style.overflow=old;previous?.focus();document.removeEventListener('visibilitychange',visibility);};
 },[]);
 useEffect(()=>{
  const video=videoRef.current;
  // Restore the source after development Strict Mode replays effect cleanup.
  if(video){video.setAttribute('src',asset.src);video.load();}
  return ()=>{video?.pause();video?.removeAttribute('src');video?.load();};
 },[index,asset.src]);
 const move=(direction:number)=>setIndex(current=>(current+direction+items.length)%items.length);
 return <dialog ref={dialog} className="gallery-viewer" aria-labelledby="viewer-title" onCancel={onClose} onClick={e=>{if(e.target===dialog.current)onClose();}} onKeyDown={e=>{if(e.target instanceof HTMLVideoElement)return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}>
  <header className="viewer-header">
   <h2 id="viewer-title">{label??copy.viewerLabel}</h2>
   <span>{String(index+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span>
   <button type="button" className="viewer-icon" onClick={onClose} aria-label={copy.closeLabel} title={copy.closeLabel} autoFocus>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5"/></svg>
   </button>
  </header>
  <div className="viewer-stage">
   <div className="viewer-media">
    {item.type==='video'?<video key={asset.id} ref={videoRef} src={asset.src} poster={poster?.src} controls muted playsInline preload="metadata" width={asset.width} height={asset.height} aria-label={item.alt} onError={()=>setFailedId(asset.id)}/>:<Image key={asset.id} src={asset.src} width={asset.width} height={asset.height} alt={item.alt} sizes="90vw" loading="eager" onError={()=>setFailedId(asset.id)}/>}
    {failed&&<p className="viewer-error" role="alert">{copy.errorMessage}</p>}
   </div>
   {items.length>1&&<>
    <button type="button" className="viewer-icon viewer-prev" onClick={()=>move(-1)} aria-label={copy.previousLabel} title={copy.previousLabel}><Arrow/></button>
    <button type="button" className="viewer-icon viewer-next" onClick={()=>move(1)} aria-label={copy.nextLabel} title={copy.nextLabel}><Arrow/></button>
   </>}
  </div>
  <div className="viewer-caption">
   <div aria-live="polite">{item.caption!==(label??copy.viewerLabel)&&<h3>{item.caption}</h3>}<p>{item.credit}</p></div>
   <a href={asset.src} target="_blank" rel="noopener noreferrer">{copy.openFileLabel}<ExternalArrow/></a>
  </div>
 </dialog>;
}
