import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('@claim:demo-sandbox opens directly, isolates storage, and resets', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('sb_license:data-engine-switchboard', 'real-user-token'));
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:data-engine-switchboard'))).toBe('real-user-token');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual(['demo:data-engine-switchboard:opened']);
  expect(requests.every((url) => url.startsWith('http://127.0.0.1:4173/'))).toBeTruthy();
});

test('@claim:site-no-analytics uses only same-origin resources', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) await page.goto(path);
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => url.startsWith('http://127.0.0.1:4173/'))).toBeTruthy();
});

test('@claim:route-metadata gives each route complete social metadata', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    for (const selector of ['meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]']) {
      await expect(page.locator(selector)).toHaveCount(1);
    }
    expect(await page.title()).not.toBe('');
  }
});

test('@claim:recorded-web-report shows a real CLI recording', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.getByRole('heading', { name: /Recorded switchboard demo run/i })).toBeVisible();
  await expect(page.getByRole('img', { name: /Recorded terminal run of switchboard demo/i })).toBeVisible();
  await expect(page.getByText('Three measured differences')).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByText('tax rounding changes a value')).toBeVisible();
  await expect(page.getByText('identifier changes schema')).toBeVisible();
  await expect(page.getByText('sort direction changes order')).toBeVisible();
});

test('product routes are focused, complete, responsive, and accessible', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeFocused();
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  }
  await page.goto('/');
  const firstTab = page.getByRole('tab', { name: /Value difference/ });
  await firstTab.focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Schema difference/ })).toHaveAttribute('aria-selected', 'true');
  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewportWidth + 1);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('mobile navigation exposes complete touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo/');
  const viewport = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
  const nav = page.getByLabel('Primary navigation');
  for (const name of ['Demo', 'How it works', 'Privacy', 'Terms']) {
    const box = await nav.getByRole('link', { name, exact: true }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});
