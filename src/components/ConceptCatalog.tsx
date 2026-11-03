'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { FoundationContent } from '@/lib/content';
import { formatMenuPrice } from '@/lib/menu-price';

export default function ConceptCatalog({content,open,onClose}:{content:FoundationContent;open:boolean;onClose:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  const {ui}=content.site;
  const original=content.media.assets.find(a=>a.id===content.menu.sourceAssetId)!;
  const labels=content.sections.cafe.taste;
  useEffect(()=>{
    const dialog=ref.current;
    if(!dialog)return;
    if(open){
      const previous=document.activeElement as HTMLElement|null;
      dialog.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';
      return ()=>{dialog.close();document.body.style.overflow=old;previous?.focus();};
    }
  },[open]);
  return <dialog ref={ref} className="catalog" aria-labelledby="catalog-title" aria-describedby="catalog-notice" onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}}>
    <div className="catalog-inner">
      <div className="catalog-top"><span className="eyebrow">{ui.catalogEyebrow}</span><button className="text-control" onClick={onClose} autoFocus>{ui.close}<span aria-hidden="true"> ×</span></button></div>
      <h2 id="catalog-title">{ui.catalogTitle}</h2><p id="catalog-notice">{content.menu.notice}</p>
      <div className="concept-grid">{content.menu.items.map(item=>{
        const asset=content.media.assets.find(a=>a.id===item.imageAssetId)!;
        return <figure key={item.id}><div className="concept-image"><Image src={asset.src} alt={`${item.name}. ${asset.alt}`} width={asset.width} height={asset.height} sizes="(max-width: 640px) 80vw, 380px" loading="lazy"/><span>{asset.isPlaceholder?labels.imageBadge:labels.imageOwnerBadge}</span></div><figcaption><h3>{item.name}<span className="catalog-price">{formatMenuPrice(item,content.menu.currency)}</span></h3><p>{item.description}</p></figcaption></figure>;
      })}</div><p className="catalog-end">{ui.catalogHint}</p>
      {!content.menu.sourceDocument&&<section className="original-menu" aria-labelledby="original-menu-title"><h3 id="original-menu-title">{labels.originalLabel}</h3><a href={original.src} target="_blank" rel="noopener noreferrer">{labels.originalOpenLabel}<span aria-hidden="true"> ↗</span></a><Image src={original.src} width={original.width} height={original.height} alt={original.alt} loading="lazy" sizes="(max-width: 640px) 85vw, 674px"/></section>}
    </div>
  </dialog>;
}
