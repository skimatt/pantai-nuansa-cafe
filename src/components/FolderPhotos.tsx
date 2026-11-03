'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {FoundationContent} from '@/lib/content';
import {Arrow} from './icons';
const Viewer=dynamic(()=>import('./GalleryViewer'),{ssr:false});
gsap.registerPlugin(ScrollTrigger);
type Entries=FoundationContent['gallery']['items'];
export default function FolderPhotos({content,entries,album=false,onOpen,onState}:{content:FoundationContent;entries:Entries;album?:boolean;onOpen?:()=>void;onState?:(open:boolean)=>void}){
 const root=useRef<HTMLDivElement>(null),strip=useRef<HTMLDivElement>(null),[viewer,setViewer]=useState<number|null>(null),copy=content.sections.album;
 useEffect(()=>{
  const el=root.current;if(!el)return;const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion:no-preference)',()=>{const context=gsap.context(()=>{
   gsap.utils.toArray<HTMLElement>('.folder-photo').forEach(photo=>gsap.fromTo(photo,{y:25},{y:0,duration:.9,ease:'power2.out',scrollTrigger:{trigger:photo,start:'top 94%',toggleActions:'play none none reverse'}}));
  },el);return ()=>context.revert();});return ()=>mm.revert();
 },[entries]);
 const open=(index:number)=>{onOpen?.();onState?.(true);setViewer(index);};
 const close=()=>{setViewer(null);onState?.(false);};
 const images=<>{entries.map((item,index)=>{const a=content.media.assets.find(a=>a.id===item.assetId)!;return <figure className="folder-photo" key={item.id}><button onClick={()=>open(index)} aria-label={`${copy.openLabel} ${item.alt}`}><picture>{a.variants[0]&&<source media="(max-width:640px)" srcSet={a.variants[0]}/>}<Image src={a.src} width={a.width} height={a.height} alt={item.alt} loading="lazy" sizes={album?'(max-width:640px) 85vw, (max-width:1000px) 42vw, 28vw':'(max-width:640px) 75vw, 300px'}/></picture></button><figcaption><p>{item.caption}</p><span>{item.credit}</span></figcaption><noscript><a href={a.src} target="_blank" rel="noopener noreferrer">{content.sections.golden.moments.openFileLabel}</a></noscript></figure>;})}</>;
 const body=<div ref={root} className={album?'album-body':'folder-photo-strip'}>
  {entries.length>0?<>{!album&&<div className="folder-strip-head"><p>{copy.stripLabel}</p><div><button aria-label={copy.previousLabel} onClick={()=>strip.current?.scrollBy({left:-350,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}><Arrow/></button><button aria-label={copy.nextLabel} onClick={()=>strip.current?.scrollBy({left:350,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}><Arrow/></button></div></div>}<div ref={strip} className={album?'album-grid':'folder-strip-track'}>{images}</div></>:album?<p className="album-empty">{copy.emptyState}</p>:null}
  {viewer!==null&&<Viewer content={content} initialIndex={viewer} entries={entries} label={copy.title} onClose={close}/>}</div>;
 if(!album)return entries.length?body:null;
 const tree=content.media.assets.find(a=>a.id===content.scenes.assetKit.trees.pine)!;
 return <section id="album" className="album-scene" aria-labelledby="album-title"><div className="album-environment" aria-hidden="true"><Image src={tree.src} width={tree.width} height={tree.height} alt="" loading="lazy" sizes="240px"/></div><div className="journey-heading"><span>{copy.chapter}</span><p className="eyebrow">{copy.eyebrow}</p></div><div className="album-heading"><h2 id="album-title">{copy.title}</h2><p>{copy.description}</p></div>{body}</section>;
}
