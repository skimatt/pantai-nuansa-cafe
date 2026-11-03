import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir,writeFile } from 'node:fs/promises';
test.beforeAll(async()=>{await mkdir('evidence/screenshots/p5',{recursive:true});});
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['small-mobile',360,800],['tablet',768,1024]] as const){
 test(`${name}: gallery viewer, video and supplied location/contact`,async({page})=>{
  await page.setViewportSize({width,height});const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('/#moments');await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.moment-frame')).toHaveCount(4);
  const next=page.locator('.gallery-controls').getByRole('button',{name:'Dokumentasi berikutnya'});await expect(next).toBeEnabled();await next.click();
  await expect.poll(()=>page.locator('.gallery-track').evaluate(el=>el.scrollLeft)).toBeGreaterThan(20);
  await expect(page.locator('.gallery-previous')).toBeEnabled();
  await page.locator('.gallery-track').evaluate(el=>el.scrollTo({left:0,behavior:'instant'}));
  await page.locator('.moment-open img').first().evaluate(i=>(i as HTMLImageElement).decode());
  await page.locator('#moments').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await page.screenshot({path:`evidence/screenshots/p5/moments-${name}.png`});await page.locator('#moments').screenshot({path:`evidence/screenshots/p5/moments-full-${name}.png`});
  const galleryAxe=await new AxeBuilder({page}).include('#moments').analyze();await writeFile(`evidence/test-runs/p5-axe-moments-${name}.json`,JSON.stringify(galleryAxe,null,2));expect(galleryAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  const first=page.locator('.moment-open').first();await first.focus();await page.keyboard.press('Enter');
  const viewer=page.locator('.gallery-viewer');await expect(viewer).toBeVisible();await expect(viewer.locator('.viewer-caption')).toContainText('Di antara ombak');
  await viewer.locator('img').evaluate(i=>(i as HTMLImageElement).decode());
  await page.screenshot({path:`evidence/screenshots/p5/viewer-${name}.png`});
  await page.keyboard.press('ArrowRight');await expect(viewer.locator('.viewer-caption')).toContainText('Dekat, tanpa');
  const viewerAxe=await new AxeBuilder({page}).analyze();await writeFile(`evidence/test-runs/p5-axe-viewer-${name}.json`,JSON.stringify(viewerAxe,null,2));expect(viewerAxe.violations.map(v=>v.id)).toEqual([]);
  await page.keyboard.press('Escape');await expect(viewer).toHaveCount(0);await expect(first).toBeFocused();
  await page.locator('.moment-open').last().click();await expect(page.locator('.gallery-viewer video')).toBeVisible();
  const movie=page.locator('.gallery-viewer video');expect(await movie.evaluate(v=>({muted:(v as HTMLVideoElement).muted,paused:(v as HTMLVideoElement).paused,controls:(v as HTMLVideoElement).controls}))).toEqual({muted:true,paused:true,controls:true});
  await movie.evaluate(v=>(v as HTMLVideoElement).play());await expect.poll(()=>movie.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(.1);
  const handle=await movie.elementHandle();await page.keyboard.press('Escape');await expect(page.locator('.gallery-viewer')).toHaveCount(0);expect(await handle?.evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);
  await page.locator('#find-us').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await expect(page.getByRole('link',{name:'Buka di Google Maps'})).toHaveAttribute('href','https://maps.app.goo.gl/zjFpYA9izBekeK8a8');
  await expect(page.getByRole('link',{name:/Hubungi pengelola/})).toHaveAttribute('href','tel:+6285320542581');
  await expect(page.getByRole('link',{name:'Instagram pengelola'})).toHaveAttribute('href','https://www.instagram.com/rs_risna22/');
  await expect(page.locator('.contact-details')).toContainText('0853 2054 2581');await expect(page.locator('.contact-details')).toContainText('Konfirmasi kepada pengelola');await expect(page.locator('.contact-details')).toContainText('Desa Lipah Rayeuk');
  await page.screenshot({path:`evidence/screenshots/p5/find-us-${name}.png`});await page.locator('#find-us').screenshot({path:`evidence/screenshots/p5/find-us-full-${name}.png`});
  const locationAxe=await new AxeBuilder({page}).include('#find-us').analyze();await writeFile(`evidence/test-runs/p5-axe-find-us-${name}.json`,JSON.stringify(locationAxe,null,2));expect(locationAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 });
}
test('gallery and contacts stay usable without JavaScript; reduced motion navigation works',async({browser})=>{
 const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await noJS.newPage();
 await page.goto('/#moments');await expect(page.locator('.gallery-original')).toHaveCount(4);await expect(page.locator('.moment-open img').first()).toBeVisible();
 await page.goto('/#find-us');await expect(page.getByRole('link',{name:'Buka di Google Maps'})).toBeVisible();await expect(page.getByRole('link',{name:/Hubungi pengelola/})).toBeVisible();await noJS.close();
 const reduced=await browser.newContext({reducedMotion:'reduce'}),p=await reduced.newPage();await p.goto('/#moments');
 await p.locator('.gallery-controls').getByRole('button',{name:'Dokumentasi berikutnya'}).click();await expect.poll(()=>p.locator('.gallery-track').evaluate(el=>el.scrollLeft)).toBeGreaterThan(20);await reduced.close();
});
test('ambient mute remains reachable after leaving Hero',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Lewati pembuka'}).click();await page.getByRole('button',{name:'Suara mati'}).click();
 await expect(page.getByRole('button',{name:'Suara hidup'})).toHaveAttribute('aria-pressed','true');
 await page.locator('#find-us').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
 await expect(page.locator('.sound-dock')).toBeVisible();await expect(page.getByRole('button',{name:'Suara hidup'})).toHaveCount(1);
 await expect(page.locator('.living-coast')).toHaveAttribute('data-motion','paused');const before=await page.locator('.living-coast').getAttribute('data-frames');await page.waitForTimeout(250);expect(await page.locator('.living-coast').getAttribute('data-frames')).toBe(before);
 await page.getByRole('button',{name:'Suara hidup'}).click();await expect(page.locator('.sound-dock')).toHaveAttribute('aria-pressed','false');
});
