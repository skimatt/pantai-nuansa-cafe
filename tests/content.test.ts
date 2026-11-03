import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync,readFileSync } from 'node:fs';
import path from 'node:path';
import { content, rawContent, parseContent, schemas } from '../src/lib/content';
import { shouldPlayIntro } from '../src/lib/intro';
import {homepageContent,completeGallery} from '../src/lib/homepage';
import {forwardFlight} from '../src/lib/coastal-air';
import {formatMenuPrice,parseOwnerPrice} from '../src/lib/menu-price';

test('owner menu facts reference real files while licensed photos remain illustrative',()=>{
 assert.equal(content.menu.items.length,11);
 for(const item of content.menu.items){
  const asset=content.media.assets.find(x=>x.id===item.imageAssetId);
  assert.ok(asset);assert.ok(existsSync(path.join('public',asset.src)));
  assert.ok(item.price!==null);assert.equal(item.available,null);assert.equal(item.verified,true);assert.equal(item.sourceType,'owner');assert.equal(asset.sourceType,'licensed');assert.equal(asset.verified,false);assert.equal(item.isPlaceholder,true);
 }
 assert.equal(content.menu.conceptItems.length,8);
 for(const concept of content.menu.conceptItems){assert.equal(concept.price,null);assert.equal(concept.verified,false);}
});
test('every manifest file and provenance document exists',()=>{
 for(const asset of content.media.assets){assert.ok(existsSync(path.join('public',asset.src)),asset.src);assert.ok(existsSync(asset.provenance));}
});
test('reject duplicate IDs and broken references',()=>{
 const duplicate=structuredClone(rawContent);duplicate.media.assets.push(duplicate.media.assets[0]);
 assert.throws(()=>parseContent(duplicate),/Duplicate/);
 const missing=structuredClone(rawContent);missing.menu.items[0].imageAssetId='missing';
 assert.throws(()=>parseContent(missing),/Missing asset/);
});
test('reject unsafe URLs and asset traversal',()=>{
 const unsafe=structuredClone(rawContent);unsafe.site.contact.mapsUrl='javascript:alert(1)' as never;
 assert.throws(()=>parseContent(unsafe));
 const traversal=structuredClone(rawContent);traversal.media.assets[0].src='/assets/../private.png';
 assert.throws(()=>parseContent(traversal));
});
test('reject generated product claims and disabled mute default',()=>{
 const falseMenu=structuredClone(rawContent.menu);falseMenu.items[0].sourceType='generated';falseMenu.items[0].verified=true;
 assert.equal(schemas.menu.safeParse(falseMenu).success,false);
 assert.equal(schemas.media.safeParse({...rawContent.media,assets:[{...rawContent.media.assets[0],isPlaceholder:false}]}).success,false);
 assert.equal(schemas.opening.safeParse({...rawContent.opening,defaultMuted:false}).success,false);
});
test('intro respects accessibility, session, deep links and disabled config',()=>{
 const base={enabled:true,reduced:false,seen:false,hasHash:false};assert.equal(shouldPlayIntro(base),true);
 for(const override of [{enabled:false},{reduced:true},{seen:true},{hasHash:true}])assert.equal(shouldPlayIntro({...base,...override}),false);
});
test('active anchors cannot point to unimplemented scenes',()=>{
 const broken=structuredClone(rawContent);broken.navigation.foundationItems.push({label:'Tidak ada',target:'#missing'});
 assert.throws(()=>parseContent(broken),/Unimplemented/);
});
test('gallery rejects generated pictures masquerading as documentary media',()=>{
 const fake=structuredClone(rawContent);fake.gallery.items[0].assetId='coastal-master';
 assert.throws(()=>parseContent(fake),/Gallery documentation/);
 const fakePoster=structuredClone(rawContent);fakePoster.gallery.items.find(i=>i.type==='video')!.posterAssetId='coastal-master';
 assert.throws(()=>parseContent(fakePoster),/documentary image poster/);
 assert.equal(content.site.contact.hours,null);assert.equal(content.site.contact.address,'Desa Lipah Rayeuk, Kec. Jeumpa, Kab. Bireuen');
 assert.equal(content.site.contact.mapsUrl,'https://maps.app.goo.gl/zjFpYA9izBekeK8a8');
 assert.equal(content.site.contact.phone,'+6285320542581');
});

test('all authorized documentary photos have a gallery entry, while the menu stays in its catalog',()=>{
 const photos=JSON.parse(readFileSync('evidence/test-runs/source-photos.json','utf8')) as {file:string}[];
 const sources=content.gallery.items.map(item=>content.media.assets.find(a=>a.id===item.assetId)!.sourceFile);
 for(const photo of photos.filter(p=>p.file!=='Menu.png'))assert.ok(sources.includes(photo.file),photo.file);
 assert.ok(!sources.includes('Menu.png'));
 assert.equal(content.gallery.items.filter(i=>i.type==='image').length,13);
 assert.equal(content.gallery.items.filter(i=>i.type==='video').length,3);
});
test('owner menu source and AI display labels cannot be silently removed',()=>{
 const fake=structuredClone(rawContent);fake.menu.items[0].isPlaceholder=false;
 assert.throws(()=>parseContent(fake),/Generated menu image/);
 const source=structuredClone(rawContent);source.menu.sourceAssetId='coastal-master';
 assert.throws(()=>parseContent(source),/approved owner menu/);
 assert.equal(content.menu.items.find(i=>i.id==='mie-aceh-telur')?.price,15000);
 assert.equal(content.menu.items.find(i=>i.id==='rambeu-bakar')?.price,25000);
});
test('documentary photos and video cannot silently become AI placeholders',()=>{
 const fake=structuredClone(rawContent);
 const photo=fake.media.assets.find(a=>a.id==='journey-together')!;
 photo.sourceType='generated';photo.isPlaceholder=true;
 assert.throws(()=>parseContent(fake),/owner media|Documentary media/);
 const broken=structuredClone(rawContent);broken.sections.journey.experience.posterAssetId='missing';
 assert.throws(()=>parseContent(broken),/Missing asset/);
});
test('video requires silent source, real poster and duration metadata',()=>{
 const noisy=structuredClone(rawContent);const video=noisy.media.assets.find(a=>a.id==='journey-senja')!;
 video.hasAudio=true;assert.throws(()=>parseContent(noisy),/silent documentary/);
 const invalid=structuredClone(rawContent);invalid.sections.journey.experience.posterAssetId='journey-senja';
 assert.throws(()=>parseContent(invalid),/image poster/);
});

test('homepage projects bounded previews while complete collections can grow',()=>{
 const expanded=structuredClone(rawContent);
 for(let i=0;i<24;i++){expanded.menu.items.push({...expanded.menu.items[0],id:`test-extra-${i}`,name:`Test ${i}`});expanded.menuSource.featured_categories[0].items.push({name:`Test ${i}`,price:'25K / ons'});}
 const full=parseContent(expanded),home=homepageContent(full);
 assert.equal(full.menu.items.length,35);assert.equal(home.menu.items.length,3);
 assert.equal(home.gallery.items.length,4);assert.equal(home.sections.cafe.explore.hotspots.length,1);
 assert.equal(home.localPhotos.gallery.length,0);assert.equal(full.localPhotos.gallery.length,13);
 assert.ok(JSON.stringify(home).length<JSON.stringify(full).length);
 for(const item of home.gallery.items)assert.ok(home.media.assets.some(a=>a.id===item.assetId));
 const broken=structuredClone(rawContent);broken.pages.home.menuIds=['missing-menu'];
 assert.throws(()=>parseContent(broken),/Missing homepage menu/);
});

test('full gallery uses the folder collection and does not resurrect deleted source photos',()=>{
 assert.equal(completeGallery(content).length,16);
 const empty=structuredClone(content);empty.localPhotos.gallery=[];
 assert.equal(completeGallery(empty).filter(i=>i.type==='image').length,0);
 assert.equal(completeGallery(empty).filter(i=>i.type==='video').length,3);
});

test('right-facing bird art flies forward and wraps outside the visible viewport',()=>{
 for(const width of [600,1440])for(let index=0;index<6;index++){
  assert.ok(forwardFlight(width,2,index).x>forwardFlight(width,1,index).x);
  for(let time=0;time<3600;time+=19){const pose=forwardFlight(width,time,index);assert.ok(pose.x>=-80&&pose.x<width+80);assert.ok(Math.abs(pose.bank)<=.035);}
  const period=(width+160)/(20-index*2);assert.ok(Math.abs(forwardFlight(width,1,index).x-forwardFlight(width,1+period,index).x)<.00001);
 }
});

test('owner price ranges and per-ons units cannot silently become flat per-portion prices',()=>{
 assert.equal(formatMenuPrice(parseOwnerPrice('25K / ons')),'Rp25.000 / ons');
 assert.equal(formatMenuPrice(parseOwnerPrice('12K - 15K')),'Rp12.000–Rp15.000');
 const wrong=structuredClone(rawContent);delete wrong.menu.items[0].priceUnit;
 assert.throws(()=>parseContent(wrong),/price mismatch/);
 const range=structuredClone(rawContent);range.menu.items.find(i=>i.id==='sanger-espreso')!.priceMax=12000;
 assert.throws(()=>parseContent(range),/price mismatch/);
 const noCredit=structuredClone(rawContent);delete noCredit.media.assets.find(a=>a.id==='web-rambeu-bakar')!.licenseUrl;
 assert.throws(()=>parseContent(noCredit),/Licensed references/);
});
