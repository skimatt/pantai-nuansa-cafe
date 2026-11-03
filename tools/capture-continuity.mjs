import {chromium} from '@playwright/test';
import {mkdir,writeFile,rename} from 'node:fs/promises';
await mkdir('evidence/continuity/raw',{recursive:true});
const browser=await chromium.launch(),reports=[];
for(const [name,width,height]of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},hasTouch:name==='mobile',isMobile:name==='mobile',recordVideo:{dir:'evidence/continuity/raw',size:{width,height}}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/#perjalanan');await page.waitForTimeout(1400);
 await page.locator('#discover').evaluate(el=>el.scrollIntoView({behavior:'smooth'}));await page.waitForTimeout(1800);
 await page.screenshot({path:`evidence/continuity/discover-${name}-record.png`});
 await page.getByRole('link',{name:'Menuju suasana senja',exact:true}).click();await page.waitForTimeout(1500);
 await page.locator('.documentary-player').evaluate(el=>el.scrollIntoView({behavior:'smooth',block:'center'}));await page.waitForTimeout(1700);
 await page.getByRole('button',{name:'Putar video senja',exact:true}).click();await page.waitForTimeout(1800);
 await page.getByRole('button',{name:'Jeda video senja'}).click();
 await page.locator('#explore').evaluate(el=>el.scrollIntoView({behavior:'smooth',block:'center'}));await page.waitForTimeout(1800);
 await page.locator('.facility-hotspot').last().click();await page.waitForTimeout(800);
 await page.locator('#taste').evaluate(el=>el.scrollIntoView({behavior:'smooth',block:'center'}));await page.waitForTimeout(1500);
 await page.getByRole('button',{name:/Nasi Goreng Seafood/}).click();await page.waitForTimeout(1300);
 await page.locator('.gallery-track').evaluate(el=>el.scrollIntoView({behavior:'smooth',block:'center'}));await page.mouse.move(10,10);await page.waitForTimeout(1300);
 const track=page.locator('.gallery-track');
 const before=await track.evaluate(el=>el.scrollLeft);await page.waitForTimeout(6500);const after=await track.evaluate(el=>el.scrollLeft);
 await page.screenshot({path:`evidence/continuity/gallery-${name}-record.png`});
 await page.getByRole('button',{name:'Jeda galeri',exact:true}).click();
 await page.locator('.moment-open').nth(4).click();await page.waitForTimeout(1000);
 for(let i=0;i<8;i++){await page.keyboard.press('ArrowRight');await page.waitForTimeout(380);}
 await page.keyboard.press('Escape');
 await page.locator('#find-us').evaluate(el=>el.scrollIntoView({behavior:'smooth',block:'center'}));await page.waitForTimeout(1800);
 await page.screenshot({path:`evidence/continuity/contact-${name}-record.png`});
 reports.push({name,viewport:{width,height},errors,autoGallery:{before,after,moved:after>before},galleryItems:await page.locator('.moment-frame').count()});
 const video=page.video();await context.close();await rename(await video.path(),`evidence/continuity/${name}-journey.webm`);
}
await browser.close();await writeFile('evidence/continuity/recording-report.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));
