import {test,expect,type Page} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import sharp from 'sharp';

async function temporalPixels(page:Page,delay:number){
 const before=await page.screenshot();await page.waitForTimeout(delay);const after=await page.screenshot();
 const {width,height}=await sharp(before).metadata();
 const difference=async(x:number,y:number,w:number,h:number)=>{
  const area={left:Math.floor(width!*x),top:Math.floor(height!*y),width:Math.floor(width!*w),height:Math.floor(height!*h)};
  const a=await sharp(before).extract(area).removeAlpha().raw().toBuffer(),b=await sharp(after).extract(area).removeAlpha().raw().toBuffer();
  let changed=0;for(let i=0;i<a.length;i+=3)if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>5)changed++;
  return changed/(a.length/3);
 };
 return {seaChangedFraction:await difference(.15,.6,.3,.12),palmChangedFraction:await difference(.72,0,.27,.28)};
}

for(const [name,width,height] of [['desktop',1440,900],['mobile',360,800]] as const){
 test(`${name}: visible sea and palm motion, user pause and offscreen sleep`,async({page})=>{
  await page.setViewportSize({width,height});await page.goto('/');
  await page.getByRole('button',{name:'Lewati pembuka'}).click();await page.waitForLoadState('networkidle');
  const canvas=page.locator('.living-coast');await expect(canvas).toHaveAttribute('data-motion','running');
  await page.waitForTimeout(500);
  const moving=await temporalPixels(page,1300);
  expect(moving.seaChangedFraction).toBeGreaterThan(.01);expect(moving.palmChangedFraction).toBeGreaterThan(.005);
  await page.getByRole('button',{name:'Jeda gerak',exact:true}).click();await expect(canvas).toHaveAttribute('data-motion','paused');
  const paused=await temporalPixels(page,500);expect(paused.seaChangedFraction).toBe(0);expect(paused.palmChangedFraction).toBe(0);
  await page.getByRole('button',{name:'Lanjutkan gerak'}).click();await expect(canvas).toHaveAttribute('data-motion','running');
  await page.locator('#find-us').evaluate(el=>el.scrollIntoView({behavior:'instant'}));await expect(canvas).toHaveAttribute('data-motion','paused');
  await writeFile(`evidence/test-runs/motion-${name}.json`,JSON.stringify({viewport:{width,height},moving,paused},null,2));
 });
}
test('reduced-motion canvas is static and navigation does not pin the Hero',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.waitForLoadState('networkidle');
 await expect(page.locator('.living-coast')).toHaveAttribute('data-motion','reduced');
 expect(await temporalPixels(page,700)).toEqual({seaChangedFraction:0,palmChangedFraction:0});
 await expect(page.getByRole('button',{name:'Jeda gerak'})).toBeHidden();
 await expect(page.locator('.pin-spacer')).toHaveCount(0);
 await page.getByRole('link',{name:'Jelajahi Nuansa',exact:true}).click();await expect(page.locator('#perjalanan')).toBeInViewport();
});
test('deliberate hover plays a silent preview and leaving stops it',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/#experience');
 const frame=page.locator('.video-frame');await frame.scrollIntoViewIfNeeded();
 await expect(page.locator('.hover-film')).toHaveCount(0);await frame.hover();
 const preview=page.locator('.hover-film');await expect(preview).toBeVisible();
 await expect.poll(()=>preview.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(.2);
 expect(await preview.evaluate(v=>(v as HTMLVideoElement).muted)).toBe(true);
 await page.mouse.move(20,20);await expect(preview).toHaveCount(0);
 expect(await page.locator('.documentary-video').evaluate(v=>(v as HTMLVideoElement).currentSrc)).toBe('');
});

for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]as const){
 test(`${name}: explicit ambient choice works with system reduced motion and survives reload`,async({page})=>{
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  const canvas=page.locator('.living-coast');await expect(canvas).toHaveAttribute('data-motion','reduced');
  await page.getByRole('button',{name:'Aktifkan animasi',exact:true}).click();await expect(canvas).toHaveAttribute('data-motion','running');
  await page.waitForTimeout(400);const moving=await temporalPixels(page,1100);expect(moving.seaChangedFraction).toBeGreaterThan(.01);expect(moving.palmChangedFraction).toBeGreaterThan(.005);
  expect(await page.evaluate(()=>matchMedia('(prefers-reduced-motion:reduce)').matches)).toBe(true);
  await page.reload();await expect(canvas).toHaveAttribute('data-motion','running');await expect(page.getByRole('button',{name:'Matikan animasi',exact:true})).toBeVisible();
  await page.locator('#moments').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
  await expect(page.locator('#moments .scene-atmosphere')).toHaveAttribute('data-motion','running');await page.mouse.move(1,1);
  const track=page.locator('.gallery-track');await track.scrollIntoViewIfNeeded();await expect(track).toHaveAttribute('data-autoplay','running');
  await expect.poll(()=>track.evaluate(el=>el.scrollLeft),{timeout:9000}).toBeGreaterThan(50);
  await page.getByRole('button',{name:'Matikan animasi',exact:true}).click();await expect(track).toHaveAttribute('data-autoplay','paused');await expect(page.locator('#moments .scene-atmosphere')).toHaveAttribute('data-motion','reduced');
  await page.locator('#hero').evaluate(el=>el.scrollIntoView({behavior:'instant'}));await expect(canvas).toHaveAttribute('data-motion','reduced');
 });
}
