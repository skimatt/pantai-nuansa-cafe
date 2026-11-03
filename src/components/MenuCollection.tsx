'use client';
import Image from 'next/image';
import {useState} from 'react';
import type {FoundationContent} from '@/lib/content';
import {formatMenuPrice} from '@/lib/menu-price';
import {Arrow} from './icons';
export default function MenuCollection({content}:{content:FoundationContent}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState(''),{labels}=content.pages;
 const categories=[...new Set(content.menu.items.map(item=>item.category))];
 const items=content.menu.items.filter(item=>(!category||item.category===category)&&item.name.toLocaleLowerCase('id').includes(query.toLocaleLowerCase('id').trim()));
 const source=content.media.assets.find(a=>a.id===content.menu.sourceAssetId)!;
 return <>
  <div className="collection-tools"><p className="collection-count"><strong>{content.menu.items.length}</strong> {labels.menuCount}</p><label className="menu-search">{labels.searchMenu}<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={labels.searchPlaceholder}/></label><div className="menu-filters" role="group" aria-label={labels.allCategories}><button aria-pressed={!category} onClick={()=>setCategory('')}>{labels.allCategories}</button>{categories.map(value=><button key={value} aria-pressed={category===value} onClick={()=>setCategory(value)}>{value}</button>)}</div></div>
  <p className="collection-notice">{content.menu.notice}</p>
  <div className="menu-collection" aria-live="polite">{items.map((item,index)=>{const image=content.media.assets.find(a=>a.id===item.imageAssetId)!;return <figure className="collection-dish" key={item.id}><div className="collection-dish-image"><Image src={image.src} width={image.width} height={image.height} alt={`${item.name}. ${image.alt}`} loading="lazy" sizes="(max-width:640px) 85vw, (max-width:1000px) 43vw, 29vw"/><span>{image.isPlaceholder?labels.imageNotice:labels.photoNotice}</span></div><figcaption><span className="dish-number">{String(index+1).padStart(2,'0')}</span><div><h2>{item.name}</h2><p>{item.category}</p>{image.sourceUrl&&<p className="photo-credit"><a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.author}</a>{' · '}<a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">{image.license}</a></p>}</div><strong>{formatMenuPrice(item,content.menu.currency)}</strong></figcaption></figure>;})}</div>
  {items.length===0&&<p className="collection-empty" role="status">{labels.noResults}</p>}
  {!content.menu.sourceDocument&&<section className="menu-source" aria-labelledby="menu-source-title"><div><p className="eyebrow">{content.site.ui.catalogEyebrow}</p><h2 id="menu-source-title">{labels.sourceTitle}</h2><p>{labels.sourceDescription}</p><a href={source.src} target="_blank" rel="noopener noreferrer">{labels.originalMenu}<Arrow/></a></div><a href={source.src} target="_blank" rel="noopener noreferrer" aria-label={labels.originalMenu}><Image src={source.src} width={source.width} height={source.height} alt={source.alt} loading="lazy" sizes="(max-width:640px) 85vw, 450px"/></a></section>}
 </>;
}
