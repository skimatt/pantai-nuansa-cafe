import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const label=process.argv[2]??'after';
const browser=await chromium.launch();
const reports=[];
try{
 for(const slowdown of [1,4]){
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  const cdp=await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:slowdown});
  await cdp.send('Performance.enable');
  await page.goto('http://127.0.0.1:4185/#discover');
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.mouse.move(800,400);
  await page.evaluate(()=>{
   const samples=[];window.scrollSamples=samples;window.sampleScroll=true;
   let previous=performance.now();
   const tick=time=>{samples.push({frame:time-previous,y:scrollY});previous=time;if(window.sampleScroll)requestAnimationFrame(tick);};
   requestAnimationFrame(tick);
  });
  const before=await cdp.send('Performance.getMetrics');
  for(let i=0;i<16;i++){await page.mouse.wheel(0,300);await page.waitForTimeout(140);}
  await page.waitForTimeout(900);
  const after=await cdp.send('Performance.getMetrics');
  const samples=await page.evaluate(()=>{window.sampleScroll=false;return window.scrollSamples;});
  const frames=samples.slice(1).map(s=>s.frame).sort((a,b)=>a-b);
  const metric=name=>after.metrics.find(m=>m.name===name).value-before.metrics.find(m=>m.name===name).value;
  reports.push({label,cpuSlowdown:slowdown,viewport:'1440x900',browser:browser.version(),samples:samples.length,
   frameMedianMs:frames[Math.floor(frames.length*.5)],frameP95Ms:frames[Math.floor(frames.length*.95)],
   intervalsOver50ms:frames.filter(f=>f>50).length,scrollDistance:samples.at(-1).y-samples[0].y,
   taskSeconds:metric('TaskDuration'),layoutSeconds:metric('LayoutDuration'),scriptSeconds:metric('ScriptDuration'),
   smooth:await page.evaluate(()=>document.documentElement.classList.contains('lenis')),
   limitations:'Local Chromium wheel simulation. Frame intervals include raster and decoding work, and are not field measurements or physical-device results.'});
  await context.close();
 }
 await writeFile('evidence/smooth-scroll/'+label+'.json',JSON.stringify(reports,null,2));
 console.log(reports);
}finally{await browser.close();}
