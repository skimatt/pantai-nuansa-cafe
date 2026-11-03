import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
const browser=await chromium.launch(),reports=[];
for(const route of ['/','/menu/','/galeri/','/fasilitas/']){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'}),page=await context.newPage(),cdp=await context.newCDPSession(page);const errors=[];
 page.on('pageerror',e=>errors.push(e.message));await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:90000});
 await page.addInitScript(()=>{window.__pagePerf={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__pagePerf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__pagePerf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
 await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle'});
 if(route==='/')await page.waitForFunction(()=>document.querySelector('.arrival')?.dataset.intro==='hero');await page.waitForTimeout(500);
 const metrics=await page.evaluate(()=>({...window.__pagePerf,transferBytes:performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.transferSize,0),videoRequestsBeforePlay:performance.getEntriesByType('resource').filter(r=>/\.(mp4|webm)(\?|$)/.test(r.name)).length,overflow:document.documentElement.scrollWidth>innerWidth}));
 reports.push({route,...metrics,errors});await context.close();
}
await browser.close();await mkdir('evidence/performance',{recursive:true});const result={browser:browser.version(),viewport:{width:390,height:844},cpuSlowdown:4,latencyMs:150,downloadBytesPerSecond:200000,reducedMotion:'no-preference',reports,limitations:'Single local Chromium simulation measured without concurrent tests/encoding, initial viewport only; not a physical phone, display FPS, field INP or thesis participant result.'};await writeFile('evidence/performance/homepage-detail-mobile.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
