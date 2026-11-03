import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
test.beforeAll(async()=>{await mkdir('evidence/section-transitions',{recursive:true});});
for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]as const){
 test(`${name}: reversible section fades with readable copy and pause`,async({page})=>{
  await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/#taste');
  const section=page.locator('#taste'),image=section.locator('.taste-art>img');await expect(section).toHaveAttribute('data-transition','active');
  const seek=async(position:number)=>{await section.evaluate((el,p)=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-innerHeight*p,behavior:'instant'}),position);await page.waitForTimeout(900);return Number(await image.evaluate(el=>getComputedStyle(el).opacity));};
  const entry=await seek(.95);expect(entry).toBeLessThan(.9);const centre=await seek(-.15);expect(centre).toBeGreaterThan(.97);const reversed=await seek(.95);expect(Math.abs(entry-reversed)).toBeLessThan(.03);
  for(const id of ['discover','experience','explore','taste','moments','find-us']){await page.locator('#'+id).evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await page.waitForTimeout(650);await page.screenshot({path:`evidence/section-transitions/${id}-${name}.png`});}
  await page.getByRole('button',{name:'Jeda gerak',exact:true}).click();await expect(section).toHaveAttribute('data-transition','static');expect(await image.evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);await writeFile(`evidence/section-transitions/${name}.json`,JSON.stringify({entry,centre,reversed,errors},null,2));
 });
}
test('reduced motion and no JavaScript leave section content fully visible',async({browser})=>{
 const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();await page.goto('/#taste');await expect(page.locator('#taste')).toHaveAttribute('data-transition','static');expect(await page.locator('.taste-art>img').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);await page.getByRole('button',{name:'Aktifkan animasi',exact:true}).click();await expect(page.locator('#taste')).toHaveAttribute('data-transition','active');await page.getByRole('button',{name:'Matikan animasi',exact:true}).click();await expect(page.locator('#taste')).toHaveAttribute('data-transition','static');await context.close();
 const noJS=await browser.newContext({javaScriptEnabled:false}),p=await noJS.newPage();await p.goto('/#taste');await expect(p.locator('#taste-title')).toBeVisible();expect(await p.locator('.taste-art>img').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);await noJS.close();
});
