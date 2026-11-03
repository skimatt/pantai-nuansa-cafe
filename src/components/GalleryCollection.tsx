'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import type {FoundationContent} from '@/lib/content';
const Viewer=dynamic(()=>import('./GalleryViewer'),{ssr:false});
export default function GalleryCollection({content,entries}:{content:FoundationContent;entries:FoundationContent['gallery']['items']}){
 const [viewer,setViewer]=useState<number|null>(null),labels=content.pages.labels,copy=content.sections.golden.moments;
 return <><div className="collection-tools"><p className="collection-count"><strong>{entries.length}</strong> {labels.galleryCount}</p><p className="collection-description">{labels.galleryIntro}</p></div><div className="complete-gallery">{entries.map((item,index)=>{const image=content.media.assets.find(a=>a.id===(item.posterAssetId??item.assetId))!;return <figure className="complete-moment" key={item.id}><button aria-label={`${item.type==='video'?copy.videoLabel+'. ':''}${copy.openLabel} ${item.alt}`} onClick={()=>setViewer(index)}><Image src={image.src} width={image.width} height={image.height} alt={item.alt} loading="lazy" sizes="(max-width:640px) 85vw, (max-width:1000px) 43vw, 29vw"/>{item.type==='video'&&<span className="complete-film-label">▷ {copy.videoLabel}</span>}</button><figcaption><p>{item.caption}</p><span>{item.credit}</span></figcaption><noscript><a href={content.media.assets.find(a=>a.id===item.assetId)!.src}>{copy.openFileLabel}</a></noscript></figure>;})}</div>{viewer!==null&&<Viewer content={content} entries={entries} initialIndex={viewer} onClose={()=>setViewer(null)}/>}</>;
}
