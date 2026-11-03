import type {Metadata} from 'next';
import Image from 'next/image';
import {content} from '@/lib/content';
import DetailFrame from '@/components/DetailFrame';
import GalleryCollection from '@/components/GalleryCollection';
export const metadata:Metadata={title:content.pages.facilities.metaTitle,description:content.pages.facilities.description,openGraph:{title:content.pages.facilities.metaTitle,description:content.pages.facilities.description}};
export default function FacilitiesPage(){
 const copy=content.sections.cafe.explore,image=content.media.assets.find(a=>a.id===content.scenes.cafe.backgroundAssetId)!;
 return <DetailFrame content={content} kind="facilities"><div className="collection-tools"><p className="collection-count"><strong>{copy.hotspots.length}</strong> {content.pages.labels.facilityCount}</p><p className="collection-description">{content.pages.labels.facilityNotice}</p></div><figure className="facility-panorama"><Image src={image.src} width={image.width} height={image.height} alt={image.alt} sizes="(max-width:640px) 90vw, 1200px"/><figcaption>{copy.artNotice}</figcaption></figure><div className="facility-collection">{copy.hotspots.map(item=><article className="complete-facility" key={item.id}><span>{item.number}</span><h2>{item.label}</h2><p>{item.description}</p></article>)}</div>{content.localPhotos.sections.explore.length>0&&<GalleryCollection content={content} entries={content.localPhotos.sections.explore}/>}</DetailFrame>;
}
