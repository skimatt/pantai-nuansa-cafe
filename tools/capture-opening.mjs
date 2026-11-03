import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
const results=[];
for(const [label,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height}});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto(process.env.NUANSA_PREVIEW_URL??'http://127.0.0.1:4173/');
 await page.waitForFunction(()=>document.querySelector('.arrival')?.getAttribute('data-intro')==='playing');
 await page.screenshot({path:`evidence/screenshots/opening-${label}-arrival.png`});
 await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.hero-copy h1')).opacity)>.7);
 await page.screenshot({path:`evidence/screenshots/opening-${label}-reveal.png`});
 await page.waitForFunction(()=>document.querySelector('.arrival')?.getAttribute('data-intro')==='hero');
 await page.screenshot({path:`evidence/screenshots/opening-${label}-settle.png`});
 const anchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>({href:a.getAttribute('href'),exists:!!document.querySelector(a.getAttribute('href'))})));
 results.push({label,width,height,errors,anchors});await context.close();
}
await writeFile('evidence/test-runs/opening-visual-smoke.json',JSON.stringify(results,null,2));
await browser.close();console.log(JSON.stringify(results,null,2));
if(results.some(r=>r.errors.length||r.anchors.some(a=>!a.exists)))process.exitCode=1;
