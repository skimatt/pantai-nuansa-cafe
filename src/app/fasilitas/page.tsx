import type {Metadata} from 'next';
import Image from 'next/image';
import {content} from '@/lib/content';
import DetailFrame from '@/components/DetailFrame';
import GalleryCollection from '@/components/GalleryCollection';
export const metadata:Metadata={title:content.pages.facilities.metaTitle,description:content.pages.facilities.description,openGraph:{title:content.pages.facilities.metaTitle,description:content.pages.facilities.description}};
export default function FacilitiesPage(){
 const copy=content.sections.cafe.explore;
 const photos=content.localPhotos.sections.explore;
 const cover=photos.find(item=>item.type==='image');
 const image=content.media.assets.find(asset=>asset.id===(cover?.assetId??content.scenes.cafe.backgroundAssetId))!;
 const remaining=photos.filter(item=>item.assetId!==cover?.assetId);
 return <DetailFrame content={content} kind="facilities">
  <div className="collection-tools">
   <p className="collection-count"><strong>{copy.hotspots.length}</strong> {content.pages.labels.facilityCount}</p>
   <p className="collection-description">{content.pages.labels.facilityNotice}</p>
  </div>
  <figure className="facility-panorama">
   <Image src={image.src} width={image.width} height={image.height} alt={image.alt} sizes="(max-width:640px) 90vw, 1200px"/>
   {cover&&<figcaption>{cover.caption+' · '+cover.credit}</figcaption>}
  </figure>
  <div className="facility-collection">{copy.hotspots.map(item=><article className="complete-facility" key={item.id}><span>{item.number}</span><h2>{item.label}</h2><p>{item.description}</p></article>)}</div>
  {remaining.length>0&&<GalleryCollection content={content} entries={remaining}/>}
 </DetailFrame>;
}
