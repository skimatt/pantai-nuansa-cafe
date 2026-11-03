import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch();const results=[];
for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/galeri/');
 await page.locator('.detail-body').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
 await page.locator('.complete-moment img').first().evaluate(im=>im.decode());await page.waitForTimeout(1100);
 await page.screenshot({path:`evidence/album/${name}-photos.png`});
 await page.locator('.complete-moment button').first().click();await page.locator('.gallery-viewer img').evaluate(im=>im.decode());await page.waitForTimeout(800);await page.screenshot({path:`evidence/album/${name}-popup.png`});await page.keyboard.press('Escape');
 results.push({viewport:{width,height},errors,photos:await page.locator('.complete-moment').count()});await page.close();
}
await browser.close();await writeFile('evidence/album/visual-review.json',JSON.stringify(results,null,2));console.log(results);
