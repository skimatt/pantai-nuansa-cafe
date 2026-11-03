import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

test('opening completes naturally, remains on same world and plays once per session',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('.arrival')).toHaveAttribute('data-intro','playing');
 await expect(page.getByRole('button',{name:'Lewati pembuka'})).toBeVisible();
 const world=await page.locator('.world').elementHandle();
 await expect(page.locator('.arrival')).toHaveAttribute('data-intro','hero',{timeout:9000});
 expect(await world?.evaluate(el=>el.isConnected)).toBe(true);
 await expect(page.getByRole('button',{name:'Suara mati'})).toHaveAttribute('aria-pressed','false');
 await page.reload();await expect(page.locator('.arrival')).toHaveAttribute('data-intro','hero');
 await expect(page.getByRole('button',{name:'Lewati pembuka'})).toBeHidden();
 expect(errors).toEqual([]);
});

test('skip, replay, accessible catalog and audio controls work',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Lewati pembuka'}).click();
 await expect(page.locator('.arrival')).toHaveAttribute('data-intro','hero');
 await page.getByRole('button',{name:'Putar ulang pembuka'}).click();
 await expect(page.locator('.arrival')).toHaveAttribute('data-intro','playing');
 await page.getByRole('button',{name:'Lewati pembuka'}).click();
 const sound=page.getByRole('button',{name:'Suara mati'});await sound.click();
 await expect(page.getByRole('button',{name:'Suara hidup'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Suara hidup'}).click();await expect(sound).toHaveAttribute('aria-pressed','false');
 const trigger=page.locator('.hero-actions').getByRole('link',{name:'Menu kuliner',exact:true});
 await trigger.click();await expect(page).toHaveURL(/\/menu\/$/);await expect(page.locator('.collection-dish')).toHaveCount(11);
 await expect(page.getByText('Foto ilustrasi penyajian',{exact:true})).toHaveCount(11);
 await page.getByRole('link',{name:'Kembali ke beranda',exact:true}).first().click();await expect(page).toHaveURL(/#taste$/);

});

for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['small-mobile',360,800],['tablet',768,1024]] as const){
 test(`${name} visual, navigation, assets and accessibility`,async({page})=>{
  await page.setViewportSize({width,height});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('/');await page.getByRole('button',{name:'Lewati pembuka'}).click();
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`evidence/screenshots/hero-${name}.png`});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const broken=await page.locator('.world img').evaluateAll(images=>(images as HTMLImageElement[]).filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src));expect(broken).toEqual([]);
  if(width<=640){await page.getByRole('button',{name:'Buka navigasi'}).click();await expect(page.getByRole('navigation')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Buka navigasi'})).toBeFocused();}
  await page.getByRole('link',{name:'Jelajahi Nuansa',exact:true}).click();
  await expect(page).toHaveURL(/#perjalanan$/);await expect(page.getByRole('heading',{name:/Setiap tempat/})).toBeInViewport();
  await page.screenshot({path:`evidence/screenshots/prolog-${name}.png`});
  const result=await new AxeBuilder({page}).analyze();
  await writeFile(`evidence/test-runs/axe-${name}.json`,JSON.stringify(result,null,2));
  expect(result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.locator('.prolog').getByRole('link',{name:'Lihat semua menu'}).click();await expect(page).toHaveURL(/\/menu\/$/);
  await expect(page.locator('.collection-dish')).toHaveCount(11);
  for(const image of await page.locator('.collection-dish img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(i=>(i as HTMLImageElement).decode());}
  await page.screenshot({path:`evidence/screenshots/catalog-${name}.png`});
  const catalogAxe=await new AxeBuilder({page}).analyze();await writeFile(`evidence/test-runs/axe-catalog-${name}.json`,JSON.stringify(catalogAxe,null,2));expect(catalogAxe.violations.map(v=>v.id)).toEqual([]);
  expect(errors).toEqual([]);
 });
}

test('reduced motion, blocked session storage, no JavaScript and deep links remain usable',async({browser})=>{
 const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new Error('Storage blocked');}});});
 await page.goto('/');await expect(page.locator('.arrival')).toHaveAttribute('data-intro','hero');
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 await expect(page.getByRole('button',{name:'Lewati pembuka'})).toBeHidden();
 await page.screenshot({path:'evidence/screenshots/hero-reduced-motion.png'});
 await context.close();
 const noJS=await browser.newContext({javaScriptEnabled:false});const staticPage=await noJS.newPage();
 await staticPage.goto('/');await expect(staticPage.getByRole('heading',{level:1})).toBeVisible();
 await staticPage.getByRole('link',{name:'Jelajahi Nuansa',exact:true}).click();await expect(staticPage).toHaveURL(/#perjalanan$/);await noJS.close();
 const deep=await browser.newPage();await deep.goto('/#perjalanan');await expect(deep.locator('.arrival')).toHaveAttribute('data-intro','hero');await deep.close();
});

test('scroll is reversible and runtime motion preference ends the intro',async({page})=>{
 await page.goto('/');await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.arrival')).toHaveAttribute('data-intro','hero');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.mouse.wheel(0,450);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(300);
 await page.mouse.wheel(0,-1000);await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
 await expect(page.getByRole('heading',{level:1})).toBeInViewport();
});
