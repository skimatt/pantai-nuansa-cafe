import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile,mkdir } from 'node:fs/promises';
import { content } from '../../src/lib/content';
import { completeGallery } from '../../src/lib/homepage';

test.beforeAll(async()=>{await mkdir('evidence/screenshots/p3',{recursive:true});});
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['small-mobile',360,800],['tablet',768,1024]] as const){
 test(`${name}: documentary composition, lazy video, controls and accessibility`,async({page})=>{
  await page.setViewportSize({width,height});
  const errors:string[]=[],videoRequests:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  page.on('request',r=>{if(r.url().endsWith('.mp4'))videoRequests.push(r.url());});
  await page.goto('/#discover');await page.evaluate(()=>document.fonts.ready);
  await page.locator('#discover img').evaluateAll(async images=>{await Promise.all((images as HTMLImageElement[]).map(i=>i.decode()));});
  await page.locator('#discover').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
  await page.waitForTimeout(900); // Allow scrub interpolation to settle before visual capture.
  await expect(page.getByRole('heading',{name:'Di antara laut dan cerita.'})).toBeVisible();
  await expect(page.locator('.documentary-photo')).toHaveCount(2);
  await expect(page.locator('.documentary-photo img')).toHaveCount(2);
  expect(await page.locator('.documentary-photo img').evaluateAll(imgs=>(imgs as HTMLImageElement[]).every(i=>i.naturalWidth>0))).toBe(true);
  await page.screenshot({path:`evidence/screenshots/p3/discover-${name}.png`});
  await page.locator('#discover').screenshot({path:`evidence/screenshots/p3/discover-full-${name}.png`});
  const discovery=await new AxeBuilder({page}).include('#discover').analyze();
  await writeFile(`evidence/test-runs/p3-axe-discover-${name}.json`,JSON.stringify(discovery,null,2));
  expect(discovery.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.getByRole('link',{name:content.sections.journey.discover.nextLabel}).click();
  await expect(page).toHaveURL(/#experience$/);
  await page.locator('.documentary-player').scrollIntoViewIfNeeded();
  await page.locator('.documentary-poster').evaluate(async image=>{await (image as HTMLImageElement).decode();});
  expect(videoRequests).toEqual([]);
  const video=page.locator('video');expect(await video.evaluate(v=>(v as HTMLVideoElement).currentSrc)).toBe('');
  await page.locator('#experience').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
  await page.waitForTimeout(900);
  await page.screenshot({path:`evidence/screenshots/p3/experience-${name}.png`});
  await page.locator('#experience').screenshot({path:`evidence/screenshots/p3/experience-full-${name}.png`});
  await page.getByRole('button',{name:content.sections.journey.experience.playLabel,exact:true}).click();
  await expect(page.getByRole('button',{name:content.sections.journey.experience.pauseLabel})).toBeVisible();
  await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(.1);
  expect(videoRequests.length).toBeGreaterThan(0);
  expect(await video.evaluate(v=>({muted:(v as HTMLVideoElement).muted,controls:(v as HTMLVideoElement).controls}))).toEqual({muted:true,controls:true});
  await page.getByRole('button',{name:content.sections.journey.experience.pauseLabel}).click();expect(await video.evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);
  await page.getByText('Deskripsi visual video',{exact:true}).click();await expect(page.locator('#video-visual-description')).toBeVisible();
  const experience=await new AxeBuilder({page}).include('#experience').analyze();
  await writeFile(`evidence/test-runs/p3-axe-experience-${name}.json`,JSON.stringify(experience,null,2));
  expect(experience.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
 });
}

test('video pauses offscreen, on page hide and when leaving for the gallery; keyboard can resume',async({page})=>{
 await page.goto('/#experience');const video=page.locator('video');
 const play=page.getByRole('button',{name:content.sections.journey.experience.playLabel,exact:true});
 await play.focus();await page.keyboard.press('Enter');
 await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(.1);
 await expect(video).toBeFocused();
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);
 await page.locator('.documentary-player').scrollIntoViewIfNeeded();
 expect(await video.evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);
 await page.getByRole('button',{name:content.sections.journey.experience.playLabel,exact:true}).click();
 await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).paused)).toBe(false);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
 expect(await video.evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);
 await page.getByRole('button',{name:content.sections.journey.experience.playLabel,exact:true}).click();
 const handle=await video.elementHandle();await page.locator('.experience-copy').getByRole('link',{name:'Lihat semua galeri'}).click();await expect(page).toHaveURL(/\/galeri\/$/);
 await expect(page.locator('.complete-moment')).toHaveCount(completeGallery(content).length);expect(await handle?.evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);

});

test('failed media retains poster and description, retry recovers',async({page})=>{
 await page.route('**'+content.media.assets.find(asset=>asset.id===content.sections.journey.experience.assetId)!.src,route=>route.abort('failed'));
 await page.goto('/#experience');await page.getByRole('button',{name:content.sections.journey.experience.playLabel,exact:true}).click();
 await expect(page.locator('.video-failure').getByRole('alert')).toContainText('Video belum dapat diputar');
 await expect(page.locator('.documentary-poster')).toBeVisible();
 await page.getByText('Deskripsi visual video',{exact:true}).click();await expect(page.locator('#video-visual-description')).toBeVisible();
 await page.screenshot({path:'evidence/screenshots/p3/video-error-fallback.png'});
 await page.unroute('**'+content.media.assets.find(asset=>asset.id===content.sections.journey.experience.assetId)!.src);await page.getByRole('button',{name:'Coba putar lagi'}).click();
 await expect.poll(()=>page.locator('video').evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(.1);
 await expect(page.locator('.video-failure').getByRole('alert')).toHaveCount(0);
});

test('reduced motion and no-JavaScript documentary access remain available',async({browser})=>{
 const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}}),page=await context.newPage();
 await page.goto('/#discover');await expect(page.getByRole('heading',{name:'Di antara laut dan cerita.'})).toBeVisible();
 expect(await page.locator('.documentary-photo').first().evaluate(el=>getComputedStyle(el).clipPath)).toBe('none');
 await page.getByRole('link',{name:content.sections.journey.discover.nextLabel}).click();await page.getByRole('button',{name:content.sections.journey.experience.playLabel,exact:true}).click();
 await expect(page.getByRole('button',{name:content.sections.journey.experience.pauseLabel})).toBeVisible();await context.close();
 const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),staticPage=await noJS.newPage();
 await staticPage.goto('/#discover');await expect(staticPage.locator('.documentary-photo img').first()).toBeVisible();
 await staticPage.getByRole('link',{name:content.sections.journey.discover.nextLabel}).click();
 await expect(staticPage.getByRole('link',{name:'Buka berkas video'})).toBeVisible();
  await expect(staticPage.getByRole('link',{name:'Buka berkas video'})).toHaveAttribute('href',content.media.assets.find(asset=>asset.id===content.sections.journey.experience.assetId)!.src);await noJS.close();
});
