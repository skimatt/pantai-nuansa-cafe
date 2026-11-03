import type {FoundationContent} from './content';
/** Keep complete collections on detail routes, rather than serializing them into
 * every homepage visit. The authoritative full manifest is validated first. */
export function homepageContent(c:FoundationContent):FoundationContent{
 const home=structuredClone(c),limits=c.pages.home;
 home.menu.items=limits.menuIds.map(id=>c.menu.items.find(item=>item.id===id)!);home.menu.conceptItems=[];
 const collection=completeGallery(c),films=collection.filter(item=>item.type==='video').slice(0,1);
 home.gallery.items=[...collection.filter(item=>item.type==='image').slice(0,limits.galleryLimit-films.length),...films];
 home.localPhotos.gallery=[];home.localPhotos.assets=[];home.localPhotos.menuOverrides=[];
 home.localPhotos.sections={discover:[],experience:[],explore:[],moments:[],findUs:[]};
 home.sections.cafe.explore.hotspots=c.sections.cafe.explore.hotspots.slice(0,limits.facilityLimit);
 const references=new Set<string>();
 const scan=(value:unknown)=>{if(typeof value==='string')references.add(value);else if(Array.isArray(value))value.forEach(scan);else if(value&&typeof value==='object')Object.values(value).forEach(scan);};
 const assets=c.media.assets;home.media.assets=[];scan(home);
 home.media.assets=assets.filter(asset=>references.has(asset.id));return home;
}
export function completeGallery(c:FoundationContent){
 const photos=c.localPhotos.gallery;
 const base=[...photos,...c.gallery.items.filter(item=>item.type==='video')];
 const additions=Object.values(c.localPhotos.sections).flat();
 return [...new Map([...base,...additions].map(item=>[item.assetId,item])).values()];
}
