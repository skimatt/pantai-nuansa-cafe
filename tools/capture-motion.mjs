import {chromium} from '@playwright/test';
import {mkdir,writeFile,rename} from 'node:fs/promises';
const base=process.env.NUANSA_PREVIEW_URL??'http://127.0.0.1:4173';
await mkdir('evidence/motion',{recursive:true});
const browser=await chromium.launch(),reports=[];
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile',recordVideo:{dir:'evidence/motion/raw',size:{width,height}}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.waitForFunction(()=>document.querySelector('.arrival')?.dataset.intro==='hero');
 for(let i=0;i<3;i++){
  await page.waitForTimeout(1300);await page.screenshot({path:`evidence/motion/${name}-frame-${i}.png`});
 }
 await page.mouse.move(width*.2,height*.6,{steps:20});await page.waitForTimeout(1000);
 await page.mouse.move(width*.8,height*.3,{steps:30});await page.waitForTimeout(1000);
 if(name==='mobile')await page.touchscreen.tap(width*.12,height*.72);
 else await page.mouse.click(width*.12,height*.72);
 await page.waitForTimeout(1100);
 // Native scroll forward/back demonstrates the reversible camera and picture tracks.
 for(let i=0;i<11;i++){await page.mouse.wheel(0,110);await page.waitForTimeout(170);}
 await page.waitForTimeout(700);
 for(let i=0;i<5;i++){await page.mouse.wheel(0,-110);await page.waitForTimeout(170);}
 await page.locator('#discover').evaluate(el=>el.scrollIntoView({behavior:'smooth',block:'center'}));await page.waitForTimeout(1400);
 const picture=page.locator('.documentary-photo picture').first();await picture.hover();await page.waitForTimeout(800);
 await page.screenshot({path:`evidence/motion/${name}-discover.png`});
 await page.locator('#experience').evaluate(el=>el.scrollIntoView({behavior:'smooth',block:'start'}));await page.waitForTimeout(1200);
 if(name==='mobile')await page.getByRole('button',{name:'Putar video senja',exact:true}).click();
 else await page.locator('.video-frame').hover();
 await page.waitForTimeout(2200);
 await page.screenshot({path:`evidence/motion/${name}-experience.png`});
 reports.push({name,viewport:{width,height},errors});
 const video=page.video();await context.close();await rename(await video.path(),`evidence/motion/${name}-walkthrough.webm`);
}
await browser.close();await writeFile('evidence/motion/capture-report.json',JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports));
