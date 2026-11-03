import {test,expect} from '@playwright/test';
for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]as const){
 test(`${name}: zero-size canvas and repeated route changes preserve animation clocks`,async({page})=>{
  await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/#discover');const atmosphere=page.locator('#discover .scene-atmosphere');await expect(atmosphere).toHaveAttribute('data-motion','running');
  await atmosphere.evaluate(el=>el.style.width='0px');await page.waitForTimeout(180);await atmosphere.evaluate(el=>el.style.removeProperty('width'));
  const before=Number(await atmosphere.getAttribute('data-frames'));await expect.poll(async()=>Number(await atmosphere.getAttribute('data-frames'))).toBeGreaterThan(before);
  await page.locator('#hero').evaluate(el=>el.scrollIntoView({behavior:'instant'}));const hero=page.locator('.living-coast');await expect(hero).toHaveAttribute('data-motion','running');
  await hero.evaluate(el=>el.style.width='0px');await page.waitForTimeout(180);await hero.evaluate(el=>el.style.removeProperty('width'));
  const heroBefore=Number(await hero.getAttribute('data-frames'));await expect.poll(async()=>Number(await hero.getAttribute('data-frames'))).toBeGreaterThan(heroBefore);
  for(let i=0;i<3;i++){
   await page.locator('.taste-footer').getByRole('link',{name:'Lihat semua menu'}).click();await expect(page).toHaveURL(/\/menu\/$/);await expect(page.locator('.scene-atmosphere')).toHaveAttribute('data-motion','running');
   await page.locator('.detail-back').click();await expect(page).toHaveURL(/#taste$/);await expect(page.locator('#taste .scene-atmosphere')).toHaveAttribute('data-motion','running');
   const frames=Number(await page.locator('#taste .scene-atmosphere').getAttribute('data-frames'));await expect.poll(async()=>Number(await page.locator('#taste .scene-atmosphere').getAttribute('data-frames'))).toBeGreaterThan(frames);
  }
  expect(errors).toEqual([]);
 });
}
