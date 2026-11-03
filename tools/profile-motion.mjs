import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch();const results=[];
for(const reduced of ['no-preference','reduce']){
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:reduced});
 const page=await context.newPage(),cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:90000});
 await page.addInitScript(()=>{
  window.__motionPerf={lcp:0,cls:0,longTasks:[]};
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__motionPerf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__motionPerf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__motionPerf.longTasks.push(e.duration);}).observe({type:'longtask',buffered:true});
 });
 await page.goto(process.env.NUANSA_PREVIEW_URL??'http://127.0.0.1:4173');
 await page.waitForFunction(()=>document.querySelector('.arrival')?.dataset.intro==='hero');await page.waitForTimeout(2000);
 const frames=()=>page.locator('.living-coast').getAttribute('data-frames').then(n=>Number(n??0));
 const before=await frames(),start=Date.now();await page.waitForTimeout(5000);const elapsed=Date.now()-start,after=await frames();
 const metrics=await page.evaluate(()=>({...window.__motionPerf,bytes:performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.transferSize,0),videos:performance.getEntriesByType('resource').filter(r=>r.name.endsWith('.mp4')).length}));
 results.push({reducedMotion:reduced,cpuSlowdown:4,latencyMs:150,downloadBytesPerSecond:200000,elapsedMs:elapsed,observedCanvasDraws:after-before,observedDrawsPerSecond:(after-before)/(elapsed/1000),...metrics,limitations:'Local Chromium simulation, single sample. Draw cadence is not end-to-end display FPS; no physical device or field INP claim.'});await context.close();
}
await browser.close();await writeFile('evidence/performance/motion-mobile-simulation.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
