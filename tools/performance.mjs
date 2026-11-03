import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
const reports=[];
for(const reducedMotion of ['no-preference','reduce']){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion});
 const page=await context.newPage();const cdp=await context.newCDPSession(page);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await cdp.send('Network.enable');
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:90000});
 await page.addInitScript(()=>{
  window.__nuansaMetrics={lcp:0,cls:0,longTasks:[],frames:[],interactions:[]};
  const metrics=window.__nuansaMetrics;
  new PerformanceObserver(list=>{for(const e of list.getEntries())metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())metrics.longTasks.push(e.duration);}).observe({type:'longtask',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.interactionId)metrics.interactions.push(e.duration);}).observe({type:'event',buffered:true,durationThreshold:16});
  let last=0;const start=performance.now();function frame(t){if(last)metrics.frames.push(t-last);last=t;if(t-start<13000)requestAnimationFrame(frame);}requestAnimationFrame(frame);
 });
 await page.goto(process.env.NUANSA_PREVIEW_URL??'http://127.0.0.1:4173/');
 await page.waitForFunction(()=>document.querySelector('.arrival')?.getAttribute('data-intro')==='hero',{},{timeout:30000});
 await page.getByRole('button',{name:'Buka navigasi'}).click();await page.keyboard.press('Escape');
 await page.getByRole('link',{name:'Jelajahi Nuansa',exact:true}).click();
 await page.waitForFunction(()=>scrollY>100);
 const report=await page.evaluate(()=>{
  const m=window.__nuansaMetrics;
  const frameIntervals=[...m.frames].sort((a,b)=>a-b);
  return {lcpMs:m.lcp,cls:m.cls,maxObservedInteractionMs:Math.max(0,...m.interactions),longTaskCount:m.longTasks.length,maxLongTaskMs:Math.max(0,...m.longTasks),frameIntervalMedianMs:frameIntervals[Math.floor(frameIntervals.length/2)],frameIntervalP95Ms:frameIntervals[Math.floor(frameIntervals.length*.95)],resourceBytes:performance.getEntriesByType('resource').reduce((s,e)=>s+e.transferSize,0),resources:performance.getEntriesByType('resource').map(e=>({name:e.name.split('/').at(-1),bytes:e.transferSize})),heapBytes:performance.memory?.usedJSHeapSize??null};
 });
 reports.push({date:'2026-11-03',browser:browser.version(),viewport:'390×844',cpuSlowdown:4,latencyMs:150,downloadBytesPerSecond:200000,reducedMotion,...report,limitations:'Synthetic local Chromium CDP run, not physical mid-range device. Interaction metric is a limited event-timing sample, not field INP. Includes local uncompressed HTTP transfer.'});
 await page.screenshot({path:`evidence/screenshots/performance-${reducedMotion}.png`});await context.close();
}
await mkdir('evidence/performance',{recursive:true});await writeFile('evidence/performance/mobile-baseline.json',JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports.map(report=>({...report,resources:undefined})),null,2));await browser.close();
