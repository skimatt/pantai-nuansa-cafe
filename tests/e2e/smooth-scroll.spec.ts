import { test, expect } from '@playwright/test';

test('wheel scroll interpolates and section navigation cancels remaining inertia', async ({ page }) => {
  await page.goto('/#discover');
  await expect(page.locator('.arrival')).toHaveAttribute('data-scroll', 'smooth');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const start = await page.evaluate(() => scrollY);
  await page.mouse.move(600, 400);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(100);
  const intermediate = await page.evaluate(() => scrollY);
  expect(intermediate).toBeGreaterThan(start);
  expect(intermediate).toBeLessThan(start + 890);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(start + 880);
  await page.locator('.chapter-rail a[href="#taste"]').click();
  await expect(page).toHaveURL(/#taste$/);
  await expect(page.locator('.navigation-wave')).toHaveAttribute('data-active', 'false');
  await expect.poll(() => page.locator('#taste').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(35);
  await page.waitForTimeout(300);
  expect(await page.locator('#taste').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(35);
});

test('gallery dialog locks the page and closing restores scrolling and focus', async ({ page }) => {
  await page.goto('/#moments');
  const trigger = page.locator('.moment-open').first();
  await trigger.click();
  await expect(page.locator('html')).toHaveClass(/lenis-stopped/);
  const start = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => scrollY)).toBe(start);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/);
  await page.mouse.move(600, 200);
  await page.mouse.wheel(0, -300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(start - 100);
});

test('reduced motion and leaving the homepage release the smooth scroll controller', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#discover');
  await expect(page.locator('.arrival')).toHaveAttribute('data-scroll', 'native');
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.arrival')).toHaveAttribute('data-scroll', 'smooth');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.arrival')).toHaveAttribute('data-scroll', 'native');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.locator('.discover-all').click();
  await expect(page).toHaveURL(/\/galeri\/$/);
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.goBack();
  await expect(page.locator('.arrival')).toHaveAttribute('data-scroll', 'smooth');
});

test('mobile touch scroll remains native and gallery swipes remain horizontal', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto('/#moments');
    await expect(page.locator('.arrival')).toHaveAttribute('data-scroll', 'smooth');
    const start = await page.evaluate(() => scrollY);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 600 }] });
    for (const y of [540, 480, 420, 360]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y }] });
      await page.waitForTimeout(35);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(start + 50);
    await page.locator('.gallery-track').evaluate(el => el.scrollBy({ left: 200, behavior: 'instant' }));
    await expect.poll(() => page.locator('.gallery-track').evaluate(el => el.scrollLeft)).toBeGreaterThan(50);
  } finally {
    await context.close();
  }
});
