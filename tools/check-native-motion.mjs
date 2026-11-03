import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('evidence/native-motion',{recursive:true});const results=[];
for(const channel of ['chrome','msedge']){
 try{
 const browser=await chromium.launch({channel,headless:false});const ctx=await browser.newContext({viewport:channel==='chrome'?{width:1440,height:900}:{width:360,height:800},recordVideo:{dir:'evidence/native-motion/video',size:channel==='chrome'?{width:1440,height:900}:{width:360,height:800}},reducedMotion:null});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const cdp=await ctx.newCDPSession(page);await cdp.send('Emulation.setEmulatedMedia',{media:'',features:[]});
 await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});await page.waitForTimeout(1800);
 const before=await page.evaluate(()=>({reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,motion:document.querySelector('.living-coast')?.dataset.motion,frames:document.querySelector('.living-coast')?.dataset.frames}));await page.waitForTimeout(1200);
 const after=await page.evaluate(()=>({motion:document.querySelector('.living-coast')?.dataset.motion,frames:document.querySelector('.living-coast')?.dataset.frames}));await page.getByRole('button',{name:'Aktifkan animasi',exact:true}).click();await page.waitForTimeout(600);const enabledBefore=await page.locator('.living-coast').getAttribute('data-frames');await page.waitForTimeout(2200);const enabledAfter=await page.locator('.living-coast').getAttribute('data-frames');await page.screenshot({path:`evidence/native-motion/${channel}-enabled.png`});await page.reload({waitUntil:'networkidle'});const reload=await page.evaluate(()=>({reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,motion:document.querySelector('.living-coast')?.dataset.motion}));await page.waitForTimeout(1200);await page.getByRole('button',{name:'Matikan animasi',exact:true}).click();const disabled=await page.locator('.living-coast').getAttribute('data-motion');results.push({channel,before,after,enabledBefore,enabledAfter,reload,disabled,errors});await page.screenshot({path:`evidence/native-motion/${channel}-system.png`});await ctx.close();await browser.close();
 }catch(e){results.push({channel,error:e.message});}
}
await writeFile('evidence/native-motion/system-browser-fixed.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
