import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 360, 800]] as const) {
  test(`${name}: preview video plays, changes and reopens without an external file`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${process.env.PREVIEW_VIDEO_URL ?? ''}/galeri/`);
    const trigger = page.locator('.complete-moment').filter({ hasText: 'Nama yang menyambut.' }).getByRole('button');
    await trigger.click();
    const video = page.locator('.gallery-viewer video');
    const play = async () => {
      await expect(video).toHaveAttribute('src', /\.mp4$/);
      await expect.poll(() => video.evaluate(el => (el as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1);
      expect(await video.evaluate(el => (el as HTMLVideoElement).muted)).toBe(true);
      await video.focus();
      await page.keyboard.press('Space');
      await expect.poll(() => video.evaluate(el => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(.15);
      expect(await video.evaluate(el => (el as HTMLVideoElement).paused)).toBe(false);
    };
    await play();
    await mkdir('evidence/preview-playback', { recursive: true });
    await page.screenshot({ path: `evidence/preview-playback/${process.env.PREVIEW_VIDEO_URL ? 'dev' : 'production'}-${name}.png` });
    const oldVideo = await video.elementHandle();
    await page.locator('.viewer-next').click();
    expect(await oldVideo?.evaluate(el => (el as HTMLVideoElement).paused)).toBe(true);
    await page.locator('.viewer-prev').click();
    await play();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await play();
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
    expect(page.url()).toContain('/galeri/');
  });
}
