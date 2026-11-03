import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
test.beforeAll(async()=>{await mkdir('evidence/detail-pages',{recursive:true});});
for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]as const){
 test(`${name}: full menu, facility and local gallery routes with keyboard navigation`,async({page})=>{
  await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  for(const route of ['menu','galeri','fasilitas']){
   await page.goto(`/${route}/`);await page.evaluate(()=>document.fonts.ready);await expect(page.locator('h1')).toBeVisible();
   await page.screenshot({path:`evidence/detail-pages/${route}-${name}.png`});
   await page.locator('.detail-body').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   await page.locator('.detail-body img').first().evaluate(i=>(i as HTMLImageElement).decode());await page.waitForTimeout(500);await page.screenshot({path:`evidence/detail-pages/${route}-${name}-collection.png`});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   const axe=await new AxeBuilder({page}).analyze();await writeFile(`evidence/detail-pages/axe-${route}-${name}.json`,JSON.stringify(axe,null,2));expect(axe.violations.map(v=>v.id)).toEqual([]);
  }
  await page.goto('/menu/');await expect(page.locator('.collection-dish')).toHaveCount(11);
  await page.getByRole('searchbox',{name:'Cari menu'}).fill('Pataya');await expect(page.locator('.collection-dish')).toHaveCount(1);await expect(page.locator('.collection-dish')).toContainText('Rp25.000');
  await page.getByRole('searchbox',{name:'Cari menu'}).fill('xyz-tidak-ada');await expect(page.locator('.collection-empty')).toBeVisible();await page.getByRole('searchbox',{name:'Cari menu'}).clear();await expect(page.locator('.collection-dish')).toHaveCount(11);
  await page.goto('/galeri/');await expect(page.locator('.complete-moment')).toHaveCount(16);
  const trigger=page.locator('.complete-moment button').first();await trigger.focus();await page.keyboard.press('Enter');
  await expect(page.locator('.gallery-viewer')).toBeVisible();await expect(page.locator('.viewer-header')).toContainText('01 / 16');await page.keyboard.press('ArrowRight');await expect(page.locator('.viewer-header')).toContainText('02 / 16');await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  await page.locator('.complete-moment button').last().click();await expect(page.locator('.gallery-viewer video')).toBeVisible();expect(await page.locator('.gallery-viewer video').evaluate(v=>(v as HTMLVideoElement).paused)).toBe(true);await page.keyboard.press('Escape');
  await page.goto('/fasilitas/');await expect(page.locator('.complete-facility')).toHaveCount(2);await expect(page.locator('.facility-collection')).toContainText('Pandangan langsung ke pantai');
  await page.locator('.detail-back').click();await expect(page).toHaveURL(/#explore$/);await expect(page.locator('.facility-hotspot')).toHaveCount(1);await expect(page.locator('.menu-selection li')).toHaveCount(3);await expect(page.locator('.moment-frame')).toHaveCount(4);await expect(page.locator('#album')).toHaveCount(0);
  expect(errors).toEqual([]);
 });
}
test('detail collections are complete without JavaScript and reduced motion keeps pages usable',async({browser})=>{
 const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:800}}),p=await ctx.newPage();
 await p.goto('/menu/');await expect(p.locator('.collection-dish')).toHaveCount(11);await expect(p.locator('.menu-source')).toHaveCount(0);
 await p.goto('/galeri/');await expect(p.locator('.complete-moment')).toHaveCount(16);await expect(p.locator('.complete-moment noscript a')).toHaveCount(16);
 await p.goto('/fasilitas/');await expect(p.locator('.complete-facility')).toHaveCount(2);await ctx.close();
 const reduced=await browser.newContext({reducedMotion:'reduce'}),page=await reduced.newPage();await page.goto('/menu/');await expect(page.locator('.scene-atmosphere')).toHaveAttribute('data-motion','reduced');await expect(page.getByRole('button',{name:'Aktifkan animasi'})).toBeVisible();await page.getByRole('button',{name:'Aktifkan animasi'}).click();await expect(page.locator('.scene-atmosphere')).toHaveAttribute('data-motion','running');await reduced.close();
});
