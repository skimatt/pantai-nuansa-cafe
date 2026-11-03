import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
test.beforeAll(async()=>{await mkdir('evidence/owner-menu',{recursive:true});});
for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]as const){
 test(`${name}: latest owner menu, licensed HD imagery and exact price units`,async({page})=>{
  await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('/menu/');await expect(page.locator('.collection-dish')).toHaveCount(11);await expect(page.locator('.menu-source')).toHaveCount(0);
  for(const image of await page.locator('.collection-dish img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(i=>(i as HTMLImageElement).decode());}
  await page.locator('.detail-body').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:`evidence/owner-menu/menu-${name}.png`});await page.screenshot({path:`evidence/owner-menu/full-${name}.png`,fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('.collection-dish').first()).toContainText('Rp25.000 / ons');await expect(page.locator('.collection-dish').filter({hasText:'Sanger Espreso'})).toContainText('Rp12.000–Rp15.000');
  await expect(page.locator('.photo-credit')).toHaveCount(11);expect(await page.locator('.photo-credit a').evaluateAll(links=>links.every(a=>(a as HTMLAnchorElement).href.startsWith('https://')))).toBe(true);
  await page.getByRole('button',{name:'Coffee & Beverages',exact:true}).click();await expect(page.locator('.collection-dish')).toHaveCount(3);await page.getByRole('button',{name:'Semua',exact:true}).click();
  await page.getByRole('searchbox',{name:'Cari menu'}).fill('Mie Bakso');await expect(page.locator('.collection-dish')).toHaveCount(1);await expect(page.locator('.collection-dish')).toContainText('Rp20.000');await page.getByRole('searchbox',{name:'Cari menu'}).clear();
  const axe=await new AxeBuilder({page}).analyze();await writeFile(`evidence/owner-menu/axe-${name}.json`,JSON.stringify(axe,null,2));expect(axe.violations.map(v=>v.id)).toEqual([]);
  await page.locator('.detail-back').click();await expect(page.locator('.menu-selection li')).toHaveCount(3);await page.locator('#find-us').evaluate(el=>el.scrollIntoView({behavior:'instant'}));await expect(page.locator('.contact-details')).toContainText('Desa Lipah Rayeuk');await expect(page.getByRole('link',{name:'TikTok Nuansa Pantai'})).toHaveAttribute('href','https://www.tiktok.com/@Nuansa.pantai_coffe');expect(errors).toEqual([]);
 });
}
