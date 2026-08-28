import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('@claim:demo-sandbox opens directly, isolates storage, and resets', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Check a Pandas-to-Polars migration');
  await expect(page.getByText('For Python data engineers:', { exact: false })).toBeVisible();
  const sampleAction = page.getByRole('link', { name: 'Try it with sample data' });
  await expect(sampleAction).toBeVisible();
  if ((page.viewportSize()?.width || 0) <= 390) {
    const actionBox = await sampleAction.boundingBox();
    expect(actionBox).not.toBeNull();
    expect(actionBox!.y + actionBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  }
  await page.evaluate(() => localStorage.setItem('sb_license:data-engine-switchboard', 'real-user-token'));
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await sampleAction.click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:data-engine-switchboard'))).toBe('real-user-token');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual(['demo:data-engine-switchboard:opened']);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:data-engine-switchboard'))).toBe('real-user-token');
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  expect(requests.every((url) => url.startsWith('http://127.0.0.1:4173/'))).toBeTruthy();
});

test('legal pages state the tested report and transformation boundaries', async ({ page }) => {
  await page.goto('/terms/');
  await expect(page.getByText('Reports identify each configured fixture and its comparison results.')).toBeVisible();
  await expect(page.getByText('They do not record transformation identity, Python details, or dataframe library versions.')).toBeVisible();
  await page.goto('/privacy/');
  await expect(page.getByText('That code can access files available to its Python process.')).toBeVisible();
  await expect(page.getByText('Switchboard itself does not upload fixture contents, reports, code, filenames, or usage data.')).toBeVisible();
  await expect(page.getByText('It reads only the configuration', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Open the repository issue tracker (external)' })).toHaveAttribute('href', 'https://github.com/B-Divyesh/sf-data-engine-switchboard/issues');
});

test('@claim:site-no-analytics uses only same-origin resources', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) await page.goto(path);
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => url.startsWith('http://127.0.0.1:4173/'))).toBeTruthy();
});

test('@claim:route-metadata gives each route complete social metadata', async ({ page }) => {
  const routes = {
    '/': 'Data Engine Switchboard — check Pandas migrations',
    '/demo/': 'Demo — Data Engine Switchboard',
    '/privacy/': 'Privacy — Data Engine Switchboard',
    '/terms/': 'Terms — Data Engine Switchboard',
    '/404.html': 'Page not found — Data Engine Switchboard'
  };
  for (const [path, title] of Object.entries(routes)) {
    await page.goto(path);
    for (const selector of ['meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]']) {
      await expect(page.locator(selector)).toHaveCount(1);
    }
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://data-engine-switchboard.sociobot.in${path}`);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(0);
    expect(description!.length).toBeLessThanOrEqual(155);
  }
});

test('recorded web report shows a real CLI recording', async ({ page }) => {
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
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => document.documentElement.clientWidth) + 1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
  await page.goto('/');
  const firstTab = page.getByRole('tab', { name: /Value difference/ });
  await firstTab.focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Schema difference/ })).toHaveAttribute('aria-selected', 'true');
  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewportWidth + 1);
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveTitle('Privacy — Data Engine Switchboard');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Data Engine Switchboard — check Pandas migrations');
  await expect(page.locator('h1')).toBeFocused();
});

test('reduced motion removes routed movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const durations = await page.locator('.signal-line i, .button').evaluateAll((elements) => elements.map((element) => ({
    animation: getComputedStyle(element).animationDuration,
    transition: getComputedStyle(element).transitionDuration
  })));
  for (const duration of durations) {
    expect(duration.animation.split(',').every((value) => Number.parseFloat(value) <= 0.00001)).toBeTruthy();
    expect(duration.transition.split(',').every((value) => Number.parseFloat(value) <= 0.00001)).toBeTruthy();
  }
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
