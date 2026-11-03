'use client';
import Link from 'next/link';
import Image from 'next/image';
import {useState,type ReactNode} from 'react';
import type {FoundationContent} from '@/lib/content';
import {sceneKit} from '@/lib/scene-kit';
import SceneAtmosphere from './SceneAtmosphere';
import DetailBackdrop from './DetailBackdrop';
import AmbientMotionControl from './AmbientMotionControl';
import {Arrow,WaveMark} from './icons';
export default function DetailFrame({content,kind,children}:{content:FoundationContent;kind:'menu'|'gallery'|'facilities';children:ReactNode}){
 const [paused,setPaused]=useState(false),p=content.pages,copy=p[kind],ui=content.site.ui;
 const backdrop=content.media.assets.find(a=>a.id===content.scenes.journey.backgroundAssetId)!;
 const frond=content.media.assets.find(a=>a.id==='rigged-palm-frond')!;
 return <div className={`detail-page detail-${kind}`}>
  <DetailBackdrop content={content} kind={kind} paused={paused}/>
  <a className="skip-content" href="#detail-content">{ui.skipContent}</a>
  <header className="detail-header"><Link className="detail-brand" href="/" aria-label={content.site.brand}><WaveMark/><span>{content.site.brand}</span></Link><nav aria-label={p.labels.navigation}>{(['menu','gallery','facilities']as const).map(item=><Link key={item} href={p.routes[item]} aria-current={item===kind?'page':undefined}>{item==='menu'?p.labels.navMenu:item==='gallery'?p.labels.navGallery:p.labels.navFacilities}</Link>)}</nav></header>
  <main id="detail-content">
   <section className="detail-intro" aria-labelledby="detail-title"><div className="detail-environment" aria-hidden="true"><Image src={backdrop.src} width={backdrop.width} height={backdrop.height} alt="" priority sizes="100vw"/><SceneAtmosphere preset={content.animations.atmospheres.discover} kit={sceneKit(content,'discover')} frond={frond.src} paused={paused}/></div><Link className="detail-back" href={kind==='menu'?'/#taste':kind==='gallery'?'/#moments':'/#explore'}><Arrow/>{p.labels.home}</Link><p className="eyebrow">{copy.eyebrow}</p><h1 id="detail-title">{copy.title}</h1><p className="detail-description">{copy.description}</p></section>
   <div className="detail-body">{children}</div>
  </main>
  <footer className="detail-footer"><div><WaveMark/><p>{content.sections.golden.findUs.footerTagline}</p></div><nav aria-label={p.labels.nextTitle}><Link href="/">{p.labels.home}<Arrow/></Link>{(['menu','gallery','facilities']as const).filter(item=>item!==kind).map(item=><Link key={item} href={p.routes[item]}>{p.labels[item]}<Arrow/></Link>)}</nav><p>{content.sections.golden.findUs.copyright}</p></footer>
  <button className="motion-dock detail-motion-dock" aria-pressed={paused} onClick={()=>setPaused(v=>!v)}><span aria-hidden="true">{paused?'▷':'Ⅱ'}</span>{paused?ui.resumeMotion:ui.pauseMotion}</button>
  <AmbientMotionControl enableLabel={ui.enableAmbientMotion} disableLabel={ui.disableAmbientMotion} description={ui.ambientMotionSystemNotice}/>
 </div>;
}
