import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
const results = [];
try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 360, 800]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4185/#discover');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    await page.mouse.move(width / 2, height / 2);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `evidence/smooth-scroll/${name}.png` });
    results.push({ name, width, height, errors, horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), smooth: await page.locator('.arrival').getAttribute('data-scroll') });
    await context.close();
  }
  await writeFile('evidence/smooth-scroll/visual-review.json', JSON.stringify(results, null, 2));
  console.log(results);
} finally {
  await browser.close();
}
