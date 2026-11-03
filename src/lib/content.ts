import { z } from 'zod';
import siteData from '../../content/site.json';
import audioData from '../../content/audio.json';
import navigationData from '../../content/navigation.json';
import openingData from '../../content/opening.json';
import sectionsData from '../../content/sections.json';
import menuData from '../../content/menu.json';
import galleryData from '../../content/gallery.json';
import mediaData from '../../content/media.json';
import animationsData from '../../content/animations.json';
import scenesData from '../../content/scenes.json';
import localPhotoData from '../../content/local-photos.json';
import pagesData from '../../content/pages.json';
import menuSourceData from '../../content/menu-source.json';
import {parseOwnerPrice} from './menu-price';

const safeUrl = z.string().url().refine(v => v.startsWith('https://'), 'External URLs must use HTTPS');
const localPath = z.string().regex(/^\/assets\/[a-zA-Z0-9/_-]+\.(webp|avif|png|svg|mp4|webm)$/).refine(v => !v.includes('..'));
const id = z.string().regex(/^[a-z0-9-]+$/);
const navItem = z.object({ label: z.string().min(1), target: z.string().regex(/^#[a-z][a-z0-9-]*$/), enabled: z.boolean().optional() });
const text = z.string().min(1);
const assetSchema = z.object({
  id, src: localPath, type: z.enum(['image', 'video', 'audio']), sceneId: id,
  sourceType: z.enum(['generated', 'procedural', 'owner','licensed']), license: text, attribution: text,
  verified: z.boolean(), isPlaceholder: z.boolean(), alt: text,
  width: z.number().positive(), height: z.number().positive(), variants: z.array(localPath),
  loading: z.enum(['eager', 'lazy']), pivot: z.tuple([z.number(), z.number()]), depth: z.number(),
  status: z.enum(['prototype', 'approved']), promptVersion: text, provenance: text,
  sourceUrl:safeUrl.optional(),licenseUrl:safeUrl.optional(),author:text.optional(),
  sourceFile: text.optional(), permission: z.enum(['owner-confirmed-2026-11-03','local-folder-publish-intent']).optional(),
  durationSeconds: z.number().positive().max(300).optional(), hasAudio: z.boolean().optional(),
}).refine(a => a.sourceType !== 'generated' || (a.isPlaceholder && !a.verified), 'Generated images must be unverified placeholders').refine(a=>a.sourceType!=='licensed'||(a.isPlaceholder&&!a.verified&&!!a.sourceUrl&&!!a.licenseUrl&&!!a.author),'Licensed references require credits and an illustrative label');
const atmosphereSchema=z.object({wind:z.number().min(.1).max(3),surf:z.number().min(0).max(2),sand:z.number().int().min(0).max(60),birds:z.number().int().min(0).max(6),tone:z.enum(['day','night','sunset']),side:z.enum(['left','right']),foliage:z.number().min(0).max(1.5)});
const galleryItemSchema=z.object({id,type:z.enum(['image','video']),assetId:id,posterAssetId:id.optional(),caption:text,alt:text,verified:z.boolean(),credit:text,sortOrder:z.number()});
const journeySchema=z.object({
  discover:z.object({chapter:text,eyebrow:text,title:text,titleAccent:text,description:text,note:text,nextLabel:text,backgroundNotice:text,
    photos:z.array(z.object({assetId:id,number:text,caption:text,credit:text,sizes:text})).min(2).max(4)}),
  experience:z.object({chapter:text,eyebrow:text,title:text,titleAccent:text,description:text,assetId:id,posterAssetId:id,titleLabel:text,durationLabel:text,formatLabel:text,credit:text,playLabel:text,pauseLabel:text,replayLabel:text,errorMessage:text,retryLabel:text,descriptionLabel:text,previewAssetId:id,previewHint:text,visualDescription:text,noScriptMessage:text,openFileLabel:text,silentNotice:text,nextLabel:text,artNotice:text,loadingLabel:text}),
});
const menuItemSchema=z.object({id,name:text,category:text,description:text,imageAssetId:id,price:z.number().nonnegative().nullable(),priceMax:z.number().nonnegative().optional(),priceUnit:z.literal('ons').optional(),sourceDocument:z.literal('content/menu-source.json').optional(),featured:z.boolean(),available:z.boolean().nullable(),verified:z.boolean(),isPlaceholder:z.boolean(),sourceType:z.enum(['generated','owner']),sourceAssetId:id.optional()}).refine(v=>v.sourceType!=='generated'||(v.isPlaceholder&&!v.verified&&v.price===null&&v.available===null),'Concept dishes must not claim price or availability');
const cafeSchema=z.object({
 explore:z.object({chapter:text,eyebrow:text,title:text,titleAccent:text,description:text,legendLabel:text,artNotice:text,nextLabel:text,sourceLabel:text,verified:z.literal(true),sourceType:z.literal('owner-chat'),confirmedAt:text,
  hotspots:z.array(z.object({id,number:text,label:text,description:text,x:z.number().min(0).max(100),y:z.number().min(0).max(100)})).min(1)}),
 taste:z.object({chapter:text,eyebrow:text,title:text,titleAccent:text,description:text,listLabel:text,imageBadge:text,sourceLabel:text,fullMenuLabel:text,originalLabel:text,originalOpenLabel:text,noScriptLabel:text,imageNotice:text,imageOwnerBadge:text,imageOwnerNotice:text}),
});
const goldenSchema=z.object({
 moments:z.object({chapter:text,eyebrow:text,title:text,titleAccent:text,description:text,openLabel:text,previousLabel:text,nextLabel:text,closeLabel:text,viewerLabel:text,videoLabel:text,errorMessage:text,openFileLabel:text,artNotice:text,pauseLabel:text,resumeLabel:text,autoLabel:text}),
 findUs:z.object({chapter:text,eyebrow:text,title:text,titleAccent:text,description:text,mapsLabel:text,phoneLabel:text,instagramLabel:text,hoursLabel:text,hoursPending:text,locationLabel:text,locationValue:text,artNotice:text,copyright:text,footerTagline:text}),
});
export const schemas = {
  audio:z.object({src:z.string().regex(/^\/assets\/audio\/[a-zA-Z0-9_-]+\.mp3$/),volume:z.number().min(0).max(1),fadeInMs:z.number().min(0).max(3000),fadeOutMs:z.number().min(0).max(3000),loop:z.boolean(),defaultMuted:z.literal(true),sourceFile:text,rightsStatus:z.enum(['user-supplied-publication-unverified','publication-confirmed'])}),
  menuSource:z.object({restaurant:z.object({name:text,address:text,social_media:z.object({instagram:text,tiktok:text})}),featured_categories:z.array(z.object({name:text,items:z.array(z.object({name:text,price:text}))}))}),
  pages:z.object({routes:z.object({menu:z.literal('/menu/'),gallery:z.literal('/galeri/'),facilities:z.literal('/fasilitas/')}),home:z.object({menuIds:z.array(id).min(1).max(4),galleryLimit:z.number().int().min(2).max(5),facilityLimit:z.number().int().min(1).max(2)}),labels:z.object({navMenu:text,navGallery:text,navFacilities:text,menu:text,gallery:text,facilities:text,home:text,navigation:text,photos:text,films:text,searchMenu:text,searchPlaceholder:text,allCategories:text,noResults:text,menuCount:text,galleryCount:text,facilityCount:text,originalMenu:text,sourceTitle:text,sourceDescription:text,galleryIntro:text,facilityNotice:text,nextTitle:text,imageNotice:text,photoNotice:text}),menu:z.object({eyebrow:text,title:text,description:text,metaTitle:text}),gallery:z.object({eyebrow:text,title:text,description:text,metaTitle:text}),facilities:z.object({eyebrow:text,title:text,description:text,metaTitle:text})}),
  site: z.object({ brand: text, language: z.literal('id'), description: text, verified: z.boolean(),
    contact: z.object({ address: text.nullable(), mapsUrl: safeUrl.nullable(), phone: z.string().regex(/^\+[0-9]{9,16}$/).nullable(), instagram: safeUrl.nullable(),businessInstagram:safeUrl,businessInstagramLabel:text,tiktok:safeUrl,tiktokLabel:text,hours:text.nullable(),sourceType:z.literal('owner-chat'),confirmedAt:text }),
    ui: z.object({
      brandLine:text,brandSuffix:text,skipContent:text,skipIntro:text,replayIntro:text,soundOff:text,soundOn:text,soundError:text,
      openMenu:text,close:text,chapterLabel:text,chapterIndexLabel:text,prototype:text,artNotice:text,eyebrow:text,
      headline:z.tuple([text,text,text]),heroDescription:text,primaryCta:text,secondaryCta:text,scroll:text,
      chapterNumber:text,chapterName:text,introLabel:text,prologEyebrow:text,prologTitle:text,prologItalic:text,
      prologDescription:text,catalogEyebrow:text,catalogTitle:text,catalogOpen:text,catalogBadge:text,
      catalogHint:text,footerNote:text,backTop:text,nextChapter:text,catalogLabel:text,ambientLabel:text,worldHint:text,pauseMotion:text,resumeMotion:text,enableAmbientMotion:text,disableAmbientMotion:text,ambientMotionSystemNotice:text,
    }),
  }),
  navigation: z.object({ items: z.array(navItem), foundationItems: z.array(navItem) }),
  opening: z.object({ enabled:z.boolean(), durationTargetSeconds:z.number().min(1).max(10), showSkip:z.boolean(), oncePerSession:z.boolean(), defaultMuted:z.literal(true), scenes:z.array(id), storageKey:text }),
  sections: z.object({ sections:z.array(z.object({ id,enabled:z.boolean(),title:text,description:text,verified:z.boolean() })),journey:journeySchema,cafe:cafeSchema,golden:goldenSchema,album:z.object({chapter:text,eyebrow:text,title:text,description:text,openLabel:text,emptyState:text,stripLabel:text,nextLabel:text,previousLabel:text,ownerPhotoBadge:text,ownerPhotoNotice:text}) }),
  menu: z.object({notice:text,items:z.array(menuItemSchema).min(1),conceptItems:z.array(menuItemSchema),sourceAssetId:id,sourceDocument:z.literal('content/menu-source.json').optional(),verified:z.literal(true),currency:z.literal('IDR'),confirmedAt:text}),
  localPhotos:z.object({assets:z.array(assetSchema),gallery:z.array(galleryItemSchema),sections:z.object({discover:z.array(galleryItemSchema),experience:z.array(galleryItemSchema),explore:z.array(galleryItemSchema),moments:z.array(galleryItemSchema),findUs:z.array(galleryItemSchema)}),menuOverrides:z.array(z.object({menuId:id,assetId:id}))}),
  gallery:z.object({ items:z.array(z.object({ id,type:z.enum(['image','video']),assetId:id,posterAssetId:id.optional(),caption:text,alt:text,verified:z.boolean(),credit:text,sortOrder:z.number() })),emptyState:text }),
  media:z.object({ assets:z.array(assetSchema),note:text }),
  animations:z.object({sectionTransitions:z.object({enabled:z.boolean(),travel:z.number().min(0).max(30),mobileTravel:z.number().min(0).max(16),scrub:z.number().min(.1).max(1),edgeOpacity:z.number().min(.65).max(1)}),navigation:z.object({duration:z.number().min(.5).max(2)}),gallery:z.object({intervalSeconds:z.number().min(4).max(15),enabled:z.boolean()}),atmospheres:z.object({discover:atmosphereSchema,experience:atmosphereSchema,explore:atmosphereSchema,taste:atmosphereSchema,moments:atmosphereSchema,findUs:atmosphereSchema}),world:z.object({fps:z.number().min(15).max(60),pixelRatio:z.number().min(1).max(2),wind:z.number().min(0).max(2),surfPeriod:z.number().min(4).max(20),sandParticles:z.number().int().min(0).max(100)}),presets:z.object({ photoReveal:z.object({duration:z.number().positive().max(3),ease:z.enum(['power2.out','power1.out'])}),cameraDepth:z.object({intensity:z.number().min(0).max(.5)}),gallery:z.object({scrub:z.boolean()}),journey:z.object({photoTravel:z.number().min(0).max(60),backdropTravel:z.number().min(0).max(60),scrub:z.number().min(.1).max(2)}) }),reducedMotionFallback:z.literal(true) }),
  scenes:z.object({assetKit:z.object({wave:id,waveFrame:z.tuple([z.number().int().positive(),z.number().int().positive(),z.number().int().positive()]),gull:id,egret:id,flightFrame:z.tuple([z.number().int().positive(),z.number().int().positive(),z.number().int().positive()]),sand:id,sandFrame:z.tuple([z.number().int().positive(),z.number().int().positive(),z.number().int().positive()]),standingEgret:id,trees:z.object({pine:id,almond:id,banyan:id})}),worlds:z.array(id),introHeroSeamless:z.literal(true),layers:z.array(id),arrival:z.object({
    id,backgroundAssetId:id,mobileAssetId:id,layerAssetIds:z.array(id),
    camera:z.object({introScale:z.number().min(1).max(1.3),heroScale:z.literal(1),scrollY:z.number().min(0).max(100)}),
    breakpoints:z.object({mobileMax:z.number().min(320).max(900)}),safeArea:z.object({desktop:z.array(z.number()),mobile:z.array(z.number())}),
    loadingPriority:z.literal('high'),audioZone:id,timelinePreset:id,
  }),journey:z.object({id,backgroundAssetId:id,mobileAssetId:id,experienceBackgroundAssetId:id,foregroundAssetId:id,waveAssetId:id,mobileMax:z.number().min(320).max(900),timelinePreset:id,safeArea:z.object({desktop:z.array(z.number()),mobile:z.array(z.number())})}),cafe:z.object({id,backgroundAssetId:id,mobileAssetId:id,tasteBackgroundAssetId:id,foregroundAssetId:id,timelinePreset:id}),golden:z.object({id,backgroundAssetId:id,mobileAssetId:id,foregroundAssetId:id,timelinePreset:id}) }),
};
export const rawContent = {audio:audioData,menuSource:menuSourceData,pages:pagesData,site:siteData,navigation:navigationData,opening:openingData,sections:sectionsData,menu:menuData,gallery:{...galleryData,items:[...galleryData.items,...localPhotoData.sections.moments]},media:{...mediaData,assets:[...mediaData.assets,...localPhotoData.assets] as z.input<typeof assetSchema>[]},localPhotos:localPhotoData,animations:animationsData,scenes:scenesData};
export function parseContent(input: typeof rawContent) {
  const c = {
    audio:schemas.audio.parse(input.audio),
    menuSource:schemas.menuSource.parse(input.menuSource),
    pages:schemas.pages.parse(input.pages),
    localPhotos:schemas.localPhotos.parse(input.localPhotos),
    site:schemas.site.parse(input.site), navigation:schemas.navigation.parse(input.navigation),
    opening:schemas.opening.parse(input.opening), sections:schemas.sections.parse(input.sections),
    menu:schemas.menu.parse(input.menu), gallery:schemas.gallery.parse(input.gallery),
    media:schemas.media.parse(input.media), animations:schemas.animations.parse(input.animations), scenes:schemas.scenes.parse(input.scenes),
  };
  for (const list of [c.media.assets,c.menu.items,c.menu.conceptItems,c.sections.sections,c.gallery.items,c.sections.cafe.explore.hotspots]) {
    const ids=list.map(x=>x.id); if(new Set(ids).size!==ids.length) throw new Error('Duplicate content IDs');
  }
  for(const id of c.pages.home.menuIds)if(!c.menu.items.some(item=>item.id===id))throw new Error(`Missing homepage menu item: ${id}`);
  const assetIds=new Set(c.media.assets.map(a=>a.id));
  for(const item of [...c.localPhotos.gallery,...Object.values(c.localPhotos.sections).flat()])if(!assetIds.has(item.assetId))throw new Error(`Missing local photo: ${item.assetId}`);
  for(const [index,item]of c.localPhotos.sections.discover.slice(0,2).entries()){c.sections.journey.discover.photos[index]={...c.sections.journey.discover.photos[index],assetId:item.assetId,caption:item.caption,credit:item.credit};}

  const journey=c.sections.journey,scene=c.scenes.journey;
  const references=[...c.menu.items.map(x=>x.imageAssetId),...c.gallery.items.flatMap(x=>[x.assetId,...(x.posterAssetId?[x.posterAssetId]:[])]),c.scenes.arrival.backgroundAssetId,c.scenes.arrival.mobileAssetId,...c.scenes.arrival.layerAssetIds,...journey.discover.photos.map(p=>p.assetId),journey.experience.assetId,journey.experience.posterAssetId,journey.experience.previewAssetId,scene.backgroundAssetId,scene.mobileAssetId,scene.experienceBackgroundAssetId,scene.foregroundAssetId,scene.waveAssetId];
  for(const ref of references) if(!assetIds.has(ref)) throw new Error(`Missing asset reference: ${ref}`);
  const cafeScene=c.scenes.cafe;
  for(const ref of [c.menu.sourceAssetId,...c.menu.conceptItems.map(i=>i.imageAssetId),cafeScene.backgroundAssetId,cafeScene.mobileAssetId,cafeScene.tasteBackgroundAssetId,cafeScene.foregroundAssetId])if(!assetIds.has(ref))throw new Error(`Missing asset reference: ${ref}`);
  const menuSource=c.media.assets.find(a=>a.id===c.menu.sourceAssetId)!;
  if(menuSource.sourceType!=='owner'||!menuSource.verified||!menuSource.permission||menuSource.isPlaceholder)throw new Error('Verified menu facts require an approved owner menu source');
  const ownerItems=c.menuSource.featured_categories.flatMap(category=>category.items.map(item=>({...item,category:category.name})));
  if(c.menu.sourceDocument){
   if(ownerItems.length!==c.menu.items.length)throw new Error('Owner menu item count mismatch');
   for(const item of c.menu.items){const source=ownerItems.find(row=>row.name===item.name&&row.category===item.category);if(!source)throw new Error('Owner menu source mismatch');const expected=parseOwnerPrice(source.price);if(item.price!==expected.price||item.priceMax!==expected.priceMax||item.priceUnit!==expected.priceUnit)throw new Error('Owner menu price mismatch');}
  }
  for(const item of c.menu.items){
    if(item.sourceType!=='owner'||!item.verified||(c.menu.sourceDocument?item.sourceDocument!==c.menu.sourceDocument:item.sourceAssetId!==c.menu.sourceAssetId))throw new Error('Displayed menu facts must be confirmed by owner');
    const image=c.media.assets.find(a=>a.id===item.imageAssetId)!;
    if((image.sourceType==='generated'||image.sourceType==='licensed')&&(!item.isPlaceholder||image.verified||!image.isPlaceholder))throw new Error('Generated menu image must remain an explicit unverified placeholder');
  }
  for(const ref of [c.scenes.golden.backgroundAssetId,c.scenes.golden.mobileAssetId,c.scenes.golden.foregroundAssetId])if(!assetIds.has(ref))throw new Error(`Missing asset reference: ${ref}`);
  for(const item of [...c.gallery.items,...c.localPhotos.gallery,...Object.values(c.localPhotos.sections).flat()]){
    const asset=c.media.assets.find(a=>a.id===item.assetId)!;
    if(asset.sourceType!=='owner'||asset.isPlaceholder||!asset.permission||asset.type!==item.type)throw new Error('Gallery documentation requires matching owner media and permission');
    if(item.type==='video'){
      const poster=c.media.assets.find(a=>a.id===item.posterAssetId);
      if(!poster||poster.type!=='image'||poster.sourceType!=='owner'||poster.isPlaceholder||!poster.permission)throw new Error('Gallery video requires an approved documentary image poster');
    }
  }
  for(const reference of [...journey.discover.photos.map(p=>p.assetId),journey.experience.assetId,journey.experience.posterAssetId]){
    const asset=c.media.assets.find(a=>a.id===reference)!;
    if(asset.sourceType!=='owner'||asset.isPlaceholder||!asset.sourceFile||!asset.permission)throw new Error(`Documentary media must have owner source and permission: ${reference}`);
  }
  const video=c.media.assets.find(a=>a.id===journey.experience.assetId)!;
  const poster=c.media.assets.find(a=>a.id===journey.experience.posterAssetId)!;
  if(video.type!=='video'||!video.durationSeconds||video.hasAudio!==false||poster.type!=='image')throw new Error('Journey video contract requires silent documentary video and image poster');
  for(const ref of [c.scenes.assetKit.wave,c.scenes.assetKit.gull,c.scenes.assetKit.egret,c.scenes.assetKit.sand,c.scenes.assetKit.standingEgret,...Object.values(c.scenes.assetKit.trees)])if(!assetIds.has(ref))throw new Error(`Missing asset reference: ${ref}`);
  const implemented=new Set(['#hero','#perjalanan','#discover','#experience','#explore','#taste','#moments','#find-us']);
  for(const link of [...c.navigation.foundationItems,...c.navigation.items.filter(x=>x.enabled)]) {
    if(!implemented.has(link.target))throw new Error(`Unimplemented active anchor: ${link.target}`);
  }
  for(const override of c.localPhotos.menuOverrides){const item=c.menu.items.find(i=>i.id===override.menuId),image=c.media.assets.find(a=>a.id===override.assetId);if(!item||!image||image.sourceType!=='owner'||image.isPlaceholder||!image.permission)throw new Error('Invalid local menu photo override');item.imageAssetId=image.id;item.isPlaceholder=false;}
  c.gallery.items.sort((a,b)=>a.sortOrder-b.sortOrder);
  return c;
}
export const content = parseContent(rawContent);
export type FoundationContent = ReturnType<typeof parseContent>;
export type Asset = z.infer<typeof assetSchema>;
export function assetById(assetId: string): Asset {
  const asset=content.media.assets.find(a=>a.id===assetId);
  if(!asset)throw new Error(`Unknown asset: ${assetId}`);
  return asset;
}
