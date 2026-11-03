import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('evidence/live-motion',{recursive:true});
const browser=await chromium.launch({headless:false,args:['--start-maximized']});const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:'evidence/live-motion/raw',size:{width:1440,height:900}}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
await page.waitForTimeout(6500);const system=await page.evaluate(()=>({reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,url:location.href,visibility:document.visibilityState,canvases:[...document.querySelectorAll('canvas')].map(c=>({class:c.className,motion:c.dataset.motion,frames:c.dataset.frames}))}));console.log(JSON.stringify(system));
for(const id of ['hero','discover','experience','explore','taste','moments','find-us']){await page.locator('#'+id).evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));await page.waitForTimeout(1000);await page.screenshot({path:`evidence/live-motion/${id}-before.png`});await page.waitForTimeout(2300);await page.screenshot({path:`evidence/live-motion/${id}-after.png`});}
await writeFile('evidence/live-motion/initial-report.json',JSON.stringify({system,errors},null,2));await context.close();await browser.close();
