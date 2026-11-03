import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
test.beforeAll(async()=>{await mkdir('evidence/compact-controls',{recursive:true});});
for(const [name,width,height]of [['desktop',1440,900],['mobile',360,800]]as const){
 test(`${name}: compact accessible controls and clean Hero`,async({page})=>{
  await page.setViewportSize({width,height});await page.goto('/#hero');
  await expect(page.locator('.header-aside,.world-hint,.scroll-link,.art-notice')).toHaveCount(0);
  for(const label of ['Jeda gerak','Suara mati']){const button=page.getByRole('button',{name:label,exact:true});await expect(button).toBeVisible();const box=await button.boundingBox();expect(box!.width).toBe(44);expect(box!.height).toBe(44);const icon=await button.locator('svg').boundingBox();expect(Math.abs(icon!.x+icon!.width/2-box!.x-box!.width/2)).toBeLessThan(.25);expect(Math.abs(icon!.y+icon!.height/2-box!.y-box!.height/2)).toBeLessThan(.25);}
  await page.getByRole('button',{name:'Jeda gerak',exact:true}).click();await expect(page.locator('.living-coast')).toHaveAttribute('data-motion','paused');await page.getByRole('button',{name:'Lanjutkan gerak',exact:true}).click();
  await page.getByRole('button',{name:'Suara mati',exact:true}).click();await expect(page.getByRole('button',{name:'Suara hidup',exact:true})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'Suara hidup',exact:true}).click();
  await page.screenshot({path:`evidence/compact-controls/hero-${name}.png`});
  await page.emulateMedia({reducedMotion:'reduce'});const enable=page.getByRole('button',{name:'Aktifkan animasi',exact:true});await expect(enable).toBeVisible();expect((await enable.boundingBox())!.width).toBe(44);await enable.focus();await page.keyboard.press('Enter');await expect(page.locator('.living-coast')).toHaveAttribute('data-motion','running');
  const choice=page.getByRole('button',{name:'Matikan animasi',exact:true}),choiceBox=await choice.boundingBox(),choiceIcon=await choice.locator('svg').boundingBox();expect(Math.abs(choiceIcon!.y+choiceIcon!.height/2-choiceBox!.y-choiceBox!.height/2)).toBeLessThan(.25);
  await page.screenshot({path:`evidence/compact-controls/choice-${name}.png`});
 });
}
