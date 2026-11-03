import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';

test.beforeAll(async()=>{await mkdir('evidence/audio',{recursive:true});});
for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]as const){
 test(`${name}: mixed music is opt-in, fades, pauses and resumes`,async({page})=>{
  const requests:string[]=[],errors:string[]=[];
  page.on('request',r=>{if(r.url().includes('.mp3'))requests.push(r.url());});
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height});await page.goto('/#hero');
  await expect(page.getByRole('button',{name:'Suara mati',exact:true})).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(0);expect(requests).toEqual([]);
  await page.getByRole('button',{name:'Suara mati',exact:true}).click();
  const audio=page.locator('audio[data-ambient-track]');
  await expect.poll(()=>audio.evaluate(a=>(a as HTMLAudioElement).currentTime)).toBeGreaterThan(.2);
  await expect.poll(()=>audio.evaluate(a=>(a as HTMLAudioElement).volume)).toBeCloseTo(.6,2);
  const playing=await audio.evaluate(a=>{const v=a as HTMLAudioElement;return {src:v.currentSrc,time:v.currentTime,duration:v.duration,volume:v.volume,loop:v.loop,paused:v.paused};});
  expect(playing.src).toContain('/assets/audio/golden-hour-ocean.mp3');
  expect(playing.duration).toBeGreaterThan(209);expect(playing.duration).toBeLessThan(211);expect(playing.loop).toBe(true);expect(playing.paused).toBe(false);
  await page.screenshot({path:`evidence/audio/enabled-${name}.png`});
  await page.getByRole('button',{name:'Suara hidup',exact:true}).click();
  await expect.poll(()=>audio.evaluate(a=>(a as HTMLAudioElement).paused)).toBe(true);
  expect(await audio.evaluate(a=>(a as HTMLAudioElement).volume)).toBe(0);
  const pausedTime=await audio.evaluate(a=>(a as HTMLAudioElement).currentTime);
  await page.waitForTimeout(300);expect(await audio.evaluate(a=>(a as HTMLAudioElement).currentTime)).toBeCloseTo(pausedTime,2);
  await page.getByRole('button',{name:'Suara mati',exact:true}).click();
  await expect.poll(()=>audio.evaluate(a=>(a as HTMLAudioElement).currentTime)).toBeGreaterThan(pausedTime+.1);
  await expect(audio).toHaveCount(1);expect(errors).toEqual([]);
  await writeFile(`evidence/audio/playback-${name}.json`,JSON.stringify({playing,pausedTime,requests,errors},null,2));
 });
}

test('mixed soundtrack pauses when hidden, yields to video and disposes on navigation',async({page})=>{
 await page.goto('/#hero');await page.getByRole('button',{name:'Suara mati',exact:true}).click();
 const audio=page.locator('audio[data-ambient-track]');
 await expect.poll(()=>audio.evaluate(a=>(a as HTMLAudioElement).currentTime)).toBeGreaterThan(.1);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 expect(await audio.evaluate(a=>(a as HTMLAudioElement).paused)).toBe(true);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
 await expect.poll(()=>audio.evaluate(a=>(a as HTMLAudioElement).paused)).toBe(false);
 await page.locator('#experience').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
 await page.getByRole('button',{name:'Putar video senja',exact:true}).click();
 await expect.poll(()=>audio.evaluate(a=>(a as HTMLAudioElement).paused)).toBe(true);
 await expect(page.getByRole('button',{name:'Suara mati',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Suara mati',exact:true}).click();
 await expect.poll(()=>audio.evaluate(a=>(a as HTMLAudioElement).paused)).toBe(false);
 await page.evaluate(()=>{const w=window as typeof window&{oldAmbient?:HTMLAudioElement};w.oldAmbient=document.querySelector('audio')!;});
 await page.locator('#taste').getByRole('link',{name:'Lihat semua menu',exact:true}).click();
 await expect(page).toHaveURL(/\/menu\/$/);await expect(page.locator('audio')).toHaveCount(0);
 expect(await page.evaluate(()=>{const old=(window as typeof window&{oldAmbient?:HTMLAudioElement}).oldAmbient;return !old||(old.paused&&!old.isConnected&&!old.getAttribute('src'));})).toBe(true);
});
