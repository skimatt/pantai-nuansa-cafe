import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir,writeFile } from 'node:fs/promises';
test.beforeAll(async()=>{await mkdir('evidence/screenshots/p4',{recursive:true});});
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['small-mobile',360,800],['tablet',768,1024]] as const){
 test(`${name}: facility hotspots and verified menu with illustrative photos`,async({page})=>{
  await page.setViewportSize({width,height});const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('/#explore');await page.evaluate(()=>document.fonts.ready);
  await page.locator('.cafe-world img').evaluate(i=>(i as HTMLImageElement).decode());
  const seat=page.getByRole('button',{name:'01 · Area duduk di atas pasir'});await seat.focus();await page.keyboard.press('Enter');
  await expect(seat).toHaveAttribute('aria-pressed','true');await expect(page.locator('#facility-info')).toContainText('meja melingkar');await expect(page.locator('.facility-hotspot')).toHaveCount(1);
  await page.locator('#explore').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await page.screenshot({path:`evidence/screenshots/p4/explore-${name}.png`});await page.locator('#explore').screenshot({path:`evidence/screenshots/p4/explore-full-${name}.png`});
  const facilityAxe=await new AxeBuilder({page}).include('#explore').analyze();await writeFile(`evidence/test-runs/p4-axe-explore-${name}.json`,JSON.stringify(facilityAxe,null,2));
  expect(facilityAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.goto('/#taste');
  await expect(page.locator('.menu-selection li')).toHaveCount(3);
  const seafood=page.getByRole('button',{name:/Chicken Steak Black Pepper/});await seafood.click();await expect(seafood).toHaveAttribute('aria-pressed','true');
  await expect(seafood).toContainText('Rp35.000');await expect(page.locator('#taste-selected-media h3')).toHaveText('Chicken Steak Black Pepper');
  await expect(page.locator('#taste-selected-media')).toContainText('Ilustrasi AI');
  await page.locator('#taste-selected-media img').evaluate(i=>(i as HTMLImageElement).decode());
  await page.locator('#taste').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await page.screenshot({path:`evidence/screenshots/p4/taste-${name}.png`});await page.locator('#taste').screenshot({path:`evidence/screenshots/p4/taste-full-${name}.png`});
  const tasteAxe=await new AxeBuilder({page}).include('#taste').analyze();await writeFile(`evidence/test-runs/p4-axe-taste-${name}.json`,JSON.stringify(tasteAxe,null,2));
  expect(tasteAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.locator('.taste-footer').getByRole('link',{name:'Lihat semua menu'}).click();await expect(page).toHaveURL(/\/menu\/$/);
  await expect(page.locator('.collection-dish')).toHaveCount(6);await expect(page.locator('.collection-dish').first()).toContainText('Rp15.000');
  await expect(page.getByRole('link',{name:'Buka daftar menu asli'}).first()).toHaveAttribute('href','/assets/cafe/menu-original.png');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 });
}
test('cafe remains readable without JavaScript and with reduced motion',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await context.newPage();
 await page.goto('/#explore');await expect(page.locator('.facility-no-script')).toContainText('Area duduk di atas pasir');
 await page.goto('/#taste');await expect(page.locator('.menu-selection li')).toHaveCount(3);await expect(page.getByRole('link',{name:'Lihat menu asli'})).toHaveAttribute('href','/assets/cafe/menu-original.png');await context.close();
 const reduced=await browser.newContext({reducedMotion:'reduce'}),p=await reduced.newPage();await p.goto('/#taste');
 await p.getByRole('button',{name:/Mie Aceh Kuah Telor/}).click();await expect(p.locator('#taste-selected-media h3')).toHaveText('Mie Aceh Kuah Telor');await reduced.close();
});
