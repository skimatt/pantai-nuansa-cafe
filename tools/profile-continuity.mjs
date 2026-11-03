import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch(),reports=[];
for(const reducedMotion of ['no-preference','reduce']){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion}),page=await context.newPage(),cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:90000});
 await page.addInitScript(()=>{
  window.__continuityPerf={lcp:0,cls:0,longTasks:[]};
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__continuityPerf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__continuityPerf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__continuityPerf.longTasks.push(e.duration);}).observe({type:'longtask',buffered:true});
 });
 await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>document.querySelector('.arrival')?.dataset.intro==='hero');
 const hero=await page.evaluate(()=>({...window.__continuityPerf})),scenes=[];
 for(const id of ['perjalanan','discover','experience','explore','taste','moments','find-us']){
  await page.locator('#'+id).evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));await page.waitForTimeout(700);
  const canvas=page.locator(`#${id} .scene-atmosphere`),hasCanvas=await canvas.count()>0,before=hasCanvas?Number(await canvas.getAttribute('data-frames')??0):0,start=Date.now();
  await page.waitForTimeout(2200);const elapsed=Date.now()-start,draws=(hasCanvas?Number(await canvas.getAttribute('data-frames')??0):0)-before;
  scenes.push({id,observedDraws:draws,elapsedMs:elapsed,drawsPerSecond:Number((draws/elapsed*1000).toFixed(2))});
 }
 const metrics=await page.evaluate(()=>({cls:window.__continuityPerf.cls,longTaskCount:window.__continuityPerf.longTasks.length,maxLongTaskMs:Math.max(0,...window.__continuityPerf.longTasks),resourceBytes:performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.transferSize,0),videoRequestsBeforePlay:performance.getEntriesByType('resource').filter(r=>r.name.endsWith('.mp4')).length}));
 reports.push({date:'2026-11-03',browser:browser.version(),viewport:{width:390,height:844},reducedMotion,cpuSlowdown:4,latencyMs:150,downloadBytesPerSecond:200000,heroLcpMs:hero.lcp,heroCls:hero.cls,scenes,...metrics,limitations:'Single local Chromium CPU/network simulation, measured alone. Canvas draw cadence is not screen FPS; no physical Android/iOS, field INP or research participant results.'});
 await context.close();
}
await browser.close();await writeFile('evidence/performance/homepage-preview-mobile.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports,null,2));
