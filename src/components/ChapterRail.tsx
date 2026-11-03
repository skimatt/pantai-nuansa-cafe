'use client';
import { useEffect, useState } from 'react';
type Chapter={target:string;label:string;enabled?:boolean};
export default function ChapterRail({chapters,label}:{chapters:Chapter[];label:string}){
  const [active,setActive]=useState('#hero');
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries)if(entry.isIntersecting)setActive(`#${entry.target.id}`);
    },{rootMargin:'-20% 0px -55% 0px',threshold:0});
    chapters.forEach(chapter=>{const el=document.querySelector(chapter.target);if(el)observer.observe(el);});
    return ()=>observer.disconnect();
  },[chapters]);
  return <nav className="chapter-rail" aria-label={label}>{chapters.filter(c=>c.enabled!==false).map((chapter,index)=><a key={chapter.target} href={chapter.target} aria-current={active===chapter.target?'location':undefined}><span className="rail-label">{chapter.label}</span><span className="rail-index">{String(index+1).padStart(2,'0')}</span></a>)}</nav>;
}
