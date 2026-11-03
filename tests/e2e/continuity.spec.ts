import {test,expect} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
test.beforeAll(async()=>{await mkdir('evidence/continuity',{recursive:true});});
test('chapter navigation crosses the animated wave, updates history and focuses destination',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/#discover');
 await page.getByRole('link',{name:'Menuju suasana senja',exact:true}).click();
 await expect(page.locator('.navigation-wave')).toHaveAttribute('data-active','true');
 await page.screenshot({path:'evidence/continuity/navigation-in-flight.png'});
 await expect(page).toHaveURL(/#experience$/);await expect(page.locator('.navigation-wave')).toHaveAttribute('data-active','false');
 await expect(page.locator('#experience-title')).toBeFocused();await expect(page.locator('#experience-title')).toBeInViewport();
 await page.goBack();await expect(page).toHaveURL(/#discover$/);
});
for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]as const){
 test(`${name}: each following environment moves, pauses globally, and sleeps offscreen`,async({page})=>{
  await page.setViewportSize({width,height});await page.goto('/#discover');const evidence=[];
  for(const id of ['discover','experience','explore','taste','moments','find-us']){
   const section=page.locator('#'+id),canvas=section.locator('.scene-atmosphere');
   await section.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
   await expect(canvas).toHaveAttribute('data-motion','running');await page.waitForTimeout(350);
   const first=await page.screenshot();await page.waitForTimeout(900);const second=await page.screenshot();
   const a=await sharp(first).removeAlpha().raw().toBuffer(),b=await sharp(second).removeAlpha().raw().toBuffer();
   let changed=0;for(let i=0;i<a.length;i+=3)if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>8)changed++;
   expect(changed).toBeGreaterThan(15);evidence.push({id,changedPixels:changed});
   await page.screenshot({path:`evidence/continuity/${id}-${name}-final.png`});
  }
  await page.getByRole('button',{name:'Jeda gerak',exact:true}).click();
  const current=page.locator('#find-us .scene-atmosphere');await expect(current).toHaveAttribute('data-motion','paused');
  const before=await current.getAttribute('data-frames');await page.waitForTimeout(500);expect(await current.getAttribute('data-frames')).toBe(before);
  await expect(page.locator('#discover .scene-atmosphere')).toHaveAttribute('data-motion','paused');
  await writeFile(`evidence/continuity/temporal-${name}.json`,JSON.stringify(evidence,null,2));
 });
}
test('homepage previews are limited and gallery tours automatically, pauses on hover and user control',async({page})=>{
 await page.goto('/#moments');const track=page.locator('.gallery-track');await track.scrollIntoViewIfNeeded();await page.mouse.move(10,10);
 await expect(page.locator('.moment-frame')).toHaveCount(4);await expect(track).toHaveAttribute('data-autoplay','running');
 await expect.poll(()=>track.evaluate(el=>el.scrollLeft),{timeout:9000}).toBeGreaterThan(100);
 await track.hover();await expect(track).toHaveAttribute('data-autoplay','paused');
 await page.mouse.move(10,10);await page.getByRole('button',{name:'Jeda galeri',exact:true}).click();
 await expect(track).toHaveAttribute('data-autoplay','paused');await page.waitForTimeout(500);const left=await track.evaluate(el=>el.scrollLeft);await page.waitForTimeout(900);expect(await track.evaluate(el=>el.scrollLeft)).toBe(left);
 await page.getByRole('button',{name:'Lanjutkan galeri'}).click();await expect(track).toHaveAttribute('data-autoplay','running');
});
test('reduced motion leaves gallery still and navigation direct',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#discover');
 await expect(page.locator('#discover .scene-atmosphere')).toHaveAttribute('data-motion','reduced');
 await page.getByRole('link',{name:'Menuju suasana senja',exact:true}).click();await expect(page).toHaveURL(/#experience$/);await expect(page.locator('.navigation-wave')).toHaveAttribute('data-active','false');
 await page.locator('#moments').evaluate(el=>el.scrollIntoView({behavior:'instant'}));await expect(page.locator('.gallery-track')).toHaveAttribute('data-autoplay','paused');
});
