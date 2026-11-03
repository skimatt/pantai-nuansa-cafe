import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
test.beforeAll(async()=>{await mkdir('evidence/detail-background',{recursive:true});});
for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]as const){
 test(`${name}: complete collection backgrounds move, pause and stay viewport bounded`,async({page})=>{
  await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));const reports=[];
  for(const route of ['menu','galeri','fasilitas']){
   await page.goto(`/${route}/`);await page.locator('.detail-body').evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY+150,behavior:'instant'}));
   const canvas=page.locator('.detail-living-backdrop');await expect(canvas).toHaveAttribute('data-motion','running');await page.waitForTimeout(1000);
   const snapshot=()=>canvas.evaluate(c=>(c as HTMLCanvasElement).toDataURL());
   const first=await snapshot();await page.waitForTimeout(900);const second=await snapshot();expect(second).not.toBe(first);
   const pixels=await sharp(Buffer.from(second.split(',')[1],'base64')).stats();expect(pixels.channels[3].max).toBeGreaterThan(30);
   const dimensions=await canvas.evaluate(c=>({width:(c as HTMLCanvasElement).width,height:(c as HTMLCanvasElement).height}));expect(dimensions.width).toBeLessThanOrEqual(width*1.25+2);expect(dimensions.height).toBeLessThanOrEqual(height*1.25+2);
   await page.screenshot({path:`evidence/detail-background/${route}-${name}.png`});
   await page.getByRole('button',{name:'Jeda gerak',exact:true}).click();await expect(canvas).toHaveAttribute('data-motion','paused');await page.waitForTimeout(200);const paused=await snapshot();await page.waitForTimeout(350);expect(await snapshot()).toBe(paused);
   await page.getByRole('button',{name:'Lanjutkan gerak',exact:true}).click();await expect(canvas).toHaveAttribute('data-motion','running');reports.push({route,dimensions,changed:true,pausedStable:true});
  }
  expect(errors).toEqual([]);await writeFile(`evidence/detail-background/${name}.json`,JSON.stringify({reports,errors},null,2));
 });
}
test('system reduced motion is static until explicit opt-in, including after scrolling',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/galeri/');await page.locator('.detail-body').evaluate(el=>el.scrollIntoView({behavior:'instant'}));const canvas=page.locator('.detail-living-backdrop');await expect(canvas).toHaveAttribute('data-motion','reduced');await page.waitForTimeout(1000);
 const before=await canvas.evaluate(c=>(c as HTMLCanvasElement).toDataURL());await page.waitForTimeout(400);expect(await canvas.evaluate(c=>(c as HTMLCanvasElement).toDataURL())).toBe(before);
 await page.getByRole('button',{name:'Aktifkan animasi',exact:true}).click();await expect(canvas).toHaveAttribute('data-motion','running');await page.waitForTimeout(400);expect(await canvas.evaluate(c=>(c as HTMLCanvasElement).toDataURL())).not.toBe(before);
});
